"use client";

// Renders a <Script> tag only when the user has granted consent for the
// given category (and optionally a specific vendor). Listens for
// "consent-updated" custom events so it reacts instantly when the user
// changes their preferences.
import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "vernont-consent";

type ConsentCategory = "analytics" | "marketing" | "functional";

interface ConsentGatedScriptProps {
  src: string;
  category: ConsentCategory;
  /** If set, checks vendors.<vendorId> instead of just the category flag */
  vendorId?: string;
  [key: string]: unknown;
}

export function ConsentGatedScript({
  src,
  category,
  vendorId,
  ...props
}: ConsentGatedScriptProps) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const consent = JSON.parse(stored);

          // If a specific vendorId is provided, check vendors map first
          if (vendorId && consent.vendors) {
            setAllowed(!!consent.vendors[vendorId]);
            return;
          }

          // Fall back to category-level check
          setAllowed(!!consent[category]);
        } catch {
          setAllowed(false);
        }
      }
    };
    check();
    window.addEventListener("consent-updated", check);
    return () => window.removeEventListener("consent-updated", check);
  }, [category, vendorId]);

  if (!allowed) return null;
  return <Script src={src} {...props} />;
}
