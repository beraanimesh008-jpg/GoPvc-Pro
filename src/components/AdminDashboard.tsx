import React, { useState, useEffect } from 'react';
import {
  AdminStats,
  Coupon,
  Order,
  OrderStatus,
  PvcPricingTier,
} from '../types';
import { api } from '../services/api';
import { generateInvoicePdf, generateShippingLabelPdf } from '../lib/pdfGenerator';
import {
  Lock,
  LogOut,
  BarChart3,
  Package,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  CheckSquare,
  Square,
  Download,
  Printer,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Layers,
  Tag,
  ShieldCheck,
  X,
  FileText,
  Copy,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('admin@gopvc.in');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'orders' | 'pricing' | 'coupons'>('orders');

  // Stats & Orders State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedPaymentStatusFilter, setSelectedPaymentStatusFilter] = useState('ALL');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Checkbox Selection
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Modals
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const [bulkStatusToApply, setBulkStatusToApply] = useState<OrderStatus>('Printing');

  // Pricing Tiers State
  const [pricingTiers, setPricingTiers] = useState<PvcPricingTier[]>([]);
  const [isSavingPricing, setIsSavingPricing] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'flat' | 'percentage'>('flat');
  const [newCouponValue, setNewCouponValue] = useState(50);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(200);

  // Check existing auth token
  useEffect(() => {
    const token = api.getAdminToken();
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await api.adminLogin(loginEmail, loginPassword);
      setIsAuthenticated(true);
      fetchDashboardData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.clearAdminToken();
    setIsAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    setIsLoadingOrders(true);
    try {
      const [statsData, ordersData, tiersData, couponsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(searchQuery, selectedStatusFilter, selectedPaymentStatusFilter),
        api.getPricingTiers(),
        api.getCoupons(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setPricingTiers(tiersData);
      setCoupons(couponsData);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [searchQuery, selectedStatusFilter, selectedPaymentStatusFilter, isAuthenticated]);

  // Order Selection Handlers
  const handleSelectAllOrders = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((o) => o.id));
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status Update Handler
  const handleUpdateSingleStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Bulk Status Update
  const handleApplyBulkStatus = async () => {
    if (selectedOrderIds.length === 0) return;
    try {
      await api.bulkUpdateOrderStatus(selectedOrderIds, bulkStatusToApply);
      setSelectedOrderIds([]);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Bulk Delete
  const handleApplyBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedOrderIds.length} orders?`)) return;
    try {
      await api.bulkDeleteOrders(selectedOrderIds);
      setSelectedOrderIds([]);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save Pricing Tiers
  const handleSavePricingTiers = async () => {
    setIsSavingPricing(true);
    try {
      await api.updatePricingTiers(pricingTiers);
      alert('Pricing Tiers updated successfully!');
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    try {
      await api.createCoupon({
        code: newCouponCode,
        type: newCouponType,
        discountValue: newCouponValue,
        minOrderValue: newCouponMinOrder,
      });
      setShowAddCouponModal(false);
      setNewCouponCode('');
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id: string) => {
    try {
      await api.deleteCoupon(id);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // PDF Downloads
  const handleDownloadInvoice = async (order: Order) => {
    const doc = await generateInvoicePdf(order);
    doc.save(`GoPvc_Invoice_${order.orderId}.pdf`);
  };

  const handleDownloadLabel = async (order: Order) => {
    const doc = await generateShippingLabelPdf(order);
    doc.save(`GoPvc_ShippingLabel_${order.orderId}.pdf`);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Login</h2>
            <p className="text-xs text-slate-500">GoPvc Backoffice Control Center</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-md shadow-red-200 transition"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Initial Demo Credentials:</p>
            <p>Email: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">admin@gopvc.in</code></p>
            <p>Password: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">admin123</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navbar */}
      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
            ADMINISTRATION PORTAL
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            GoPvc Control Panel
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Sub Navigation Tabs */}
          <div className="bg-slate-800 p-1 rounded-2xl flex gap-1 shrink-0">
            <button
              onClick={() => setAdminTab('orders')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'orders' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setAdminTab('pricing')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'pricing' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pricing Rules
            </button>
            <button
              onClick={() => setAdminTab('coupons')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                adminTab === 'coupons' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coupons
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">TODAY'S ORDERS</span>
            <span className="text-2xl font-black text-slate-900">{stats.todayOrders}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">₹{stats.todayRevenue} Revenue</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">MONTHLY REVENUE</span>
            <span className="text-2xl font-black text-slate-900">₹{stats.monthlyRevenue}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">AOV: ₹{stats.averageOrderValue}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-amber-600 block">PENDING ORDERS</span>
            <span className="text-2xl font-black text-amber-600">{stats.pendingOrders}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">Requires Processing</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-blue-600 block">IN PRINTING</span>
            <span className="text-2xl font-black text-blue-600">{stats.printingOrders}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">UV Machine Active</span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-emerald-600 block">DELIVERED</span>
            <span className="text-2xl font-black text-emerald-600">{stats.deliveredOrders}</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">Total {stats.totalOrdersCount} Orders</span>
          </div>
        </div>
      )}

      {/* TAB 1: ORDER MANAGEMENT */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Order ID, Name, Phone, District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="ALL">All Order Statuses</option>
                <option value="Order Received">Order Received</option>
                <option value="Payment Successful">Payment Successful</option>
                <option value="Printing">Printing</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>

              <select
                value={selectedPaymentStatusFilter}
                onChange={(e) => setSelectedPaymentStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>

          {/* Bulk Operations Toolbar */}
          {selectedOrderIds.length > 0 && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
              <span className="text-xs font-bold">
                {selectedOrderIds.length} Order(s) Selected
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={bulkStatusToApply}
                  onChange={(e) => setBulkStatusToApply(e.target.value as OrderStatus)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold border border-slate-700"
                >
                  <option value="Printing">Set Status: Printing</option>
                  <option value="Quality Check">Set Status: Quality Check</option>
                  <option value="Packed">Set Status: Packed</option>
                  <option value="Shipped">Set Status: Shipped</option>
                  <option value="Delivered">Set Status: Delivered</option>
                </select>

                <button
                  onClick={handleApplyBulkStatus}
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Apply Bulk Status
                </button>

                <button
                  onClick={handleApplyBulkDelete}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
                </button>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 w-8 text-center">
                    <button onClick={handleSelectAllOrders} className="text-slate-600">
                      {selectedOrderIds.length === orders.length && orders.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-red-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer & Phone</th>
                  <th className="p-3">Payment & Txn ID</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Grand Total</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {orders.map((ord) => {
                  const payStatus = (ord.payment?.status || ord.payment?.paymentStatus || 'PAID').toUpperCase();
                  const txnId = ord.payment?.transactionId || ord.payment?.cashfreeOrderId || 'N/A';
                  const method = ord.payment?.paymentMethod || ord.payment?.provider || 'Cashfree';

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleSelectOrder(ord.id)}
                          className="text-slate-600"
                        >
                          {selectedOrderIds.includes(ord.id) ? (
                            <CheckSquare className="w-4 h-4 text-red-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="p-3 font-extrabold text-slate-900">{ord.orderId}</td>

                      <td className="p-3">
                        <span className="font-bold block">{ord.customer.fullName}</span>
                        <span className="text-[10px] text-slate-500">{ord.customer.phone}</span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {payStatus === 'PAID' || payStatus === 'SUCCESS' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">
                              PAID
                            </span>
                          ) : payStatus === 'PENDING' ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] border border-amber-300">
                              PENDING
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[10px] border border-rose-300">
                              FAILED
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-bold">({method})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 block truncate max-w-[130px]">
                          Txn: {txnId}
                        </span>
                      </td>

                      <td className="p-3 font-bold">{ord.quantity} Cards</td>

                      <td className="p-3 font-bold text-emerald-600">₹{ord.priceBreakdown.grandTotal}</td>

                      <td className="p-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateSingleStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-200 bg-white"
                        >
                          <option value="Order Received">Order Received</option>
                          <option value="Payment Successful">Payment Successful</option>
                          <option value="Printing">Printing</option>
                          <option value="Quality Check">Quality Check</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="p-3 text-[10px] text-slate-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                      </td>

                      <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedOrderDetail(ord)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        title="View Order Details & PDFs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <a
                        href={`/api/orders/${ord.orderId}/download-all`}
                        download={`Order-${ord.orderId}-PDFs.zip`}
                        className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 inline-flex items-center"
                        title="Download All Customer PDFs (ZIP)"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDownloadInvoice(ord)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50"
                        title="Download Invoice PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadLabel(ord)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        title="Print A6 Label"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete order ${ord.orderId}?`)) {
                            await api.deleteOrder(ord.id);
                            fetchDashboardData();
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING RULES */}
      {adminTab === 'pricing' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Dynamic Pricing Tier System</h3>
              <p className="text-xs text-slate-500">Configure quantity discount tiers applied automatically at checkout.</p>
            </div>
            <button
              onClick={handleSavePricingTiers}
              disabled={isSavingPricing}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition"
            >
              {isSavingPricing ? 'Saving...' : 'Save Pricing Changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingTiers.map((tier, idx) => (
              <div key={tier.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-red-600 uppercase">Tier #{idx + 1}</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Min Qty</label>
                    <input
                      type="number"
                      value={tier.minQty}
                      onChange={(e) => {
                        const copy = [...pricingTiers];
                        copy[idx].minQty = Number(e.target.value);
                        setPricingTiers(copy);
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Price Per Card (₹)</label>
                    <input
                      type="number"
                      value={tier.pricePerCard}
                      onChange={(e) => {
                        const copy = [...pricingTiers];
                        copy[idx].pricePerCard = Number(e.target.value);
                        setPricingTiers(copy);
                      }}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COUPON MANAGER */}
      {adminTab === 'coupons' && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Coupon Code Manager</h3>
              <p className="text-xs text-slate-500">Create and manage flat / percentage discount codes.</p>
            </div>
            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((cp) => (
              <div key={cp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-slate-900 font-mono tracking-wider">{cp.code}</span>
                  <button
                    onClick={() => handleDeleteCoupon(cp.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-emerald-600 font-bold">
                  {cp.type === 'flat' ? `₹${cp.discountValue} Flat Discount` : `${cp.discountValue}% Percentage Off`}
                </p>
                <p className="text-[10px] text-slate-500">Min Order Value: ₹{cp.minOrderValue}</p>
                <p className="text-[10px] text-slate-500">Used {cp.usageCount} times</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Coupon Code (e.g. SUMMER10)"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Min Order Value (₹)</label>
                <input
                  type="number"
                  required
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAIL MODAL */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                  ORDER DETAILS & FILE DOWNLOADS
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {selectedOrderDetail.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Order Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-sm">{selectedOrderDetail.customer.fullName}</p>
                <p className="text-slate-600">📞 {selectedOrderDetail.customer.phone}</p>
                <p className="text-slate-600">✉️ {selectedOrderDetail.customer.email}</p>
                <p className="text-slate-500 text-[11px] pt-1">
                  📍 {selectedOrderDetail.customer.houseNo}, {selectedOrderDetail.customer.village}, {selectedOrderDetail.customer.district}, {selectedOrderDetail.customer.state} - {selectedOrderDetail.customer.pinCode}
                </p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                <p className="text-slate-600"><strong>Quantity:</strong> {selectedOrderDetail.quantity} PVC Cards</p>
                <p className="text-slate-600"><strong>Grand Total:</strong> ₹{selectedOrderDetail.priceBreakdown.grandTotal}</p>
                <p className="text-slate-600"><strong>Order Status:</strong> <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-bold text-[10px]">{selectedOrderDetail.status}</span></p>
                <p className="text-slate-500 text-[11px]"><strong>Order Date:</strong> {new Date(selectedOrderDetail.createdAt).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Cashfree Payment Information */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-teal-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Cashfree PG Payment Details
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  (selectedOrderDetail.payment?.status || selectedOrderDetail.payment?.paymentStatus || 'PAID').toUpperCase() === 'PAID'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  {(selectedOrderDetail.payment?.status || selectedOrderDetail.payment?.paymentStatus || 'PAID').toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium pt-1">
                <p><strong>Transaction ID:</strong> <span className="font-mono text-slate-900">{selectedOrderDetail.payment?.transactionId || 'N/A'}</span></p>
                <p><strong>Cashfree Order ID:</strong> <span className="font-mono text-slate-900">{selectedOrderDetail.payment?.cashfreeOrderId || 'N/A'}</span></p>
                <p><strong>Payment Session ID:</strong> <span className="font-mono text-slate-900 text-[10px] truncate block">{selectedOrderDetail.payment?.paymentSessionId || 'N/A'}</span></p>
                <p><strong>Payment Method:</strong> <span className="font-bold text-slate-900">{selectedOrderDetail.payment?.paymentMethod || 'UPI / Online'}</span></p>
                {selectedOrderDetail.payment?.paidAt && (
                  <p className="col-span-2"><strong>Paid Timestamp:</strong> {new Date(selectedOrderDetail.payment.paidAt).toLocaleString('en-IN')}</p>
                )}
              </div>
            </div>

            {/* Uploaded PDF Files Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  Uploaded Customer PDFs ({selectedOrderDetail.files?.length || 0})
                </h4>

                {selectedOrderDetail.files && selectedOrderDetail.files.length > 0 && (
                  <a
                    href={`/api/orders/${selectedOrderDetail.orderId}/download-all`}
                    download={`Order-${selectedOrderDetail.orderId}-PDFs.zip`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-red-400" />
                    Download All PDFs (ZIP)
                  </a>
                )}
              </div>

              {!selectedOrderDetail.files || selectedOrderDetail.files.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No uploaded PDF files associated with this order.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedOrderDetail.files.map((file: any, fIdx: number) => {
                    const slotNum = file.fileIndex || fIdx + 1;
                    const viewUrl = file.filePath || `/uploads/${selectedOrderDetail.orderId}/${file.fileName}`;
                    const downloadUrl = `/api/files/download?path=${encodeURIComponent(viewUrl)}&name=${encodeURIComponent(file.name || file.fileName)}`;

                    return (
                      <div
                        key={file.id || fIdx}
                        className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-red-200 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                            #{slotNum}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {file.name || file.fileName || `PVC_Card_${slotNum}.pdf`}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {(file.fileSize || file.sizeBytes ? (file.fileSize || file.sizeBytes) / (1024 * 1024) : 0.1).toFixed(2)} MB • {file.pageCount || 1} Page(s) • PDF Document
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition"
                            title="View PDF inline in browser"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" /> View
                          </a>

                          <a
                            href={downloadUrl}
                            download={file.name || file.fileName}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs"
                            title="Download PDF to computer"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleDownloadInvoice(selectedOrderDetail)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-red-600" /> Print Invoice
              </button>
              <button
                onClick={() => handleDownloadLabel(selectedOrderDetail)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-700" /> Print Shipping Label
              </button>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
