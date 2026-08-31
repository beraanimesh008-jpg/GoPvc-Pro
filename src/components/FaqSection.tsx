import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
  category: 'General' | 'Ordering' | 'Quality' | 'Security' | 'Delivery';
}

export const FAQS_DATA: FaqItem[] = [
  {
    category: 'Quality',
    q: 'What is a PVC Card and why is it better than a paper laminated card?',
    a: 'A PVC card is made from high-density rigid polyvinyl chloride plastic measuring 85.6 mm × 53.98 mm × 0.8 mm (standard CR80 bank card size). Unlike paper laminated pouches that peel, warp, or absorb moisture, a PVC card is 100% waterproof, tearproof, scratch-resistant, and fits perfectly in standard wallet slots.',
  },
  {
    category: 'Ordering',
    q: 'How do I order a PVC Card online on GoPVC?',
    a: 'Ordering is fast and simple: (1) Select your card quantity, (2) Upload your e-Aadhaar, e-PAN, Voter ID, or Driving Licence PDF file, (3) Fill in your delivery address, and (4) Complete instant payment via UPI, GPay, PhonePe, Paytm, or Cards. Your order is printed and dispatched within 24 hours.',
  },
  {
    category: 'General',
    q: 'Which documents can I print on a PVC Card with GoPVC?',
    a: 'You can print e-Aadhaar Cards, PAN Cards (NSDL/UTIITSL), Voter IDs (e-EPIC), Driving Licences (RTO), Ayushman Bharat PM-JAY Cards, ABHA Health Cards, Ration Cards, e-Shram UAN Cards, Corporate Employee Badges, Student IDs, and custom document PDFs.',
  },
  {
    category: 'General',
    q: 'How much does PVC Card Printing cost in India?',
    a: 'GoPVC offers single card printing at transparent volume rates: 1 to 5 cards @ ₹65/card with free doorstep delivery. For larger orders, rates drop to ₹49/card (6-20 cards), ₹42/card (21-50 cards), and down to ₹35/card for bulk 51+ cards.',
  },
  {
    category: 'Delivery',
    q: 'Is doorstep delivery free across India?',
    a: 'Yes, 100% free doorstep delivery is included on every order across all 28 states and Union Territories in India with no hidden handling fees.',
  },
  {
    category: 'Security',
    q: 'Are my uploaded PDF documents (Aadhaar, PAN, Voter ID) safe and private?',
    a: 'Absolutely. All uploads are processed via 256-bit SSL encrypted channels. Once printed and dispatched, our automated server scripts permanently purge all original PDF files and rendered image buffers from our database.',
  },
  {
    category: 'Quality',
    q: 'What is the exact physical size and thickness of the printed PVC card?',
    a: 'We print strictly on official CR80 rigid substrate measuring 85.6 mm length, 53.98 mm width, and 800 microns (0.8 mm) thickness—identical to standard VISA/Mastercard banking cards.',
  },
  {
    category: 'Quality',
    q: 'Are GoPVC cards 100% waterproof and scratch-resistant?',
    a: 'Yes. Our cards are printed using 300 DPI thermal transfer dye-sublimation technology sealed under a transparent UV laminate layer that prevents ink fading, smudging, or water damage.',
  },
  {
    category: 'Delivery',
    q: 'How long does dispatch and delivery take across India?',
    a: 'Orders placed before 2 PM are printed and dispatched on the same business day. Delivery via speed post and premium couriers (Delhivery, BlueDart, India Post) takes 2 to 4 business days depending on your PIN code.',
  },
  {
    category: 'Ordering',
    q: 'How can I track my PVC card order status online?',
    a: 'You can track your order live anytime by clicking "Track Order" in the top navigation bar and entering your 8-character Order ID or mobile number to view real-time status updates from printing to final delivery.',
  },
  {
    category: 'Ordering',
    q: 'What payment methods are supported on GoPVC?',
    a: 'We support all major Indian payment methods powered by Cashfree PG including UPI Apps (Google Pay, PhonePe, Paytm, BHIM), Credit Cards, Debit Cards, Net Banking, and Wallet payments.',
  },
  {
    category: 'Ordering',
    q: 'Can I order multiple PVC cards in bulk at discounted rates?',
    a: 'Yes! Our pricing automatically tiers down as quantity increases: 1-5 cards @ ₹65/card, 6-20 cards @ ₹49/card, 21-50 cards @ ₹42/card, and 51+ cards @ ₹35/card with free nationwide shipping.',
  },
  {
    category: 'Quality',
    q: 'What file formats are supported for PVC card printing?',
    a: 'We accept high-resolution PDF documents. Our system automatically parses multi-page e-Aadhaar or government PDFs and extracts the front and back card layout for optimal printing.',
  },
  {
    category: 'Security',
    q: 'What should I do if my PDF document is password-protected?',
    a: 'If your e-Aadhaar or e-PAN PDF is password protected, our client-side file validator prompts you to enter the document password so we can verify and unlock the file before printing.',
  },
  {
    category: 'Security',
    q: 'What is the return or reprint policy if my card arrives damaged?',
    a: 'In the rare event that your PVC card arrives damaged or contains print defects, contact our helpline at +91 87001 60926 or email support@gopvc.in with an image. We will dispatch a free replacement within 24 hours.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Ordering', 'Quality', 'Security', 'Delivery'];

  const filteredFaqs = FAQS_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Generate JSON-LD Schema for FAQPage
  const faqSchemaJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      {/* Inject FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaJson) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-100 inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            15 Essential FAQs About PVC Card Printing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Got questions about file upload, privacy, print thickness, or delivery timelines? Find instant answers below.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4">
          
          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FAQs (e.g., Aadhaar, delivery, price)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
              No FAQs matched your search term "{searchQuery}". Try searching for "waterproof", "Aadhaar", or "price".
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden transition-all hover:border-slate-300"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 font-normal leading-relaxed border-t border-slate-200/50 pt-3 bg-white/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
