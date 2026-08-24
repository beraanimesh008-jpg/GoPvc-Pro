import React from 'react';
import { SeoServicePage } from '../data/seoPages';
import { ThirdPartyAdBanner } from './ThirdPartyAdBanner';
import { PvcPricingTier } from '../types';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  HelpCircle,
  FileCheck2,
  Lock,
  Layers,
  ChevronRight,
  Sparkles,
  Printer,
  FileText,
  CreditCard,
} from 'lucide-react';

interface ServiceLandingPageViewProps {
  service: SeoServicePage;
  onOrderNow: () => void;
  onNavigatePath: (path: string) => void;
  pricingTiers?: PvcPricingTier[];
}

export const ServiceLandingPageView: React.FC<ServiceLandingPageViewProps> = ({
  service,
  onOrderNow,
  onNavigatePath,
  pricingTiers,
}) => {
  const lowestPrice = pricingTiers?.[pricingTiers.length - 1]?.pricePerCard || 35;
  const singlePrice = pricingTiers?.[0]?.pricePerCard || 65;

  return (
    <div className="bg-slate-50 min-h-screen pb-16 space-y-10">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto">
          <button
            onClick={() => onNavigatePath('/')}
            className="hover:text-red-600 transition flex items-center gap-1"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">PVC Card Printing</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-red-600 font-bold truncate">{service.h1}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Service Hero Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {service.badge}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Free All-India Delivery
            </span>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" /> 800 Micron Rigid Plastic
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {service.h1}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
              {service.summary}
            </p>
          </div>

          {/* Pricing Highlight Pill & Primary CTA */}
          <div className="p-5 bg-gradient-to-r from-red-50 via-white to-slate-50 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Transparent Pricing</div>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{lowestPrice} – ₹{singlePrice}</span>
                <span className="text-xs font-semibold text-slate-500">/ card (Bulk discounts applied)</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">✓ No hidden shipping or packaging charges</div>
            </div>

            <button
              onClick={onOrderNow}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Order {service.h1} Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Technical Specifications & Substrate Matrix */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-red-600" /> Key Features & Quality Assurance
            </h2>
            <ul className="space-y-3.5 text-sm text-slate-700">
              {service.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Target Use Case & Eligibility
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {service.whoIsItFor}
              </p>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-600" /> Physical Specifications
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between gap-2">
                <span className="font-semibold text-slate-500">Dimensions</span>
                <span className="font-bold text-slate-800 text-right">{service.cardSpecifications.dimensions}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-2">
                <span className="font-semibold text-slate-500">Thickness</span>
                <span className="font-bold text-slate-800 text-right">{service.cardSpecifications.thickness}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-2">
                <span className="font-semibold text-slate-500">Material</span>
                <span className="font-bold text-slate-800 text-right">{service.cardSpecifications.material}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-2">
                <span className="font-semibold text-slate-500">Print Engine</span>
                <span className="font-bold text-slate-800 text-right">{service.cardSpecifications.printTechnology}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-2">
                <span className="font-semibold text-slate-500">Surface Finish</span>
                <span className="font-bold text-slate-800 text-right">{service.cardSpecifications.finish}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-2">
                <span className="font-semibold text-slate-500">Lifespan</span>
                <span className="font-bold text-emerald-700 text-right">{service.cardSpecifications.durability}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <Lock className="w-3.5 h-3.5 text-slate-700 inline mr-1" />
              {service.privacyNote}
            </div>
          </div>

        </section>

        {/* Non-intrusive Ad Placement */}
        <ThirdPartyAdBanner />

        {/* Step-by-Step Ordering Guide */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">Quick 4-Step Process</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              How to Order {service.h1} Online
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.stepByStepGuide.map((step) => (
              <div
                key={step.step}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-2.5 relative"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Questions Regarding {service.h1}
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-2"
                >
                  <h3 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                    <span className="text-red-600 font-black">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-5 font-normal">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Services Internal Linking Hub */}
        {service.relatedServices && service.relatedServices.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Other Popular PVC Printing Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {service.relatedServices.map((rel, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigatePath(`/${rel.slug}`)}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-red-200 hover:shadow-md transition text-left space-y-2 group cursor-pointer"
                >
                  <div className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition flex items-center justify-between">
                    <span>{rel.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
                  </div>
                  <p className="text-xs text-slate-500">{rel.desc}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA Bar */}
        <div className="p-8 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-white">Ready to Order Your {service.h1}?</h3>
            <p className="text-xs text-slate-300">
              Upload your PDF, select quantity, and receive your 800-micron card with free delivery.
            </p>
          </div>
          <button
            onClick={onOrderNow}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Start PVC Card Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
