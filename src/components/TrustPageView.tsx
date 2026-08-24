import React from 'react';
import { TrustPage } from '../data/trustPages';
import { ShieldCheck, ChevronRight, CheckCircle2, ArrowRight, Lock, Phone, Mail, MapPin } from 'lucide-react';

interface TrustPageViewProps {
  page: TrustPage;
  onNavigatePath: (path: string) => void;
  onOrderNow: () => void;
}

export const TrustPageView: React.FC<TrustPageViewProps> = ({
  page,
  onNavigatePath,
  onOrderNow,
}) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 space-y-8">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigatePath('/')}
            className="hover:text-red-600 transition"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-red-600 font-bold">{page.h1}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Policy Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {page.badge}
              </span>
              <span className="text-xs text-slate-400">
                Last reviewed: {page.lastUpdated}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {page.h1}
            </h1>
          </div>

          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-8">
            {page.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {sec.heading}
                </h2>
                <p className="text-slate-600 leading-relaxed font-normal">{sec.content}</p>
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-2 pt-1 pl-2">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Contact Details Quick Box */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400" /> GoPVC Official Contact & Facility
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Operating Facility: GoPvc Print Hub, Unit 4, Plot 88, Kolkata, West Bengal - 700091, India.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-red-400" /> +91 87001 60926</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-red-400" /> support@gopvc.in</span>
              <span className="text-slate-400 font-mono">GSTIN: 19AABCG0123P1Z5</span>
            </div>
          </div>

        </article>

      </div>
    </div>
  );
};
