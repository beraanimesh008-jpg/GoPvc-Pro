import React from 'react';
import { SEO_GUIDES } from '../data/seoPages';
import { BookOpen, ChevronRight, Clock, ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface GuidesHubViewProps {
  onNavigatePath: (path: string) => void;
  onOrderNow: () => void;
}

export const GuidesHubView: React.FC<GuidesHubViewProps> = ({ onNavigatePath, onOrderNow }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 space-y-8">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigatePath('/')}
            className="hover:text-red-600 transition"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-red-600 font-bold">Guides & Knowledge Base</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hub Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-100 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> CARD PRINTING KNOWLEDGE BASE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            PVC Card Printing Guides & Technical Insights
          </h1>
          <p className="text-sm text-slate-600">
            Expert articles, dimension specs, file preparation tutorials, and comparison breakdowns for citizen identity cards and corporate badges in India.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEO_GUIDES.map((guide) => (
            <div
              key={guide.slug}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:border-red-200 hover:shadow-md transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                    {guide.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {guide.readTime}
                  </span>
                </div>

                <h2 className="text-base font-black text-slate-900 group-hover:text-red-600 transition leading-snug">
                  {guide.h1}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {guide.excerpt}
                </p>
              </div>

              <button
                onClick={() => onNavigatePath(guide.path)}
                className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-red-600 transition cursor-pointer"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
              </button>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="p-8 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-white">Have a PDF Ready to Print?</h3>
            <p className="text-xs text-slate-300">
              Get your 800-micron rigid PVC plastic cards printed and dispatched with free shipping.
            </p>
          </div>
          <button
            onClick={onOrderNow}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Order PVC Cards Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
