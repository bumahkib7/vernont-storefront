import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-4">
              Join the Vernont World
            </h3>
            <p className="font-serif text-primary-foreground/80 mb-8">
              Subscribe to receive exclusive offers, early access to new
              collections, and stories from the world of fine fragrance.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-transparent border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 font-serif focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gold text-primary font-display tracking-widest uppercase text-sm hover:bg-gold/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <h2 className="font-display text-2xl tracking-[0.3em] uppercase mb-6">
                Vernont
              </h2>
            </Link>
            <p className="font-serif text-sm text-primary-foreground/70 leading-relaxed mb-6">
              Crafting exquisite fragrances that capture moments, evoke emotions,
              and define elegance since 2024.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-sm tracking-widest uppercase mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-display text-sm tracking-widest uppercase mb-6">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display text-sm tracking-widest uppercase mb-6">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-serif text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-primary-foreground/10" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-serif text-xs text-primary-foreground/50">
            &copy; {new Date().getFullYear()} Vernont. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="font-serif text-xs text-primary-foreground/50 hover:text-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-serif text-xs text-primary-foreground/50 hover:text-gold transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="font-serif text-xs text-primary-foreground/50 hover:text-gold transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
