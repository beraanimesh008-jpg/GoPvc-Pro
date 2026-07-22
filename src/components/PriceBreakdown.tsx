import React, { useState } from 'react';
import { PriceBreakdown as PriceBreakdownType, PvcPricingTier } from '../types';
import { Tag, CheckCircle2, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface PriceBreakdownProps {
  quantity: number;
  pricingTiers: PvcPricingTier[];
  priceBreakdown: PriceBreakdownType;
  onApplyCoupon: (code: string, discountAmount: number) => void;
  onRemoveCoupon: () => void;
  onProceedToPayment: () => void;
  isReadyForPayment: boolean;
  missingRequirementsMessage?: string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  quantity,
  pricingTiers,
  priceBreakdown,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToPayment,
  isReadyForPayment,
  missingRequirementsMessage,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await api.validateCoupon(couponInput, priceBreakdown.subtotal);
      if (res.valid) {
        onApplyCoupon(res.couponCode, res.discountAmount);
        setCouponInput('');
      }
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-100 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="pb-3 sm:pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 block mb-0.5">
            STEP 3 OF 3
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Order Summary & Payment
          </h2>
        </div>

        <div className="text-right">
          <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold border border-red-100">
            {priceBreakdown.appliedTierLabel || 'Standard Price'}
          </span>
        </div>
      </div>

      {/* Itemized Calculation List */}
      <div className="space-y-3 text-xs font-medium text-slate-700">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-600">
            Base PVC Cards ({quantity} × ₹{priceBreakdown.unitPrice})
          </span>
          <span className="font-bold text-slate-900">₹{priceBreakdown.subtotal}</span>
        </div>

        {/* Volume Tier Discount Savings */}
        {priceBreakdown.tierDiscount > 0 && (
          <div className="flex justify-between items-center py-1 text-emerald-600">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Volume Bulk Discount
            </span>
            <span className="font-bold">- ₹{priceBreakdown.tierDiscount}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {priceBreakdown.couponDiscount > 0 && (
          <div className="flex justify-between items-center py-1 text-emerald-600">
            <span className="flex items-center gap-1.5 font-bold">
              <Tag className="w-3.5 h-3.5" />
              Coupon ({priceBreakdown.couponCode})
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold">- ₹{priceBreakdown.couponDiscount}</span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-[10px] text-rose-600 hover:underline font-bold"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Shipping Fee */}
        <div className="flex justify-between items-center py-1 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1 text-slate-600">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            Express PAN-India Delivery
          </span>
          <span className="font-bold text-emerald-600">
            {priceBreakdown.shippingFee === 0 ? 'FREE' : `₹${priceBreakdown.shippingFee}`}
          </span>
        </div>
      </div>

      {/* Coupon Code Input Box */}
      {!priceBreakdown.couponCode && (
        <form onSubmit={handleCouponSubmit} className="space-y-2 pt-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Have a coupon? (e.g. GOPVC50)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs uppercase font-bold focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isValidatingCoupon || !couponInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {isValidatingCoupon ? 'Validating...' : 'Apply'}
            </button>
          </div>
          {couponError && (
            <p className="text-[11px] font-semibold text-rose-600">{couponError}</p>
          )}
        </form>
      )}

      {/* Grand Total Highlight Box */}
      <div className="bg-red-50/60 rounded-2xl p-5 border border-red-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
            GRAND TOTAL (INCL. ALL TAXES & SHIPPING)
          </span>
          <span className="text-3xl font-black text-slate-900">
            ₹{priceBreakdown.grandTotal}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Razorpay Secure
          </span>
        </div>
      </div>

      {/* Proceed Button */}
      <div>
        <button
          onClick={onProceedToPayment}
          disabled={!isReadyForPayment}
          className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Pay ₹{priceBreakdown.grandTotal} via Razorpay</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {!isReadyForPayment && missingRequirementsMessage && (
          <p className="text-[11px] font-semibold text-amber-600 text-center mt-2.5">
            ⚠️ {missingRequirementsMessage}
          </p>
        )}
      </div>

      {/* Security assurances */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 128-bit SSL Encrypted
        </span>
        <span>•</span>
        <span>Razorpay Verified</span>
        <span>•</span>
        <span>Instant PDF Invoice</span>
      </div>
    </div>
  );
};
