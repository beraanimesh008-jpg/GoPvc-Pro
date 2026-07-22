import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Amitabh Roy',
    city: 'Kolkata, WB',
    rating: 5,
    text: 'Ordered 3 PVC cards for Aadhaar & PAN. The thickness is identical to an ATM bank card! UV print color contrast is super clear and barcodes scan instantly.',
    cardType: 'Aadhaar & PAN PVC',
    date: '2 days ago',
  },
  {
    id: 2,
    name: 'Sneha Kulkarni',
    city: 'Pune, MH',
    rating: 5,
    text: 'Uploaded 10 employee badges for our firm. Received package via Bluedart in 2 days. The auto PDF validator saved us from uploading encrypted files. Highly recommended!',
    cardType: 'Corporate Employee IDs',
    date: '5 days ago',
  },
  {
    id: 3,
    name: 'Manish Verma',
    city: 'Jaipur, RJ',
    rating: 5,
    text: 'Very fast service and great price. Loved the live tracking feature. Received invoice PDF on my WhatsApp and email immediately after Razorpay payment.',
    cardType: 'Voter & Driving License',
    date: '1 week ago',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            CUSTOMER REVIEWS
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Loved by 12,500+ Happy Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED BUYER
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{rev.name}</span>
                  <span className="text-[10px] text-slate-500">{rev.city}</span>
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                  {rev.cardType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
