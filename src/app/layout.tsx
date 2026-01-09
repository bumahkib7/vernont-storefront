import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import { BackToTop } from "@/components/ui/BackToTop";

const garamond = EB_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Vernont",
  description: "Fragrance, distilled to its essence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${garamond.variable} ${inter.variable}`}>
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
