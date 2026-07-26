import React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Zap, FileText, Smartphone, Award, Shield } from 'lucide-react';

interface AvailableCardsSectionProps {
  onSelectCardType: () => void;
}

const CARDS_DATA = [
  {
    h3: 'Aadhaar PVC Card',
    badge: 'UIDAI Compliant',
    desc: 'Print your official e-Aadhaar PDF on waterproof 800-micron PVC with high-resolution secure QR code scanning.',
    iconColor: 'bg-orange-50 text-orange-600 border-orange-100',
    tags: ['Waterproof', 'Official QR Code', '800 Micron'],
    price: '₹50',
  },
  {
    h3: 'PAN Card PVC',
    badge: 'NSDL / UTIITSL Format',
    desc: 'High-contrast thermal print for e-PAN documents with barcode & sharp signature panel clarity.',
    iconColor: 'bg-blue-50 text-blue-600 border-blue-100',
    tags: ['HD Barcode', 'Signature Panel', 'CR80 Size'],
    price: '₹50',
  },
  {
    h3: 'Voter ID PVC',
    badge: 'ECI e-EPIC Format',
    desc: 'Durable plastic Voter ID card printed directly from official Election Commission e-EPIC PDF downloads.',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    tags: ['Tearproof', 'UV Sealed', 'Compact Size'],
    price: '₹50',
  },
  {
    h3: 'Driving Licence PVC',
    badge: 'RTO Compliant',
    desc: 'Pocket-sized rigid PVC Driving Licence card with scratch-resistant clear protective lamination.',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-100',
    tags: ['Scratchproof', 'RTO Dimension', 'Long Lasting'],
    price: '₹50',
  },
  {
    h3: 'Ayushman Bharat PVC Card',
    badge: 'PM-JAY Health Card',
    desc: 'Vivid color print for Ayushman Bharat Golden Card with ₹5 Lakh coverage details clearly readable.',
    iconColor: 'bg-red-50 text-red-600 border-red-100',
    tags: ['PM-JAY Header', 'High Contrast', 'Waterproof'],
    price: '₹50',
  },
  {
    h3: 'ABHA PVC Card',
    badge: 'National Health ID',
    desc: 'Ayushman Bharat Health Account plastic card with clear 14-digit ABHA number & QR code.',
    iconColor: 'bg-teal-50 text-teal-600 border-teal-100',
    tags: ['Health ID', 'QR Enabled', 'Pocket Fit'],
    price: '₹50',
  },
  {
    h3: 'Ration Card PVC',
    badge: 'Food & Supplies Dept',
    desc: 'Convert digital e-Ration card PDFs into rigid waterproof PVC cards for daily subsidised ration collection.',
    iconColor: 'bg-amber-50 text-amber-600 border-amber-100',
    tags: ['Digital Ration', 'Waterproof', 'Heavy Duty'],
    price: '₹50',
  },
];

export const AvailableCardsSection: React.FC<AvailableCardsSectionProps> = ({ onSelectCardType }) => {
  return (
    <section id="available-cards" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header with Required H2s */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-100 inline-flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> OFFICIAL PRINT SPECIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Print Premium PVC Cards Online
          </h2>
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 tracking-tight">
            Available PVC Cards
          </h2>
          <p className="text-sm text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Choose from all official government e-documents and commercial plastic ID card templates. Printed using 300 DPI thermal transfer machines on high-density CR80 PVC.
          </p>
        </div>

        {/* 7 Specific Cards Grid with Exact Required H3s */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARDS_DATA.map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-red-300 hover:shadow-lg transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${card.iconColor}`}>
                    {card.badge}
                  </span>
                  <span className="text-sm font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {card.price}
                  </span>
                </div>

                {/* H3 Heading as required by prompt */}
                <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  {card.h3}
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {card.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {card.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Free Doorstep Delivery
                </span>
                <button
                  onClick={onSelectCardType}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 group-hover:translate-x-0.5 cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">100% Privacy & Data Security Assured</h4>
              <p className="text-xs text-slate-300">All uploaded PDF files are processed via 256-bit SSL encrypted channels and permanently purged post printing.</p>
            </div>
          </div>
          <button
            onClick={onSelectCardType}
            className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shrink-0 cursor-pointer shadow-sm"
          >
            Upload Document & Print
          </button>
        </div>

      </div>
    </section>
  );
};
