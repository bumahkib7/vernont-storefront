"use client";

import Link from "next/link";
import { useState } from "react";
import { useStoreBranding } from "@/context/StoreConfigContext";
import { useNavigation } from "@/context/NavigationContext";
import { marketingApi } from "@/lib/api";
import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  DiscoverIcon,
  PayPalIcon,
} from "react-svg-credit-card-payment-icons";

export function Footer() {
  const { storeName } = useStoreBranding();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setError("");
    try {
      await marketingApi.publicSubscribe({ email });
      setSubscribed(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="w-full bg-white text-[#1A1A1A]">
      
      {/* Black Trust Bar */}
      <div className="w-full bg-black py-4 grid grid-cols-2 md:grid-cols-4 text-center">
        {['FAST SECURE SHIPPING', '5 STAR REVIEWS', '24/7 SUPPORT', '24 MONTH WARRANTY'].map(t => (
          <span key={t} className="text-[11px] font-bold tracking-[0.15em] text-white py-1">{t}</span>
        ))}
      </div>

      {/* Grey Newsletter Block */}
      <div className="w-full bg-[#f4f4f4] py-16 border-b border-[#E5E5E5]">
        <div className="max-w-[800px] mx-auto text-center px-4">
          <h3 className="text-xl md:text-2xl text-[#1A1A1A] tracking-wide mb-8" style={{ fontFamily: 'Georgia, serif' }}>
            Get Exclusive Offers, News and Entry to our monthly prize draw
          </h3>
          {subscribed ? (
             <div className="text-[#5f9e90] text-sm">Thank you for subscribing!</div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col items-center w-full max-w-[600px] mx-auto">
              <div className="flex w-full bg-white shadow-sm">
                <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email to register"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={subscribing}
                  className="flex-1 py-3 px-4 outline-none text-[13px] bg-transparent placeholder:text-[#999]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-[#e5e5e5] text-[#595959] px-6 text-[11px] hover:bg-[#d5d5d5] hover:text-[#1A1A1A] font-bold tracking-[0.1em] transition-colors disabled:opacity-50"
                >
                  {subscribing ? "SENDING..." : "SUBMIT"}
                </button>
              </div>
              {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            </form>
          )}
        </div>
      </div>

      {/* Main White Links Section — every link here points at a real
          page.tsx route under src/app. Previous footer had ~25 links to
          lens / vouchers / blog routes that didn't exist (404), plus a
          fake trust-badge column claiming 33,471 Trustpilot reviews the
          store doesn't actually have. Both removed.

          Social media icons also removed — they previously pointed at
          facebook.com / instagram.com / twitter.com etc (platform
          homepages, not Vernont's own accounts). Re-add the row with
          real account URLs when the brand launches its socials. */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Shop */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-5">Shop</h3>
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/eyewear" className="hover:text-[#1A1A1A] transition-colors">All Eyewear</Link></li>
              <li><Link href="/new" className="hover:text-[#1A1A1A] transition-colors">New In</Link></li>
              <li><Link href="/pre-owned" className="hover:text-[#1A1A1A] transition-colors">Pre-Owned</Link></li>
              <li><Link href="/brands" className="hover:text-[#1A1A1A] transition-colors">Brands</Link></li>
              <li><Link href="/for-her" className="hover:text-[#1A1A1A] transition-colors">For Her</Link></li>
              <li><Link href="/for-him" className="hover:text-[#1A1A1A] transition-colors">For Him</Link></li>
              <li><Link href="/unisex" className="hover:text-[#1A1A1A] transition-colors">Unisex</Link></li>
              <li><Link href="/gifts" className="hover:text-[#1A1A1A] transition-colors">Gifts</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-5">Help</h3>
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/faq" className="hover:text-[#1A1A1A] transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-[#1A1A1A] transition-colors">Shipping</Link></li>
              <li><Link href="/account/returns" className="hover:text-[#1A1A1A] transition-colors">Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#1A1A1A] transition-colors">Size Guide</Link></li>
              <li><Link href="/try-on" className="hover:text-[#1A1A1A] transition-colors">Virtual Try-On</Link></li>
              <li><Link href="/contact" className="hover:text-[#1A1A1A] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-5">Company</h3>
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/about" className="hover:text-[#1A1A1A] transition-colors">About Us</Link></li>
              <li><Link href="/craftsmanship" className="hover:text-[#1A1A1A] transition-colors">Craftsmanship</Link></li>
              <li><Link href="/sustainability" className="hover:text-[#1A1A1A] transition-colors">Sustainability</Link></li>

              <li><Link href="/press" className="hover:text-[#1A1A1A] transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-5">Legal</h3>
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/terms" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-[#1A1A1A] transition-colors">Return Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-[#1A1A1A] transition-colors">Cookie Policy</Link></li>
              <li><Link href="/imprint" className="hover:text-[#1A1A1A] transition-colors">Imprint</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 md:pt-12 md:pb-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative">
         <div className="text-[11px] text-[#666]">
            &copy; {new Date().getFullYear()} {storeName}
         </div>
         
         {/* Payment method logos — real brand SVGs via react-svg-credit-card-payment-icons.
             Wallet logos (Apple Pay / Google Pay / Shop Pay) are not shown here since
             Stripe's Payment Element surfaces them dynamically at checkout based on
             the shopper's device + available methods. */}
         <div className="flex flex-wrap items-center justify-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <VisaIcon format="logoBorder" width={40} height={28} />
            <MastercardIcon format="logoBorder" width={40} height={28} />
            <AmexIcon format="logoBorder" width={40} height={28} />
            <DiscoverIcon format="logoBorder" width={40} height={28} />
            <PayPalIcon format="logoBorder" width={40} height={28} />
         </div>

         {/* Currency switcher removed — prices are GBP-only.
             Re-add when multi-currency checkout is wired up. */}
      </div>
    </footer>
  );
}
