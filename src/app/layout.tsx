import type { Metadata } from "next";
import { Suspense } from "react";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { CompareDrawer } from "@/components/ui/CompareDrawer";
import { CompareBar } from "@/components/ui/CompareBar";
import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import { BackToTop } from "@/components/ui/BackToTop";
import { ShoppingAssistant } from "@/components/ai/shopping-assistant";
import { Toaster } from "sonner";
import { content } from "@/config/vertical";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/ProductJsonLd";
import { PostHogPageView } from "@/providers/PostHogProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { ConsentGatedScript } from "@/components/ui/ConsentGatedScript";

// GA4 measurement ID (format: G-XXXXXXXXXX). Read at build time from the
// environment so local dev / preview deploys don't pollute production
// analytics. If the env var is unset we simply don't inject the GA script.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-manrope",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

const { siteMetadata } = content;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteMetadata.titleDefault,
    template: siteMetadata.titleTemplate,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: "Vernont" }],
  creator: "Vernont",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Vernont",
    title: siteMetadata.titleDefault,
    description: siteMetadata.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.titleDefault,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager — gated on analytics consent via ConsentGatedScript */}
        {/* Pinterest domain verification */}
        <meta name="p:domain_verify" content="86f00dd301eb1410f0605a138f895bef"/>
        {/* Resource hints to reduce DNS lookup and connection time */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://eu-assets.i.posthog.com" />
        <link rel="dns-prefetch" href="https://eu.i.posthog.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdn.vernont.com" />
        {/* Klaviyo tracking — gated on marketing consent via ConsentGatedScript */}
      </head>
      <body className={manrope.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:text-[#1A1A1A] focus:border focus:border-[#1A1A1A] focus:rounded">
          Skip to main content
        </a>
        {/* GTM noscript fallback removed — GTM is now consent-gated */}
        <OrganizationJsonLd
          name="Vernont"
          url={siteUrl}
          logo={`${siteUrl}/favicon.svg`}
          description={siteMetadata.description}
        />
        <WebsiteJsonLd
          name="Vernont"
          url={siteUrl}
          searchUrl={`${siteUrl}/eyewear`}
        />
        <Providers>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
          <CartDrawer />
          <CompareDrawer />
          <CompareBar />
          <BackToTop />
          <NewsletterPopup />
          <ShoppingAssistant />
          <Toaster position="bottom-right" richColors />
        </Providers>
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
        {/* Google Consent Mode v2 — declare defaults BEFORE GA4 loads so the
            tag arrives in denied state. The cookie consent banner flips
            analytics_storage to 'granted' on Accept all. wait_for_update
            gives the banner a 500ms window to update consent before GA
            fires its first hit, preventing a denied-then-granted flicker.
            Using afterInteractive instead of beforeInteractive to avoid
            render blocking while still loading before GA4. */}
        <Script id="gtag-consent-default" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});`}
        </Script>
        {/* Google Analytics 4 — only injects the gtag script + page view
            handler when NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time.
            The @next/third-parties helper loads the script with
            strategy=afterInteractive and auto-tracks App Router navigation
            via the Next.js router, so SPA page views are captured without
            any manual wiring. */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
        {/* Klaviyo — only loads when marketing consent is granted */}
        <ConsentGatedScript
          src="https://static.klaviyo.com/onsite/js/WTXx5d/klaviyo.js?company_id=WTXx5d"
          category="marketing"
          vendorId="klaviyo"
          strategy="lazyOnload"
        />
        {/* GTM — only loads when analytics consent is granted */}
        <ConsentGatedScript
          src="https://www.googletagmanager.com/gtm.js?id=GTM-N5T9JHV2"
          category="analytics"
          vendorId="gtm"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
