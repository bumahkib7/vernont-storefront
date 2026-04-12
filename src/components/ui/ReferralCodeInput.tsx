"use client";

import { useState } from "react";
import { CaretDown, CaretUp, Gift, SpinnerGap, CheckCircle } from "@/components/icons";

const API_BASE_URL =
  typeof window !== "undefined" && process.env.NODE_ENV === "production"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const STORAGE_KEY = "vernont_referral_code";

export function ReferralCodeInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Check if a code was already applied
  const appliedCode =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/store/referrals/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Invalid referral code");
      }

      localStorage.setItem(STORAGE_KEY, trimmed);
      setStatus("success");
      setMessage("Referral code applied!");
      setCode("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to apply code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-500/10 rounded-lg p-3">
        <CheckCircle className="h-4 w-4 flex-shrink-0" />
        <span>
          Referral code <span className="font-mono font-medium">{appliedCode}</span> applied
        </span>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Have a referral code?
        </span>
        {isOpen ? (
          <CaretUp className="h-4 w-4" />
        ) : (
          <CaretDown className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="px-3 pb-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !code.trim()}
              className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <SpinnerGap className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </form>

          {status === "success" && (
            <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {message}
            </p>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-[var(--destructive)]">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}
