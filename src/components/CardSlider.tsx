import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CardSample {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  renderCard: () => React.ReactNode;
}

export const CardSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const cards = [
    // 1. Aadhaar Card
    {
      id: 'aadhaar',
      tag: 'Aadhaar Card',
      title: 'Aadhaar Card PVC Print',
      subtitle: 'Government of India Specification',
      badgeText: 'MOST POPULAR',
      badgeBg: 'bg-orange-500',
      badgeTextColor: 'text-white',
      renderCard: () => (
        <div className="relative w-full h-full bg-[#fdfaf5] border border-orange-200/80 rounded-xl overflow-hidden shadow-md flex flex-col justify-between text-slate-900 select-none p-2 sm:p-2.5 font-sans">
          {/* Header Banner with Tricolor Wave */}
          <div className="relative z-10 flex items-center justify-between pb-1 border-b border-orange-300/50">
            <div className="flex items-center gap-1.5">
              {/* Ashoka Emblem Representation */}
              <div className="w-5 h-6 flex flex-col items-center justify-center shrink-0 text-[#1a237e]">
                <div className="text-[10px] font-extrabold leading-none">🏛️</div>
                <div className="text-[5px] font-bold tracking-tighter uppercase text-slate-700">सत्यमेव जयते</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-black text-[#d84315] leading-none tracking-tight">
                  भारत सरकार
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold text-slate-700 leading-none">
                  Government of India
                </div>
              </div>
            </div>

            {/* Aadhaar Sun Fingerprint Logo */}
            <div className="flex items-center gap-1">
              <div className="text-right">
                <span className="text-[9px] font-bold text-red-600 block leading-none">আধার</span>
                <span className="text-[7px] text-slate-500 leading-none">Aadhaar</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px]">
                  🔴
                </div>
              </div>
            </div>
          </div>

          {/* Card Body Details */}
          <div className="relative z-10 my-auto py-1 flex items-center gap-2">
            {/* User Photo Box */}
            <div className="w-14 h-16 sm:w-16 sm:h-20 bg-emerald-100/60 border-2 border-slate-800 rounded-md overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
              <div className="w-full h-full bg-gradient-to-b from-amber-100 to-emerald-200 flex flex-col items-center justify-end pb-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-700/80 mb-1" />
                <div className="w-10 h-6 sm:w-12 sm:h-7 rounded-t-full bg-emerald-900/80" />
              </div>
            </div>

            {/* Details Column */}
            <div className="flex-1 min-w-0 space-y-0.5 text-left">
              <div className="text-[11px] sm:text-[12px] font-extrabold text-slate-900 leading-tight">
                আধার কার্ড / Aadhaar Card
              </div>
              <div className="text-[9px] sm:text-[10px] font-semibold text-slate-800">
                <span className="text-slate-600">জন্মতারিখ / DOB:</span> 29/09/2010
              </div>
              <div className="text-[9px] sm:text-[10px] font-semibold text-slate-800">
                <span className="text-slate-600">লিঙ্গ / GENDER:</span> পুরুষ / MALE
              </div>

              {/* Aadhaar Number Display */}
              <div className="pt-1">
                <div className="text-[12px] sm:text-[14px] font-black tracking-widest text-slate-950 font-mono bg-orange-100/50 px-1.5 py-0.5 rounded border border-orange-200/60 inline-block">
                  1111 2222 3333
                </div>
              </div>
            </div>

            {/* Micro Avatar & QR Code */}
            <div className="flex flex-col items-center justify-between h-full shrink-0 space-y-1">
              <div className="w-5 h-6 bg-slate-200 rounded border border-slate-300 overflow-hidden flex items-center justify-center text-[8px]">
                👤
              </div>
              {/* QR Code representation */}
              <div className="w-10 h-10 bg-slate-900 p-0.5 rounded border border-slate-300 grid grid-cols-3 gap-0.5">
                <div className="bg-white rounded-2xs" />
                <div className="bg-white rounded-2xs" />
                <div className="bg-white rounded-2xs" />
                <div className="bg-white rounded-2xs" />
                <div className="bg-slate-900 rounded-2xs" />
                <div className="bg-white rounded-2xs" />
                <div className="bg-white rounded-2xs" />
                <div className="bg-white rounded-2xs" />
                <div className="bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Bottom Slogan Bar */}
          <div className="relative z-10 -mx-2.5 -mb-2.5 mt-0.5 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 py-1 px-2 text-center text-white text-[10px] sm:text-[11px] font-extrabold tracking-wide">
            আমার আধার, আমার পরিচয়
          </div>

          {/* Background subtle watermark */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        </div>
      ),
    },

    // 2. Ayushman Vay Vandana Card
    {
      id: 'ayushman',
      tag: 'Ayushman Card',
      title: 'Ayushman Vay Vandana PVC',
      subtitle: 'AB PM-JAY 5 Lakh Free Treatment Card',
      badgeText: 'HEALTH CARD',
      badgeBg: 'bg-emerald-600',
      badgeTextColor: 'text-white',
      renderCard: () => (
        <div className="relative w-full h-full bg-[#fcfdfa] border border-emerald-300/80 rounded-xl overflow-hidden shadow-md flex flex-col justify-between text-slate-900 select-none p-2 sm:p-2.5 font-sans">
          {/* Header Orange Bar */}
          <div className="relative z-10 -mx-2.5 -mt-2.5 p-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black tracking-tight">NHA</span>
              <span className="text-[8px] bg-white/20 px-1 rounded font-bold">PM-JAY</span>
            </div>
            <div className="text-right">
              <div className="text-[8px] font-bold opacity-90 leading-none">आयुष्मान वय वंदना कार्ड</div>
              <div className="text-[9px] font-black leading-tight">Ayushman Vay Vandana Card</div>
            </div>
          </div>

          {/* Middle Highlight Box: 5 Lakh Benefit */}
          <div className="relative z-10 mt-1 bg-gradient-to-r from-amber-50 to-orange-50 p-1.5 rounded-lg border border-orange-200/70 flex items-center justify-between">
            <div>
              <span className="text-[13px] sm:text-[15px] font-black text-orange-600 leading-none block">
                ₹5 लाख <span className="text-[10px] font-bold text-slate-700">का मुफ़्त उपचार</span>
              </span>
            </div>
            <div className="text-right text-[8px] font-bold text-slate-600">
              ABHA & PM-JAY VERIFIED
            </div>
          </div>

          {/* Main Content Details */}
          <div className="relative z-10 my-auto py-1 flex items-center gap-2">
            {/* User Photo */}
            <div className="w-13 h-15 sm:w-14 sm:h-18 bg-sky-100 border-2 border-slate-700 rounded overflow-hidden shrink-0 flex flex-col items-center justify-end pb-0.5">
              <div className="w-6 h-6 rounded-full bg-slate-700 mb-0.5" />
              <div className="w-10 h-5 rounded-t-full bg-blue-900" />
            </div>

            {/* Text details */}
            <div className="flex-1 min-w-0 text-left space-y-0.5">
              <div className="text-[10px] sm:text-[11px] font-black text-slate-900 leading-tight">
                Sample Kumar
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-700 font-semibold">
                YOB: <span className="font-bold">01-01-2002</span> | GENDER: <span className="font-bold">M</span>
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-600 font-medium truncate">
                Village: Sample City | Block: Block
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-900 font-bold font-mono">
                ABHA: 91-1188-1188-1188
              </div>
            </div>

            {/* QR Code */}
            <div className="w-9 h-9 bg-slate-900 p-0.5 rounded border border-slate-300 grid grid-cols-3 gap-0.5 shrink-0">
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-slate-900" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
            </div>
          </div>

          {/* Bottom Green PM-JAY Banner */}
          <div className="relative z-10 -mx-2.5 -mb-2.5 bg-emerald-800 text-white py-1 px-2 text-center text-[8px] sm:text-[9px] font-bold tracking-tight truncate">
            आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (एबी पीएम-जय)
          </div>
        </div>
      ),
    },

    // 3. PAN Card
    {
      id: 'pan',
      tag: 'PAN Card',
      title: 'PAN Card PVC Print',
      subtitle: 'Income Tax Department - Govt of India',
      badgeText: 'OFFICIAL ID',
      badgeBg: 'bg-blue-600',
      badgeTextColor: 'text-white',
      renderCard: () => (
        <div className="relative w-full h-full bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 border border-blue-300/80 rounded-xl overflow-hidden shadow-md flex flex-col justify-between text-slate-900 select-none p-2 sm:p-2.5 font-sans">
          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-1 border-b border-blue-200">
            <div className="text-left">
              <div className="text-[9px] sm:text-[10px] font-black text-[#1e3a8a] leading-none">
                आयकर विभाग
              </div>
              <div className="text-[7px] font-bold text-slate-600 leading-none">
                INCOME TAX DEPARTMENT
              </div>
            </div>

            {/* Center Emblem */}
            <div className="w-5 h-5 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center text-[9px] font-black shadow-xs">
              🏛️
            </div>

            <div className="text-right">
              <div className="text-[9px] sm:text-[10px] font-black text-[#1e3a8a] leading-none">
                भारत सरकार
              </div>
              <div className="text-[7px] font-bold text-slate-600 leading-none">
                GOVT. OF INDIA
              </div>
            </div>
          </div>

          {/* PAN Card Title & Number */}
          <div className="relative z-10 text-center my-0.5">
            <div className="text-[8px] font-bold text-blue-900 tracking-wider uppercase">
              Permanent Account Number Card
            </div>
            <div className="text-[13px] sm:text-[15px] font-black text-slate-950 font-mono tracking-widest bg-white/80 py-0.5 px-2 rounded border border-blue-200 inline-block my-0.5 shadow-2xs">
              ABCDE1234F
            </div>
          </div>

          {/* Details & Photo */}
          <div className="relative z-10 my-auto flex items-center gap-2">
            {/* Photo Box */}
            <div className="w-12 h-14 bg-white border border-slate-400 rounded overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-slate-400 font-bold">
              Photo
            </div>

            {/* Particulars */}
            <div className="flex-1 min-w-0 text-left space-y-0.5 text-[8px] sm:text-[9px]">
              <div>
                <span className="text-slate-500 font-semibold block leading-none">नाम / Name</span>
                <span className="font-bold text-slate-900 block truncate">XXXXX XXXX XXX</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block leading-none">पिता का नाम / Father's Name</span>
                <span className="font-bold text-slate-900 block truncate">XXXXX XXXX XXX</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block leading-none">जन्म की तारीख / DOB</span>
                <span className="font-bold text-slate-900 block">01/01/1990</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="w-10 h-10 bg-slate-900 p-0.5 rounded border border-slate-300 grid grid-cols-3 gap-0.5 shrink-0">
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-slate-900" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
            </div>
          </div>

          {/* Signature Strip */}
          <div className="relative z-10 mt-1 bg-white/90 border border-slate-300 rounded py-0.5 px-2 text-center text-[7px] text-slate-500 font-mono italic">
            Applicant Signature / हस्ताक्षर
          </div>
        </div>
      ),
    },

    // 4. West Bengal Ration Card
    {
      id: 'ration',
      tag: 'Ration Card',
      title: 'WB Digital Ration PVC Card',
      subtitle: 'Khadya & Sarbaraha Daphtar - SPHH/RKSY',
      badgeText: 'STATE CARD',
      badgeBg: 'bg-sky-600',
      badgeTextColor: 'text-white',
      renderCard: () => (
        <div className="relative w-full h-full bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 border border-sky-300/80 rounded-xl overflow-hidden shadow-md flex flex-col justify-between text-slate-900 select-none p-2 sm:p-2.5 font-sans">
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between pb-1 border-b border-sky-300/60">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-6 text-sky-900 font-bold flex flex-col items-center justify-center text-[11px]">
                🏛️
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-black text-sky-950 leading-none">
                  পশ্চিমবঙ্গ সরকার
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold text-slate-700 leading-none">
                  খাদ্য ও সরবরাহ দপ্তর
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] font-black text-sky-900 bg-sky-200/70 px-1.5 py-0.5 rounded border border-sky-300">
                SPHH / RKSY
              </div>
            </div>
          </div>

          {/* Ration Card Number */}
          <div className="relative z-10 my-0.5 text-left">
            <div className="text-[10px] sm:text-[11px] font-black text-slate-950">
              Ration Card No : <span className="font-mono text-blue-900">SPHH 40538188</span>
            </div>
            <div className="text-[8px] text-slate-600 font-bold">
              For NFSA - Special Priority Household
            </div>
          </div>

          {/* Details Column */}
          <div className="relative z-10 my-auto py-0.5 flex items-center justify-between text-left gap-2 text-[8px] sm:text-[9px]">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div><span className="text-slate-600 font-semibold">Name of Card Holder:</span> <span className="font-bold text-slate-900">Anubrata Das</span></div>
              <div><span className="text-slate-600 font-semibold">Father/Husband:</span> <span className="font-bold text-slate-900">Dulal Das</span></div>
              <div><span className="text-slate-600 font-semibold">Dealer Name:</span> <span className="font-bold text-slate-900">HARAN ALI MONDAL</span></div>
            </div>

            {/* QR Code */}
            <div className="w-10 h-10 bg-slate-900 p-0.5 rounded border border-slate-300 grid grid-cols-3 gap-0.5 shrink-0">
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-slate-900" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
            </div>
          </div>

          {/* Footer Warning */}
          <div className="relative z-10 -mx-2.5 -mb-2.5 bg-sky-900 text-white py-0.5 px-2 text-center text-[8px] font-semibold">
            Not Transferable (হস্তান্তরযোগ্য নয়) • পশ্চিমবঙ্গ সরকার
          </div>
        </div>
      ),
    },

    // 5. Voter ID Card
    {
      id: 'voter',
      tag: 'Voter ID',
      title: 'Voter ID / e-EPIC PVC Card',
      subtitle: 'Election Commission of India Standard',
      badgeText: 'VOTER CARD',
      badgeBg: 'bg-indigo-600',
      badgeTextColor: 'text-white',
      renderCard: () => (
        <div className="relative w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border border-orange-300/80 rounded-xl overflow-hidden shadow-md flex flex-col justify-between text-slate-900 select-none p-2 sm:p-2.5 font-sans">
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between pb-1 border-b border-orange-300/60">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-[9px] font-black shrink-0">
                🗳️
              </div>
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-black text-orange-950 leading-none">
                  भारत निर्वाचन आयोग
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold text-slate-700 leading-none">
                  ELECTION COMMISSION OF INDIA
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[8px] font-extrabold text-orange-700 bg-orange-200/80 px-1.5 py-0.5 rounded">
                e-EPIC
              </div>
            </div>
          </div>

          {/* Card Title */}
          <div className="relative z-10 text-center my-0.5">
            <div className="text-[8px] sm:text-[9px] font-extrabold text-slate-800">
              e-Electors Photo Identity Card - ई-मतदाता पहचान पत्र
            </div>
          </div>

          {/* Details & Photo */}
          <div className="relative z-10 my-auto flex items-center gap-2">
            {/* Photo Box */}
            <div className="w-13 h-15 bg-slate-200 border-2 border-slate-700 rounded overflow-hidden shrink-0 flex flex-col items-center justify-end pb-0.5">
              <div className="w-6 h-6 rounded-full bg-slate-800 mb-0.5" />
              <div className="w-10 h-5 rounded-t-full bg-red-800" />
            </div>

            {/* Text details */}
            <div className="flex-1 min-w-0 text-left space-y-0.5 text-[8px] sm:text-[9px]">
              <div><span className="text-slate-600 font-semibold">नाम/Name:</span> <span className="font-bold text-slate-950">मोडसिंह भूरिया</span></div>
              <div><span className="text-slate-600 font-semibold">पिता/Father:</span> <span className="font-bold text-slate-950">कल्ला भूरिया</span></div>
              <div><span className="text-slate-600 font-semibold">लिंग/Gender:</span> <span className="font-bold text-slate-950">पुरुष / Male</span></div>
              <div><span className="text-slate-600 font-semibold">EPIC No:</span> <span className="font-bold font-mono text-orange-900">XYZ1234567</span></div>
            </div>

            {/* QR Code */}
            <div className="w-10 h-10 bg-slate-900 p-0.5 rounded border border-slate-300 grid grid-cols-3 gap-0.5 shrink-0">
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-slate-900" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-white" />
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="relative z-10 -mx-2.5 -mb-2.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white py-0.5 px-2 text-center text-[8px] font-bold">
            e-EPIC - ELECTION COMMISSION OF INDIA
          </div>
        </div>
      ),
    },

    // 6. Standard Dark Spec PVC Substrate
    {
      id: 'spec',
      tag: 'CR80 Plastic',
      title: '800 Micron Rigid PVC Substrate',
      subtitle: 'Waterproof & Scratch Resistant Lamination',
      badgeText: 'PREMIUM SUBSTRATE',
      badgeBg: 'bg-slate-900',
      badgeTextColor: 'text-amber-400',
      renderCard: () => (
        <div className="relative w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border border-slate-700/80 rounded-xl overflow-hidden shadow-md flex flex-col justify-between text-white select-none p-2.5 sm:p-3 font-sans">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 text-left">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-red-400 font-bold block">
                OFFICIAL PVC PRINT SPEC
              </span>
              <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                GOVERNMENT / CORPORATE ID
              </h4>
            </div>
            <div className="w-8 h-5 rounded bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
              <div className="w-4 h-3 border border-amber-300/60 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
                <div className="bg-amber-300/60 rounded-2xs" />
                <div className="bg-amber-300/60 rounded-2xs" />
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="space-y-0.5 text-left">
              <span className="text-[8px] text-slate-400 block uppercase">UV LAMINATE SEAL</span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-200">
                800 MICRON RIGID SUBSTRATE
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
              GP
            </div>
          </div>

          {/* Glossy shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-pulse" />
        </div>
      ),
    },
  ];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Automatic slide effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3500); // 3.5s interval

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  const activeCard = cards[currentIndex];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Slide Info Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 text-left">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${activeCard.badgeBg} ${activeCard.badgeTextColor} shadow-2xs`}>
            {activeCard.badgeText}
          </span>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
              {activeCard.title}
            </h4>
            <p className="text-[10px] text-slate-500 truncate max-w-[180px] sm:max-w-xs">
              {activeCard.subtitle}
            </p>
          </div>
        </div>

        {/* Pause/Play & Nav Indicators */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isPaused ? 'Resume Auto Sliding' : 'Pause Sliding'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[10px] font-mono font-bold text-slate-400">
            {currentIndex + 1}/{cards.length}
          </span>
        </div>
      </div>

      {/* Main Card View Box */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeCard.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 80 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {activeCard.renderCard()}
          </motion.div>
        </AnimatePresence>

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-20"
          aria-label="Previous Card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all z-20"
          aria-label="Next Card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-3">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-6 bg-red-600'
                : 'w-1.5 bg-slate-200 hover:bg-slate-300'
            }`}
            title={card.tag}
          />
        ))}
      </div>
    </div>
  );
};
