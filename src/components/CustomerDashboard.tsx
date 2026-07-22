import React, { useState } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { generateInvoicePdf } from '../lib/pdfGenerator';
import {
  User,
  Search,
  Package,
  Truck,
  FileText,
  RotateCcw,
  RefreshCw,
  XCircle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface CustomerDashboardProps {
  onReorder: (order: Order) => void;
  onTrackOrder: (orderId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onReorder,
  onTrackOrder,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [customerOrders, setCustomerOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const orders = await api.getCustomerOrders(searchInput.trim());
      if (orders.length === 0) {
        setErrorMsg(`No orders found matching "${searchInput}". Please verify your mobile number or email.`);
        setCustomerOrders([]);
      } else {
        setCustomerOrders(orders);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to search customer orders.');
      setCustomerOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const doc = await generateInvoicePdf(order);
      doc.save(`GoPvc_Invoice_${order.orderId}.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Search Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto font-bold">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Portal & Order History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your past PVC card orders, download invoices, track live dispatches, or reorder with 1 click.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Mobile Number or Email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition shadow-xs flex items-center justify-center"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Find Orders'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold max-w-md mx-auto flex items-center gap-2 justify-center">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Orders List */}
      {customerOrders && customerOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-red-600" />
              Found {customerOrders.length} Order(s)
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {customerOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-red-200 transition"
              >
                {/* Left Order Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">{ord.orderId}</span>
                    <span className="px-3 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                    <span>•</span>
                    <span>{ord.quantity} PVC Card(s)</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">₹{ord.priceBreakdown.grandTotal}</span>
                  </div>

                  <p className="text-xs text-slate-600 truncate max-w-md">
                    Deliver To: {ord.customer.fullName}, {ord.customer.village}, {ord.customer.district} ({ord.customer.pinCode})
                  </p>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onTrackOrder(ord.orderId)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-red-600" />
                    <span>Track Status</span>
                  </button>

                  <button
                    onClick={() => handleDownloadInvoice(ord)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Invoice PDF</span>
                  </button>

                  <button
                    onClick={() => onReorder(ord)}
                    className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm shadow-red-200 transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder Cards</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
