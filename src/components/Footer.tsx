import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Truck, Lock, FileText, BookOpen, ChevronRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'track' | 'customer' | 'admin') => void;
  onNavigatePath?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onNavigatePath }) => {
  const handlePathClick = (path: string) => {
    if (onNavigatePath) {
      onNavigatePath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Address */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                <div className="w-4 h-4 bg-white rounded-xs rotate-45"></div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Go<span className="text-red-500">Pvc</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal max-w-sm">
              India's high-definition 800-micron PVC card printing service. Factory-direct UV thermal printing with 100% waterproof finish, automated verification, and free doorstep delivery across all Indian PIN codes.
            </p>

            <div className="text-xs text-slate-400 space-y-1.5 pt-1">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" /> Helpline: +91 87001 60926 (Mon-Sat 9:30 AM - 7:30 PM)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" /> Official Support: support@gopvc.in
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" /> Unit 4, Plot 88, Kolkata, WB - 700091, India
              </p>
            </div>
          </div>

          {/* Dedicated PVC Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">PVC Print Services</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => handlePathClick('/aadhaar-pvc-card')} className="hover:text-white transition">
                  Aadhaar PVC Card Print
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/pan-pvc-card')} className="hover:text-white transition">
                  PAN Card PVC Print
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/voter-id-pvc-card')} className="hover:text-white transition">
                  Voter ID PVC Card
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/driving-licence-pvc-card')} className="hover:text-white transition">
                  Driving Licence PVC
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/ayushman-pvc-card')} className="hover:text-white transition">
                  Ayushman Bharat Card
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/abha-pvc-card')} className="hover:text-white transition">
                  ABHA Health ID Card
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/ration-card-pvc')} className="hover:text-white transition">
                  Digital Ration Card PVC
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/corporate-id-card')} className="hover:text-white transition">
                  Corporate Staff Badges
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/bulk-pvc-card-printing')} className="hover:text-white transition text-red-400 font-bold">
                  Bulk Orders (from ₹49)
                </button>
              </li>
            </ul>
          </div>

          {/* Guides & Technical Articles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Guides & Knowledge</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => handlePathClick('/guides')} className="hover:text-white transition flex items-center gap-1 font-semibold text-slate-300">
                  <BookOpen className="w-3 h-3 text-red-400" /> Knowledge Hub
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/guides/what-is-pvc-card')} className="hover:text-white transition">
                  What is a PVC Card?
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/guides/aadhaar-pvc-card-vs-paper-print')} className="hover:text-white transition">
                  PVC vs Paper Lamination
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/guides/pvc-card-size-and-thickness-explained')} className="hover:text-white transition">
                  CR80 & 800 Micron Specs
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/guides/pvc-card-printing-price-in-india')} className="hover:text-white transition">
                  PVC Card Price in India
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/guides/how-to-prepare-pdf-for-pvc-card-printing')} className="hover:text-white transition">
                  How to Prepare PDF Files
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/guides/how-long-does-pvc-card-delivery-take')} className="hover:text-white transition">
                  Delivery & Transit Timelines
                </button>
              </li>
            </ul>
          </div>

          {/* Trust, E-E-A-T & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Trust & Policies</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => handlePathClick('/about-us')} className="hover:text-white transition">
                  About GoPVC Hub
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/contact-us')} className="hover:text-white transition">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/privacy-policy')} className="hover:text-white transition">
                  Privacy & Data Policy
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/data-deletion-policy')} className="hover:text-white transition">
                  Document Purge Policy
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/terms-and-conditions')} className="hover:text-white transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/refund-cancellation-policy')} className="hover:text-white transition">
                  Refund & Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => handlePathClick('/shipping-policy')} className="hover:text-white transition">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition flex items-center gap-1 text-slate-500 pt-2">
                  <Lock className="w-3 h-3" /> Staff Backoffice
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p className="font-bold text-slate-300">
            Legal & Regulatory Transparency Statement:
          </p>
          <p>
            GoPVC (https://gopvc.in) is an independent private custom print-on-demand manufacturing provider. GoPVC is NOT affiliated with, sponsored by, or operated by UIDAI, the Income Tax Department, the Election Commission of India, the Ministry of Road Transport & Highways, or the National Health Authority. We do not issue government records or modify citizen data. We strictly provide physical printing services for PDF files uploaded by authorized individuals.
          </p>
        </div>

        {/* Bottom copyright & badges */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GoPVC (gopvc.in). All rights reserved. GSTIN: 19AABCG0123P1Z5.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>24-Hour Disk Purge</span>
            <span>•</span>
            <span>Made with Precision in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
