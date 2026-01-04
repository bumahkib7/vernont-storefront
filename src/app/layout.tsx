import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import { BackToTop } from "@/components/ui/BackToTop";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vernont | Luxury Perfumes",
  description: "Discover exquisite fragrances that define elegance. Vernont - Where luxury meets artistry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${crimson.variable} antialiased`}
      >
        <Providers>
          {children}
          <CartDrawer />
          <NewsletterPopup />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
