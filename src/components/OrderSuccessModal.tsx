import React, { useState } from 'react';
import { Order } from '../types';
import { generateInvoicePdf, generateShippingLabelPdf } from '../lib/pdfGenerator';
import {
  CheckCircle2,
  FileText,
  Printer,
  Download,
  Truck,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isGeneratingLabel, setIsGeneratingLabel] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = async () => {
    setIsGeneratingInvoice(true);
    try {
      const doc = await generateInvoicePdf(order);
      doc.save(`GoPvc_Invoice_${order.orderId}.pdf`);
    } catch (err) {
      console.error('Invoice generation failed:', err);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handleDownloadLabel = async () => {
    setIsGeneratingLabel(true);
    try {
      const doc = await generateShippingLabelPdf(order);
      doc.save(`GoPvc_ShippingLabel_${order.orderId}.pdf`);
    } catch (err) {
      console.error('Shipping label generation failed:', err);
    } finally {
      setIsGeneratingLabel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
        
        {/* Success Icon Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
              PAYMENT SUCCESSFUL
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Order Confirmed & Received!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Thank you, {order.customer.fullName}. Your PVC cards have been routed to our printing facility.
            </p>
          </div>
        </div>

        {/* Order ID Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              YOUR UNIQUE ORDER ID
            </span>
            <span className="text-xl font-black text-slate-900 tracking-wider">
              {order.orderId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyOrderId}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Details Summary Grid */}
        <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs font-medium text-slate-700">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Cards Quantity</span>
            <span className="font-bold text-slate-900">{order.quantity} PVC Card(s)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-bold text-emerald-600">₹{order.priceBreakdown.grandTotal}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Delivery Address</span>
            <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
              {order.customer.village}, {order.customer.district} ({order.customer.pinCode})
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Estimated Delivery</span>
            <span className="font-bold text-slate-900">2 - 4 Business Days</span>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadInvoice}
            disabled={isGeneratingInvoice}
            className="py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-red-600" />
            <span>{isGeneratingInvoice ? 'Generating...' : 'Tax Invoice PDF'}</span>
          </button>

          <button
            onClick={handleDownloadLabel}
            disabled={isGeneratingLabel}
            className="py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{isGeneratingLabel ? 'Generating...' : 'Shipping Label'}</span>
          </button>
        </div>

        {/* Action CTAs */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.orderId);
            }}
            className="w-full py-3.5 rounded-2xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Live Status</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
