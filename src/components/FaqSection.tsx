import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'What types of documents can I convert into PVC Cards?',
    a: 'You can upload PDF files for Aadhaar Cards, PAN Cards, Voter IDs, Driving Licenses, Health Insurance Cards, Corporate Employee Badges, Student IDs, or any custom document designed in standard card proportions.',
  },
  {
    q: 'How does password protection validation work?',
    a: 'If your uploaded PDF is encrypted with a password (like e-Aadhaar or e-PAN), our validator detects it instantly. You must remove password protection before uploading so our UV print server can parse the document layout.',
  },
  {
    q: 'What is the physical size and thickness of the PVC Card?',
    a: 'We print on standard CR80 rigid bank plastic substrate measuring 85.6 mm x 53.98 mm with an official 800-micron (0.8mm) thickness.',
  },
  {
    q: 'How long does dispatch and delivery take across India?',
    a: 'Orders placed before 2 PM are printed and dispatched on the same business day via priority couriers (Bluedart, Delhivery, Speed Post). Delivery typically takes 2 to 4 business days.',
  },
  {
    q: 'Are my uploaded PDF documents kept private and secure?',
    a: 'Yes. All uploads are processed over 256-bit SSL encrypted connections and automatically purged from our servers 48 hours after delivery confirmation.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
