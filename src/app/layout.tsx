import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { CompareDrawer } from "@/components/ui/CompareDrawer";
import { CompareBar } from "@/components/ui/CompareBar";
// Newsletter popup disabled - using inline newsletter section instead
// import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import { BackToTop } from "@/components/ui/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vernont.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vernont | Designer & Niche Fragrances",
    template: "%s | Vernont",
  },
  description: "Shop 2,400+ authentic fragrances from 180+ brands. Free shipping over £75, 30-day returns, and free samples with every order.",
  keywords: ["fragrances", "perfume", "cologne", "designer fragrances", "niche perfumes", "luxury scents"],
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
    title: "Vernont | Designer & Niche Fragrances",
    description: "Shop 2,400+ authentic fragrances from 180+ brands. Free shipping over £75, 30-day returns, and free samples with every order.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vernont | Designer & Niche Fragrances",
    description: "Shop 2,400+ authentic fragrances from 180+ brands. Free shipping over £75.",
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
      <body className={inter.className}>
        <Providers>
          {children}
          <CartDrawer />
          <CompareDrawer />
          <CompareBar />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
