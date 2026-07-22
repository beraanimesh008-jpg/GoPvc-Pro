import React, { useState } from 'react';
import { CreditCard, Search, ShieldCheck, Truck, User, Lock, Phone, Menu, X, Home, PackageCheck, Shield } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'track' | 'customer' | 'admin') => void;
  activeView: 'home' | 'track' | 'customer' | 'admin';
  onQuickTrack: (orderId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeView, onQuickTrack }) => {
  const [trackSearchInput, setTrackSearchInput] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackSearchInput.trim()) {
      onQuickTrack(trackSearchInput.trim());
      setShowSearchModal(false);
      setTrackSearchInput('');
    }
  };

  const handleMobileNav = (view: 'home' | 'track' | 'customer' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-2 sm:gap-4 border-b border-slate-800">
        <span className="flex items-center gap-1.5 text-red-400 font-semibold truncate">
          <Truck className="w-3.5 h-3.5 shrink-0" /> FREE PAN-India Express Delivery
        </span>
        <span className="hidden sm:inline text-slate-500">|</span>
        <span className="hidden sm:inline text-slate-300">
          800 Micron Waterproof High-Definition UV PVC Cards
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <a href="tel:+919876543210" className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition">
          <Phone className="w-3 h-3 text-red-400" /> +91 98765 43210
        </a>
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-xs shadow-red-200 group-hover:bg-red-700 transition shrink-0">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-xs rotate-45"></div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Go<span className="text-red-600">Pvc</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 ml-0.5">
                  PRO
                </span>
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                activeView === 'home'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Order Cards
            </button>

            <button
              onClick={() => onNavigate('track')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                activeView === 'track'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              Track Order
            </button>

            <button
              onClick={() => onNavigate('customer')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                activeView === 'customer'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-slate-600 hover:text-red-600'
              }`}
            >
              My Orders
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Track Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-full text-slate-600 hover:text-red-600 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-medium"
              title="Search Order ID"
            >
              <Search className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline text-slate-600 hover:text-red-600">Track ID</span>
            </button>

            {/* Customer Portal Shortcut */}
            <button
              onClick={() => onNavigate('customer')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Customer Portal</span>
            </button>

            {/* Admin Login Button */}
            <button
              onClick={() => onNavigate('admin')}
              className={`hidden sm:flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition ${
                activeView === 'admin'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-900 text-white hover:bg-red-600 shadow-xs'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => handleMobileNav('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition ${
                activeView === 'home'
                  ? 'bg-red-50 text-red-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-red-600" />
              <span>Order PVC Cards</span>
            </button>

            <button
              onClick={() => handleMobileNav('track')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition ${
                activeView === 'track'
                  ? 'bg-red-50 text-red-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-red-600" />
              <span>Track Order Status</span>
            </button>

            <button
              onClick={() => handleMobileNav('customer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition ${
                activeView === 'customer'
                  ? 'bg-red-50 text-red-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-red-600" />
              <span>Customer Portal (My Orders)</span>
            </button>

            <button
              onClick={() => handleMobileNav('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition ${
                activeView === 'admin'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        )}
      </header>

      {/* Quick Track Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-w-md w-full border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-red-600" />
                Track PVC Card Order
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Enter Order ID (e.g. GPVC000001) or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="GPVC000001 or 9876543210"
                  value={trackSearchInput}
                  onChange={(e) => setTrackSearchInput(e.target.value)}
                  className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="flex-1 py-3 sm:py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 sm:py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-sm shadow-red-200"
                >
                  Track Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
