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

export const metadata: Metadata = {
  title: "Vernont | Designer & Niche Fragrances",
  description: "Shop 2,400+ authentic fragrances from 180+ brands. Free shipping over \u00a375, 30-day returns, and free samples with every order.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
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
