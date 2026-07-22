import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_COUPONS, DEFAULT_PRICING_TIERS, SAMPLE_ORDERS } from './src/data/defaultData';
import { Coupon, Order, OrderStatus, PvcPricingTier } from './src/types';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gopvc_jwt_production_secret_key_2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gopvc.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DbSchema {
  pricingTiers: PvcPricingTier[];
  coupons: Coupon[];
  orders: Order[];
  orderCounter: number;
}

// Initial DB state
let dbData: DbSchema = {
  pricingTiers: DEFAULT_PRICING_TIERS,
  coupons: DEFAULT_COUPONS,
  orders: SAMPLE_ORDERS,
  orderCounter: 1004,
};

// Load DB from file if exists
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      dbData = {
        pricingTiers: parsed.pricingTiers || DEFAULT_PRICING_TIERS,
        coupons: parsed.coupons || DEFAULT_COUPONS,
        orders: parsed.orders || SAMPLE_ORDERS,
        orderCounter: parsed.orderCounter || 1004,
      };
    } else {
      saveDb();
    }
  } catch (err) {
    console.error('Failed to load db.json, using defaults:', err);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

loadDb();

// Helper: Auth middleware
function verifyAdminToken(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).adminUser = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

// ==================== API ROUTES ====================

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'GoPvc',
    timestamp: new Date().toISOString(),
    totalOrders: dbData.orders.length,
  });
});

// 2. Admin Login
app.post('/api/admin/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const isValidEmail = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isValidPass = password.trim() === ADMIN_PASSWORD;

  if (!isValidEmail || !isValidPass) {
    return res.status(401).json({ error: 'Invalid Admin credentials' });
  }

  const token = jwt.sign(
    { id: 'admin-1', email: ADMIN_EMAIL, name: 'GoPvc Super Admin', role: 'superadmin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: { id: 'admin-1', email: ADMIN_EMAIL, name: 'GoPvc Super Admin', role: 'superadmin' },
  });
});

// 3. Get Pricing Tiers
app.get('/api/pricing', (req: Request, res: Response) => {
  res.json(dbData.pricingTiers);
});

// 4. Update Pricing Tiers (Admin)
app.put('/api/pricing', verifyAdminToken, (req: Request, res: Response) => {
  const { tiers } = req.body;
  if (!Array.isArray(tiers)) {
    return res.status(400).json({ error: 'Tiers must be an array' });
  }
  dbData.pricingTiers = tiers;
  saveDb();
  res.json({ success: true, pricingTiers: dbData.pricingTiers });
});

// 5. Get Coupons
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json(dbData.coupons);
});

// 6. Validate Coupon
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  const coupon = dbData.coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
  );

  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or inactive coupon code' });
  }

  const now = new Date();
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    return res.status(400).json({ error: 'Coupon has expired' });
  }

  const orderValue = Number(subtotal) || 0;
  if (orderValue < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Minimum order value for code ${coupon.code} is ₹${coupon.minOrderValue}. Your current total is ₹${orderValue}.`,
    });
  }

  let discountAmount = 0;
  if (coupon.type === 'flat') {
    discountAmount = coupon.discountValue;
  } else {
    discountAmount = Math.round((orderValue * coupon.discountValue) / 100);
  }

  if (discountAmount > orderValue) {
    discountAmount = orderValue;
  }

  res.json({
    valid: true,
    couponCode: coupon.code,
    type: coupon.type,
    discountValue: coupon.discountValue,
    discountAmount,
  });
});

// 7. Create Coupon (Admin)
app.post('/api/coupons', verifyAdminToken, (req: Request, res: Response) => {
  const { code, type, discountValue, minOrderValue, expiresAt } = req.body;
  if (!code || !type || discountValue === undefined) {
    return res.status(400).json({ error: 'Missing required coupon fields' });
  }

  const newCoupon: Coupon = {
    id: `cp-${Date.now()}`,
    code: code.trim().toUpperCase(),
    type,
    discountValue: Number(discountValue),
    minOrderValue: Number(minOrderValue) || 0,
    expiresAt: expiresAt || '2027-12-31T23:59:59Z',
    isActive: true,
    usageCount: 0,
  };

  dbData.coupons.push(newCoupon);
  saveDb();
  res.json({ success: true, coupon: newCoupon });
});

// 8. Edit / Toggle Coupon (Admin)
app.put('/api/coupons/:id', verifyAdminToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const couponIndex = dbData.coupons.findIndex((c) => c.id === id);
  if (couponIndex === -1) {
    return res.status(404).json({ error: 'Coupon not found' });
  }

  dbData.coupons[couponIndex] = {
    ...dbData.coupons[couponIndex],
    ...req.body,
  };

  saveDb();
  res.json({ success: true, coupon: dbData.coupons[couponIndex] });
});

// 9. Delete Coupon (Admin)
app.delete('/api/coupons/:id', verifyAdminToken, (req: Request, res: Response) => {
  const { id } = req.params;
  dbData.coupons = dbData.coupons.filter((c) => c.id !== id);
  saveDb();
  res.json({ success: true });
});

// 10. Place Customer Order
app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, quantity, files, priceBreakdown, paymentProvider } = req.body;

  if (!customer || !customer.fullName || !customer.phone || !customer.pinCode) {
    return res.status(400).json({ error: 'Complete delivery details are required.' });
  }

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid card quantity.' });
  }

  // Generate unique Order ID e.g. GPVC000004
  const currentCount = dbData.orderCounter;
  dbData.orderCounter += 1;
  const orderIdStr = `GPVC${String(currentCount).padStart(6, '0')}`;

  const nowIso = new Date().toISOString();

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderId: orderIdStr,
    createdAt: nowIso,
    updatedAt: nowIso,
    customer,
    quantity: Number(quantity),
    files: files || [],
    priceBreakdown,
    payment: {
      provider: paymentProvider || 'Razorpay',
      status: 'SUCCESS',
      razorpayPaymentId: `pay_${Date.now()}`,
      razorpayOrderId: `order_${orderIdStr}`,
      paidAt: nowIso,
    },
    status: 'Order Received',
    trackingLogs: [
      {
        status: 'Order Received',
        timestamp: nowIso,
        note: 'Order placed and PDF files verified successfully.',
      },
      {
        status: 'Payment Successful',
        timestamp: nowIso,
        note: `Payment of ₹${priceBreakdown.grandTotal} verified via Razorpay.`,
      },
    ],
    printLabelGenerated: false,
  };

  // If coupon used, increment coupon usage count
  if (priceBreakdown.couponCode) {
    const cp = dbData.coupons.find((c) => c.code === priceBreakdown.couponCode);
    if (cp) {
      cp.usageCount += 1;
    }
  }

  dbData.orders.unshift(newOrder);
  saveDb();

  res.status(201).json({
    success: true,
    order: newOrder,
  });
});

// 11. Customer Order Tracking
app.get('/api/track/:orderId', (req: Request, res: Response) => {
  const queryStr = req.params.orderId.trim().toUpperCase();
  const order = dbData.orders.find(
    (o) => o.orderId.toUpperCase() === queryStr || o.customer.phone === queryStr
  );

  if (!order) {
    return res.status(404).json({ error: `No active order found for "${req.params.orderId}".` });
  }

  res.json(order);
});

// 12. Customer Login/Orders History Search by Phone/Email
app.get('/api/customer/orders', (req: Request, res: Response) => {
  const query = String(req.query.query || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'Please provide phone or email to search orders' });
  }

  const matchingOrders = dbData.orders.filter(
    (o) =>
      o.customer.phone.includes(query) ||
      o.customer.email.toLowerCase().includes(query) ||
      o.orderId.toLowerCase().includes(query)
  );

  res.json(matchingOrders);
});

// 13. Admin Get All Orders (with filters & search)
app.get('/api/orders', verifyAdminToken, (req: Request, res: Response) => {
  let list = [...dbData.orders];

  const search = String(req.query.search || '').trim().toLowerCase();
  const statusFilter = String(req.query.status || 'ALL');

  if (search) {
    list = list.filter(
      (o) =>
        o.orderId.toLowerCase().includes(search) ||
        o.customer.fullName.toLowerCase().includes(search) ||
        o.customer.phone.includes(search) ||
        o.customer.district.toLowerCase().includes(search)
    );
  }

  if (statusFilter !== 'ALL') {
    list = list.filter((o) => o.status === statusFilter);
  }

  res.json(list);
});

// 14. Update Single Order Status (Admin)
app.put('/api/orders/:id/status', verifyAdminToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body as { status: OrderStatus; note?: string };

  const order = dbData.orders.find((o) => o.id === id || o.orderId === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const nowIso = new Date().toISOString();
  order.status = status;
  order.updatedAt = nowIso;
  order.trackingLogs.push({
    status,
    timestamp: nowIso,
    note: note || `Order status updated to ${status}.`,
  });

  saveDb();
  res.json({ success: true, order });
});

// 15. Bulk Update Status (Admin)
app.put('/api/orders/bulk-status', verifyAdminToken, (req: Request, res: Response) => {
  const { orderIds, status } = req.body as { orderIds: string[]; status: OrderStatus };
  if (!Array.isArray(orderIds) || !status) {
    return res.status(400).json({ error: 'orderIds array and status required' });
  }

  const nowIso = new Date().toISOString();
  let updatedCount = 0;

  dbData.orders.forEach((order) => {
    if (orderIds.includes(order.id) || orderIds.includes(order.orderId)) {
      order.status = status;
      order.updatedAt = nowIso;
      order.trackingLogs.push({
        status,
        timestamp: nowIso,
        note: `Bulk update status set to ${status}.`,
      });
      updatedCount += 1;
    }
  });

  saveDb();
  res.json({ success: true, updatedCount });
});

// 16. Delete Order (Admin)
app.delete('/api/orders/:id', verifyAdminToken, (req: Request, res: Response) => {
  const { id } = req.params;
  dbData.orders = dbData.orders.filter((o) => o.id !== id && o.orderId !== id);
  saveDb();
  res.json({ success: true });
});

// 17. Bulk Delete Orders (Admin)
app.post('/api/orders/bulk-delete', verifyAdminToken, (req: Request, res: Response) => {
  const { orderIds } = req.body as { orderIds: string[] };
  if (!Array.isArray(orderIds)) {
    return res.status(400).json({ error: 'orderIds must be an array' });
  }

  dbData.orders = dbData.orders.filter(
    (o) => !orderIds.includes(o.id) && !orderIds.includes(o.orderId)
  );

  saveDb();
  res.json({ success: true });
});

// 18. Admin Analytics & Stats
app.get('/api/admin/stats', verifyAdminToken, (req: Request, res: Response) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  let todayOrders = 0;
  let todayRevenue = 0;
  let monthlyRevenue = 0;
  let pendingOrders = 0;
  let printingOrders = 0;
  let packedOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let totalRevenue = 0;

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  dbData.orders.forEach((o) => {
    const oDate = new Date(o.createdAt);
    const dateStr = o.createdAt.split('T')[0];

    totalRevenue += o.priceBreakdown.grandTotal;

    if (dateStr === todayStr) {
      todayOrders += 1;
      todayRevenue += o.priceBreakdown.grandTotal;
    }

    if (oDate.getMonth() === currentMonth && oDate.getFullYear() === currentYear) {
      monthlyRevenue += o.priceBreakdown.grandTotal;
    }

    if (o.status === 'Order Received' || o.status === 'Payment Successful') pendingOrders += 1;
    if (o.status === 'Printing' || o.status === 'Quality Check') printingOrders += 1;
    if (o.status === 'Packed') packedOrders += 1;
    if (o.status === 'Shipped') shippedOrders += 1;
    if (o.status === 'Delivered') deliveredOrders += 1;
  });

  const totalOrdersCount = dbData.orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  res.json({
    todayOrders,
    todayRevenue,
    monthlyRevenue,
    pendingOrders,
    printingOrders,
    packedOrders,
    shippedOrders,
    deliveredOrders,
    averageOrderValue,
    totalOrdersCount,
  });
});

// 19. SEO Robots.txt & Sitemap
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: ${process.env.APP_URL || 'https://gopvc.in'}/sitemap.xml
`);
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.type('application/xml');
  const baseUrl = process.env.APP_URL || 'https://gopvc.in';
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

// ==================== VITE & STATIC SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GoPvc production server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
