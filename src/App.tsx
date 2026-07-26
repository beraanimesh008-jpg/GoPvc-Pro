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

import { SeoSchemas } from './components/SeoSchemas';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { TrustBadgesBanner } from './components/TrustBadgesBanner';
import { AvailableCardsSection } from './components/AvailableCardsSection';
import { SeoContentSection } from './components/SeoContentSection';

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
  const [quickTrackOrderId, setQuickTrackOrderId] = useState<string>('');

  // Order Configuration State
  const [quantity, setQuantity] = useState<number>(1);
  const [pricingTiers, setPricingTiers] = useState<PvcPricingTier[]>(DEFAULT_PRICING_TIERS);
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

  // Load pricing tiers from API on mount & check for Cashfree redirect return
  useEffect(() => {
    api
      .getPricingTiers()
      .then((tiers) => setPricingTiers(tiers))
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
        pricePerCard: 120,
      }
    );
  };

  const matchingTier = getMatchingTier(quantity);
  const unitPrice = matchingTier.pricePerCard;
  const subtotal = quantity * unitPrice;

  // Calculate tier discount relative to standard 1-card price (₹120)
  const singleCardPrice = pricingTiers[0]?.pricePerCard || 120;
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

      // Requirement 4: Frontend must use paymentSessionId = response.payment_session_id
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
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickTrack = (orderId: string) => {
    setQuickTrackOrderId(orderId);
    setActiveView('track');
  };

  const handleReorder = (order: Order) => {
    setQuantity(order.quantity);
    setAddress(order.customer);
    setActiveView('home');
    setTimeout(() => {
      handleScrollToUpload();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-red-100 selection:text-red-900">
      {/* Inject Structured JSON-LD Schemas */}
      <SeoSchemas />
      
      {/* Header */}
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onQuickTrack={handleQuickTrack}
      />

      {/* SEO Breadcrumb Navigation */}
      {activeView === 'home' && <BreadcrumbNav />}

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-12 pb-16">
            
            {/* Hero Section */}
            <HeroSection onScrollToUpload={handleScrollToUpload} />

            {/* Conversion Trust Badges Banner */}
            <TrustBadgesBanner />

            {/* Available PVC Cards Showcase */}
            <AvailableCardsSection onSelectCardType={handleScrollToUpload} />

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

            {/* Dynamic Pricing Calculator Section */}
            <PricingTable
              pricingTiers={pricingTiers}
              onSelectQuantity={(qty) => {
                setQuantity(qty);
                handleScrollToUpload();
              }}
            />

            {/* Customer Reviews Section */}
            <ReviewsSection />

            {/* Comprehensive SEO Content Section (1500-2000 Words) */}
            <SeoContentSection onScrollToUpload={handleScrollToUpload} />

            {/* FAQ Accordion with 15 FAQs & FAQ Schema */}
            <FaqSection />

          </div>
        )}

        {/* Live Order Tracking View */}
        {activeView === 'track' && (
          <OrderTrackingModal initialOrderId={quickTrackOrderId} />
        )}

        {/* Customer Portal View */}
        {activeView === 'customer' && (
          <CustomerDashboard
            onReorder={handleReorder}
            onTrackOrder={handleQuickTrack}
          />
        )}

        {/* Admin Dashboard View */}
        {activeView === 'admin' && <AdminDashboard />}
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

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
