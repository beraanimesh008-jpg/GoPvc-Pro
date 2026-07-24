import React from 'react';
import { CreditCard, ShieldCheck, Mail, Phone, MapPin, Truck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'track' | 'customer' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                <div className="w-4 h-4 bg-white rounded-xs rotate-45"></div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Go<span className="text-red-500">Pvc</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              India's leading automated PVC Card Printing facility. High-definition 800-micron UV printing from uploaded PDFs with instant validation & express nationwide doorstep delivery.
            </p>

            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400" /> Helpline: +91 87001 60926
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400" /> Support: support@gopvc.in
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition">
                  Order PVC Cards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-white transition">
                  Track Live Dispatch
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer')} className="hover:text-white transition">
                  Customer Order Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-400" /> Admin Backoffice Login
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Supported Card Types</h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-medium">
              <li>• e-Aadhaar PVC Print</li>
              <li>• PAN Card Plastic Print</li>
              <li>• Voter ID & Driving License</li>
              <li>• Corporate Employee Badges</li>
              <li>• Student & Health Insurance IDs</li>
            </ul>
          </div>

          {/* Security & GST Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Security & GST</h4>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/80 space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Encrypted & Purged
              </p>
              <p className="text-[11px] text-slate-400">
                GSTIN: 19AABCG0123P1Z5
              </p>
              <p className="text-[11px] text-slate-400">
                GoPvc Print Hub, Unit 4, Plot 88, Kolkata, WB - 700091
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GoPvc Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Razorpay Payment Gateway</span>
            <span>•</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
