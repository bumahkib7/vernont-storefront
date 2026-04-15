"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { EnvelopeSimple, CheckCircle, WarningCircle, SpinnerGap } from "@/components/icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface EmailPreferences {
  marketingEmailsEnabled: boolean;
  priceDropAlertsEnabled: boolean;
  newArrivalsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  promotionalEnabled: boolean;
  emailFrequency: string;
}

export default function EmailPreferencesPage() {
  const [email, setEmail] = useState("");
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<EmailPreferences>({
    marketingEmailsEnabled: false,
    priceDropAlertsEnabled: false,
    newArrivalsEnabled: false,
    weeklyDigestEnabled: false,
    promotionalEnabled: false,
    emailFrequency: "NORMAL",
  });

  // Auto-load preferences if email is in URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
      loadPreferences(emailParam);
    }
  }, []);

  const loadPreferences = async (emailToLoad: string) => {
    setIsLoadingPrefs(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `/api/proxy/store/marketing/preferences/public/by-email?email=${encodeURIComponent(emailToLoad)}`
      );

      if (!res.ok) {
        throw new Error("Failed to load preferences");
      }

      const data = await res.json();
      setPreferences(data);
      setShowPreferences(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load preferences. Please try again."
      );
    } finally {
      setIsLoadingPrefs(false);
    }
  };

  const handleLoadPreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    await loadPreferences(email.trim().toLowerCase());
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `/api/proxy/store/marketing/preferences/public/by-email`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            ...preferences,
          }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Failed to update preferences");
      }

      setSuccess("Your email preferences have been updated successfully!");

      // Scroll to success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update preferences. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to unsubscribe from all marketing emails? You can always resubscribe later."
    );

    if (!confirmed) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `/api/proxy/store/marketing/preferences/public/by-email`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            marketingEmailsEnabled: false,
            priceDropAlertsEnabled: false,
            newArrivalsEnabled: false,
            weeklyDigestEnabled: false,
            promotionalEnabled: false,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to unsubscribe");
      }

      // Update local state
      setPreferences({
        marketingEmailsEnabled: false,
        priceDropAlertsEnabled: false,
        newArrivalsEnabled: false,
        weeklyDigestEnabled: false,
        promotionalEnabled: false,
        emailFrequency: preferences.emailFrequency,
      });

      setSuccess("You have been unsubscribed from all marketing emails.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not unsubscribe. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-[1500px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="tracking-wider uppercase text-sm mb-3" style={{ color: "#999" }}>
            Manage Your Communication
          </p>
          <h1
            className="text-4xl md:text-5xl tracking-wide mb-4"
            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", color: "#1A1A1A" }}
          >
            Email Preferences
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: "#666" }}>
            Control what emails you receive from us. You can opt in or opt out at any time.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {success && (
            <div
              className="mb-6 p-4 rounded-lg flex items-start gap-3"
              style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
              <p style={{ color: "#166534" }}>{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg flex items-start gap-3"
              style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5" }}
            >
              <WarningCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
              <p style={{ color: "#991b1b" }}>{error}</p>
            </div>
          )}

          {/* Email Input Form */}
          {!showPreferences && (
            <div
              className="p-8 rounded-lg"
              style={{ backgroundColor: "#FAFAF8", border: "1px solid #E5E5E5" }}
            >
              <form onSubmit={handleLoadPreferences}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#1A1A1A" }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <EnvelopeSimple className="w-5 h-5" style={{ color: "#999" }} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      disabled={isLoadingPrefs}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border outline-none transition-colors"
                      style={{
                        borderColor: "#E5E5E5",
                        backgroundColor: "#fff",
                        color: "#1A1A1A",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm" style={{ color: "#999" }}>
                    Enter your email to view and manage your preferences
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoadingPrefs}
                  className="w-full py-3 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: "#1A1A1A",
                    color: "#fff",
                  }}
                >
                  {isLoadingPrefs ? (
                    <span className="flex items-center justify-center gap-2">
                      <SpinnerGap className="w-5 h-5 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Preferences Management */}
          {showPreferences && (
            <div
              className="p-8 rounded-lg"
              style={{ backgroundColor: "#FAFAF8", border: "1px solid #E5E5E5" }}
            >
              <div className="mb-6">
                <p className="text-sm mb-2" style={{ color: "#999" }}>
                  Managing preferences for:
                </p>
                <p className="font-medium" style={{ color: "#1A1A1A" }}>
                  {email}
                </p>
                <button
                  onClick={() => {
                    setShowPreferences(false);
                    setEmail("");
                    setSuccess(null);
                    setError(null);
                  }}
                  className="text-sm mt-2 underline"
                  style={{ color: "#666" }}
                >
                  Use a different email
                </button>
              </div>

              <div className="space-y-6">
                <PreferenceToggle
                  label="Marketing Emails"
                  description="Receive updates about new products, sales, and special offers"
                  enabled={preferences.marketingEmailsEnabled}
                  onChange={(enabled) =>
                    setPreferences({ ...preferences, marketingEmailsEnabled: enabled })
                  }
                />

                <PreferenceToggle
                  label="Price Drop Alerts"
                  description="Get notified when items on your wishlist go on sale"
                  enabled={preferences.priceDropAlertsEnabled}
                  onChange={(enabled) =>
                    setPreferences({ ...preferences, priceDropAlertsEnabled: enabled })
                  }
                />

                <PreferenceToggle
                  label="New Arrivals"
                  description="Be the first to know about new eyewear collections"
                  enabled={preferences.newArrivalsEnabled}
                  onChange={(enabled) =>
                    setPreferences({ ...preferences, newArrivalsEnabled: enabled })
                  }
                />

                <PreferenceToggle
                  label="Weekly Digest"
                  description="A curated roundup of featured products and stories"
                  enabled={preferences.weeklyDigestEnabled}
                  onChange={(enabled) =>
                    setPreferences({ ...preferences, weeklyDigestEnabled: enabled })
                  }
                />

                <PreferenceToggle
                  label="Promotional Emails"
                  description="Exclusive discounts and promotional campaigns"
                  enabled={preferences.promotionalEnabled}
                  onChange={(enabled) =>
                    setPreferences({ ...preferences, promotionalEnabled: enabled })
                  }
                />
              </div>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: "#E5E5E5" }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: "#1A1A1A",
                      color: "#fff",
                    }}
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <SpinnerGap className="w-5 h-5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>

                  <Button
                    onClick={handleUnsubscribeAll}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: "#fff",
                      color: "#1A1A1A",
                      border: "1px solid #E5E5E5",
                    }}
                  >
                    Unsubscribe from All
                  </Button>
                </div>
              </div>

              <p className="mt-6 text-xs text-center" style={{ color: "#999" }}>
                Changes may take up to 24 hours to take effect. Transactional emails (order
                confirmations, shipping notifications) will still be sent.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

// Preference Toggle Component
function PreferenceToggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="font-medium mb-1" style={{ color: "#1A1A1A" }}>
          {label}
        </h3>
        <p className="text-sm" style={{ color: "#999" }}>
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
        style={{
          backgroundColor: enabled ? "#1A1A1A" : "#E5E5E5",
        }}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          style={{
            transform: enabled ? "translateX(1.25rem)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}
