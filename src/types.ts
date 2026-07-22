/**
 * GoPvc Application Types
 */

export type OrderStatus =
  | 'Order Received'
  | 'Payment Successful'
  | 'Printing'
  | 'Quality Check'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface PvcPricingTier {
  id: string;
  minQty: number;
  maxQty: number | null; // null means or above
  pricePerCard: number;
  label?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'flat' | 'percentage';
  discountValue: number;
  minOrderValue: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

export interface UploadedPdfItem {
  id: string;
  fileIndex: number;
  name: string;
  sizeBytes: number;
  pageCount: number;
  isPasswordProtected: boolean;
  isCorrupted: boolean;
  isLowResolution: boolean;
  dimensionsMm: {
    width: number;
    height: number;
  };
  previewDataUrl?: string;
  uploadedAt: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  houseNo: string;
  village: string;
  postOffice: string;
  policeStation: string;
  district: string;
  state: string;
  pinCode: string;
  landmark?: string;
}

export interface PriceBreakdown {
  unitPrice: number;
  subtotal: number;
  tierDiscount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingFee: number;
  grandTotal: number;
  appliedTierLabel?: string;
}

export interface TrackingLog {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderId: string; // e.g. GPVC000001
  createdAt: string;
  updatedAt: string;
  customer: CustomerAddress;
  quantity: number;
  files: UploadedPdfItem[];
  priceBreakdown: PriceBreakdown;
  payment: {
    provider: 'Razorpay' | 'UPI' | 'Cards' | 'NetBanking';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    paidAt?: string;
  };
  status: OrderStatus;
  trackingLogs: TrackingLog[];
  printLabelGenerated: boolean;
  adminNotes?: string;
}

export interface AdminStats {
  todayOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  pendingOrders: number;
  printingOrders: number;
  packedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  averageOrderValue: number;
  totalOrdersCount: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  name: string;
}

export interface PdfValidationResult {
  isValid: boolean;
  isEncrypted: boolean;
  isCorrupted: boolean;
  isLowResolution?: boolean;
  pageCount: number;
  widthMm: number;
  heightMm: number;
  resolutionDpi: number;
  warnings: string[];
  errors: string[];
}
