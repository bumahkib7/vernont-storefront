"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, Heart, List, X, CaretLeft, CaretRight, User, SpinnerGap, ShoppingBag } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useStoreBranding } from "@/context/StoreConfigContext";
import { useNavigation } from "@/context/NavigationContext";
import { useBrands } from "@/lib/hooks";
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

  // Brand strip — fetch from backend, show only brands that actually have products.
  // Cached by React Query (see useBrands); stale-while-revalidate keeps it cheap across page nav.
  const { data: brandsData } = useBrands({ limit: 20 }, { staleTime: 5 * 60 * 1000 });
  const brandStripItems = (brandsData?.brands ?? [])
    .filter((b) => b.product_count > 0)
    .sort((a, b) => b.product_count - a.product_count)
    .slice(0, 8);

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
        console.error("MagnifyingGlass error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // MagnifyingGlass results dropdown handling
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
      <div className="flex flex-col w-full border-b border-[#E5E5E5]">
        {/* === Layer 1: Main Utility === */}
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-5 flex items-center justify-between">
          {/* Mobile List & Logo */}
          <div className="flex items-center gap-4 min-w-[200px]">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-1" aria-label="Open menu">
              <List className="w-6 h-6" />
            </button>
            <Link href="/" className="font-bold text-xl lg:text-3xl tracking-[0.35em] text-[#1A1A1A] whitespace-nowrap">
              {storeName?.toUpperCase() || "VERNONT"}
            </Link>
          </div>

          {/* Center: MagnifyingGlass Bar */}
          <div className="hidden lg:flex flex-1 max-w-[550px] mx-8 relative" ref={searchRef}>
             <form onSubmit={handleSearchSubmit} className="w-full relative">
                <input 
                   type="text" 
                   placeholder="Search..." 
                   value={searchQuery}
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setShowResults(true);
                   }}
                   onFocus={() => setShowResults(true)}
                   className="w-full bg-[#f4f4f4] text-sm py-2.5 px-4 outline-none placeholder:text-[#666]"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]" aria-label="Search">
                   {searchLoading ? <SpinnerGap className="w-4 h-4 animate-spin" /> : <MagnifyingGlass className="w-4 h-4" />}
                </button>
             </form>

             {/* MagnifyingGlass Dropdown Desktop */}
             <AnimatePresence>
               {showResults && searchQuery.length >= 2 && (
                 <motion.div 
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 5 }}
                   className="absolute top-full mt-2 left-0 w-full bg-white border border-[#E5E5E5] shadow-lg z-50 max-h-[400px] overflow-y-auto"
                 >
                   {searchResults.length > 0 ? (
                      <div className="p-2">
                        {searchResults.map((product) => (
                           <button
                             key={product.id}
                             onClick={() => handleProductClick(product.handle || product.id)}
                             className="flex items-center gap-3 w-full p-2 text-left hover:bg-[#F5F5F5] transition-colors"
                           >
                             <div className="w-10 h-10 bg-[#F5F5F5]">
                                {product.thumbnail && <img src={product.thumbnail} alt="" className="w-full h-full object-contain" />}
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-xs truncate text-[#1A1A1A]">{product.title}</p>
                               {product.brand && <p className="text-[10px] text-[#999]">{product.brand}</p>}
                             </div>
                           </button>
                        ))}
                      </div>
                   ) : !searchLoading ? (
                      <div className="p-4 text-center text-xs text-[#999]">No results found</div>
                   ) : null}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-5 min-w-[200px] justify-end">
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-1 hover:opacity-60 transition-opacity text-[#1A1A1A]"
              aria-label="Search"
            >
              <MagnifyingGlass className="w-5 h-5" />
            </button>

            <div className="hidden lg:flex items-center text-[13px] font-medium text-[#1A1A1A] cursor-pointer hover:opacity-70 gap-1 border border-[#E5E5E5] rounded-full px-3 py-1">
               GBP £ <CaretRight className="w-3 h-3 rotate-90" />
            </div>

            <Link href="/account" className="p-1 hover:opacity-60 transition-opacity hidden sm:block">
              <User className="w-5 h-5 text-[#1A1A1A]" />
            </Link>

            <button onClick={openCart} className="relative p-1 hover:opacity-60 transition-opacity text-[#1A1A1A]" aria-label={`Shopping cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}`}>
              <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </div>
              <ShoppingBag className="w-5 h-5" />
            </button>

            <Link href="/wishlist" className="p-1 hover:opacity-60 transition-opacity text-[#1A1A1A] hidden sm:block">
              <Heart className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* === Layer 3: Dynamic Navigation === */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-3 pb-4">
          {mainNav.map((item) => (
            <div
              key={item.label}
              className="group relative"
              onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <span className="text-[12px] font-medium text-[#1A1A1A] tracking-wider hover:opacity-60 transition-opacity uppercase">
                  {item.label}
                </span>
                {item.hasDropdown && <CaretRight className="w-3 h-3 rotate-90 text-[#999]" />}
              </Link>

              {/* Dropdown */}
              {item.hasDropdown && item.dropdownItems && activeDropdown === item.label && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-[#E5E5E5] shadow-lg min-w-[220px] py-2 z-50"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.dropdownItems.map((dropItem) => (
                    <Link
                      key={dropItem.href}
                      href={dropItem.href}
                      className="block px-4 py-2.5 text-[13px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
                    >
                      {dropItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="/eyewear?sale=true" className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-2xl text-red-600 italic font-serif leading-none hover:opacity-70 transition-opacity pr-1" style={{ fontFamily: 'Georgia, serif' }}>
              Sale
            </span>
          </Link>

          <Link href="/contact" className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-[12px] font-medium text-[#1A1A1A] tracking-wider hover:opacity-60 transition-opacity uppercase">
              Contact
            </span>
          </Link>
        </nav>

        {/* === Layer 4: Brand Strip === */}
        {/* Hidden entirely until brands load to avoid a flash of an empty black bar. */}
        {brandStripItems.length > 0 && (
          <div className="w-full bg-black py-2.5 overflow-x-auto no-scrollbar">
             <div className="flex items-center justify-center gap-12 lg:gap-16 min-w-max px-6">
                {brandStripItems.map((brand) => (
                   <Link
                      key={brand.id}
                      href={`/eyewear?brand=${encodeURIComponent(brand.slug)}`}
                      className="text-white text-sm lg:text-[15px] font-bold tracking-widest uppercase hover:opacity-70 transition-opacity"
                   >
                      {brand.name}
                   </Link>
                ))}
             </div>
          </div>
        )}

        {/* === Layer 5: Policy === */}
        <div className="w-full bg-white py-3 border-b border-[#E5E5E5]">
           <p className="text-center text-[11px] font-medium text-[#1A1A1A] tracking-wide">
              Owned and Operated by a Qualified Optometrist. You can trust our prescription lens quality. Guaranteed.
           </p>
        </div>
      </div>

      {/* === Mobile List === */}
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

      {/* === MagnifyingGlass Overlay — full screen === */}
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
                <MagnifyingGlass className="w-5 h-5 text-[#999]" />
                <input
                  type="text"
                  placeholder={productConfig.searchPlaceholder}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-[#999]"
                />
                {searchLoading && <SpinnerGap className="w-5 h-5 animate-spin text-[#999]" />}
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                  className="p-1"
                  aria-label="Close search"
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
