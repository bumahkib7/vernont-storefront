"use client";

// GDPR-compliant cookie consent banner with per-category AND per-vendor
// toggles, TCF v2.2 integration, and dedicated /consent page support.
// Pairs with the GA4 Consent Mode v2 default=denied script in layout.tsx.
// On user action we POST consent to the backend for audit trail, update
// gtag consent, toggle PostHog, dispatch a custom event so
// ConsentGatedScript can react (Klaviyo, GTM), and update the TCF API.
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { initTcfApi, updateTcfConsent } from "@/lib/tcf";

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

/* ── Vendor definitions ──────────────────────────────────────────── */
const VENDORS = [
  { id: "ga4", name: "Google Analytics 4", category: "analytics", description: "Page views, events, and conversion tracking" },
  { id: "posthog", name: "PostHog", category: "analytics", description: "Product analytics and session replay" },
  { id: "klaviyo", name: "Klaviyo", category: "marketing", description: "Email marketing popups and forms" },
  { id: "gtm", name: "Google Tag Manager", category: "marketing", description: "Marketing tag orchestration" },
  { id: "stripe", name: "Stripe", category: "necessary", description: "Secure payment processing", required: true },
  { id: "mapbox", name: "Mapbox", category: "functional", description: "Store locator and maps" },
] as const;

type VendorId = (typeof VENDORS)[number]["id"];

type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

type VendorConsent = Record<VendorId, boolean>;

type StoredConsent = ConsentCategories & {
  vendors: VendorConsent;
  version: number;
  ts: number;
};

const STORAGE_KEY = "vernont-consent";
const SESSION_COOKIE = "vernont-sid";
const CURRENT_CONSENT_VERSION = 1;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ── Helpers ─────────────────────────────────────────────────────── */

function defaultVendors(categories: ConsentCategories): VendorConsent {
  return {
    ga4: categories.analytics,
    posthog: categories.analytics,
    klaviyo: categories.marketing,
    gtm: categories.marketing,
    stripe: true,
    mapbox: categories.functional,
  };
}

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

  // TCF v2.2
  updateTcfConsent(categories);
}

function saveConsent(categories: ConsentCategories, vendors: VendorConsent) {
  const payload: StoredConsent = {
    ...categories,
    vendors: { ...vendors, stripe: true },
    version: CURRENT_CONSENT_VERSION,
    ts: Date.now(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage blocked (Safari private mode, etc.)
  }
}

function postConsentToBackend(categories: ConsentCategories, vendors: VendorConsent) {
  const sessionId = getSessionId();
  fetch(`${API_URL}/store/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      sessionId,
      categories: {
        ...categories,
        vendors: { ...vendors, stripe: true },
      },
      consentVersion: CURRENT_CONSENT_VERSION,
    }),
  }).catch(() => {});
}

/* ── Toggle switch ───────────────────────────────────────────────── */
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

/* ── Category row ────────────────────────────────────────────────── */
function CategoryRow({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
  children,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!children;

  return (
    <div className="py-2.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {hasChildren && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-[11px] text-[#888] hover:text-[#1A1A1A] transition-colors leading-none"
                aria-label={expanded ? "Collapse vendors" : "Expand vendors"}
              >
                {expanded ? "\u25BC" : "\u25B6"}
              </button>
            )}
            <label
              htmlFor={id}
              className="text-[13px] font-medium text-[#1A1A1A] cursor-pointer"
            >
              {label}
            </label>
          </div>
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
      {hasChildren && expanded && (
        <div className="ml-5 mt-2 space-y-1 border-l-2 border-[#F0F0F0] pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Vendor row ──────────────────────────────────────────────────── */
function VendorRow({
  vendor,
  checked,
  onChange,
}: {
  vendor: (typeof VENDORS)[number];
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const isRequired = "required" in vendor && vendor.required;
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="flex-1 min-w-0">
        <span className="text-[12px] font-medium text-[#1A1A1A]">
          {vendor.name}
        </span>
        <p className="text-[11px] text-[#999] leading-snug">
          {vendor.description}
        </p>
      </div>
      <div className="shrink-0">
        {isRequired ? (
          <span className="text-[10px] text-[#888] whitespace-nowrap">
            Required
          </span>
        ) : (
          <Toggle
            id={`vendor-${vendor.id}`}
            checked={checked}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function CookieConsent({
  mode = "banner",
  forceShow = false,
}: {
  mode?: "page" | "banner";
  forceShow?: boolean;
}) {
  const [visible, setVisible] = useState(mode === "page");
  const [managing, setManaging] = useState(mode === "page");
  const [categories, setCategories] = useState<ConsentCategories>({
    analytics: false,
    marketing: false,
    functional: false,
  });
  const [vendors, setVendors] = useState<VendorConsent>(
    defaultVendors({ analytics: false, marketing: false, functional: false }),
  );

  // Check for ?reconsent=true in banner mode
  let reconsentParam = false;
  if (mode === "banner") {
    try {
      // useSearchParams is safe here since this is a client component
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const searchParams = useSearchParams();
      reconsentParam = searchParams.get("reconsent") === "true";
    } catch {
      // Not wrapped in Suspense — ignore
    }
  }

  const shouldForceShow = forceShow || reconsentParam;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredConsent = JSON.parse(stored);
        const cats: ConsentCategories = {
          analytics: parsed.analytics,
          marketing: parsed.marketing,
          functional: parsed.functional,
        };

        // Hydrate vendor state from stored data (or derive from categories)
        const storedVendors: VendorConsent = parsed.vendors || defaultVendors(cats);
        setCategories(cats);
        setVendors({ ...storedVendors, stripe: true });

        // Initialize TCF with stored consent
        initTcfApi(cats);

        if (parsed.version >= CURRENT_CONSENT_VERSION && !shouldForceShow) {
          // Consent still valid — apply silently, don't show banner
          applyConsent(cats);
          if (mode === "banner") return;
        }
      } catch {
        // corrupted — re-prompt
      }
    } else {
      // No stored consent — initialize TCF with defaults (all denied)
      initTcfApi({ analytics: false, marketing: false, functional: false });
    }

    // Ensure session cookie exists
    getSessionId();

    if (mode === "banner") {
      const t = window.setTimeout(() => setVisible(true), 800);
      return () => window.clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [shouldForceShow, mode]);

  /* ── Category toggle handler (syncs vendors in that category) ── */
  const toggleCategory = useCallback(
    (cat: keyof ConsentCategories, value: boolean) => {
      setCategories((c) => ({ ...c, [cat]: value }));
      setVendors((v) => {
        const next = { ...v };
        for (const vendor of VENDORS) {
          if (vendor.category === cat && !("required" in vendor && vendor.required)) {
            next[vendor.id] = value;
          }
        }
        return next;
      });
    },
    [],
  );

  /* ── Individual vendor toggle ──────────────────────────────────── */
  const toggleVendor = useCallback((vendorId: VendorId, value: boolean) => {
    setVendors((v) => ({ ...v, [vendorId]: value }));
  }, []);

  const handleDecision = useCallback(
    (cats: ConsentCategories, vends: VendorConsent) => {
      const finalVendors = { ...vends, stripe: true };
      saveConsent(cats, finalVendors);
      postConsentToBackend(cats, finalVendors);
      applyConsent(cats);
      if (mode === "banner") setVisible(false);
    },
    [mode],
  );

  const acceptAll = useCallback(() => {
    const cats = { analytics: true, marketing: true, functional: true };
    const vends = defaultVendors(cats);
    setCategories(cats);
    setVendors(vends);
    handleDecision(cats, vends);
  }, [handleDecision]);

  const rejectAll = useCallback(() => {
    const cats = { analytics: false, marketing: false, functional: false };
    const vends = defaultVendors(cats);
    setCategories(cats);
    setVendors(vends);
    handleDecision(cats, vends);
  }, [handleDecision]);

  const savePreferences = useCallback(() => {
    handleDecision(categories, vendors);
  }, [handleDecision, categories, vendors]);

  /* ── Render helpers ────────────────────────────────────────────── */
  const vendorsForCategory = (cat: string) =>
    VENDORS.filter((v) => v.category === cat);

  const renderVendors = (cat: string) =>
    vendorsForCategory(cat).map((vendor) => (
      <VendorRow
        key={vendor.id}
        vendor={vendor}
        checked={vendors[vendor.id]}
        onChange={(v) => toggleVendor(vendor.id, v)}
      />
    ));

  /* ── Container styling ─────────────────────────────────────────── */
  const isPage = mode === "page";
  const containerClassName = isPage
    ? "w-full"
    : "fixed bottom-4 left-4 right-4 z-[60]";

  const cardClassName = isPage
    ? "rounded-lg bg-white border border-[#E5E5E5] shadow-lg p-5 md:p-6"
    : "max-w-[1200px] mx-auto rounded-lg bg-white border border-[#E5E5E5] shadow-lg p-5 md:p-6";

  const content = (
    <div className={containerClassName} role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className={cardClassName}>
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
          /* ── Manage view with vendor toggles ────────── */
          <div>
            <h2 className="text-[14px] font-semibold text-[#1A1A1A] mb-3">
              Cookie Preferences
            </h2>

            <div className="divide-y divide-[#F0F0F0]">
              {/* Strictly Necessary */}
              <CategoryRow
                id="cat-necessary"
                label="Strictly Necessary"
                description="Essential for site function. Cannot be disabled."
                checked={true}
                disabled
              >
                {vendorsForCategory("necessary").map((vendor) => (
                  <VendorRow
                    key={vendor.id}
                    vendor={vendor}
                    checked={true}
                    onChange={() => {}}
                  />
                ))}
              </CategoryRow>

              {/* Analytics */}
              <CategoryRow
                id="cat-analytics"
                label="Analytics"
                description="Helps us understand how you use the site."
                checked={categories.analytics}
                onChange={(v) => toggleCategory("analytics", v)}
              >
                {renderVendors("analytics")}
              </CategoryRow>

              {/* Marketing */}
              <CategoryRow
                id="cat-marketing"
                label="Marketing"
                description="Personalized offers and ad targeting."
                checked={categories.marketing}
                onChange={(v) => toggleCategory("marketing", v)}
              >
                {renderVendors("marketing")}
              </CategoryRow>

              {/* Functional */}
              <CategoryRow
                id="cat-functional"
                label="Functional"
                description="Location detection, maps, and preferences."
                checked={categories.functional}
                onChange={(v) => toggleCategory("functional", v)}
              >
                {renderVendors("functional")}
              </CategoryRow>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 pt-3 border-t border-[#F0F0F0]">
              {!isPage && (
                <button
                  type="button"
                  onClick={rejectAll}
                  className="text-[13px] text-[#666] hover:text-[#1A1A1A] px-3 py-2 text-center transition-colors"
                >
                  Reject all
                </button>
              )}
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
    </div>
  );

  /* Page mode: no animation, always visible */
  if (isPage) {
    return visible ? content : null;
  }

  /* Banner mode: animated slide-up */
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
