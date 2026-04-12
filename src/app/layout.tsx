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
// Newsletter popup disabled - using inline newsletter section instead
// import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import { BackToTop } from "@/components/ui/BackToTop";
import { ShoppingAssistant } from "@/components/ai/shopping-assistant";
import { Toaster } from "sonner";
import { content } from "@/config/vertical";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/ProductJsonLd";
import { PostHogPageView } from "@/providers/PostHogProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";

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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", sizes: "32x32" },
    ],
    apple: [
      { url: "/icon-192.svg", sizes: "180x180", type: "image/svg+xml" },
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
        {/* Pinterest domain verification */}
        <meta name="p:domain_verify" content="86f00dd301eb1410f0605a138f895bef"/>
        {/* Resource hints to reduce DNS lookup and connection time */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://eu-assets.i.posthog.com" />
        <link rel="dns-prefetch" href="https://eu.i.posthog.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdn.vernont.com" />
        {/* Klaviyo tracking */}
        <script async type='text/javascript' src='https://static.klaviyo.com/onsite/js/WTXx5d/klaviyo.js?company_id=WTXx5d'></script>
      </head>
      <body className={manrope.className}>
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
          <ShoppingAssistant />
          <Toaster position="bottom-right" richColors />
        </Providers>
        <CookieConsent />
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
        {/* Klaviyo initialization */}
        <Script id="klaviyo-init" strategy="afterInteractive">
          {`!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`}
        </Script>
      </body>
    </html>
  );
}
