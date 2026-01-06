"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import { useStoreBranding, useSocialLinks, usePolicies, useFeature } from "@/context/StoreConfigContext";

// TikTok icon (not in lucide-react)
const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Pinterest icon (not in lucide-react by default)
const PinterestIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.44l1.4-5.96s-.35-.7-.35-1.73c0-1.62.94-2.83 2.1-2.83.99 0 1.47.75 1.47 1.64 0 1-.64 2.5-.97 3.89-.28 1.16.58 2.1 1.72 2.1 2.06 0 3.64-2.17 3.64-5.3 0-2.77-1.99-4.7-4.83-4.7-3.29 0-5.22 2.47-5.22 5.02 0 .99.38 2.06.86 2.64.1.1.1.21.08.32l-.32 1.32c-.05.21-.17.25-.38.15-1.4-.65-2.27-2.68-2.27-4.32 0-3.52 2.56-6.75 7.38-6.75 3.87 0 6.88 2.76 6.88 6.45 0 3.85-2.43 6.95-5.8 6.95-1.13 0-2.2-.59-2.56-1.29l-.7 2.66c-.25.97-.93 2.18-1.38 2.92A12 12 0 1 0 12 0z"/>
  </svg>
);

const footerLinks = {
  shop: [
    { name: "All Fragrances", href: "/fragrances" },
    { name: "For Her", href: "/for-her" },
    { name: "For Him", href: "/for-him" },
    { name: "Gift Sets", href: "/gifts" },
    { name: "New Arrivals", href: "/new" },
  ],
  about: [
    { name: "Our Story", href: "/about" },
    { name: "Craftsmanship", href: "/craftsmanship" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Press", href: "/press" },
    { name: "Careers", href: "/careers" },
  ],
  help: [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "FAQs", href: "/faq" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Store Locator", href: "/stores" },
  ],
};

export function Footer() {
  const { storeName, description } = useStoreBranding();
  const socialLinks = useSocialLinks();
  const policies = usePolicies();
  const newsletterEnabled = useFeature("newsletter_enabled");

  // Build social links array from config
  const socialItems = [
    { name: "Instagram", href: socialLinks?.instagram, Icon: Instagram },
    { name: "Facebook", href: socialLinks?.facebook, Icon: Facebook },
    { name: "Twitter", href: socialLinks?.twitter, Icon: Twitter },
    { name: "TikTok", href: socialLinks?.tiktok, Icon: TikTokIcon },
    { name: "YouTube", href: socialLinks?.youtube, Icon: Youtube },
    { name: "Pinterest", href: socialLinks?.pinterest, Icon: PinterestIcon },
    { name: "LinkedIn", href: socialLinks?.linkedin, Icon: Linkedin },
  ].filter(item => item.href);

  // Build legal links from policies
  const legalLinks = [
    { name: "Privacy", href: policies?.privacy_url || "/privacy" },
    { name: "Terms", href: policies?.terms_url || "/terms" },
    { name: "Cookies", href: "/cookies" },
    { name: "Imprint", href: "/imprint" },
  ];

  return (
    <footer className="bg-[#0D0D0D] text-[#F5F0E1] relative">
      {/* Art Deco Top Border */}
      <div className="absolute top-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="h-px mt-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Art Deco Newsletter Section - Only show if enabled */}
      {newsletterEnabled && (
        <div className="relative border-b border-gold/10">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              {/* Decorative Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-gold/40" />
                <span className="text-gold text-xs">◆◆◆</span>
                <span className="h-px w-12 bg-gold/40" />
              </div>

              <h3 className="font-display text-3xl md:text-4xl tracking-[0.15em] mb-4">
                Join the {storeName} World
              </h3>
              <p className="font-serif text-[#F5F0E1]/70 mb-10 text-lg leading-relaxed">
                Subscribe to receive exclusive offers, early access to new
                collections, and stories from the world of fine fragrance.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  {/* Corner decorations */}
                  <span className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-gold/40" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 border-r border-t border-gold/40" />
                  <span className="absolute -bottom-1 -left-1 w-3 h-3 border-l border-b border-gold/40" />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-gold/40" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 bg-transparent border border-gold/30 text-[#F5F0E1] placeholder:text-[#F5F0E1]/40 font-serif tracking-wide focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gold text-[#0D0D0D] font-display tracking-[0.25em] uppercase text-xs hover:bg-[#F5F0E1] transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Art Deco Links Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-gold text-[8px]">◆◆</span>
                <h2 className="font-display text-2xl tracking-[0.4em] uppercase">
                  {storeName}
                </h2>
                <span className="text-gold text-[8px]">◆◆</span>
              </div>
            </Link>
            <p className="font-serif text-sm text-[#F5F0E1]/60 leading-relaxed mb-8">
              {description || "Crafting exquisite fragrances that capture moments, evoke emotions, and define elegance."}
            </p>

            {/* Art Deco Social Icons - Dynamic */}
            {socialItems.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="h-px w-6 bg-gold/30" />
                {socialItems.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-gold/30 flex items-center justify-center hover:border-gold hover:text-gold transition-all"
                    aria-label={name}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Shop Links */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 bg-gold rotate-45" />
              <h4 className="font-display text-xs tracking-[0.3em] uppercase text-gold">
                Shop
              </h4>
            </div>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-[#F5F0E1]/60 hover:text-gold transition-colors inline-block relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 bg-gold rotate-45" />
              <h4 className="font-display text-xs tracking-[0.3em] uppercase text-gold">
                About
              </h4>
            </div>
            <ul className="space-y-4">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-[#F5F0E1]/60 hover:text-gold transition-colors inline-block relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 bg-gold rotate-45" />
              <h4 className="font-display text-xs tracking-[0.3em] uppercase text-gold">
                Help
              </h4>
            </div>
            <ul className="space-y-4">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-[#F5F0E1]/60 hover:text-gold transition-colors inline-block relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Art Deco Divider */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/20" />
          <span className="text-gold/40 text-[10px]">◆</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/20" />
        </div>
      </div>

      {/* Art Deco Bottom Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#F5F0E1]/40">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-2">
            {legalLinks.map((link, index) => (
              <span key={link.name} className="flex items-center">
                <Link
                  href={link.href}
                  className="font-display text-[10px] tracking-[0.15em] uppercase text-[#F5F0E1]/40 hover:text-gold transition-colors px-3"
                >
                  {link.name}
                </Link>
                {index < legalLinks.length - 1 && <span className="text-gold/30 text-[8px]">◆</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>
    </footer>
  );
}
