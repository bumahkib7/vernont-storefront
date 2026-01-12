"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, User, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useStoreBranding } from "@/context/StoreConfigContext";
import { useNavigation } from "@/context/NavigationContext";
import { productsApi, type Product } from "@/lib/api";

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
  const { mainNav, isLoading: navLoading } = useNavigation();

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

  // Close search results when clicking outside
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
    }
  };

  const handleProductClick = (handle: string) => {
    router.push(`/product/${handle}`);
    setShowResults(false);
    setSearchQuery("");
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] text-center py-2 px-4 text-sm">
        <span>Free shipping over £75</span>
        <span className="mx-2">•</span>
        <span>30-day returns</span>
        <span className="mx-2">•</span>
        <span>100% authentic</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[var(--background)] border-b border-[var(--border)]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-[var(--surface)] rounded-md transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span
                className="text-xl font-normal tracking-[0.2em]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {(storeName || "Vernont").toUpperCase()}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNav.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors rounded-md"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.hasDropdown && activeDropdown === item.label && item.dropdownItems && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="py-2">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface)] hover:text-[var(--primary)] transition-colors"
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
            </div>
          </div>

          {/* Right: Search + Icons */}
          <div className="flex items-center gap-2">
            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  className="w-64 pl-10 pr-10 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[var(--muted-foreground)]" />
                )}

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && searchQuery.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      {searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleProductClick(product.handle || product.id)}
                              className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-[var(--surface)] transition-colors"
                            >
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-[var(--surface)] rounded flex items-center justify-center text-xs text-[var(--muted-foreground)]">
                                  No img
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{product.title}</p>
                                {product.brand && (
                                  <p className="text-xs text-[var(--muted-foreground)]">{product.brand}</p>
                                )}
                              </div>
                            </button>
                          ))}
                          <div className="border-t border-[var(--border)] mt-2 pt-2 px-4 pb-2">
                            <button
                              type="submit"
                              className="text-sm text-[var(--primary)] hover:underline"
                            >
                              View all results for "{searchQuery}"
                            </button>
                          </div>
                        </div>
                      ) : !searchLoading ? (
                        <div className="px-4 py-6 text-center text-sm text-[var(--muted-foreground)]">
                          No products found for "{searchQuery}"
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Search Button (Mobile) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--primary)] text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--primary)] text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[var(--background)] shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
                  <span
                    className="text-lg font-normal tracking-[0.2em]"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {(storeName || "Vernont").toUpperCase()}
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto py-4">
                  {mainNav.map((item) => (
                    <div key={item.label} className="mb-2">
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-lg font-medium hover:bg-[var(--surface)] transition-colors"
                      >
                        {item.label}
                      </Link>
                      {item.dropdownItems && (
                        <div className="ml-4 border-l border-[var(--border)]">
                          {item.dropdownItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Menu Footer */}
                <div className="border-t border-[var(--border)] p-4 space-y-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--surface)] rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Help & FAQ
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-[var(--background)]"
          >
            <div className="flex flex-col h-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                className="flex items-center h-16 px-4 border-b border-[var(--border)] gap-3"
              >
                <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search fragrances, brands..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-[var(--muted-foreground)]"
                />
                {searchLoading && (
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--muted-foreground)]" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              <div className="flex-1 overflow-y-auto p-4">
                {searchQuery.length >= 2 ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-[var(--muted-foreground)] mb-4">
                        {searchResults.length} results for "{searchQuery}"
                      </p>
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            router.push(`/product/${product.handle || product.id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className="flex items-center gap-3 w-full p-3 text-left bg-[var(--surface)] rounded-lg hover:bg-[var(--border)] transition-colors"
                        >
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt=""
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-[var(--border)] rounded flex items-center justify-center text-xs text-[var(--muted-foreground)]">
                              No img
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.title}</p>
                            {product.brand && (
                              <p className="text-sm text-[var(--muted-foreground)]">{product.brand}</p>
                            )}
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="w-full py-3 text-center text-[var(--primary)] font-medium hover:underline"
                      >
                        View all results
                      </button>
                    </div>
                  ) : !searchLoading ? (
                    <div className="text-center text-[var(--muted-foreground)] mt-12">
                      No products found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="text-center text-[var(--muted-foreground)] mt-12">
                      Searching...
                    </div>
                  )
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Popular Searches</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Oud", "Rose", "Creed Aventus", "Tom Ford", "Gift Sets"].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-4 py-2 bg-[var(--surface)] rounded-full text-sm hover:bg-[var(--border)] transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
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
