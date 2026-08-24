import React, { useEffect, useRef } from 'react';

interface ThirdPartyAdBannerProps {
  className?: string;
}

/**
 * ThirdPartyAdBanner component
 * Integrates the required third-party advertising script and container safely.
 * 
 * - Uses exact script URL and container ID.
 * - Single container per page to prevent duplicate DOM IDs.
 * - Dynamic script loading on mount with clean unmount handling.
 * - Isolated with layout-shift prevention (min-height + responsive container).
 * - Kept strictly outside of checkout, upload, and payment interactive forms.
 */
export const ThirdPartyAdBanner: React.FC<ThirdPartyAdBannerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef<boolean>(false);

  useEffect(() => {
    // Only execute on client side in browser
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    if (scriptInjectedRef.current) return;

    const scriptSrc = 'https://pl31004101.profitableratecpmnetwork.com/8f8734928e355dbd6ea9e01047299376/invoke.js';

    // Create the exact required script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    container.appendChild(script);
    scriptInjectedRef.current = true;

    return () => {
      // Safe cleanup on component unmount
      try {
        if (container && script.parentNode === container) {
          container.removeChild(script);
        }
      } catch {
        // Safe failover
      }
      scriptInjectedRef.current = false;
    };
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-center justify-center my-8 sm:my-10 px-4 ${className}`}
      aria-label="Advertisement Banner"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle non-intrusive ad indicator */}
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 select-none">
          Advertisement
        </span>

        {/* Ad Container with reserved min-height to prevent cumulative layout shift (CLS) */}
        <div
          ref={containerRef}
          id="container-8f8734928e355dbd6ea9e01047299376"
          className="w-full min-h-[90px] sm:min-h-[100px] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50 border border-dashed border-slate-200/80 p-2 text-center"
        />
      </div>
    </div>
  );
};
