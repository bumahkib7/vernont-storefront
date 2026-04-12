"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Copy,
  WhatsappLogo,
  EnvelopeSimple,
  SpinnerGap,
  CheckCircle,
  Users,
  ShareNetwork,
} from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

interface Referral {
  code: string;
  status: string;
  used_at?: string | null;
  referee_email?: string | null;
  created_at: string;
}

interface ReferralResponse {
  referrals: Referral[];
}

interface GenerateResponse {
  code: string;
}

const API_BASE_URL =
  typeof window !== "undefined" && process.env.NODE_ENV === "production"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function ReferralsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/store/referrals/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch referrals");
      const data: ReferralResponse = await res.json();
      setReferrals(data.referrals || []);
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      setIsLoading(false);
      return;
    }
    fetchReferrals();
  }, [authLoading, isAuthenticated, fetchReferrals]);

  const generateCode = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/store/referrals`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to generate referral code");
      }
      const data: GenerateResponse = await res.json();
      // Add the new code to the list and refresh
      setReferrals((prev) => [
        { code: data.code, status: "active", created_at: new Date().toISOString() },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const getReferralUrl = (code: string) => `https://vernont.com?ref=${code}`;

  const copyToClipboard = async (code: string) => {
    const url = getReferralUrl(code);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const shareWhatsApp = (code: string) => {
    const url = getReferralUrl(code);
    const text = `Check out Vernont eyewear! Use my referral link to shop: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareEmail = (code: string) => {
    const url = getReferralUrl(code);
    const subject = "Check out Vernont Eyewear";
    const body = `Hey! I thought you might like Vernont eyewear. Use my referral link to shop and we both earn rewards:\n\n${url}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_self"
    );
  };

  const activeCode = referrals.find((r) => r.status === "active");

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
            <Gift className="h-6 w-6 text-[var(--primary)]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Refer a Friend</h2>
            <p className="text-[var(--muted-foreground)] text-sm mb-6">
              Share your unique link and earn rewards when friends shop
            </p>

            {/* Show active code or generate button */}
            {activeCode ? (
              <div className="space-y-4">
                {/* Code display */}
                <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
                  <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                    Your referral code
                  </p>
                  <p className="font-mono text-lg font-semibold tracking-wide mb-2">
                    {activeCode.code}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] break-all">
                    {getReferralUrl(activeCode.code)}
                  </p>
                </div>

                {/* Share buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyToClipboard(activeCode.code)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {copiedCode === activeCode.code ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => shareWhatsApp(activeCode.code)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <WhatsappLogo className="h-4 w-4" />
                    Share on WhatsApp
                  </button>

                  <button
                    onClick={() => shareEmail(activeCode.code)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
                  >
                    <EnvelopeSimple className="h-4 w-4" />
                    Share via Email
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {error && (
                  <p className="text-sm text-[var(--destructive)] mb-3">{error}</p>
                )}
                <button
                  onClick={generateCode}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <SpinnerGap className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ShareNetwork className="h-4 w-4" />
                      Generate My Link
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Referrals table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="font-semibold">Your Referrals</h2>
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">
            {referrals.length} {referrals.length === 1 ? "code" : "codes"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <SpinnerGap className="h-6 w-6 animate-spin text-[var(--primary)]" />
          </div>
        ) : referrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                    Code
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">
                    Used Date
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--muted-foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {referrals.map((referral) => (
                  <tr
                    key={referral.code}
                    className="hover:bg-[var(--background)] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-medium">
                      {referral.code}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                          referral.status === "active"
                            ? "bg-green-500/10 text-green-600"
                            : referral.status === "used"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-[var(--muted)]/10 text-[var(--muted-foreground)]"
                        }`}
                      >
                        {referral.status.charAt(0).toUpperCase() +
                          referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {referral.used_at
                        ? new Date(referral.used_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => copyToClipboard(referral.code)}
                        className="text-[var(--primary)] hover:underline text-xs"
                      >
                        {copiedCode === referral.code ? "Copied!" : "Copy Link"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-[var(--muted-foreground)]" />
            </div>
            <p className="font-medium mb-1">No referrals yet</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Generate a referral code above to start sharing
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
