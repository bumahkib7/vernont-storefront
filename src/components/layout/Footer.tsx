"use client";

import Link from "next/link";
import { useState } from "react";
import { useStoreBranding } from "@/context/StoreConfigContext";
import { useNavigation } from "@/context/NavigationContext";
import {
  InstagramLogo,
  FacebookLogo,
  XLogo,
  PinterestLogo,
  YoutubeLogo,
  LinkedinLogo
} from "@phosphor-icons/react";
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
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
            <form onSubmit={handleSubscribe} className="flex w-full bg-white max-w-[600px] mx-auto shadow-sm">
              <input 
                type="email" 
                placeholder="Enter your email to register" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 py-3 px-4 outline-none text-[13px] bg-transparent placeholder:text-[#999]" 
              />
              <button 
                type="submit" 
                className="bg-[#e5e5e5] text-[#999] px-6 text-[11px] hover:bg-[#d5d5d5] hover:text-[#1A1A1A] font-bold tracking-[0.1em] transition-colors"
              >
                SUBMIT
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main White Links Section */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
          
          {/* Trust Widgets Col */}
          <div className="flex flex-col gap-8 lg:pr-8">
            <div className="flex flex-col items-start gap-1">
               <span className="font-bold text-lg text-[#1A1A1A] flex items-center gap-1">
                 <span className="text-[#00b67a] text-xl">★</span> Trustpilot
               </span>
               <div className="flex text-white bg-[#00b67a] px-2 py-0.5 gap-1 text-sm tracking-widest my-1">
                  ★★★★★
               </div>
               <span className="text-[10px] text-[#666]">
                 TrustScore 4.7 <span className="font-bold underline text-[#1A1A1A]">33,471 reviews</span>
               </span>
            </div>
            
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-[#6c28a0] flex items-center justify-center text-white font-bold text-xl rounded-sm">*</div>
               <div className="flex flex-col">
                  <span className="text-[#6c28a0] font-bold text-[15px] leading-tight">reviewcentre</span>
                  <span className="text-[9px] text-[#6c28a0] italic">honest opinions that matter</span>
               </div>
            </div>

            <div className="flex flex-col items-start">
               <div className="flex items-center gap-1 font-bold text-[15px]">
                  <span className="text-[#1A1A1A] text-xl leading-none">✪</span> REVIEWS.io
               </div>
               <span className="bg-black text-white px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold mt-1">
                  - Trusted Site -
               </span>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/faq" className="hover:text-[#1A1A1A] transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-[#1A1A1A] transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-[#1A1A1A] transition-colors">Returns</Link></li>
              <li><Link href="/vouchers" className="hover:text-[#1A1A1A] transition-colors">Eyecare Vouchers</Link></li>
              <li><Link href="/gift-vouchers" className="hover:text-[#1A1A1A] transition-colors">Gift Vouchers</Link></li>
              <li><Link href="/blog" className="hover:text-[#1A1A1A] transition-colors">Read Our Blog</Link></li>
              <li><Link href="/contact" className="hover:text-[#1A1A1A] transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/shape" className="hover:text-[#1A1A1A] transition-colors">Frame Shape</Link></li>
              <li><Link href="/prescription" className="hover:text-[#1A1A1A] transition-colors">Prescription Lenses</Link></li>
              <li><Link href="/ordering" className="hover:text-[#1A1A1A] transition-colors">Ordering Glasses</Link></li>
              <li><Link href="/rx-sunglasses" className="hover:text-[#1A1A1A] transition-colors">Prescription Sunglasses</Link></li>
              <li><Link href="/varifocal" className="hover:text-[#1A1A1A] transition-colors">Varifocal Lenses</Link></li>
              <li><Link href="/blue-light" className="hover:text-[#1A1A1A] transition-colors">Blue Light Protection</Link></li>
              <li><Link href="/zeiss" className="hover:text-[#1A1A1A] transition-colors">ZEISS Lenses</Link></li>
              <li><Link href="/zeiss-blue" className="hover:text-[#1A1A1A] transition-colors">ZEISS BlueGuard</Link></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/measure-pd" className="hover:text-[#1A1A1A] transition-colors">How To Measure PD</Link></li>
              <li><Link href="/reglaze" className="hover:text-[#1A1A1A] transition-colors">Reglaze Lenses</Link></li>
              <li><Link href="/buy-online" className="hover:text-[#1A1A1A] transition-colors">Buy Glasses Online</Link></li>
              <li><Link href="/track" className="hover:text-[#1A1A1A] transition-colors">Track Your Order</Link></li>
              <li><Link href="/transitions" className="hover:text-[#1A1A1A] transition-colors">Transitions Lenses</Link></li>
              <li><Link href="/truoptics" className="hover:text-[#1A1A1A] transition-colors">TruOptics Lenses</Link></li>
            </ul>
          </div>

          {/* Links Col 4 */}
          <div className="relative">
            <ul className="space-y-4 text-[12px] text-[#666]">
              <li><Link href="/crizal" className="hover:text-[#1A1A1A] transition-colors">Crizal Lenses</Link></li>
              <li><Link href="/eyezen" className="hover:text-[#1A1A1A] transition-colors">EyeZen Lenses</Link></li>
              <li><Link href="/essilor" className="hover:text-[#1A1A1A] transition-colors">Essilor Lenses</Link></li>
              <li><Link href="/zeiss-clear" className="hover:text-[#1A1A1A] transition-colors">ZEISS ClearView</Link></li>
              <li><Link href="/zeiss-photo" className="hover:text-[#1A1A1A] transition-colors">ZEISS PhotoFusion X</Link></li>
              <li><Link href="/zeiss-smart" className="hover:text-[#1A1A1A] transition-colors">ZEISS SmartLife Lenses</Link></li>
              <li><Link href="/even-realities" className="hover:text-[#1A1A1A] transition-colors">Even Realities Smart Glasses</Link></li>
            </ul>
            
            {/* Social Icons positioned at bottom right of this column (or grid) */}
            <div className="absolute bottom-0 left-0 flex gap-4 text-[#666] pt-8 lg:pt-0">
               <a href="https://facebook.com" aria-label="Facebook" className="hover:text-[#1A1A1A]"><FacebookLogo weight="fill" className="w-5 h-5" /></a>
               <a href="https://instagram.com" aria-label="Instagram" className="hover:text-[#1A1A1A]"><InstagramLogo className="w-5 h-5" /></a>
               <a href="https://twitter.com" aria-label="X" className="hover:text-[#1A1A1A]"><XLogo className="w-4 h-4 mt-0.5" /></a>
               <a href="https://pinterest.com" aria-label="Pinterest" className="hover:text-[#1A1A1A]"><PinterestLogo weight="fill" className="w-5 h-5" /></a>
               <a href="https://youtube.com" aria-label="YouTube" className="hover:text-[#1A1A1A]"><YoutubeLogo weight="fill" className="w-5 h-5" /></a>
               <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-[#1A1A1A]"><LinkedinLogo weight="fill" className="w-5 h-5" /></a>
            </div>
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

         <div>
            <select className="bg-[#6b8982] text-white text-[12px] px-4 py-2 rounded-full appearance-none pr-8 bg-no-repeat bg-[right_10px_center] cursor-pointer outline-none font-medium hover:bg-[#5a7670] transition-colors"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')" }}
            >
               <option value="GBP">GBP £</option>
               <option value="USD">USD $</option>
               <option value="EUR">EUR €</option>
            </select>
         </div>
      </div>
    </footer>
  );
}
