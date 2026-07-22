import React, { useState } from 'react';
import { Order, CustomerAddress, PriceBreakdown } from '../types';
import { ShieldCheck, CreditCard, QrCode, Building, Lock, CheckCircle2, X } from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceBreakdown: PriceBreakdown;
  customer: CustomerAddress;
  onPaymentSuccess: (paymentResult: { provider: string; paymentId: string }) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  priceBreakdown,
  customer,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        provider: activeTab === 'upi' ? 'Razorpay (UPI)' : activeTab === 'card' ? 'Razorpay (Card)' : 'Razorpay (NetBanking)',
        paymentId: `pay_PvcLive_${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xs">
              RZP
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                Razorpay Checkout
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  TEST MODE
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Merchant: GoPvc Print Hub</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Summary */}
        <div className="bg-slate-50 p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              PAYMENT AMOUNT
            </span>
            <span className="text-2xl font-black text-slate-900">
              ₹{priceBreakdown.grandTotal}
            </span>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-700 font-bold block">{customer.fullName}</span>
            <span className="text-slate-500 text-[11px]">{customer.phone}</span>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('upi')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'upi'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> UPI / QR
            </button>

            <button
              onClick={() => setActiveTab('card')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'card'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Card
            </button>

            <button
              onClick={() => setActiveTab('netbanking')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'netbanking'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" /> NetBank
            </button>
          </div>

          {/* TAB 1: UPI / QR Code */}
          {activeTab === 'upi' && (
            <div className="space-y-4 text-center">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block">
                {/* Simulated QR Code box */}
                <div className="w-32 h-32 bg-white border-2 border-slate-900 rounded-xl p-2 mx-auto flex flex-col items-center justify-center relative">
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <span className="absolute bottom-1 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                    SCAN & PAY
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2">
                  GPay • PhonePe • Paytm • BHIM
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 text-left mb-1">
                  Or enter UPI ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Card */}
          {activeTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NetBanking */}
          {activeTab === 'netbanking' && (
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              <button className="p-3 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50 text-center transition">
                State Bank of India
              </button>
              <button className="p-3 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50 text-center transition">
                HDFC Bank
              </button>
              <button className="p-3 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50 text-center transition">
                ICICI Bank
              </button>
              <button className="p-3 rounded-xl border border-slate-200 hover:border-red-600 hover:bg-red-50 text-center transition">
                Axis Bank
              </button>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handleSimulatedPay}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 disabled:opacity-50 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Simulate Successful Payment ₹{priceBreakdown.grandTotal}</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            256-Bit SSL Encrypted Razorpay Gateway
          </p>
        </div>
      </div>
    </div>
  );
};
