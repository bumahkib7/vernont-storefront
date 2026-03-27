"use client";

import Link from "next/link";
import { useState } from "react";
import { useStoreBranding } from "@/context/StoreConfigContext";
import { useNavigation } from "@/context/NavigationContext";
import { Check, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { content, DEFAULT_HELP_LINKS, DEFAULT_COMPANY_LINKS } from "@/config/vertical";

const HELP_LINKS = DEFAULT_HELP_LINKS;
const COMPANY_LINKS = DEFAULT_COMPANY_LINKS;
const TRUST_FEATURES = content.trustBadges;

export function Footer() {
  const { storeName } = useStoreBranding();
  const { footerShopLinks, footerBrandLinks } = useNavigation();
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
    <footer className="bg-[#1A1A1A] text-white">
      {/* Trust Band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_FEATURES.map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 text-[12px]">
                <feature.icon className="h-4 w-4 text-white/60" />
                <span className="text-white/80">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Newsletter Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <span className="text-base tracking-wide" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {storeName?.toLowerCase() || "vernont"}
              </span>
            </Link>
            <p className="text-white/60 text-[13px] mb-4 max-w-xs leading-relaxed">
              {content.footerDescription}
            </p>

            <div className="mb-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/80 mb-2">Newsletter</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Check className="h-4 w-4" />
                  <span>Thanks! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-[13px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                    required
                  />
                  <button type="submit" className="px-3 py-2 bg-white text-[#1A1A1A] hover:bg-white/90 transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/80 mb-3">Shop</p>
            <ul className="space-y-2">
              {footerShopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/60 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands Links */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/80 mb-3">Brands</p>
            <ul className="space-y-2">
              {footerBrandLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/60 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/80 mb-3">Help</p>
            <ul className="space-y-2">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/60 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/80 mb-3">Company</p>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-white/60 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] text-white/50">
              <span>&copy; {new Date().getFullYear()} {storeName || "Vernont"}. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30 mr-1">Pay securely with</span>
              {["Visa", "MC", "Amex", "Apple Pay", "Google Pay"].map((m) => (
                <div key={m} className="px-2 py-0.5 bg-white/10 text-[9px] font-medium text-white/60">{m}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
