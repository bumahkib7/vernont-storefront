import type { Metadata } from "next";
import { Manrope } from "next/font/google";
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
          {children}
          <CartDrawer />
          <CompareDrawer />
          <CompareBar />
          <BackToTop />
          <ShoppingAssistant />
          <Toaster position="bottom-right" richColors />
        </Providers>
        {/* Google Analytics 4 — only injects the gtag script + page view
            handler when NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time.
            The @next/third-parties helper loads the script with
            strategy=afterInteractive and auto-tracks App Router navigation
            via the Next.js router, so SPA page views are captured without
            any manual wiring. */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
