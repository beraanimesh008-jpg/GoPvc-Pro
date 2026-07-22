import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { generateInvoicePdf, generateShippingLabelPdf } from '../lib/pdfGenerator';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  MapPin,
  RefreshCw,
  XCircle,
  PackageCheck,
  AlertCircle,
  Phone,
} from 'lucide-react';

interface OrderTrackingModalProps {
  initialOrderId?: string;
  onClose?: () => void;
}

const ALL_STATUSES: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Order Received', label: 'Order Received', desc: 'PDF files verified & queued' },
  { status: 'Payment Successful', label: 'Payment Verified', desc: 'Razorpay payment authorized' },
  { status: 'Printing', label: 'High-Def UV Printing', desc: 'Printing on 800-micron substrate' },
  { status: 'Quality Check', label: 'Quality Inspection', desc: 'Thickness & scratch test passed' },
  { status: 'Packed', label: 'Sealed & Packed', desc: 'Moisture-proof courier mailer' },
  { status: 'Shipped', label: 'Dispatched with Courier', desc: 'In transit to delivery address' },
  { status: 'Delivered', label: 'Delivered', desc: 'Successfully handed to customer' },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  initialOrderId = '',
  onClose,
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await api.trackOrder(idToSearch.trim());
      setOrder(result);
    } catch (err: any) {
      setOrder(null);
      setErrorMsg(err.message || 'Order not found. Please verify Order ID or Mobile Number.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      fetchTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(searchInput);
  };

  const getStatusIndex = (status: OrderStatus) => {
    return ALL_STATUSES.findIndex((s) => s.status === status);
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      const doc = await generateInvoicePdf(order);
      doc.save(`GoPvc_Invoice_${order.orderId}.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadLabel = async () => {
    if (!order) return;
    try {
      const doc = await generateShippingLabelPdf(order);
      doc.save(`GoPvc_ShippingLabel_${order.orderId}.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Search Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto font-bold">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Track PVC Card Dispatch Live
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your 10-digit Order ID (e.g. GPVC000001) or Registered Mobile Number.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Order ID or Mobile Number"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 disabled:opacity-50 transition shadow-sm shadow-red-200"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Track'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold max-w-md mx-auto flex items-center gap-2 justify-center">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Order Tracking Timeline Display */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-8 animate-in fade-in">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ORDER REFERENCE
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {order.orderId}
                <span className="px-3 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                  {order.status}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadInvoice}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>Invoice PDF</span>
              </button>

              <button
                onClick={handleDownloadLabel}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Label PDF</span>
              </button>
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Fulfillment Progress
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {ALL_STATUSES.map((step, idx) => {
                const currentIdx = getStatusIndex(order.status);
                const isCompleted = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                const logForStep = order.trackingLogs.find((l) => l.status === step.status);

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-red-600 text-white shadow-md shadow-red-200 ring-4 ring-red-50'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px]">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Information */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-extrabold ${
                            isCompleted ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>

                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold animate-pulse">
                            IN PROGRESS
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500">{step.desc}</p>

                      {logForStep && (
                        <div className="text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mt-1">
                          <span className="text-slate-400 font-normal mr-2">
                            {new Date(logForStep.timestamp).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>{logForStep.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              Delivery Destination
            </span>
            <p className="text-xs font-bold text-slate-900">{order.customer.fullName}</p>
            <p className="text-xs text-slate-600">
              {order.customer.houseNo}, {order.customer.village}, PO: {order.customer.postOffice}, PS: {order.customer.policeStation}, {order.customer.district}, {order.customer.state} - {order.customer.pinCode}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" /> +91 {order.customer.phone}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
