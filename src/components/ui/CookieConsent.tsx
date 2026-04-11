"use client";

// Cookie consent banner. Pairs with the GA4 Consent Mode v2 default=denied
// script injected in layout.tsx — on user action we call `gtag('consent',
// 'update', ...)` to either grant or keep denied. PostHog opt-in/out is
// called on the same action. Persistence is a single localStorage key.
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>,
    ) => void;
    posthog?: {
      opt_in_capturing?: () => void;
      opt_out_capturing?: () => void;
    };
  }
}

const STORAGE_KEY = "vernont-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip if the user has already made a choice. We intentionally do not
    // re-validate the stored payload shape — the presence of the key is
    // enough to suppress the banner on repeat visits.
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return;

    // Small delay so the banner doesn't compete with LCP/first paint.
    const t = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const acceptAll = () => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ analytics: true, ads: false, ts: Date.now() }),
      );
    } catch {
      // localStorage blocked (Safari private mode, etc.) — still update
      // consent + hide banner; worst case it re-shows next session.
    }
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.posthog?.opt_in_capturing?.();
    setVisible(false);
  };

  const rejectNonEssential = () => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ analytics: false, ads: false, ts: Date.now() }),
      );
    } catch {
      // same rationale as above
    }
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
    });
    window.posthog?.opt_out_capturing?.();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 z-[60]"
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div className="max-w-[1200px] mx-auto rounded-lg bg-white border border-[#E5E5E5] shadow-lg p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-1 text-[13px] leading-relaxed">
                <p className="text-[#666]">
                  <span className="text-[#1A1A1A] font-medium">
                    We use cookies
                  </span>{" "}
                  to improve your experience, analyze traffic, and personalize
                  content. Read our{" "}
                  <Link
                    href="/privacy"
                    className="text-[#1A1A1A] underline underline-offset-2 hover:no-underline"
                  >
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
                <Link
                  href="/privacy"
                  className="text-[13px] text-[#666] hover:text-[#1A1A1A] px-3 py-2 text-center transition-colors"
                >
                  Manage
                </Link>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="text-[13px] text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#F5F5F5] px-4 py-2 transition-colors"
                >
                  Reject non-essential
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="text-[13px] text-white bg-[#1A1A1A] hover:bg-[#333] px-4 py-2 transition-colors"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
