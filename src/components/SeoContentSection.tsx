import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ShieldCheck, Zap, Layers, Sparkles, Award, Truck, Lock, FileText, ArrowRight } from 'lucide-react';

interface SeoContentSectionProps {
  onScrollToUpload?: () => void;
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({ onScrollToUpload }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section id="seo-content" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3.5 py-1 rounded-full border border-red-100 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> COMPLETE GUIDE & KNOWLEDGE BASE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Comprehensive Guide to PVC Card Printing Online in India
          </h2>
          <p className="text-sm text-slate-600 font-normal max-w-2xl mx-auto">
            Everything you need to know about converting digital e-Aadhaar, e-PAN, Voter ID, Driving Licence, and Health Cards into durable 800-micron rigid PVC plastic cards.
          </p>
        </div>

        {/* Rich SEO Content Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/80 space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Article Introduction */}
          <article className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Why Transition from Paper Documents to Rigid Plastic PVC Cards in India?
            </h2>
            <p>
              In modern digital India, government agencies have digitized essential citizen identification documents including <strong>e-Aadhaar</strong>, <strong>e-PAN</strong>, <strong>e-EPIC Voter ID</strong>, <strong>Digital Driving Licences</strong>, and <strong>Ayushman Bharat Health Cards</strong>. While downloading these documents as PDF files is convenient, relying on printed paper copies or thin paper-laminated slips leaves your critical identity proofs vulnerable to water damage, fading ink, accidental tears, and severe wear and tear.
            </p>
            <p>
              This is where <strong>PVC Card Printing</strong> becomes essential. A standard <strong>Smart PVC Card</strong> measures exactly 85.6 mm × 53.98 mm with a thickness of 800 microns (0.8 mm)—the exact physical specification of standard credit, debit, and banking cards. Transitioning to a high-density plastic card ensures that your identification proofs remain 100% waterproof, scratch-resistant, unbreakable, and pocket-friendly for daily use across airports, railway stations, banks, government offices, and verification kiosks across India.
            </p>
          </article>

          {/* Detailed Document Breakdown */}
          <div className="space-y-6 pt-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Most Popular PVC Card Printing Online Services in India
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-base text-red-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Aadhaar PVC Card Printing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your <strong>Aadhaar PVC Card</strong> is the primary proof of identity in India. When you print your official e-Aadhaar PDF on a 800-micron PVC card with GoPVC, we preserve the high-density UIDAI secure QR code on the back, ensuring seamless offline verification at airports, hotel check-ins, and telecom centers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-base text-red-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> PAN PVC Card Printing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A <strong>PAN PVC Card</strong> is required for banking transactions, tax filing, and financial verification. Printing your e-PAN PDF from NSDL or UTIITSL on rigid plastic gives you sharp high-contrast barcode rendering and a clear signature panel that won’t smudge over time.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-base text-red-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Voter ID PVC Card
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ordering a <strong>Voter ID PVC Card</strong> online allows you to convert your Election Commission of India (ECI) e-EPIC PDF into a sturdy wallet card. Never worry about soggy paper voter slips during election days again.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-base text-red-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Driving Licence PVC Card
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A <strong>Driving Licence PVC Card</strong> withstands daily handling in bike and car wallets. Printed with UV-resistant inks, your RTO driver details remain crystal clear even after years of sun and moisture exposure.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-base text-red-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Ayushman Bharat PVC Card & ABHA Card
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Protect your <strong>Ayushman Bharat PVC Card</strong> and <strong>ABHA PVC Card</strong> (Ayushman Bharat Health Account) for hassle-free hospital admissions and cashless treatment verification under the PM-JAY scheme.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-slate-900 text-base text-red-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Ration Card PVC &amp; Smart PVC Cards
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our <strong>Ration Card PVC</strong> service converts digital state food department PDFs into heavy-duty plastic cards, making monthly ration collection smooth and waterproof.
                </p>
              </div>

              {/* Card 7 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2 md:col-span-2">
                <h3 className="font-bold text-slate-900 text-base text-red-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> e-Shram PVC Card Printing
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get your official <strong>e-Shram PVC Card</strong> printed with high-contrast 12-digit Universal Account Number (UAN) and scannable QR code on durable 800-micron waterproof plastic.
                </p>
              </div>

            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Comparison: Paper Print vs. Standard Laminated Paper vs. GoPVC 800-Micron Rigid PVC
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Feature / Specification</th>
                    <th className="p-3.5">Standard Paper Print</th>
                    <th className="p-3.5">Paper Laminated Pouch</th>
                    <th className="p-3.5 bg-red-600 text-white">GoPVC 800-Micron PVC Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-slate-900">Durability & Lifespan</td>
                    <td className="p-3 text-red-600 font-medium">Few weeks (Tears easily)</td>
                    <td className="p-3 text-amber-600 font-medium">6 to 12 months (Peels at edges)</td>
                    <td className="p-3 font-bold text-emerald-600 bg-red-50/50">10+ Years (Unbreakable plastic)</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Water Resistance</td>
                    <td className="p-3 text-red-600 font-medium">❌ 0% (Soggy instantly)</td>
                    <td className="p-3 text-amber-600 font-medium">⚠️ Water leaks into edges</td>
                    <td className="p-3 font-bold text-emerald-600 bg-red-50/50">✔ 100% Waterproof & Washable</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-slate-900">Thickness & Substrate</td>
                    <td className="p-3">70 - 100 GSM Paper</td>
                    <td className="p-3">Paper + Thin Laminate Film</td>
                    <td className="p-3 font-bold text-slate-900 bg-red-50/50">800 Micron Rigid CR80 Plastic</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Wallet Fit</td>
                    <td className="p-3 text-red-600 font-medium">Folds & creases</td>
                    <td className="p-3 text-amber-600 font-medium">Oversized sharp corners</td>
                    <td className="p-3 font-bold text-emerald-600 bg-red-50/50">Exact Bank ATM Card Dimension</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-slate-900">QR Code Scan Reliability</td>
                    <td className="p-3 text-amber-600 font-medium">Smudges quickly</td>
                    <td className="p-3 text-amber-600 font-medium">Glossy glare interferes</td>
                    <td className="p-3 font-bold text-emerald-600 bg-red-50/50">300 DPI Ultra Sharp QR Scanning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Print PVC Card Online Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              How to Print PVC Card Online in India with GoPVC (Step-by-Step)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">1</div>
                <h4 className="font-bold text-slate-900 text-xs">Select Quantity & Tier</h4>
                <p className="text-[11px] text-slate-600">Choose 1 to 5 cards @ ₹65/card or bulk quantities down to ₹35/card with automatic discounts applied.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">2</div>
                <h4 className="font-bold text-slate-900 text-xs">Upload PDF Document</h4>
                <p className="text-[11px] text-slate-600">Upload your e-Aadhaar, e-PAN, or Voter ID PDF. Password protection is automatically checked.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">3</div>
                <h4 className="font-bold text-slate-900 text-xs">Enter Delivery Address</h4>
                <p className="text-[11px] text-slate-600">Provide full recipient name, mobile number, full address, and PIN code for fast delivery.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">4</div>
                <h4 className="font-bold text-slate-900 text-xs">Instant Payment & Delivery</h4>
                <p className="text-[11px] text-slate-600">Pay securely via UPI (GPay, PhonePe, Paytm) or cards. Track your live shipment till doorstep delivery.</p>
              </div>

            </div>
          </div>

          {/* Privacy & Security Guarantees */}
          <div className="bg-red-50/60 rounded-2xl p-6 border border-red-100 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" /> 100% Data Privacy & Encryption Guarantee for Indian Citizens
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              At GoPVC, we understand that government identification documents contain sensitive personal information. That is why our website utilizes end-to-end <strong>256-bit SSL encryption</strong> for all file transfers. Once your PVC card order is printed, encoded, and dispatched, our automated server script permanently purges all uploaded PDF files and rendered image buffers from our database. We never share, store, or re-use your personal identification details.
            </p>
          </div>

          {/* Popular Search Keywords & Tags */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Popular Searches & Services</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                'PVC Card Printing',
                'PVC Card Printing Online',
                'Aadhaar PVC Card',
                'PAN PVC Card',
                'Voter ID PVC Card',
                'Driving Licence PVC Card',
                'Ayushman Bharat PVC Card',
                'ABHA PVC Card',
                'Ration Card PVC',
                'e-Shram PVC Card',
                'Smart PVC Card',
                'PVC Card India',
                'PVC Card Home Delivery',
                'Print PVC Card Online',
                'PVC Card Order',
                'PVC Card Order Online',
                'Order PVC Card Online',
                'Aadhaar PVC Card Order',
                'PAN PVC Card Order',
                'Voter ID PVC Card Order',
                'Driving Licence PVC Card Order',
                'PVC Card Printing Price',
                'Ration Card PVC Order',
                'Ayushman Card PVC Order',
              ].map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-lg border border-slate-200/80 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Nationwide Express Delivery Callout */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900 text-white rounded-2xl gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-black text-base">Ready to Order Your PVC Card Online in India?</h4>
              <p className="text-xs text-slate-300">From ₹49 with free doorstep delivery across all PIN codes in India.</p>
            </div>
            <button
              onClick={onScrollToUpload}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Order PVC Card Online Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
