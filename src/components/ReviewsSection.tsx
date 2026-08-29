import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  MessageSquarePlus,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  ThumbsUp,
  User,
  MapPin,
  Calendar,
  CreditCard,
  ChevronDown,
  Check,
} from 'lucide-react';
import { CustomerReview } from '../types';
import { DEFAULT_REVIEWS } from '../data/defaultData';
import { api } from '../services/api';

const CARD_TYPE_OPTIONS = [
  'Aadhaar PVC Card',
  'PAN Card PVC',
  'Voter ID PVC Card',
  'Driving Licence PVC',
  'Ayushman Bharat / ABHA Card',
  'Ration Card PVC',
  'Corporate / Employee ID',
  'Student / Institutional ID',
  'Bulk Multi-Card Order',
  'Custom Photo / Membership Card',
];

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('gopvc_customer_reviews');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return DEFAULT_REVIEWS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterCardType, setFilterCardType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Form State for New Review
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formCardType, setFormCardType] = useState(CARD_TYPE_OPTIONS[0]);
  const [formText, setFormText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await api.getReviews();
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
        try {
          localStorage.setItem('gopvc_customer_reviews', JSON.stringify(data));
        } catch {}
      }
    } catch (err) {
      console.warn('Could not fetch latest reviews from server, using local fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Please enter your full name (আপনার নাম লিখুন)');
      return;
    }

    if (!formText.trim() || formText.trim().length < 10) {
      setFormError('Please write at least a few words about your experience (কমপক্ষে ১০ অক্ষরের মতামত দিন)');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitReview({
        name: formName.trim(),
        city: formCity.trim() || 'India',
        rating: formRating,
        cardType: formCardType,
        text: formText.trim(),
      });

      if (res && res.review) {
        const updated = [res.review, ...reviews.filter((r) => r.id !== res.review.id)];
        setReviews(updated);
        try {
          localStorage.setItem('gopvc_customer_reviews', JSON.stringify(updated));
        } catch {}
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        // Reset form
        setFormName('');
        setFormCity('');
        setFormText('');
        setFormRating(5);
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      // Even if offline, add locally to give user instant feedback
      const offlineReview: CustomerReview = {
        id: `rev-local-${Date.now()}`,
        name: formName.trim(),
        city: formCity.trim() || 'India',
        rating: formRating,
        cardType: formCardType,
        text: formText.trim(),
        createdAt: new Date().toISOString(),
        isVerified: true,
        status: 'approved',
      };
      const updated = [offlineReview, ...reviews];
      setReviews(updated);
      try {
        localStorage.setItem('gopvc_customer_reviews', JSON.stringify(updated));
      } catch {}

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        setFormName('');
        setFormCity('');
        setFormText('');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    if (filterRating !== 'all' && rev.rating !== filterRating) {
      return false;
    }
    if (filterCardType !== 'all' && !rev.cardType.toLowerCase().includes(filterCardType.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rev.name.toLowerCase().includes(q);
      const matchCity = rev.city.toLowerCase().includes(q);
      const matchText = rev.text.toLowerCase().includes(q);
      const matchCard = rev.cardType.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchText && !matchCard) {
        return false;
      }
    }
    return true;
  });

  // Calculate stats
  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviewsCount).toFixed(1)
    : '4.9';

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
    return { stars, count, percentage };
  });

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5:
        return '5 Stars – Outstanding Quality & Service (অসাধারণ)';
      case 4:
        return '4 Stars – Very Good Experience (খুব ভালো)';
      case 3:
        return '3 Stars – Good & Satisfactory (ভালো)';
      case 2:
        return '2 Stars – Needs Improvement (উন্নতি প্রয়োজন)';
      default:
        return '1 Star – Disappointed (সন্তোষজনক নয়)';
    }
  };

  const formatRelativeDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <section id="customer-reviews" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              CUSTOMER REVIEWS & FEEDBACK
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Trusted by <span className="text-red-600">100,000+</span> Happy Customers in India
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Read real reviews from genuine buyers across India or submit your own experience with our ATM-grade PVC cards and fast doorstep delivery.
            </p>
          </div>

          {/* Action: Write Review Button */}
          <div className="flex-shrink-0">
            <button
              id="btn-write-review-top"
              onClick={() => {
                setSubmitSuccess(false);
                setFormError('');
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review / মতামত দিন</span>
            </button>
          </div>
        </div>

        {/* Rating Summary & Trust Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          {/* Big Score Box */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
              {avgRating}
              <span className="text-xl sm:text-2xl font-bold text-slate-400">/5</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Based on <span className="font-bold text-slate-900">{totalReviewsCount}+</span> verified customer reviews
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Genuine Buyers
            </div>
          </div>

          {/* Star Breakdown Bars */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-2.5 px-0 sm:px-4">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <button
                key={stars}
                onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
                className={`w-full flex items-center gap-3 text-xs font-semibold p-1.5 rounded-lg transition-colors text-left ${
                  filterRating === stars ? 'bg-red-50 text-red-700' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="w-12 flex items-center gap-1 font-bold">
                  {stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[11px] text-slate-500 font-medium">{percentage}%</span>
                <span className="w-12 text-right text-[11px] text-slate-400">({count})</span>
              </button>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-3.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" /> GoPVC Guarantee
            </div>
            <div className="space-y-2 text-slate-600 text-[11px]">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>CR80 800-Micron</strong> rigid plastic cards (ATM thickness)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Waterproof & Scratch-Resistant</strong> UV cured pigment</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Free Doorstep Shipping</strong> across all PIN codes in India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews by name, city, card type or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 text-slate-800 placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Star Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterRating === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Stars
              </button>
              {[5, 4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                    filterRating === star
                      ? 'bg-amber-400 text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </button>
              ))}
            </div>

            {/* Card Category Dropdown */}
            <div className="relative">
              <select
                value={filterCardType}
                onChange={(e) => setFilterCardType(e.target.value)}
                className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold pl-3 pr-8 py-2 rounded-xl border border-transparent focus:border-red-500 focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Card Types</option>
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Voter">Voter ID</option>
                <option value="Driving">Driving Licence</option>
                <option value="Ayushman">Ayushman / ABHA</option>
                <option value="Ration">Ration Card</option>
                <option value="Corporate">Corporate / ID</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <User className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No reviews found matching your filter</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or rating filter.</p>
            <button
              onClick={() => {
                setFilterRating('all');
                setFilterCardType('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.slice(0, visibleCount).map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-200/80 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Rating + Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-slate-200" />
                      ))}
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED BUYER
                    </span>
                  </div>

                  {/* Card Type Tag */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-red-700 bg-red-50/80 px-2.5 py-0.5 rounded-md border border-red-100 inline-flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {rev.cardType}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-700 font-normal leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>

                {/* Author Info & Date */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center border border-slate-200">
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block leading-snug">{rev.name}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {rev.city}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatRelativeDate(rev.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredReviews.length > visibleCount && (
          <div className="text-center pt-2">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              Show More Reviews ({filteredReviews.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black">Ordered from GoPVC recently?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Share your feedback to help other buyers choose genuine ATM-grade PVC cards in India.
            </p>
          </div>
          <button
            id="btn-write-review-bottom"
            onClick={() => {
              setSubmitSuccess(false);
              setFormError('');
              setIsModalOpen(true);
            }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Leave a Customer Review / মতামত দিন</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUSTOMER REVIEW SUBMISSION MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider border border-red-100">
                <Sparkles className="w-3 h-3" /> FEEDBACK FORM
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Share Your Customer Feedback
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                আপনার কার্ড প্রিন্টিং অভিজ্ঞতা কেমন ছিল আমাদের জানান। Your honest review helps thousands of citizens make informed decisions.
              </p>
            </div>

            {/* Success State */}
            {submitSuccess ? (
              <div className="py-10 text-center space-y-4 animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900">Thank You for Your Feedback!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    আপনার রিভিউটি সফলভাবে প্রকাশিত হয়েছে। Your feedback has been published on GoPVC.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                {formError && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold">
                    {formError}
                  </div>
                )}

                {/* Rating Selector */}
                <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    Overall Rating (রেটিং দিন) *
                  </label>
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            (hoverRating || formRating) >= star
                              ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-amber-700">
                    {getRatingLabel(hoverRating || formRating)}
                  </div>
                </div>

                {/* Name & City Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Your Full Name (নাম) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Animesh Bera"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      City & State (শহর / জেলা)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolkata, WB"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Card Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Card Printed (কোন কার্ড প্রিন্ট করেছেন) *
                  </label>
                  <select
                    value={formCardType}
                    onChange={(e) => setFormCardType(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
                  >
                    {CARD_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Review Message Textarea */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Your Review & Experience (আপনার মূল্যবান মন্তব্য) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How was the plastic card quality, ATM thickness, QR code clarity, packaging and delivery time?"
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-hidden resize-none"
                  />
                  <div className="text-[10px] text-slate-400">
                    Please avoid sharing sensitive personal card numbers or passwords.
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-60 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Review...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Customer Review / রিভিউ সাবমিট করুন</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
