import React from 'react';
import { PvcPricingTier } from '../types';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

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
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            TRANSPARENT VOLUME PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Order More, Save More
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Automated tier discounts applied instantly when card quantity increases.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier, idx) => {
            const isPopular = idx === 1 || idx === 2;
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-3xl p-6 shadow-xl border-2 transition-all flex flex-col justify-between ${
                  isPopular ? 'border-red-600 ring-4 ring-red-50' : 'border-slate-100'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {tier.maxQty === 1
                      ? 'Single Card'
                      : tier.maxQty
                      ? `${tier.minQty} to ${tier.maxQty} Cards`
                      : `${tier.minQty}+ Bulk Cards`}
                  </span>

                  <div>
                    <span className="text-3xl font-black text-slate-900">₹{tier.pricePerCard}</span>
                    <span className="text-xs font-normal text-slate-500"> / card</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>800 Micron PVC Substrate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>HD UV Ink Printing</span>
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
