import React from 'react';
import { PvcPricingTier } from '../types';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Printer, Sparkles } from 'lucide-react';

interface PricingTableProps {
  pricingTiers: PvcPricingTier[];
  onSelectQuantity: (qty: number) => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  pricingTiers,
  onSelectQuantity,
}) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black tracking-wide shadow-sm border border-slate-800 hover:border-slate-700 transition">
              <Printer className="w-3.5 h-3.5 text-red-500" />
              <span>Evolis iconic Primacy 2</span>
              <span className="text-[10px] text-slate-400 font-semibold border-l border-slate-700 pl-2">HD 300 DPI Thermal UV</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              TRANSPARENT VOLUME PRICING
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Order More, Save More
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Automated tier discounts applied instantly when card quantity increases.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            pricingTiers.length === 4
              ? 'lg:grid-cols-4'
              : pricingTiers.length <= 3
              ? 'lg:grid-cols-3'
              : 'md:grid-cols-3 lg:grid-cols-5'
          } gap-4 sm:gap-6`}
        >
          {pricingTiers.map((tier, idx) => {
            const isPopular = idx === 1 || (pricingTiers.length >= 4 && idx === 2);
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-3xl p-6 shadow-xl border-2 transition-all flex flex-col justify-between ${
                  isPopular ? 'border-red-600 ring-4 ring-red-50' : 'border-slate-100'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-100">
                      Tier #{idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {tier.maxQty === 1
                        ? '1 Card'
                        : tier.maxQty
                        ? `${tier.minQty}-${tier.maxQty} Cards`
                        : `${tier.minQty}+ Cards`}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {tier.maxQty === 1
                      ? 'Single Card'
                      : tier.maxQty
                      ? `${tier.minQty} to ${tier.maxQty} Cards`
                      : `Bulk ${tier.minQty}+ Cards`}
                  </h3>

                  <div>
                    <span className="text-3xl font-black text-slate-900">₹{tier.pricePerCard}</span>
                    <span className="text-xs font-normal text-slate-500"> / card</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>800 Micron Solid Rigid PVC</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>HD UV Thermal Printing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Includes Free Doorstep Shipping</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onSelectQuantity(tier.minQty)}
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                    isPopular
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <span>Select {tier.minQty} Card(s)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
