"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type posthog from "posthog-js";

// PostHog Analytics Provider
// - EU Region: https://eu.posthog.com
// - Free tier: 1M events/month, 5K session recordings
// - Session replays, error tracking, feature flags
// - Events linked with backend via same user ID (distinctId)
// - Lazy loaded after page interactive to avoid render blocking

let posthogInstance: typeof posthog | null = null;
let isInitializing = false;

async function initPostHog() {
  if (posthogInstance || isInitializing) return posthogInstance;
  if (typeof window === "undefined") return null;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";

  if (!apiKey) return null;

  isInitializing = true;

  try {
    // Dynamic import to avoid loading PostHog during initial page load
    const { default: posthog } = await import("posthog-js");

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

    posthogInstance = posthog;
    return posthog;
  } catch (error) {
    console.error("Failed to initialize PostHog:", error);
    return null;
  } finally {
    isInitializing = false;
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<typeof posthog | null>(null);

  useEffect(() => {
    // Initialize PostHog after the page becomes interactive
    initPostHog().then((ph) => {
      if (ph) setClient(ph);
    });
  }, []);

  // Render children immediately without waiting for PostHog
  // PostHog will start tracking once it's loaded
  if (!client) {
    return <>{children}</>;
  }

  // Dynamically import the provider component
  const PHProvider = require("posthog-js/react").PostHogProvider;
  return <PHProvider client={client}>{children}</PHProvider>;
}

// PostHog Page View Tracker
// Captures route changes in Next.js App Router
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize PostHog if not already done
    initPostHog().then((ph) => {
      if (ph) setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady || !posthogInstance || !pathname) return;

    let url = window.origin + pathname;
    if (searchParams && searchParams.toString()) {
      url = url + `?${searchParams.toString()}`;
    }
    posthogInstance.capture("$pageview", {
      $current_url: url,
    });
  }, [pathname, searchParams, isReady]);

  return null;
}
