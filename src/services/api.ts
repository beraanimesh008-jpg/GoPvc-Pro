import {
  AdminStats,
  AdminUser,
  Coupon,
  Order,
  OrderStatus,
  PriceBreakdown,
  PvcPricingTier,
} from '../types';

const ADMIN_TOKEN_KEY = 'gopvc_admin_jwt';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `HTTP error! status: ${response.status}`);
  }

  return data as T;
}

export const api = {
  getAdminToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  setAdminToken(token: string) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },

  clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  // Upload PDF file to server disk
  async uploadPdf(file: File, fileIndex: number): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileIndex', String(fileIndex));

    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Failed to upload PDF file.');
    }

    return data.file;
  },

  // Admin Authentication
  async adminLogin(email: string, pass: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetchJson<{ success: boolean; token: string; user: AdminUser }>(
      '/api/admin/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      }
    );
    this.setAdminToken(res.token);
    return res;
  },

  // Get Pricing Tiers
  async getPricingTiers(): Promise<PvcPricingTier[]> {
    return fetchJson<PvcPricingTier[]>('/api/pricing');
  },

  // Update Pricing Tiers (Admin)
  async updatePricingTiers(tiers: PvcPricingTier[]): Promise<PvcPricingTier[]> {
    const res = await fetchJson<{ success: boolean; pricingTiers: PvcPricingTier[] }>(
      '/api/pricing',
      {
        method: 'PUT',
        body: JSON.stringify({ tiers }),
      }
    );
    return res.pricingTiers;
  },

  // Get Coupons
  async getCoupons(): Promise<Coupon[]> {
    return fetchJson<Coupon[]>('/api/coupons');
  },

  // Validate Coupon
  async validateCoupon(code: string, subtotal: number): Promise<{
    valid: boolean;
    couponCode: string;
    discountValue: number;
    discountAmount: number;
  }> {
    return fetchJson('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  // Create Coupon (Admin)
  async createCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    const res = await fetchJson<{ success: boolean; coupon: Coupon }>('/api/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
    return res.coupon;
  },

  // Toggle/Update Coupon (Admin)
  async updateCoupon(id: string, updateData: Partial<Coupon>): Promise<Coupon> {
    const res = await fetchJson<{ success: boolean; coupon: Coupon }>(`/api/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return res.coupon;
  },

  // Delete Coupon (Admin)
  async deleteCoupon(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`/api/coupons/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  // Create Cashfree Payment Order
  async createCashfreeOrder(orderData: {
    customer: any;
    quantity: number;
    files: any[];
    priceBreakdown: PriceBreakdown;
  }): Promise<{
    success: boolean;
    orderId: string;
    cashfreeOrderId: string;
    paymentSessionId: string;
    isTestMode: boolean;
    order: Order;
  }> {
    return fetchJson('/api/cashfree/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Verify Cashfree Payment Server-Side
  async verifyCashfreeOrder(
    cashfreeOrderId?: string,
    orderId?: string
  ): Promise<{
    success: boolean;
    verified: boolean;
    paymentStatus: string;
    order: Order;
    error?: string;
  }> {
    return fetchJson('/api/cashfree/verify-order', {
      method: 'POST',
      body: JSON.stringify({ cashfreeOrderId, orderId }),
    });
  },

  // Retry Cashfree Payment
  async retryCashfreePayment(orderId: string): Promise<{
    success: boolean;
    cashfreeOrderId: string;
    paymentSessionId: string;
    orderId: string;
    isTestMode: boolean;
    order: Order;
  }> {
    return fetchJson('/api/cashfree/retry-payment', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  // Track Order Status
  async trackOrder(orderId: string): Promise<Order> {
    return fetchJson<Order>(`/api/track/${encodeURIComponent(orderId)}`);
  },

  // Search Customer History
  async getCustomerOrders(query: string): Promise<Order[]> {
    return fetchJson<Order[]>(`/api/customer/orders?query=${encodeURIComponent(query)}`);
  },

  // Admin Get All Orders (Supports search, status, paymentStatus)
  async getAdminOrders(search = '', status = 'ALL', paymentStatus = 'ALL'): Promise<Order[]> {
    return fetchJson<Order[]>(
      `/api/orders?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&paymentStatus=${encodeURIComponent(paymentStatus)}`
    );
  },

  // Admin Update Order Status
  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    const res = await fetchJson<{ success: boolean; order: Order }>(
      `/api/orders/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
      }
    );
    return res.order;
  },

  // Admin Bulk Update Status
  async bulkUpdateOrderStatus(orderIds: string[], status: OrderStatus): Promise<number> {
    const res = await fetchJson<{ success: boolean; updatedCount: number }>(
      '/api/orders/bulk-status',
      {
        method: 'PUT',
        body: JSON.stringify({ orderIds, status }),
      }
    );
    return res.updatedCount;
  },

  // Admin Delete Order
  async deleteOrder(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  // Admin Bulk Delete Orders
  async bulkDeleteOrders(orderIds: string[]): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>('/api/orders/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ orderIds }),
    });
    return res.success;
  },

  // Admin Analytics & KPIs
  async getAdminStats(): Promise<AdminStats> {
    return fetchJson<AdminStats>('/api/admin/stats');
  },
};
