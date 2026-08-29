import React from 'react';
import { Lock, Award, Droplets, Truck, Headphones, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TrustBadgesBanner: React.FC = () => {
  const trustItems = [
    {
      icon: Lock,
      title: 'Secure Upload',
      desc: '256-bit SSL encrypted PDF processing & auto deletion',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      desc: '800-micron rigid CR80 bank card plastic substrate',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      icon: Droplets,
      title: 'Waterproof PVC',
      desc: '100% tearproof, scratchproof & UV color sealed',
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      desc: '24-48 hr dispatch with free doorstep shipping in India',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      desc: 'Dedicated phone & WhatsApp support (+91 87001 60926)',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  return (
    <section className="py-8 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-800/60 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> GUARANTEED QUALITY & SERVICE EXCELLENCE
          </span>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
            Why 100,000+ Indian Citizens Trust GoPVC
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${item.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 font-normal leading-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
