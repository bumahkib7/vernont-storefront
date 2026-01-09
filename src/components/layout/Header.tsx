"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useStoreBranding } from "@/context/StoreConfigContext";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { storeName } = useStoreBranding();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md">
        <nav className="flex items-center justify-between h-16 px-6 lg:px-12">
          {/* Left: Menu */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-24 flex items-center gap-2 text-sm tracking-wide hover:opacity-50 transition-opacity"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="text-xl tracking-[0.2em] uppercase">
              {storeName || "Vernont"}
            </span>
          </Link>

          {/* Right: Icons */}
          <div className="w-24 flex items-center justify-end gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-50 transition-opacity"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={openCart}
              className="relative hover:opacity-50 transition-opacity"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-foreground text-background text-[10px] flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* Full Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="h-full flex flex-col">
              {/* Menu Header */}
              <div className="flex items-center justify-between h-16 px-6 lg:px-12">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-24 flex items-center gap-2 text-sm tracking-wide hover:opacity-50 transition-opacity"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
                <Link href="/" onClick={() => setMenuOpen(false)} className="absolute left-1/2 -translate-x-1/2">
                  <span className="text-xl tracking-[0.2em] uppercase">
                    {storeName || "Vernont"}
                  </span>
                </Link>
                <div className="w-24" />
              </div>

              {/* Menu Content */}
              <div className="flex-1 flex items-center justify-center">
                <nav className="text-center space-y-8">
                  {[
                    { name: "Shop", href: "/fragrances" },
                    { name: "Collections", href: "/collections" },
                    { name: "About", href: "/about" },
                    { name: "Stores", href: "/stores" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block text-4xl sm:text-5xl lg:text-6xl tracking-wide hover:opacity-50 transition-opacity"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Menu Footer */}
              <div className="px-6 lg:px-12 py-8 border-t border-border">
                <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex gap-6">
                    <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-foreground transition-colors">
                      Contact
                    </Link>
                    <Link href="/faq" onClick={() => setMenuOpen(false)} className="hover:text-foreground transition-colors">
                      FAQ
                    </Link>
                    <Link href="/shipping" onClick={() => setMenuOpen(false)} className="hover:text-foreground transition-colors">
                      Shipping
                    </Link>
                  </div>
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="hover:text-foreground transition-colors">
                    Account
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center h-16 px-6 lg:px-12 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground mr-4" />
                <input
                  type="text"
                  placeholder="Search"
                  autoFocus
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="ml-4 hover:opacity-50 transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Start typing to search</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
