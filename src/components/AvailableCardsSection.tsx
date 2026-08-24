import React from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  FileText,
  Smartphone,
  Award,
  Shield,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AvailableCardsSectionProps {
  onSelectCardType: () => void;
  onNavigatePath?: (path: string) => void;
}

const CARDS_DATA = [
  {
    slug: 'aadhaar-pvc-card',
    h3: 'Aadhaar PVC Card',
    badge: 'UIDAI e-Aadhaar',
    desc: 'Print your official e-Aadhaar PDF on waterproof 800-micron PVC with high-resolution secure QR code scanning.',
    iconColor: 'bg-orange-50 text-orange-600 border-orange-100',
    tags: ['Waterproof', 'Official QR Code', '800 Micron'],
    price: '₹49 - ₹75',
  },
  {
    slug: 'pan-pvc-card',
    h3: 'PAN Card PVC',
    badge: 'NSDL / UTIITSL Format',
    desc: 'High-contrast thermal print for e-PAN documents with barcode & sharp signature panel clarity.',
    iconColor: 'bg-blue-50 text-blue-600 border-blue-100',
    tags: ['HD Barcode', 'Signature Panel', 'CR80 Size'],
    price: '₹49 - ₹75',
  },
  {
    slug: 'voter-id-pvc-card',
    h3: 'Voter ID PVC',
    badge: 'ECI e-EPIC Format',
    desc: 'Durable plastic Voter ID card printed directly from official Election Commission e-EPIC PDF downloads.',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    tags: ['Tearproof', 'UV Sealed', 'Compact Size'],
    price: '₹49 - ₹75',
  },
  {
    slug: 'driving-licence-pvc-card',
    h3: 'Driving Licence PVC',
    badge: 'RTO / Parivahan',
    desc: 'Pocket-sized rigid PVC Driving Licence card with scratch-resistant clear protective lamination.',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-100',
    tags: ['Scratchproof', 'RTO Dimension', 'Long Lasting'],
    price: '₹49 - ₹75',
  },
  {
    slug: 'ayushman-pvc-card',
    h3: 'Ayushman Bharat PVC Card',
    badge: 'PM-JAY Health Card',
    desc: 'Vivid color print for Ayushman Bharat Golden Card with ₹5 Lakh coverage details clearly readable.',
    iconColor: 'bg-red-50 text-red-600 border-red-100',
    tags: ['PM-JAY Header', 'High Contrast', 'Waterproof'],
    price: '₹49 - ₹75',
  },
  {
    slug: 'abha-pvc-card',
    h3: 'ABHA PVC Card',
    badge: 'National Health ID',
    desc: 'Ayushman Bharat Health Account plastic card with clear 14-digit ABHA number & QR code.',
    iconColor: 'bg-teal-50 text-teal-600 border-teal-100',
    tags: ['Health ID', 'QR Enabled', 'Pocket Fit'],
    price: '₹49 - ₹75',
  },
  {
    slug: 'ration-card-pvc',
    h3: 'Ration Card PVC',
    badge: 'Food & Supplies Dept',
    desc: 'Convert digital e-Ration card PDFs into rigid waterproof PVC cards for monthly subsidised ration collection.',
    iconColor: 'bg-amber-50 text-amber-600 border-amber-100',
    tags: ['Digital Ration', 'Waterproof', 'Heavy Duty'],
    price: '₹49 - ₹75',
  },
  {
    slug: 'corporate-id-card',
    h3: 'Corporate Employee ID Card',
    badge: 'Enterprise Badges',
    desc: 'Custom staff identity cards, employee badges, and student IDs with edge-to-edge full-color branding.',
    iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    tags: ['Staff Badges', 'GST Invoice', 'Lanyard Slot Ready'],
    price: 'From ₹35 - ₹49/card',
  },
  {
    slug: 'custom-pvc-card',
    h3: 'Custom PVC Card Printing',
    badge: 'Design Your Own',
    desc: 'Order custom plastic cards for club memberships, warranty cards, VIP event passes, and business cards.',
    iconColor: 'bg-pink-50 text-pink-600 border-pink-100',
    tags: ['Custom Artwork', 'Matte/Gloss Finish', 'No Minimum MOQ'],
    price: 'From ₹35 - ₹49/card',
  },
  {
    slug: 'bulk-pvc-card-printing',
    h3: 'Bulk PVC Card Printing',
    badge: 'Wholesale Volume',
    desc: 'Volume production for cyber cafes, CSC centers, schools, and corporate HR with automated tier discounts.',
    iconColor: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    tags: ['Bulk Rates', 'Priority Batching', 'Free Express Air'],
    price: 'Wholesale ₹35 - ₹49',
  },
];

export const AvailableCardsSection: React.FC<AvailableCardsSectionProps> = ({
  onSelectCardType,
  onNavigatePath,
}) => {
  return (
    <section id="available-cards" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-100 inline-flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> OFFICIAL PRINT SPECIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Print Premium PVC Cards Online in India
          </h2>
          <p className="text-sm text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Choose from all official citizen e-documents and commercial plastic ID card categories. Printed using 300+ DPI industrial UV machines on solid CR80 800-micron plastic.
          </p>
        </div>

        {/* Cards Grid */}
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
                  <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {card.price}
                  </span>
                </div>

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

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                {onNavigatePath && (
                  <button
                    onClick={() => onNavigatePath(`/${card.slug}`)}
                    className="text-xs font-semibold text-slate-500 hover:text-red-600 transition cursor-pointer"
                  >
                    View Details
                  </button>
                )}
                <button
                  onClick={onSelectCardType}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 group-hover:translate-x-0.5 cursor-pointer ml-auto"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy & Guarantee Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">100% Privacy & Data Sanitization Guarantee</h4>
              <p className="text-xs text-slate-300">
                Uploaded PDFs are transmitted over 256-bit SSL encrypted channels and permanently deleted post printing.
              </p>
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
