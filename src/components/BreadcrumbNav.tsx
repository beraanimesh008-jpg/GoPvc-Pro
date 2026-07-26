import React from 'react';
import { Home, ChevronRight, CreditCard, ShieldCheck } from 'lucide-react';

export const BreadcrumbNav: React.FC = () => {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-100/80 border-b border-slate-200/60 py-2.5 px-4 sm:px-8 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="flex items-center hover:text-red-600 font-medium transition-colors">
              <Home className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span>Home</span>
            </a>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1" />
            <a href="#available-cards" className="hover:text-red-600 font-medium transition-colors">
              Available PVC Cards
            </a>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1" />
            <span className="font-bold text-slate-900" aria-current="page">
              PVC Card Printing Online in India
            </span>
          </li>
        </ol>

        <div className="hidden md:flex items-center gap-4 text-[11px] font-bold text-slate-700">
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit SSL Encrypted
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-slate-700">
            <CreditCard className="w-3.5 h-3.5 text-red-600" />
            Just ₹50 with Free Delivery
          </span>
        </div>

      </div>
    </nav>
  );
};
