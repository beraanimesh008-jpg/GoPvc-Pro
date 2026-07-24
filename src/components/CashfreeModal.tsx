import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, QrCode, Building, Wallet, Lock, AlertCircle, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

declare global {
  interface Window {
    Cashfree?: any;
  }
}

interface CashfreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cashfreeOrderId: string;
  paymentSessionId: string;
  orderId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  isTestMode?: boolean;
  onPaymentSuccess: (order: Order) => void;
  onPaymentFailure: (errorMsg: string) => void;
}

export const CashfreeModal: React.FC<CashfreeModalProps> = ({
  isOpen,
  onClose,
  cashfreeOrderId,
  paymentSessionId,
  orderId,
  amount,
  customerName,
  customerPhone,
  isTestMode = false,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');

  if (!isOpen) return null;

  const triggerCashfreeSDK = async () => {
    setErrorMessage(null);
    setIsVerifying(true);

    try {
      let cashfreeInstance: any = null;

      if (window.Cashfree) {
        cashfreeInstance = window.Cashfree({
          mode: isTestMode ? 'sandbox' : 'production',
        });
      } else {
        // Fallback or dynamic loader if window.Cashfree is not ready yet
        const { load } = await import('@cashfreepayments/cashfree-js');
        cashfreeInstance = await load({
          mode: isTestMode ? 'sandbox' : 'production',
        });
      }

      if (!cashfreeInstance || !paymentSessionId) {
        throw new Error('Cashfree Payment Gateway SDK failed to initialize.');
      }

      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: '_modal',
      };

      cashfreeInstance.checkout(checkoutOptions).then(async (result: any) => {
        setIsVerifying(true);
        if (result.error) {
          console.warn('Cashfree Checkout Error/Cancel:', result.error);
          const verifyRes = await api.verifyCashfreeOrder(cashfreeOrderId, orderId);
          setIsVerifying(false);

          if (verifyRes.verified && verifyRes.order) {
            onPaymentSuccess(verifyRes.order);
          } else {
            const msg = verifyRes.error || result.error.message || 'Payment was cancelled or failed.';
            setErrorMessage(msg);
            onPaymentFailure(msg);
          }
        } else if (result.paymentDetails || result.redirect) {
          // Verify server-side
          const verifyRes = await api.verifyCashfreeOrder(cashfreeOrderId, orderId);
          setIsVerifying(false);

          if (verifyRes.verified && verifyRes.order) {
            onPaymentSuccess(verifyRes.order);
          } else {
            const msg = verifyRes.error || 'Payment verification failed.';
            setErrorMessage(msg);
            onPaymentFailure(msg);
          }
        } else {
          // Default server verification
          const verifyRes = await api.verifyCashfreeOrder(cashfreeOrderId, orderId);
          setIsVerifying(false);

          if (verifyRes.verified && verifyRes.order) {
            onPaymentSuccess(verifyRes.order);
          } else {
            setErrorMessage('Payment verification pending or failed.');
          }
        }
      });
    } catch (err: any) {
      console.error('Cashfree launch error:', err);
      // Fallback: Verify payment with server directly
      try {
        const verifyRes = await api.verifyCashfreeOrder(cashfreeOrderId, orderId);
        setIsVerifying(false);
        if (verifyRes.verified && verifyRes.order) {
          onPaymentSuccess(verifyRes.order);
          return;
        }
      } catch (vErr) {}

      setIsVerifying(false);
      setErrorMessage(err.message || 'Could not launch Cashfree Checkout. Please try again.');
    }
  };

  const handleManualVerify = async () => {
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      const verifyRes = await api.verifyCashfreeOrder(cashfreeOrderId, orderId);
      setIsVerifying(false);

      if (verifyRes.verified && verifyRes.order) {
        onPaymentSuccess(verifyRes.order);
      } else {
        const msg = verifyRes.error || 'Payment not completed yet. Please complete payment or retry.';
        setErrorMessage(msg);
      }
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMessage(err.message || 'Error checking payment status.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Cashfree Branded Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-teal-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-xs tracking-wider shadow-md">
              CF
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-2 text-white">
                Cashfree Payments
                {isTestMode ? (
                  <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700">
                    TEST MODE
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700">
                    LIVE GATEWAY
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-teal-200/80 font-medium">Order: #{orderId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Bar */}
        <div className="bg-slate-50 p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              TOTAL AMOUNT TO PAY
            </span>
            <span className="text-2xl font-black text-teal-700">₹{amount}</span>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-900 font-bold block">{customerName}</span>
            <span className="text-slate-500 text-[11px]">{customerPhone}</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Supported Methods Badges */}
          <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-3 text-center space-y-2">
            <span className="text-[11px] font-bold text-teal-900 tracking-wide block">
              SUPPORTED PAYMENT METHODS
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setSelectedMethod('upi')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedMethod === 'upi'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                UPI / QR
              </button>

              <button
                onClick={() => setSelectedMethod('card')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedMethod === 'card'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Cards
              </button>

              <button
                onClick={() => setSelectedMethod('netbanking')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedMethod === 'netbanking'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                NetBank
              </button>

              <button
                onClick={() => setSelectedMethod('wallet')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center gap-1 ${
                  selectedMethod === 'wallet'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                Wallets
              </button>
            </div>
            <p className="text-[10px] text-teal-800 font-medium">
              Google Pay • PhonePe • Paytm • BHIM • All Major Banks & Cards
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Payment Error / Pending</p>
                <p className="text-[11px] text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Checkout Launch Action */}
          <div className="space-y-3">
            <button
              onClick={triggerCashfreeSDK}
              disabled={isVerifying}
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Verifying with Cashfree...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-teal-200" />
                  Pay ₹{amount} via Cashfree
                </>
              )}
            </button>

            <button
              onClick={handleManualVerify}
              disabled={isVerifying}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              Already paid? Verify Status with Server
            </button>
          </div>

          {/* Security Guarantee Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit SSL Encrypted
            </span>
            <span>Official Cashfree Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
