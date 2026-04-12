"use client";

// GDPR-compliant cookie consent banner with per-category toggles.
// Pairs with the GA4 Consent Mode v2 default=denied script in layout.tsx.
// On user action we POST consent to the backend for audit trail, update
// gtag consent, toggle PostHog, and dispatch a custom event so
// ConsentGatedScript can react (Klaviyo, GTM).
import { useEffect, useState, useCallback } from "react";
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

type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

type StoredConsent = ConsentCategories & {
  version: number;
  ts: number;
};

const STORAGE_KEY = "vernont-consent";
const SESSION_COOKIE = "vernont-sid";
const CURRENT_CONSENT_VERSION = 1;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getSessionId(): string {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (match) return match.split("=")[1];

  const id = crypto.randomUUID();
  document.cookie = `${SESSION_COOKIE}=${id}; path=/; max-age=31536000; SameSite=Lax`;
  return id;
}

function applyConsent(categories: ConsentCategories) {
  // GA4 Consent Mode v2
  window.gtag?.("consent", "update", {
    analytics_storage: categories.analytics ? "granted" : "denied",
    ad_storage: categories.marketing ? "granted" : "denied",
    ad_user_data: categories.marketing ? "granted" : "denied",
    ad_personalization: categories.marketing ? "granted" : "denied",
  });

  // PostHog
  if (categories.analytics) {
    window.posthog?.opt_in_capturing?.();
  } else {
    window.posthog?.opt_out_capturing?.();
  }

  // Custom event for ConsentGatedScript (Klaviyo, GTM)
  window.dispatchEvent(
    new CustomEvent("consent-updated", { detail: categories }),
  );
}

function saveConsent(categories: ConsentCategories) {
  const payload: StoredConsent = {
    ...categories,
    version: CURRENT_CONSENT_VERSION,
    ts: Date.now(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage blocked (Safari private mode, etc.)
  }
}

function postConsentToBackend(categories: ConsentCategories) {
  const sessionId = getSessionId();
  fetch(`${API_URL}/store/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      sessionId,
      categories,
      consentVersion: CURRENT_CONSENT_VERSION,
    }),
  }).catch(() => {});
}

// ── Toggle switch ────────────────────────────────────────────────────
function Toggle({
  checked,
  disabled,
  onChange,
  id,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2
        ${checked ? "bg-[#1A1A1A]" : "bg-[#D1D1D1]"}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm
          ring-0 transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}

// ── Category row ─────────────────────────────────────────────────────
function CategoryRow({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[#1A1A1A] cursor-pointer"
        >
          {label}
        </label>
        <p className="text-[12px] text-[#888] mt-0.5 leading-snug">
          {description}
        </p>
      </div>
      <div className="pt-0.5">
        {disabled ? (
          <span className="text-[11px] text-[#888] whitespace-nowrap">
            Always on
          </span>
        ) : (
          <Toggle id={id} checked={checked} onChange={onChange} />
        )}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>({
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredConsent = JSON.parse(stored);
        if (parsed.version >= CURRENT_CONSENT_VERSION) {
          // Consent still valid — apply it silently and don't show banner
          applyConsent(parsed);
          return;
        }
      } catch {
        // corrupted — re-prompt
      }
    }

    // Ensure session cookie exists
    getSessionId();

    const t = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const handleDecision = useCallback((cats: ConsentCategories) => {
    saveConsent(cats);
    postConsentToBackend(cats);
    applyConsent(cats);
    setVisible(false);
  }, []);

  const acceptAll = useCallback(() => {
    handleDecision({ analytics: true, marketing: true, functional: true });
  }, [handleDecision]);

  const rejectAll = useCallback(() => {
    handleDecision({ analytics: false, marketing: false, functional: false });
  }, [handleDecision]);

  const savePreferences = useCallback(() => {
    handleDecision(categories);
  }, [handleDecision, categories]);

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
            {!managing ? (
              /* ── Default banner ─────────────────────────── */
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-1 text-[13px] leading-relaxed">
                  <p className="text-[#666]">
                    <span className="text-[#1A1A1A] font-medium">
                      We use cookies
                    </span>{" "}
                    to improve your experience and analyze traffic. Read our{" "}
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
                  <button
                    type="button"
                    onClick={() => setManaging(true)}
                    className="text-[13px] text-[#666] hover:text-[#1A1A1A] px-3 py-2 text-center transition-colors"
                  >
                    Manage
                  </button>
                  <button
                    type="button"
                    onClick={rejectAll}
                    className="text-[13px] text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#F5F5F5] px-4 py-2 transition-colors"
                  >
                    Reject all
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
            ) : (
              /* ── Manage view ────────────────────────────── */
              <div>
                <h2 className="text-[14px] font-semibold text-[#1A1A1A] mb-3">
                  Cookie Preferences
                </h2>

                <div className="divide-y divide-[#F0F0F0]">
                  <CategoryRow
                    id="cat-necessary"
                    label="Strictly Necessary"
                    description="Essential for site function. Cannot be disabled."
                    checked={true}
                    disabled
                  />
                  <CategoryRow
                    id="cat-analytics"
                    label="Analytics"
                    description="GA4, PostHog — helps us understand how you use the site."
                    checked={categories.analytics}
                    onChange={(v) =>
                      setCategories((c) => ({ ...c, analytics: v }))
                    }
                  />
                  <CategoryRow
                    id="cat-marketing"
                    label="Marketing"
                    description="Klaviyo — personalized email offers and promotions."
                    checked={categories.marketing}
                    onChange={(v) =>
                      setCategories((c) => ({ ...c, marketing: v }))
                    }
                  />
                  <CategoryRow
                    id="cat-functional"
                    label="Functional"
                    description="Location detection, currency preferences."
                    checked={categories.functional}
                    onChange={(v) =>
                      setCategories((c) => ({ ...c, functional: v }))
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 pt-3 border-t border-[#F0F0F0]">
                  <button
                    type="button"
                    onClick={savePreferences}
                    className="text-[13px] text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#F5F5F5] px-4 py-2 transition-colors"
                  >
                    Save preferences
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
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
