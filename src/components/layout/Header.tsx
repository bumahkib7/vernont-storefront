"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Heart, Menu, X, ChevronLeft, ChevronRight, User, Loader2, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useStoreBranding } from "@/context/StoreConfigContext";
import { useNavigation } from "@/context/NavigationContext";
import { productsApi, type Product } from "@/lib/api";
import { product as productConfig } from "@/config/vertical";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { storeName } = useStoreBranding();
  const { mainNav } = useNavigation();

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await productsApi.search(searchQuery, 5);
        setSearchResults(response.products);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleProductClick = (handle: string) => {
    router.push(`/product/${handle}`);
    setShowResults(false);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  useEffect(() => {
    return () => { if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current); };
  }, []);

  return (
    <>
      {/* === Row 1: Promo banner with arrows — SGH style === */}
      <div className="bg-[#F5F5F5] border-b border-[#E5E5E5]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 py-2">
          <button className="p-1 text-[#1A1A1A] hover:opacity-60" aria-label="Previous promo">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#1A1A1A] tracking-wide">
            30% off second pair. Applied at checkout on full priced styles | T&Cs apply
          </p>
          <button className="p-1 text-[#1A1A1A] hover:opacity-60" aria-label="Next promo">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* === Row 2: Utility links — SGH style === */}
      <div className="hidden lg:block bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-end gap-6 px-4 py-1.5">
          {[
            { label: "Get support", href: "/contact" },
            { label: "Order status", href: "/account/orders" },
            { label: "Our services", href: "/faq" },
            { label: "UK", href: "#" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] text-[#1A1A1A] hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* === Row 3: Main header — logo left, nav center, icons right === */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[60px] px-4 lg:px-6">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4 min-w-[180px]">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1A1A1A]" />
              <span className="text-base font-normal tracking-wide" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {storeName?.toLowerCase() || "vernont"}
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav — SGH style uppercase, spaced */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-[13px] font-medium uppercase tracking-[0.12em] text-[#1A1A1A] hover:opacity-60 transition-opacity whitespace-nowrap"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {item.label}
                </Link>

                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.label && item.dropdownItems && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 mt-0 w-52 bg-white border border-[#E5E5E5] shadow-lg z-50"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="py-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block px-5 py-2.5 text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right: Icons only — SGH style */}
          <div className="flex items-center gap-4 min-w-[180px] justify-end">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1 hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-1 hover:opacity-60 transition-opacity hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A1A1A] text-white text-[9px] font-medium flex items-center justify-center rounded-full">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="p-1 hover:opacity-60 transition-opacity hidden sm:block"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Bag */}
            <button
              onClick={openCart}
              className="relative p-1 hover:opacity-60 transition-opacity"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1A1A1A] text-white text-[9px] font-medium flex items-center justify-center rounded-full">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* === Mobile Menu === */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-14 px-4 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
                    <span className="text-sm tracking-wide" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {storeName?.toLowerCase() || "vernont"}
                    </span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1" aria-label="Close menu">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {mainNav.map((item) => (
                    <div key={item.label} className="border-b border-[#F0F0F0]">
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-5 py-4 text-[13px] font-medium uppercase tracking-[0.12em] hover:bg-[#F5F5F5]"
                      >
                        {item.label}
                      </Link>
                      {item.dropdownItems && (
                        <div className="bg-[#FAFAFA]">
                          {item.dropdownItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-8 py-3 text-[12px] text-[#666] hover:text-[#1A1A1A] hover:bg-[#F0F0F0]"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E5E5E5] p-4 space-y-3 text-[12px] text-[#666]">
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#1A1A1A]">Get support</Link>
                  <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#1A1A1A]">Order status</Link>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block hover:text-[#1A1A1A]">My Account</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* === Search Overlay — full screen === */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="flex flex-col h-full">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center h-14 px-4 border-b border-[#E5E5E5] gap-3"
              >
                <Search className="w-5 h-5 text-[#999]" />
                <input
                  type="text"
                  placeholder={productConfig.searchPlaceholder}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-[#999]"
                />
                {searchLoading && <Loader2 className="w-5 h-5 animate-spin text-[#999]" />}
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              <div className="flex-1 overflow-y-auto p-4" ref={searchRef}>
                {searchQuery.length >= 2 ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-xs text-[#999] mb-4">{searchResults.length} results</p>
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.handle || product.id)}
                          className="flex items-center gap-3 w-full p-3 text-left hover:bg-[#F5F5F5] transition-colors"
                        >
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt="" className="w-12 h-12 object-contain" />
                          ) : (
                            <div className="w-12 h-12 bg-[#F5F5F5] flex items-center justify-center text-[10px] text-[#999]">No img</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{product.title}</p>
                            {product.brand && <p className="text-xs text-[#999]">{product.brand}</p>}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : !searchLoading ? (
                    <div className="text-center text-[#999] mt-12 text-sm">No results found</div>
                  ) : (
                    <div className="text-center text-[#999] mt-12 text-sm">Searching...</div>
                  )
                ) : (
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-[#999] mb-3">Popular Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {productConfig.popularSearches.slice(0, 5).map((term) => (
                        <button key={term} onClick={() => setSearchQuery(term)} className="px-4 py-2 bg-[#F5F5F5] text-sm hover:bg-[#E5E5E5] transition-colors">
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
