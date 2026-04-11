"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// PostHog Analytics Provider
// - EU Region: https://eu.posthog.com
// - Free tier: 1M events/month, 5K session recordings
// - Session replays, error tracking, feature flags
// - Events linked with backend via same user ID (distinctId)

if (typeof window !== "undefined") {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

  if (apiKey) {
    posthog.init(apiKey, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false, // We manually capture pageviews
      capture_pageleave: true,
      autocapture: {
        dom_event_allowlist: ["click"], // Only autocapture clicks
        url_allowlist: [window.location.origin],
      },
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "[data-mask]",
      },
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();

        // Respect cookie consent: opt out by default, CookieConsent banner
        // will call opt_in_capturing() if user accepts analytics.
        const stored = window.localStorage.getItem("vernont-consent");
        if (stored) {
          try {
            const consent = JSON.parse(stored);
            if (!consent.analytics) {
              posthog.opt_out_capturing();
            }
          } catch {
            // Malformed consent — default to opted out
            posthog.opt_out_capturing();
          }
        } else {
          // No consent recorded yet — opt out until user chooses
          posthog.opt_out_capturing();
        }
      },
    });
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// PostHog Page View Tracker
// Captures route changes in Next.js App Router
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
