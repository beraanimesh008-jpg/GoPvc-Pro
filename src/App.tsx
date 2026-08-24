import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OrderUploadFlow } from './components/OrderUploadFlow';
import { AddressForm } from './components/AddressForm';
import { PriceBreakdown } from './components/PriceBreakdown';
import { CashfreeModal } from './components/CashfreeModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PricingTable } from './components/PricingTable';
import { FaqSection } from './components/FaqSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

import { DynamicSeoHead } from './components/DynamicSeoHead';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { TrustBadgesBanner } from './components/TrustBadgesBanner';
import { AvailableCardsSection } from './components/AvailableCardsSection';
import { SeoContentSection } from './components/SeoContentSection';
import { ThirdPartyAdBanner } from './components/ThirdPartyAdBanner';

import { ServiceLandingPageView } from './components/ServiceLandingPageView';
import { GuideArticleView } from './components/GuideArticleView';
import { GuidesHubView } from './components/GuidesHubView';
import { TrustPageView } from './components/TrustPageView';

import { SEO_SERVICE_PAGES, SEO_GUIDES } from './data/seoPages';
import { TRUST_PAGES } from './data/trustPages';

import {
  CustomerAddress,
  Order,
  PriceBreakdown as PriceBreakdownType,
  PvcPricingTier,
  UploadedPdfItem,
} from './types';
import { DEFAULT_PRICING_TIERS } from './data/defaultData';
import { api } from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'track' | 'customer' | 'admin'>('home');
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      return pathname && pathname !== '' ? pathname : '/';
    }
    return '/';
  });

  const [quickTrackOrderId, setQuickTrackOrderId] = useState<string>('');

  // Order Configuration State
  const [quantity, setQuantity] = useState<number>(1);
  const [pricingTiers, setPricingTiers] = useState<PvcPricingTier[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('gopvc_pricing_tiers');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // use default
      }
    }
    return DEFAULT_PRICING_TIERS;
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedPdfItem[]>([]);

  // Delivery Address State
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: '',
    phone: '',
    email: '',
    houseNo: '',
    village: '',
    postOffice: '',
    policeStation: '',
    district: '',
    state: '',
    pinCode: '',
    landmark: '',
  });

  // Coupon State
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState<number>(0);

  // Cashfree Payment Session State
  const [isCashfreeModalOpen, setIsCashfreeModalOpen] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [cashfreeSession, setCashfreeSession] = useState<{
    cashfreeOrderId: string;
    paymentSessionId: string;
    orderId: string;
    amount: number;
    isTestMode: boolean;
  } | null>(null);

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path === '/' || path === '') {
        setActiveView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load pricing tiers from API on mount & sync to localStorage
  useEffect(() => {
    api
      .getPricingTiers()
      .then((tiers) => {
        if (Array.isArray(tiers) && tiers.length > 0) {
          setPricingTiers(tiers);
          try {
            localStorage.setItem('gopvc_pricing_tiers', JSON.stringify(tiers));
          } catch {}
        }
      })
      .catch((err) => console.error('Failed to load pricing tiers:', err));

    // Handle return redirect from Cashfree (e.g. #payment-verify?cf_order_id=...&order_id=...)
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search || hash.replace(/^#payment-verify\??/, ''));
    const cfOrderId = urlParams.get('cf_order_id') || urlParams.get('order_id');

    if (cfOrderId || hash.includes('payment-verify')) {
      const orderIdParam = urlParams.get('order_id') || '';
      api.verifyCashfreeOrder(cfOrderId || undefined, orderIdParam || undefined).then((res) => {
        if (res.verified && res.order) {
          setCreatedOrder(res.order);
          window.history.replaceState(null, '', window.location.pathname);
        }
      });
    }
  }, []);

  // Path navigation helper
  const navigateToPath = (path: string) => {
    setCurrentPath(path);
    setActiveView('home');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute matching tier for selected quantity
  const getMatchingTier = (qty: number): PvcPricingTier => {
    const found = pricingTiers.find((t) => {
      if (t.maxQty === null) return qty >= t.minQty;
      return qty >= t.minQty && qty <= t.maxQty;
    });
    return (
      found ||
      pricingTiers[pricingTiers.length - 1] || {
        id: 'default',
        minQty: 1,
        maxQty: 1,
        pricePerCard: pricingTiers[0]?.pricePerCard || 65,
      }
    );
  };

  const matchingTier = getMatchingTier(quantity);
  const unitPrice = matchingTier.pricePerCard;
  const subtotal = quantity * unitPrice;

  // Calculate tier discount relative to standard 1-card price
  const singleCardPrice = pricingTiers[0]?.pricePerCard || 65;
  const baseSubtotal = quantity * singleCardPrice;
  const tierDiscount = Math.max(0, baseSubtotal - subtotal);

  const shippingFee = 0; // Free shipping
  const grandTotal = Math.max(0, subtotal - appliedCouponDiscount + shippingFee);

  const priceBreakdown: PriceBreakdownType = {
    unitPrice,
    subtotal,
    tierDiscount,
    couponCode: appliedCouponCode,
    couponDiscount: appliedCouponDiscount,
    shippingFee,
    grandTotal,
    appliedTierLabel: matchingTier.label || `${quantity} Card(s) @ ₹${unitPrice}`,
  };

  // Check readiness for payment
  const isAddressComplete = Boolean(
    address.fullName.trim() &&
      address.phone.trim().length === 10 &&
      address.email.trim() &&
      address.houseNo.trim() &&
      address.village.trim() &&
      address.district.trim() &&
      address.state.trim() &&
      address.pinCode.trim().length === 6
  );

  const isFilesComplete = uploadedFiles.length >= quantity;
  const isReadyForPayment = isFilesComplete && isAddressComplete;

  let missingRequirementsMessage = '';
  if (!isFilesComplete) {
    missingRequirementsMessage = `Please upload ${quantity - uploadedFiles.length} more PDF file(s).`;
  } else if (!isAddressComplete) {
    missingRequirementsMessage = 'Please complete all required shipping address fields.';
  }

  const handleApplyCoupon = (code: string, discountAmount: number) => {
    setAppliedCouponCode(code);
    setAppliedCouponDiscount(discountAmount);
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(undefined);
    setAppliedCouponDiscount(0);
  };

  const handleProceedToPayment = async () => {
    if (!isReadyForPayment || isInitializingPayment) return;

    setIsInitializingPayment(true);
    try {
      const response = await api.createCashfreeOrder({
        customer: address,
        quantity,
        files: uploadedFiles,
        priceBreakdown,
      });

      const paymentSessionId = response.payment_session_id || response.paymentSessionId;

      if (!paymentSessionId || paymentSessionId.trim() === '') {
        throw new Error('payment_session_id is missing or invalid in Cashfree server response.');
      }

      setCashfreeSession({
        cashfreeOrderId: response.cashfreeOrderId,
        paymentSessionId: paymentSessionId,
        orderId: response.orderId,
        amount: priceBreakdown.grandTotal,
        isTestMode: response.isTestMode,
      });

      setIsCashfreeModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to initialize payment with Cashfree. Please try again.');
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const handlePaymentSuccess = (verifiedOrder: Order) => {
    setIsCashfreeModalOpen(false);
    setCreatedOrder(verifiedOrder);
  };

  const handlePaymentFailure = (errorMsg: string) => {
    console.warn('Cashfree payment failed:', errorMsg);
  };

  const handleScrollToUpload = () => {
    if (currentPath !== '/') {
      navigateToPath('/');
    }
    setTimeout(() => {
      if (uploadSectionRef.current) {
        uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  const handleQuickTrack = (orderId: string) => {
    setQuickTrackOrderId(orderId);
    setActiveView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorder = (order: Order) => {
    setQuantity(order.quantity);
    setAddress(order.customer);
    navigateToPath('/');
    setTimeout(() => {
      handleScrollToUpload();
    }, 120);
  };

  // Route pattern matching
  const cleanPath = currentPath.replace(/\/$/, '') || '/';
  const matchedService = SEO_SERVICE_PAGES.find((s) => s.path === cleanPath || `/${s.slug}` === cleanPath);
  const matchedGuide = SEO_GUIDES.find((g) => g.path === cleanPath || `/guides/${g.slug}` === cleanPath);
  const isGuidesHub = cleanPath === '/guides';
  const trustKey = cleanPath.replace(/^\//, '');
  const matchedTrust = TRUST_PAGES[trustKey];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-red-100 selection:text-red-900">
      {/* Dynamic SEO Head & Structured Data Injection */}
      <DynamicSeoHead currentPath={cleanPath} />

      {/* Header */}
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'home') {
            navigateToPath('/');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickTrack={handleQuickTrack}
        onNavigatePath={navigateToPath}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* Live Order Tracking View */}
        {activeView === 'track' ? (
          <OrderTrackingModal initialOrderId={quickTrackOrderId} />
        ) : activeView === 'customer' ? (
          <CustomerDashboard
            onReorder={handleReorder}
            onTrackOrder={handleQuickTrack}
          />
        ) : activeView === 'admin' ? (
          <AdminDashboard />
        ) : matchedService ? (
          /* Dedicated Service Landing Page (e.g. /aadhaar-pvc-card) */
          <ServiceLandingPageView
            service={matchedService}
            onOrderNow={handleScrollToUpload}
            onNavigatePath={navigateToPath}
            pricingTiers={pricingTiers}
          />
        ) : matchedGuide ? (
          /* Dedicated Guide Article (e.g. /guides/what-is-pvc-card) */
          <GuideArticleView
            article={matchedGuide}
            onNavigatePath={navigateToPath}
            onOrderNow={handleScrollToUpload}
          />
        ) : isGuidesHub ? (
          /* Guides & Knowledge Hub (/guides) */
          <GuidesHubView
            onNavigatePath={navigateToPath}
            onOrderNow={handleScrollToUpload}
          />
        ) : matchedTrust ? (
          /* Trust, E-E-A-T & Legal Policy Pages */
          <TrustPageView
            page={matchedTrust}
            onNavigatePath={navigateToPath}
            onOrderNow={handleScrollToUpload}
          />
        ) : (
          /* Main Homepage View */
          <div className="space-y-12 pb-16">
            
            {/* Dynamic Pricing Calculator Section (Top of Page) */}
            <PricingTable
              pricingTiers={pricingTiers}
              onSelectQuantity={(qty) => {
                setQuantity(qty);
                handleScrollToUpload();
              }}
            />

            {/* Third-Party Ad Placement directly under Order More, Save More */}
            <ThirdPartyAdBanner className="my-6" />

            {/* Hero Section */}
            <HeroSection
              onScrollToUpload={handleScrollToUpload}
              pricingTiers={pricingTiers}
            />

            {/* SEO Breadcrumb Navigation */}
            <BreadcrumbNav />

            {/* Conversion Trust Badges Banner */}
            <TrustBadgesBanner />

            {/* Available PVC Cards Showcase */}
            <AvailableCardsSection
              onSelectCardType={handleScrollToUpload}
              onNavigatePath={navigateToPath}
              pricingTiers={pricingTiers}
            />

            {/* Order Flow Form */}
            <div ref={uploadSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Form Column (Steps 1 & 2) */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Step 1: Upload Flow */}
                  <OrderUploadFlow
                    quantity={quantity}
                    onQuantityChange={(qty) => setQuantity(qty)}
                    files={uploadedFiles}
                    onFilesChange={(newFiles) => setUploadedFiles(newFiles)}
                  />

                  {/* Step 2: Delivery Address Form */}
                  <AddressForm
                    address={address}
                    onChange={(updated) => setAddress(updated)}
                  />
                </div>

                {/* Right Sticky Order Summary Column (Step 3) */}
                <div className="lg:col-span-5 lg:sticky lg:top-24">
                  <PriceBreakdown
                    quantity={quantity}
                    pricingTiers={pricingTiers}
                    priceBreakdown={priceBreakdown}
                    onApplyCoupon={handleApplyCoupon}
                    onRemoveCoupon={handleRemoveCoupon}
                    onProceedToPayment={handleProceedToPayment}
                    isReadyForPayment={isReadyForPayment}
                    missingRequirementsMessage={missingRequirementsMessage}
                  />
                </div>

              </div>
            </div>

            {/* Customer Reviews Section */}
            <ReviewsSection />

            {/* Comprehensive SEO Content Section */}
            <SeoContentSection onScrollToUpload={handleScrollToUpload} />

            {/* FAQ Accordion with FAQs */}
            <FaqSection />

          </div>
        )}
      </main>

      {/* Cashfree Payment Gateway Modal */}
      {cashfreeSession && (
        <CashfreeModal
          isOpen={isCashfreeModalOpen}
          onClose={() => setIsCashfreeModalOpen(false)}
          cashfreeOrderId={cashfreeSession.cashfreeOrderId}
          paymentSessionId={cashfreeSession.paymentSessionId}
          orderId={cashfreeSession.orderId}
          amount={cashfreeSession.amount}
          customerName={address.fullName}
          customerPhone={address.phone}
          isTestMode={cashfreeSession.isTestMode}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}

      {/* Order Confirmation Success Modal */}
      {createdOrder && (
        <OrderSuccessModal
          order={createdOrder}
          onClose={() => setCreatedOrder(null)}
          onTrackOrder={handleQuickTrack}
        />
      )}

      {/* Footer with comprehensive SEO links */}
      <Footer
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'home') {
            navigateToPath('/');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigatePath={navigateToPath}
      />

    </div>
  );
}
