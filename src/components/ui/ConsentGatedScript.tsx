"use client";

// Renders a <Script> tag only when the user has granted consent for the
// given category. Listens for "consent-updated" custom events so it
// reacts instantly when the user changes their preferences.
import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "vernont-consent";

type ConsentCategory = "analytics" | "marketing" | "functional";

export function ConsentGatedScript({
  src,
  category,
  ...props
}: {
  src: string;
  category: ConsentCategory;
} & Record<string, unknown>) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const consent = JSON.parse(stored);
          setAllowed(!!consent[category]);
        } catch {
          setAllowed(false);
        }
      }
    };
    check();
    window.addEventListener("consent-updated", check);
    return () => window.removeEventListener("consent-updated", check);
  }, [category]);

  if (!allowed) return null;
  return <Script src={src} {...props} />;
}
