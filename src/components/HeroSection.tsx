import React from 'react';
import { ShieldCheck, Zap, Sparkles, ArrowRight, CheckCircle2, Upload, CreditCard, ShieldAlert } from 'lucide-react';
import { CardSlider } from './CardSlider';
import { PvcPricingTier } from '../types';

interface HeroSectionProps {
  onScrollToUpload: () => void;
  pricingTiers?: PvcPricingTier[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToUpload, pricingTiers }) => {
  const singlePrice = pricingTiers?.[0]?.pricePerCard || 65;
  const lowestPrice = pricingTiers?.[pricingTiers.length - 1]?.pricePerCard || 35;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-6 sm:pt-10 pb-10 sm:pb-16 border-b border-slate-100">
      {/* Background Subtle Accent Blob */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-red-200">
              <Sparkles className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>India's #1 Rated PVC Card Printing Service</span>
            </div>

            {/* H1 SEO Headline & Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                PVC Card Order Online <br className="hidden sm:inline" />
                <span className="text-red-600">in India</span>
              </h1>
              <p className="text-xl sm:text-2xl font-black text-red-600 tracking-tight">
                Starting at ₹{lowestPrice}/card with Free Delivery
              </p>
            </div>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium leading-relaxed">
              Order high-quality PVC cards online for Aadhaar, PAN Card, Voter ID, Driving Licence, Ayushman Bharat, ABHA and other ID cards.
            </p>

            {/* 6 Key Features Checklist Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Waterproof</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Scratch Resistant</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Premium Finish</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Secure Upload</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Fast Processing</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Home Delivery Across India</span>
              </div>
            </div>

            {/* Call to Action Buttons: Primary & Secondary */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onScrollToUpload}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 shadow-lg shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                aria-label="Order Now PVC Cards"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToUpload}
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                aria-label="Upload PDF Document"
              >
                <Upload className="w-4 h-4 text-red-400" />
                <span>Upload PDF</span>
              </button>

              <div className="text-xs text-slate-500 flex items-center gap-2 justify-center sm:justify-start pt-1 sm:pt-0">
                <div className="flex -space-x-2 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] border-2 border-white">
                    99%
                  </div>
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px] border-2 border-white">
                    ★
                  </div>
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-800 block">12,500+ Cards Delivered</span>
                  <p className="text-[10px] text-slate-500">Verified 4.9/5 Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card Mockup Feature Box */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-100 space-y-4 sm:space-y-5">
              
              {/* Card Spec Tag Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs border border-red-100">
                    CR80
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Standard Plastic Substrate</span>
                    <span className="text-[10px] text-slate-500">85.6mm × 53.98mm × 0.8mm</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                  IN STOCK
                </span>
              </div>

              {/* Automatic Card Slider Showcase */}
              <CardSlider />

              {/* Dynamic Instant Price Banner */}
              <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">STARTING RATE</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900">₹{lowestPrice}<span className="text-xs font-normal text-slate-500"> / card (Bulk)</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 block">
                    1 Card @ ₹{singlePrice}
                  </span>
                  <span className="text-[10px] text-slate-500">Includes Free Doorstep Delivery</span>
                </div>
              </div>

              {/* Security guarantee footer */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                <span>100% Encrypted File Processing. Files deleted after printing.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

