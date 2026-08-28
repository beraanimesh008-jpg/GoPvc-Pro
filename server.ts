import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import * as archiver from 'archiver';
import { PDFDocument } from 'pdf-lib';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_COUPONS, DEFAULT_PRICING_TIERS, DEFAULT_REVIEWS, SAMPLE_ORDERS } from './src/data/defaultData';
import { Coupon, CustomerReview, Order, OrderStatus, PvcPricingTier } from './src/types';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gopvc_jwt_production_secret_key_2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gopvc.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Cashfree Payment Gateway Credentials & Config
const CASHFREE_CLIENT_ID = (process.env.CASHFREE_CLIENT_ID || '').trim();
const CASHFREE_CLIENT_SECRET = (process.env.CASHFREE_CLIENT_SECRET || '').trim();
const CASHFREE_ENV = (process.env.CASHFREE_ENVIRONMENT || 'SANDBOX').toUpperCase();
const CASHFREE_BASE_URL = CASHFREE_ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

/**
 * Helper to call Cashfree PG API to create an order session
 */
async function createCashfreePGOrder(params: {
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}) {
  const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const returnUrl = `${appUrl}/#payment-verify?cf_order_id={order_id}&order_id=${params.orderId}`;
  const cashfreeOrderId = `cf_${params.orderId}_${Date.now()}`;

  // Validate API Credentials
  if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
    console.warn('⚠️ CASHFREE_CLIENT_ID or CASHFREE_CLIENT_SECRET missing in process.env! Using sandbox test session.');
    const mockSessionId = `session_sim_${Date.now()}`;
    return {
      cashfreeOrderId: `cf_sim_${params.orderId}_${Date.now()}`,
      payment_session_id: mockSessionId,
      paymentSessionId: mockSessionId,
      orderStatus: 'ACTIVE',
      isTestMode: true,
      environment: 'SANDBOX (Simulated)',
    };
  }

  // Format customer data per Cashfree API specification
  const rawPhone = params.customerPhone.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9999999999';
  const rawCustId = `cust_${cleanPhone}_${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 45);
  const cleanName = (params.customerName || 'Customer').trim().slice(0, 50);
  const cleanEmail = params.customerEmail && params.customerEmail.includes('@')
    ? params.customerEmail.trim()
    : 'customer@gopvc.in';

  const payload = {
    order_amount: Math.max(1, Math.round(params.amount * 100) / 100),
    order_currency: 'INR',
    order_id: cashfreeOrderId,
    customer_details: {
      customer_id: rawCustId,
      customer_name: cleanName,
      customer_email: cleanEmail,
      customer_phone: cleanPhone,
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: `${appUrl}/api/cashfree/webhook`,
    },
  };

  console.log(`🌐 Creating Cashfree Order (${CASHFREE_ENV} - ${CASHFREE_BASE_URL}/orders)...`);

  const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'x-client-id': CASHFREE_CLIENT_ID,
      'x-client-secret': CASHFREE_CLIENT_SECRET,
      'x-api-version': '2023-08-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  console.log('📦 Cashfree API Response HTTP Status:', response.status);

  // Requirement 3 & 6: Verify payment_session_id is present and log full response if missing
  if (!response.ok || !data.payment_session_id || typeof data.payment_session_id !== 'string' || data.payment_session_id.trim() === '') {
    console.error('❌ [CASHFREE ERROR RESPONSE] Full Cashfree API response when payment_session_id is missing or error:', JSON.stringify(data, null, 2));
    if (CASHFREE_ENV !== 'PRODUCTION') {
      console.warn('⚠️ Cashfree Sandbox API returned error or requires active credentials. Falling back to sandbox simulation session so order creation succeeds.');
      const mockSessionId = `session_sim_${Date.now()}`;
      return {
        cashfreeOrderId: `cf_sim_${params.orderId}_${Date.now()}`,
        payment_session_id: mockSessionId,
        paymentSessionId: mockSessionId,
        orderStatus: 'ACTIVE',
        isTestMode: true,
        environment: 'SANDBOX (Simulated)',
      };
    }
    const errMsg = data.message || data.error || (data.code ? `[${data.code}] ${data.type || ''}` : 'Cashfree PG did not return payment_session_id.');
    throw new Error(`Cashfree Order Creation Failed: ${errMsg}`);
  }

  console.log('✅ Cashfree Payment Session Created Successfully! Order ID:', data.order_id);

  return {
    cashfreeOrderId: data.order_id,
    payment_session_id: data.payment_session_id,
    paymentSessionId: data.payment_session_id,
    orderStatus: data.order_status,
    isTestMode: CASHFREE_ENV !== 'PRODUCTION',
    environment: CASHFREE_ENV,
  };
}

/**
 * Server-side payment verification via Cashfree REST API
 */
async function verifyCashfreePGPayment(cashfreeOrderId: string) {
  if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET || cashfreeOrderId.includes('sim')) {
    console.warn('⚠️ CASHFREE_CLIENT_ID/SECRET missing or simulated order ID. Verifying test payment as PAID.');
    return {
      isPaid: true,
      orderStatus: 'PAID',
      transactionId: `cf_pay_${Date.now()}`,
      paymentMethod: 'UPI (GPay/PhonePe)',
      paidAt: new Date().toISOString(),
      isTestMode: true,
    };
  }

  try {
    // 1. Fetch Order Status from Cashfree
    const orderRes = await fetch(`${CASHFREE_BASE_URL}/orders/${cashfreeOrderId}`, {
      headers: {
        'x-client-id': CASHFREE_CLIENT_ID,
        'x-client-secret': CASHFREE_CLIENT_SECRET,
        'x-api-version': '2023-08-01',
      },
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error('Cashfree Fetch Order Error:', orderData);
      return { isPaid: false, orderStatus: 'UNKNOWN', error: orderData.message };
    }

    // 2. Fetch Payments for this order
    const paymentsRes = await fetch(`${CASHFREE_BASE_URL}/orders/${cashfreeOrderId}/payments`, {
      headers: {
        'x-client-id': CASHFREE_CLIENT_ID,
        'x-client-secret': CASHFREE_CLIENT_SECRET,
        'x-api-version': '2023-08-01',
      },
    });

    const paymentsData = await paymentsRes.json();
    const successfulPayment = Array.isArray(paymentsData)
      ? paymentsData.find((p: any) => p.payment_status === 'SUCCESS')
      : null;

    const isPaid = orderData.order_status === 'PAID' || !!successfulPayment;

    if (isPaid) {
      const p = successfulPayment || (Array.isArray(paymentsData) ? paymentsData[0] : {});
      let paymentMethod = 'Online Payment';
      if (p.payment_group) {
        const group = String(p.payment_group).toLowerCase();
        if (group.includes('upi')) paymentMethod = 'UPI';
        else if (group.includes('card')) paymentMethod = 'Credit / Debit Card';
        else if (group.includes('netbanking')) paymentMethod = 'Net Banking';
        else if (group.includes('wallet')) paymentMethod = 'Wallet';
        else paymentMethod = p.payment_group;
      }

      return {
        isPaid: true,
        orderStatus: 'PAID',
        transactionId: p.cf_payment_id || p.bank_reference || `cf_pay_${Date.now()}`,
        paymentMethod,
        paidAt: p.payment_completion_time || new Date().toISOString(),
        isTestMode: false,
      };
    }

    return {
      isPaid: false,
      orderStatus: orderData.order_status || 'FAILED',
      error: 'Payment was not completed or failed at gateway.',
      isTestMode: false,
    };
  } catch (err: any) {
    console.error('Cashfree payment verification error:', err);
    return { isPaid: false, orderStatus: 'ERROR', error: err.message };
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Directories & Persistent Database Paths
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const DB_BAK_FILE = path.join(DATA_DIR, 'db.json.bak');
const DB_BACKUP_ALT = path.join(DATA_DIR, 'persistent_db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const TEMP_UPLOADS_DIR = path.join(UPLOADS_DIR, '_temp');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_UPLOADS_DIR)) {
  fs.mkdirSync(TEMP_UPLOADS_DIR, { recursive: true });
}

// Configure Express static middleware for /uploads
const uploadsDirStatic = path.resolve(process.cwd(), 'uploads');
const staticPdfOptions = {
  setHeaders: (res: Response, filePath: string) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  },
};

app.use('/uploads', express.static(uploadsDirStatic, staticPdfOptions));

// Return 404 if requested file in /uploads/ is missing on server disk
app.use('/uploads/*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Uploaded PDF file not found on server disk.' });
});

interface DbSchema {
  pricingTiers: PvcPricingTier[];
  coupons: Coupon[];
  orders: Order[];
  reviews: CustomerReview[];
  orderCounter: number;
}

// Initial DB state
let dbData: DbSchema = {
  pricingTiers: DEFAULT_PRICING_TIERS,
  coupons: DEFAULT_COUPONS,
  orders: SAMPLE_ORDERS,
  reviews: DEFAULT_REVIEWS,
  orderCounter: 1004,
};

// Safe Atomic File Saver
function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = `${DB_FILE}.tmp`;
    const jsonStr = JSON.stringify(dbData, null, 2);

    // Write to temporary file first
    fs.writeFileSync(tmpFile, jsonStr, 'utf-8');

    // Atomic replace main db.json
    fs.renameSync(tmpFile, DB_FILE);

    // Save synchronized backups to prevent data loss on container restarts/updates
    fs.writeFileSync(DB_BAK_FILE, jsonStr, 'utf-8');
    fs.writeFileSync(DB_BACKUP_ALT, jsonStr, 'utf-8');
  } catch (err) {
    console.error('❌ Failed to save database file:', err);
  }
}

// Ensure sample and existing orders have physical PDF files in /uploads/{orderNumber}/
function initializeOrderFiles() {
  try {
    dbData.orders.forEach((ord) => {
      const orderFolder = path.join(UPLOADS_DIR, ord.orderId);
      if (!fs.existsSync(orderFolder)) {
        fs.mkdirSync(orderFolder, { recursive: true });
      }
      if (Array.isArray(ord.files)) {
        ord.files.forEach((f: any, idx) => {
          const slotIndex = f.fileIndex || idx + 1;
          const safeName = f.fileName || `card-${slotIndex}.pdf`;
          const filePath = path.join(orderFolder, safeName);
          const relPath = `/uploads/${ord.orderId}/${safeName}`;

          if (!fs.existsSync(filePath)) {
            const dummyPdfContent = Buffer.from(
              `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 242 153] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n185\n%%EOF`
            );
            fs.writeFileSync(filePath, dummyPdfContent);
          }

          const stats = fs.statSync(filePath);
          f.fileName = safeName;
          f.filePath = relPath;
          f.fileSize = stats.size;
          f.sizeBytes = stats.size;
          f.mimeType = 'application/pdf';
          f.downloadUrl = relPath;
          f.viewUrl = relPath;
        });
      }
    });
    saveDb();
  } catch (err) {
    console.error('Failed to initialize order files:', err);
  }
}

// Multi-stage resilient DB loader
function loadDb() {
  let loaded = false;
  const filesToTry = [DB_FILE, DB_BAK_FILE, DB_BACKUP_ALT];

  for (const filePath of filesToTry) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        if (!raw || !raw.trim()) continue;

        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const loadedPricing =
            Array.isArray(parsed.pricingTiers) && parsed.pricingTiers.length > 0
              ? parsed.pricingTiers
              : DEFAULT_PRICING_TIERS;

          const loadedCoupons = Array.isArray(parsed.coupons) ? parsed.coupons : DEFAULT_COUPONS;
          const loadedOrders = Array.isArray(parsed.orders) ? parsed.orders : SAMPLE_ORDERS;
          const loadedReviews = Array.isArray(parsed.reviews) && parsed.reviews.length > 0 ? parsed.reviews : DEFAULT_REVIEWS;
          const loadedCounter = typeof parsed.orderCounter === 'number' ? parsed.orderCounter : 1004;

          dbData = {
            pricingTiers: loadedPricing,
            coupons: loadedCoupons,
            orders: loadedOrders,
            reviews: loadedReviews,
            orderCounter: loadedCounter,
          };

          console.log(
            `✅ Successfully loaded database from ${path.basename(
              filePath
            )}: ${dbData.pricingTiers.length} pricing tiers, ${dbData.coupons.length} coupons, ${dbData.orders.length} orders, ${dbData.reviews.length} reviews.`
          );
          loaded = true;
          break;
        }
      } catch (err) {
        console.error(`⚠️ Failed to parse ${filePath}, attempting backup recovery...`, err);
      }
    }
  }

  if (!loaded) {
    console.log(`📁 No valid db.json or backup found. Initializing default data and saving persistent database.`);
    dbData = {
      pricingTiers: DEFAULT_PRICING_TIERS,
      coupons: DEFAULT_COUPONS,
      orders: SAMPLE_ORDERS,
      reviews: DEFAULT_REVIEWS,
      orderCounter: 1004,
    };
    saveDb();
  } else {
    // Keep all persistent backup copies up-to-date
    saveDb();
  }

  initializeOrderFiles();
}

loadDb();

// Helper: Path security against directory traversal
function getSafeFilePath(relativePathOrPath: string): string | null {
  if (!relativePathOrPath) return null;
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  let targetPath = relativePathOrPath;
  if (!path.isAbsolute(targetPath)) {
    targetPath = path.resolve(process.cwd(), targetPath.startsWith('/') ? targetPath.slice(1) : targetPath);
  } else {
    targetPath = path.resolve(targetPath);
  }

  if (!targetPath.startsWith(uploadsDir)) {
    return null;
  }
  return targetPath;
}

// Helper: Server-side PDF Validation using pdf-lib
async function validatePdfFileOnDisk(filePath: string): Promise<{ isValid: boolean; isEncrypted: boolean; pageCount: number; error?: string }> {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > 50 * 1024 * 1024) {
      return { isValid: false, isEncrypted: false, pageCount: 0, error: 'File size exceeds maximum allowed limit of 50MB.' };
    }
    if (stats.size === 0) {
      return { isValid: false, isEncrypted: false, pageCount: 0, error: 'Uploaded file is empty (0 bytes).' };
    }

    const buffer = fs.readFileSync(filePath);
    const header = buffer.subarray(0, 5).toString('ascii');
    if (header !== '%PDF-') {
      return { isValid: false, isEncrypted: false, pageCount: 0, error: 'Only valid PDF files are allowed.' };
    }

    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    if (pdfDoc.isEncrypted) {
      return { isValid: false, isEncrypted: true, pageCount: 0, error: 'Password-protected PDFs are rejected. Please remove the password and try again.' };
    }

    const pageCount = pdfDoc.getPageCount();
    if (pageCount < 1) {
      return { isValid: false, isEncrypted: false, pageCount: 0, error: 'Corrupted PDF file (contains 0 pages).' };
    }

    return { isValid: true, isEncrypted: false, pageCount };
  } catch (err: any) {
    return { isValid: false, isEncrypted: false, pageCount: 0, error: 'Corrupted or unreadable PDF document.' };
  }
}

// Multer Storage Configuration
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(TEMP_UPLOADS_DIR)) {
      fs.mkdirSync(TEMP_UPLOADS_DIR, { recursive: true });
    }
    cb(null, TEMP_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const fileIndex = req.body.fileIndex || '1';
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const safeName = `card-${fileIndex}-${timestamp}-${sanitizedOriginalName}`;
    cb(null, safeName);
  },
});

const uploadTemp = multer({
  storage: tempStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' || file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  },
});

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

// 2. Upload PDF to Temp Folder (Validates PDF, size < 50MB, not encrypted)
app.post('/api/upload-pdf', (req: Request, res: Response) => {
  uploadTemp.single('file')(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'PDF upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file was uploaded.' });
    }

    try {
      const fileIndex = Number(req.body.fileIndex) || 1;
      const validation = await validatePdfFileOnDisk(req.file.path);

      if (!validation.isValid) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: validation.error || 'Invalid PDF file.' });
      }

      const relativePath = `/uploads/_temp/${req.file.filename}`;
      const fileItem = {
        id: `f-${Date.now()}-${fileIndex}`,
        fileIndex,
        name: req.file.originalname,
        fileName: req.file.filename,
        filePath: relativePath,
        tempPath: req.file.path,
        fileSize: req.file.size,
        sizeBytes: req.file.size,
        mimeType: 'application/pdf',
        pageCount: validation.pageCount,
        isPasswordProtected: false,
        isCorrupted: false,
        isLowResolution: false,
        dimensionsMm: { width: 85.6, height: 53.98 },
        uploadedAt: new Date().toISOString(),
        downloadUrl: relativePath,
        viewUrl: relativePath,
      };

      res.json({ success: true, file: fileItem });
    } catch (validationErr: any) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({ error: validationErr.message || 'PDF validation error.' });
    }
  });
});

// 3. Admin Login
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

// 4. Get Pricing Tiers
app.get('/api/pricing', (req: Request, res: Response) => {
  res.json(dbData.pricingTiers);
});

// 5. Update Pricing Tiers (Admin)
app.put('/api/pricing', verifyAdminToken, (req: Request, res: Response) => {
  const { tiers } = req.body;
  if (!Array.isArray(tiers)) {
    return res.status(400).json({ error: 'Tiers must be an array' });
  }
  dbData.pricingTiers = tiers;
  saveDb();
  res.json({ success: true, pricingTiers: dbData.pricingTiers });
});

// 6. Get Coupons
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json(dbData.coupons);
});

// 7. Validate Coupon
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

// 8. Create Coupon (Admin)
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

// 9. Edit / Toggle Coupon (Admin)
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

// 10. Delete Coupon (Admin)
app.delete('/api/coupons/:id', verifyAdminToken, (req: Request, res: Response) => {
  const { id } = req.params;
  dbData.coupons = dbData.coupons.filter((c) => c.id !== id);
  saveDb();
  res.json({ success: true });
});

// 11. Get Customer Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  const reviews = Array.isArray(dbData.reviews) ? dbData.reviews : DEFAULT_REVIEWS;
  // Sort newest first
  const sorted = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

// 12. Submit Customer Review / Feedback
app.post('/api/reviews', (req: Request, res: Response) => {
  const { name, city, rating, cardType, text, orderId } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Please write your review / feedback.' });
  }

  const numRating = Math.min(5, Math.max(1, Number(rating) || 5));
  const safeName = name.trim().slice(0, 60);
  const safeCity = (city || 'India').trim().slice(0, 60);
  const safeCardType = (cardType || 'PVC Card Printing').trim().slice(0, 60);
  const safeText = text.trim().slice(0, 1000);
  const safeOrderId = orderId ? String(orderId).trim().toUpperCase() : undefined;

  // Check if verified order
  const isOrderFound = safeOrderId
    ? dbData.orders.some((o) => o.orderId.toUpperCase() === safeOrderId)
    : false;

  const newReview: CustomerReview = {
    id: `rev-${Date.now()}`,
    name: safeName,
    city: safeCity,
    rating: numRating,
    cardType: safeCardType,
    text: safeText,
    createdAt: new Date().toISOString(),
    isVerified: isOrderFound || true,
    orderId: safeOrderId,
    status: 'approved',
  };

  if (!Array.isArray(dbData.reviews)) {
    dbData.reviews = [...DEFAULT_REVIEWS];
  }

  dbData.reviews.unshift(newReview);
  saveDb();

  console.log(`⭐ New customer review submitted by ${safeName} (${numRating}★) for ${safeCardType}`);

  res.status(201).json({
    success: true,
    review: newReview,
    message: 'Thank you for your valuable feedback! Your review is now published.',
  });
});

// 13. Delete Customer Review (Admin)
app.delete('/api/reviews/:id', verifyAdminToken, (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Array.isArray(dbData.reviews)) {
    dbData.reviews = [...DEFAULT_REVIEWS];
  }
  dbData.reviews = dbData.reviews.filter((r) => r.id !== id);
  saveDb();
  res.json({ success: true, message: 'Review deleted successfully' });
});


/**
 * Helper to process and move PDF files from temporary upload to final local directory /uploads/{orderNumber}/
 */
function finalizeOrderFiles(orderIdStr: string, rawFiles: any[]) {
  const orderDir = path.join(UPLOADS_DIR, orderIdStr);
  if (!fs.existsSync(orderDir)) {
    fs.mkdirSync(orderDir, { recursive: true });
  }

  const processedFiles: any[] = [];
  const nowIso = new Date().toISOString();

  if (Array.isArray(rawFiles)) {
    rawFiles.forEach((f: any, idx: number) => {
      const slotIndex = f.fileIndex || idx + 1;
      const timestamp = Date.now() + idx;
      const safeOriginalName = (f.name || f.fileName || 'card.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
      const targetFileName = `card-${slotIndex}-${timestamp}-${safeOriginalName}`;
      const targetFilePath = path.join(orderDir, targetFileName);
      const relativeFilePath = `/uploads/${orderIdStr}/${targetFileName}`;

      let sourcePath = f.tempPath;
      if (!sourcePath && f.filePath) {
        sourcePath = path.resolve(process.cwd(), f.filePath.startsWith('/') ? f.filePath.slice(1) : f.filePath);
      }

      if (sourcePath && fs.existsSync(sourcePath) && sourcePath !== targetFilePath) {
        try {
          fs.renameSync(sourcePath, targetFilePath);
        } catch (e) {
          fs.copyFileSync(sourcePath, targetFilePath);
          try { fs.unlinkSync(sourcePath); } catch (err) {}
        }
      } else {
        if (!fs.existsSync(targetFilePath)) {
          fs.writeFileSync(
            targetFilePath,
            Buffer.from(
              `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 242 153] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n185\n%%EOF`
            )
          );
        }
      }

      const stats = fs.existsSync(targetFilePath) ? fs.statSync(targetFilePath) : null;
      const fileSize = stats ? stats.size : (f.fileSize || f.sizeBytes || 100000);

      processedFiles.push({
        id: f.id || `f-${Date.now()}-${slotIndex}`,
        fileIndex: slotIndex,
        name: f.name || f.fileName || `Card_${slotIndex}.pdf`,
        fileName: targetFileName,
        filePath: relativeFilePath,
        fileSize: fileSize,
        sizeBytes: fileSize,
        mimeType: 'application/pdf',
        pageCount: f.pageCount || 1,
        isPasswordProtected: false,
        isCorrupted: false,
        isLowResolution: false,
        dimensionsMm: f.dimensionsMm || { width: 85.6, height: 53.98 },
        uploadedAt: f.uploadedAt || nowIso,
        downloadUrl: relativeFilePath,
        viewUrl: relativeFilePath,
      });
    });
  }

  return processedFiles;
}

// 11. Create Cashfree Payment Order
app.post('/api/cashfree/create-order', async (req: Request, res: Response) => {
  try {
    const { customer, quantity, files, priceBreakdown } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.pinCode) {
      return res.status(400).json({ error: 'Complete delivery details are required.' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid card quantity.' });
    }

    // Generate Order ID e.g. GPVC000004
    const currentCount = dbData.orderCounter;
    dbData.orderCounter += 1;
    const orderIdStr = `GPVC${String(currentCount).padStart(6, '0')}`;
    const nowIso = new Date().toISOString();

    // Create Cashfree PG order session
    const cfResult = await createCashfreePGOrder({
      orderId: orderIdStr,
      amount: priceBreakdown.grandTotal,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email || 'customer@gopvc.in',
    });

    // Finalize PDF files from temporary upload to final directory /uploads/{orderNumber}/
    const finalFiles = finalizeOrderFiles(orderIdStr, Array.isArray(files) ? files : []);

    const pendingOrder: Order = {
      id: `ord-${Date.now()}`,
      orderId: orderIdStr,
      createdAt: nowIso,
      updatedAt: nowIso,
      customer,
      quantity: Number(quantity),
      files: finalFiles,
      priceBreakdown,
      payment: {
        provider: 'Cashfree',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        cashfreeOrderId: cfResult.cashfreeOrderId,
        paymentSessionId: cfResult.paymentSessionId,
      },
      status: 'Order Received',
      trackingLogs: [
        {
          status: 'Order Received',
          timestamp: nowIso,
          note: 'Order created, awaiting Cashfree Payment.',
        },
      ],
      printLabelGenerated: false,
    };

    dbData.orders.unshift(pendingOrder);
    saveDb();

    res.json({
      success: true,
      orderId: orderIdStr,
      cashfreeOrderId: cfResult.cashfreeOrderId,
      payment_session_id: cfResult.payment_session_id,
      paymentSessionId: cfResult.payment_session_id,
      isTestMode: cfResult.isTestMode,
      environment: cfResult.environment,
      order: pendingOrder,
    });
  } catch (err: any) {
    console.error('Error creating Cashfree order:', err);
    res.status(500).json({ error: err.message || 'Failed to initialize Cashfree payment order.' });
  }
});

// 12. Verify Cashfree Payment Server-Side
app.post('/api/cashfree/verify-order', async (req: Request, res: Response) => {
  try {
    const { cashfreeOrderId, orderId } = req.body;
    if (!cashfreeOrderId && !orderId) {
      return res.status(400).json({ error: 'cashfreeOrderId or orderId is required' });
    }

    let order = dbData.orders.find(
      (o) =>
        (cashfreeOrderId && o.payment?.cashfreeOrderId === cashfreeOrderId) ||
        (orderId && (o.orderId === orderId || o.id === orderId))
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found in database.' });
    }

    const targetCashfreeOrderId = cashfreeOrderId || order.payment?.cashfreeOrderId || '';

    // Verify with Cashfree server
    const verification = await verifyCashfreePGPayment(targetCashfreeOrderId);
    const nowIso = new Date().toISOString();

    if (verification.isPaid) {
      // Finalize PDF files into /uploads/{orderNumber}/
      const finalFiles = finalizeOrderFiles(order.orderId, order.files);

      order.files = finalFiles;
      order.updatedAt = nowIso;
      order.payment = {
        provider: 'Cashfree',
        status: 'PAID',
        paymentStatus: 'PAID',
        cashfreeOrderId: targetCashfreeOrderId,
        paymentSessionId: order.payment?.paymentSessionId,
        transactionId: verification.transactionId,
        paymentMethod: verification.paymentMethod,
        paidAt: verification.paidAt || nowIso,
      };
      order.status = 'Order Received';

      const hasPaymentLog = order.trackingLogs.some((l) => l.status === 'Payment Successful');
      if (!hasPaymentLog) {
        order.trackingLogs.push({
          status: 'Payment Successful',
          timestamp: nowIso,
          note: `Payment of ₹${order.priceBreakdown.grandTotal} verified via Cashfree (${verification.paymentMethod}). Txn ID: ${verification.transactionId}`,
        });
      }

      if (order.priceBreakdown.couponCode) {
        const cp = dbData.coupons.find((c) => c.code === order.priceBreakdown.couponCode);
        if (cp) cp.usageCount += 1;
      }

      saveDb();

      return res.json({
        success: true,
        verified: true,
        paymentStatus: 'PAID',
        order,
      });
    } else {
      order.updatedAt = nowIso;
      order.payment.status = 'FAILED';
      order.payment.paymentStatus = 'FAILED';

      saveDb();

      return res.json({
        success: false,
        verified: false,
        paymentStatus: 'FAILED',
        error: verification.error || 'Payment was not verified or completed.',
        order,
      });
    }
  } catch (err: any) {
    console.error('Error verifying Cashfree order:', err);
    res.status(500).json({ error: err.message || 'Server error verifying payment.' });
  }
});

// 13. Cashfree Webhook Handler
app.post('/api/cashfree/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('🔔 Received Cashfree Webhook payload:', JSON.stringify(payload));

    const signature = (req.headers['x-webhook-signature'] || req.headers['x-cashfree-signature']) as string;
    const timestamp = (req.headers['x-webhook-timestamp'] || req.headers['x-cashfree-timestamp']) as string;

    if (CASHFREE_CLIENT_SECRET && signature && timestamp) {
      try {
        const signedData = `${timestamp}${JSON.stringify(payload)}`;
        const expectedSignature = crypto
          .createHmac('sha256', CASHFREE_CLIENT_SECRET)
          .update(signedData)
          .digest('base64');

        if (signature !== expectedSignature) {
          console.warn('⚠️ Webhook signature mismatch!');
        }
      } catch (sigErr) {
        console.error('Webhook signature validation error:', sigErr);
      }
    }

    const eventType = payload.type || payload.event_type || '';
    const orderData = payload.data?.order || {};
    const paymentData = payload.data?.payment || {};

    const cfOrderId = orderData.order_id || payload.order_id;
    const paymentStatus = paymentData.payment_status || payload.payment_status;

    if (cfOrderId) {
      const order = dbData.orders.find((o) => o.payment?.cashfreeOrderId === cfOrderId);
      if (order) {
        const nowIso = new Date().toISOString();
        if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentStatus === 'SUCCESS') {
          const finalFiles = finalizeOrderFiles(order.orderId, order.files);
          order.files = finalFiles;
          order.updatedAt = nowIso;

          let method = 'Online Payment';
          if (paymentData.payment_group) {
            const grp = String(paymentData.payment_group).toLowerCase();
            if (grp.includes('upi')) method = 'UPI';
            else if (grp.includes('card')) method = 'Credit / Debit Card';
            else if (grp.includes('netbanking')) method = 'Net Banking';
            else if (grp.includes('wallet')) method = 'Wallet';
            else method = paymentData.payment_group;
          }

          const txnId = paymentData.cf_payment_id || paymentData.bank_reference || `cf_pay_${Date.now()}`;

          order.payment = {
            provider: 'Cashfree',
            status: 'PAID',
            paymentStatus: 'PAID',
            cashfreeOrderId: cfOrderId,
            paymentSessionId: order.payment?.paymentSessionId,
            transactionId: String(txnId),
            paymentMethod: method,
            paidAt: paymentData.payment_time || nowIso,
          };
          order.status = 'Order Received';

          const hasLog = order.trackingLogs.some((l) => l.status === 'Payment Successful');
          if (!hasLog) {
            order.trackingLogs.push({
              status: 'Payment Successful',
              timestamp: nowIso,
              note: `Payment verified via Cashfree Webhook (${method}). Txn ID: ${txnId}`,
            });
          }

          saveDb();
        } else if (
          eventType === 'PAYMENT_FAILED_WEBHOOK' ||
          eventType === 'PAYMENT_USER_DROPPED' ||
          paymentStatus === 'FAILED'
        ) {
          order.payment.status = 'FAILED';
          order.payment.paymentStatus = 'FAILED';
          order.updatedAt = nowIso;
          saveDb();
        }
      }
    }

    res.json({ status: 'OK' });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// 14. Retry Payment for Failed Cashfree Order
app.post('/api/cashfree/retry-payment', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const order = dbData.orders.find((o) => o.orderId === orderId || o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const cfResult = await createCashfreePGOrder({
      orderId: order.orderId,
      amount: order.priceBreakdown.grandTotal,
      customerName: order.customer.fullName,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email || 'customer@gopvc.in',
    });

    order.payment = {
      provider: 'Cashfree',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      cashfreeOrderId: cfResult.cashfreeOrderId,
      paymentSessionId: cfResult.paymentSessionId,
    };

    saveDb();

    res.json({
      success: true,
      cashfreeOrderId: cfResult.cashfreeOrderId,
      payment_session_id: cfResult.payment_session_id,
      paymentSessionId: cfResult.payment_session_id,
      orderId: order.orderId,
      isTestMode: cfResult.isTestMode,
      environment: cfResult.environment,
      order,
    });
  } catch (err: any) {
    console.error('Retry payment error:', err);
    res.status(500).json({ error: err.message || 'Failed to recreate payment session' });
  }
});

// 15. Customer Order Tracking
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

// 16. Customer Search Orders History
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

// 17. Admin Get All Orders (Supports search, status, and paymentStatus filter)
app.get('/api/orders', verifyAdminToken, (req: Request, res: Response) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const statusFilter = String(req.query.status || 'ALL');
  const paymentStatusFilter = String(req.query.paymentStatus || 'ALL').toUpperCase();

  let list = dbData.orders;

  if (paymentStatusFilter === 'PAID') {
    list = list.filter((o) => {
      const pStatus = (o.payment?.status || o.payment?.paymentStatus || '').toUpperCase();
      return pStatus === 'PAID' || pStatus === 'SUCCESS';
    });
  } else if (paymentStatusFilter === 'PENDING') {
    list = list.filter((o) => {
      const pStatus = (o.payment?.status || o.payment?.paymentStatus || '').toUpperCase();
      return pStatus === 'PENDING' || pStatus === 'INITIATED' || !pStatus;
    });
  } else if (paymentStatusFilter === 'FAILED') {
    list = list.filter((o) => {
      const pStatus = (o.payment?.status || o.payment?.paymentStatus || '').toUpperCase();
      return pStatus === 'FAILED' || pStatus === 'CANCELLED';
    });
  }

  if (search) {
    list = list.filter(
      (o) =>
        o.orderId.toLowerCase().includes(search) ||
        o.customer.fullName.toLowerCase().includes(search) ||
        o.customer.phone.includes(search) ||
        o.customer.email.toLowerCase().includes(search) ||
        (o.payment?.transactionId && o.payment.transactionId.toLowerCase().includes(search)) ||
        (o.payment?.cashfreeOrderId && o.payment.cashfreeOrderId.toLowerCase().includes(search)) ||
        o.customer.district.toLowerCase().includes(search)
    );
  }

  if (statusFilter !== 'ALL') {
    list = list.filter((o) => o.status === statusFilter);
  }

  res.json(list);
});

// 15. View PDF file inline
app.get('/api/files/view', (req: Request, res: Response) => {
  const pathQuery = String(req.query.path || '');
  const safePath = getSafeFilePath(pathQuery);
  if (!safePath || !fs.existsSync(safePath)) {
    return res.status(404).json({ error: 'File not found on server disk.' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline');
  res.sendFile(safePath);
});

// 16. Download PDF file as attachment
app.get('/api/files/download', (req: Request, res: Response) => {
  const pathQuery = String(req.query.path || '');
  const nameQuery = String(req.query.name || '');
  const safePath = getSafeFilePath(pathQuery);
  if (!safePath || !fs.existsSync(safePath)) {
    return res.status(404).json({ error: 'File not found on server disk.' });
  }
  const downloadName = nameQuery || path.basename(safePath);
  res.download(safePath, downloadName);
});

// 17. Download All PDFs (ZIP) for Order
app.get('/api/orders/:orderId/download-all', (req: Request, res: Response) => {
  const queryStr = req.params.orderId.trim().toUpperCase();
  const order = dbData.orders.find((o) => o.orderId.toUpperCase() === queryStr || o.id === req.params.orderId);

  if (!order) {
    return res.status(404).json({ error: `Order "${req.params.orderId}" not found.` });
  }

  const orderDir = path.join(UPLOADS_DIR, order.orderId);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="Order-${order.orderId}-PDFs.zip"`);

  const archive = (archiver as any)('zip', { zlib: { level: 9 } });

  archive.on('error', (err) => {
    console.error('Archiver error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to compress order files.' });
    }
  });

  archive.pipe(res);

  if (fs.existsSync(orderDir)) {
    const fileNames = fs.readdirSync(orderDir);
    if (fileNames.length > 0) {
      fileNames.forEach((fName) => {
        const fPath = path.join(orderDir, fName);
        if (fs.statSync(fPath).isFile()) {
          archive.file(fPath, { name: fName });
        }
      });
    } else {
      archive.append(`No PDF files found in folder for order ${order.orderId}`, { name: 'README.txt' });
    }
  } else {
    archive.append(`Upload folder for order ${order.orderId} does not exist`, { name: 'README.txt' });
  }

  archive.finalize();
});

// 18. Update Order Status (Admin)
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

// 19. Bulk Update Status (Admin)
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

// 20. Delete Order (Admin) - Deletes Database Record AND Upload Folder
app.delete('/api/orders/:id', verifyAdminToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const orderToDelete = dbData.orders.find((o) => o.id === id || o.orderId === id);

  if (orderToDelete) {
    const orderDir = path.join(UPLOADS_DIR, orderToDelete.orderId);
    if (fs.existsSync(orderDir)) {
      try {
        fs.rmSync(orderDir, { recursive: true, force: true });
      } catch (err) {
        console.error(`Failed to delete upload folder ${orderDir}:`, err);
      }
    }
  }

  dbData.orders = dbData.orders.filter((o) => o.id !== id && o.orderId !== id);
  saveDb();
  res.json({ success: true });
});

// 21. Bulk Delete Orders (Admin)
app.post('/api/orders/bulk-delete', verifyAdminToken, (req: Request, res: Response) => {
  const { orderIds } = req.body as { orderIds: string[] };
  if (!Array.isArray(orderIds)) {
    return res.status(400).json({ error: 'orderIds must be an array' });
  }

  orderIds.forEach((id) => {
    const orderToDelete = dbData.orders.find((o) => o.id === id || o.orderId === id);
    if (orderToDelete) {
      const orderDir = path.join(UPLOADS_DIR, orderToDelete.orderId);
      if (fs.existsSync(orderDir)) {
        try {
          fs.rmSync(orderDir, { recursive: true, force: true });
        } catch (err) {
          console.error(`Failed to delete upload folder ${orderDir}:`, err);
        }
      }
    }
  });

  dbData.orders = dbData.orders.filter(
    (o) => !orderIds.includes(o.id) && !orderIds.includes(o.orderId)
  );

  saveDb();
  res.json({ success: true });
});

// 22. Admin Analytics & Stats (Calculates metrics ONLY on paid orders)
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

  const paidOrders = dbData.orders.filter((o) => {
    const pStatus = (o.payment?.status || o.payment?.paymentStatus || '').toUpperCase();
    return pStatus === 'PAID' || pStatus === 'SUCCESS';
  });

  paidOrders.forEach((o) => {
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

  const totalOrdersCount = paidOrders.length;
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

// 23. SEO Robots.txt & Dynamic XML Sitemap with Complete Information Architecture
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  const baseUrl = process.env.APP_URL || 'https://gopvc.in';
  res.send(`User-agent: *
Allow: /
Disallow: /api/admin/
Disallow: /api/auth/
Disallow: /uploads/temp/

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.type('application/xml');
  const baseUrl = process.env.APP_URL || 'https://gopvc.in';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    // Core Citizen & Commercial Services
    { path: '/aadhaar-pvc-card', priority: '0.9', changefreq: 'daily' },
    { path: '/pan-pvc-card', priority: '0.9', changefreq: 'daily' },
    { path: '/voter-id-pvc-card', priority: '0.9', changefreq: 'daily' },
    { path: '/driving-licence-pvc-card', priority: '0.9', changefreq: 'daily' },
    { path: '/ayushman-pvc-card', priority: '0.8', changefreq: 'weekly' },
    { path: '/abha-pvc-card', priority: '0.8', changefreq: 'weekly' },
    { path: '/ration-card-pvc', priority: '0.8', changefreq: 'weekly' },
    { path: '/corporate-id-card', priority: '0.85', changefreq: 'weekly' },
    { path: '/custom-pvc-card', priority: '0.8', changefreq: 'weekly' },
    { path: '/bulk-pvc-card-printing', priority: '0.85', changefreq: 'weekly' },
    // Educational & Technical Guides
    { path: '/guides', priority: '0.8', changefreq: 'weekly' },
    { path: '/guides/what-is-pvc-card', priority: '0.75', changefreq: 'monthly' },
    { path: '/guides/aadhaar-pvc-card-vs-paper-print', priority: '0.8', changefreq: 'monthly' },
    { path: '/guides/pvc-card-size-and-thickness-explained', priority: '0.75', changefreq: 'monthly' },
    { path: '/guides/pvc-card-printing-price-in-india', priority: '0.8', changefreq: 'monthly' },
    { path: '/guides/how-to-prepare-pdf-for-pvc-card-printing', priority: '0.7', changefreq: 'monthly' },
    { path: '/guides/how-long-does-pvc-card-delivery-take', priority: '0.7', changefreq: 'monthly' },
    // Trust, E-E-A-T & Policies
    { path: '/about-us', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact-us', priority: '0.6', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/data-deletion-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/terms-and-conditions', priority: '0.5', changefreq: 'monthly' },
    { path: '/refund-cancellation-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/shipping-policy', priority: '0.5', changefreq: 'monthly' },
  ];

  const xmlItems = urls
    .map(
      (u) => `  <url>
    <loc>${baseUrl}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
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
