"use client";

import Link from "next/link";
import { useState } from "react";
import { useStoreBranding } from "@/context/StoreConfigContext";
import { useNavigation } from "@/context/NavigationContext";
import { Check, Truck, RotateCcw, Shield, Mail, Instagram, Facebook, Twitter } from "lucide-react";

// Static links that don't come from API
const HELP_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Track Order", href: "/track" },
  { label: "Size Guide", href: "/size-guide" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Affiliate Program", href: "/affiliates" },
];

const TRUST_FEATURES = [
  { icon: Check, label: "100% Authentic" },
  { icon: Truck, label: "Free shipping £75+" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: Shield, label: "Secure checkout" },
];

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
    <footer className="bg-[var(--foreground)] text-white">
      {/* Trust Band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_FEATURES.map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 text-sm">
                <feature.icon className="h-4 w-4 text-[var(--success)]" />
                <span className="text-white/90">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Newsletter Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span
                className="text-2xl font-normal tracking-[0.2em]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {(storeName || "Vernont").toUpperCase()}
              </span>
            </Link>
            <p className="text-white/70 text-sm mb-4 max-w-xs">
              2,400+ authentic fragrances from 180+ brands. Free samples with every order.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="font-semibold mb-2">Get 10% off your first order</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-[var(--success)]">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Thanks! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-md hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links - Dynamic from API */}
          <div>
            <p className="font-semibold mb-4">Shop</p>
            <ul className="space-y-2">
              {footerShopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands Links - Dynamic from API */}
          <div>
            <p className="font-semibold mb-4">Brands</p>
            <ul className="space-y-2">
              {footerBrandLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <p className="font-semibold mb-4">Help</p>
            <ul className="space-y-2">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <p className="font-semibold mb-4">Company</p>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-white/60">
              <span>© {new Date().getFullYear()} {storeName || "Vernont"}. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 mr-2">Pay securely with</span>
              <div className="flex gap-1">
                {["Visa", "MC", "Amex", "PayPal", "Klarna"].map((method) => (
                  <div
                    key={method}
                    className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium text-white/70"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
