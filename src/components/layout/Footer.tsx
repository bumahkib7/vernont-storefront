"use client";

import Link from "next/link";
import { useStoreBranding } from "@/context/StoreConfigContext";

export function Footer() {
  const { storeName } = useStoreBranding();

  return (
    <footer className="border-t border-border">
      <div className="px-6 lg:px-12 py-16 lg:py-24">
        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-16 mb-16 lg:mb-24">
          <div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6">Shop</p>
            <ul className="space-y-3">
              <li><Link href="/fragrances" className="text-sm hover:opacity-50 transition-opacity">All Fragrances</Link></li>
              <li><Link href="/new" className="text-sm hover:opacity-50 transition-opacity">New Arrivals</Link></li>
              <li><Link href="/gifts" className="text-sm hover:opacity-50 transition-opacity">Gifts</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6">About</p>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm hover:opacity-50 transition-opacity">Our Story</Link></li>
              <li><Link href="/stores" className="text-sm hover:opacity-50 transition-opacity">Stores</Link></li>
              <li><Link href="/sustainability" className="text-sm hover:opacity-50 transition-opacity">Sustainability</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6">Help</p>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm hover:opacity-50 transition-opacity">Contact</Link></li>
              <li><Link href="/shipping" className="text-sm hover:opacity-50 transition-opacity">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="text-sm hover:opacity-50 transition-opacity">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6">Legal</p>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm hover:opacity-50 transition-opacity">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm hover:opacity-50 transition-opacity">Terms</Link></li>
              <li><Link href="/cookies" className="text-sm hover:opacity-50 transition-opacity">Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-8 border-t border-border">
          <span className="text-xl tracking-[0.2em] uppercase">
            {storeName || "Vernont"}
          </span>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
