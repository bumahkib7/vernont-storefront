"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, Search, ShoppingBag, User, X, Heart, Sparkles, LogOut, Package, MapPin, ChevronDown, Diamond } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { FragranceQuiz } from "@/components/ui/FragranceQuiz";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreBranding, useFeature } from "@/context/StoreConfigContext";

const navigation = [
  { name: "Collections", href: "/collections" },
  { name: "Fragrances", href: "/fragrances" },
  { name: "For Her", href: "/for-her" },
  { name: "For Him", href: "/for-him" },
  { name: "Gifts", href: "/gifts" },
  { name: "Our Story", href: "/about" },
];

// Art Deco Diamond Separator
const DecoDiamond = () => (
  <span className="text-gold text-[8px] mx-3 opacity-40">◆</span>
);

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { storeName, logoUrl } = useStoreBranding();
  const wishlistEnabled = useFeature("wishlist_enabled");

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-background"
      }`}>
        {/* Animated Announcement Bar */}
        <AnnouncementBar />

        {/* Main Header with Art Deco Styling */}
        <div className="relative border-b border-gold/20">
          {/* Decorative top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-24">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="mr-2 hover:bg-gold/10">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r-gold/20">
                  {/* Art Deco Mobile Menu */}
                  <div className="relative pt-8">
                    {/* Decorative header */}
                    <div className="flex items-center justify-center mb-10">
                      <span className="h-px w-12 bg-gold/40" />
                      <span className="text-gold text-xs mx-4">◆</span>
                      <span className="h-px w-12 bg-gold/40" />
                    </div>

                    <nav className="flex flex-col space-y-1">
                      {navigation.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="block py-4 px-6 text-lg font-display tracking-[0.2em] uppercase hover:bg-gold/5 hover:text-gold transition-all relative group"
                          >
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-gold transition-all duration-300 group-hover:w-4" />
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-6 mt-6 border-t border-gold/20"
                      >
                        <button
                          onClick={() => setIsQuizOpen(true)}
                          className="flex items-center gap-3 py-4 px-6 text-lg font-display tracking-[0.2em] uppercase text-gold hover:bg-gold/5 transition-all w-full"
                        >
                          <Sparkles className="h-5 w-5" />
                          Find Your Scent
                        </button>
                      </motion.div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Art Deco Logo */}
              <Link href="/" className="flex-1 lg:flex-none group relative">
                <motion.div
                  className="flex items-center justify-center lg:justify-start"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Logo ornament left */}
                  <span className="hidden md:block text-gold text-[10px] mr-3 opacity-60 group-hover:opacity-100 transition-opacity">◆◆</span>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={storeName}
                      className="h-8 md:h-10 w-auto object-contain"
                    />
                  ) : (
                    <h1 className="font-display text-2xl md:text-3xl tracking-[0.4em] uppercase">
                      {storeName}
                    </h1>
                  )}
                  {/* Logo ornament right */}
                  <span className="hidden md:block text-gold text-[10px] ml-3 opacity-60 group-hover:opacity-100 transition-opacity">◆◆</span>
                </motion.div>
                {/* Decorative underline */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="h-px w-8 bg-gold/60" />
                  <span className="w-1 h-1 bg-gold rotate-45" />
                  <span className="h-px w-8 bg-gold/60" />
                </motion.div>
              </Link>

              {/* Art Deco Desktop Navigation */}
              <nav className="hidden lg:flex items-center flex-1 justify-center">
                <div className="flex items-center">
                  {navigation.map((item, index) => (
                    <div key={item.name} className="flex items-center">
                      <Link
                        href={item.href}
                        className="deco-nav-item text-xs font-display tracking-[0.2em] uppercase hover:text-gold transition-colors px-1"
                      >
                        {item.name}
                      </Link>
                      {index < navigation.length - 1 && <DecoDiamond />}
                    </div>
                  ))}
                  <DecoDiamond />
                  <button
                    onClick={() => setIsQuizOpen(true)}
                    className="flex items-center gap-2 text-xs font-display tracking-[0.2em] uppercase text-gold hover:text-rose-gold transition-colors deco-nav-item px-1"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Quiz
                  </button>
                </div>
              </nav>

              {/* Art Deco Right Icons */}
              <div className="flex items-center space-x-1 md:space-x-3">
                {/* Currency Selector - Desktop only */}
                <div className="hidden md:block">
                  <CurrencySelector />
                </div>

                {/* Art Deco Icon Buttons */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="relative w-10 h-10 flex items-center justify-center hover:text-gold transition-all group"
                >
                  <span className="absolute inset-0 border border-transparent group-hover:border-gold/30 transition-colors" />
                  {isSearchOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="sr-only">Search</span>
                </button>

                {wishlistEnabled && (
                  <Link href="/wishlist" className="hidden sm:block">
                    <button className="relative w-10 h-10 flex items-center justify-center hover:text-gold transition-all group">
                      <span className="absolute inset-0 border border-transparent group-hover:border-gold/30 transition-colors" />
                      <Heart className="h-4 w-4" />
                      <AnimatePresence>
                        {wishlistCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-gold text-[10px] text-white flex items-center justify-center font-display"
                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                          >
                            {wishlistCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span className="sr-only">Wishlist</span>
                    </button>
                  </Link>
                )}

                {/* Art Deco User Menu */}
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  {authLoading ? (
                    <div className="w-10 h-10 flex items-center justify-center">
                      <div className="h-4 w-4 animate-pulse bg-gold/20" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                    </div>
                  ) : isAuthenticated ? (
                    <>
                      <button
                        className="relative w-10 h-10 flex items-center justify-center hover:text-gold transition-all group"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      >
                        <span className="absolute inset-1 border border-gold/40 group-hover:border-gold transition-colors" />
                        <span className="font-display text-sm text-gold">
                          {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </button>

                      {/* Art Deco Dropdown Menu */}
                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-3 w-60 bg-card border border-gold/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)] z-50"
                          >
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

                            {/* User Info */}
                            <div className="px-5 py-4 border-b border-gold/10">
                              <p className="font-display text-sm tracking-[0.1em] uppercase">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="font-serif text-xs text-muted-foreground truncate mt-1">
                                {user?.email}
                              </p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                              <Link
                                href="/account"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 font-display text-xs tracking-wider uppercase hover:bg-gold/5 hover:text-gold transition-all group"
                              >
                                <User className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                                My Account
                              </Link>
                              <Link
                                href="/account/orders"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 font-display text-xs tracking-wider uppercase hover:bg-gold/5 hover:text-gold transition-all group"
                              >
                                <Package className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                                Orders
                              </Link>
                              <Link
                                href="/account/addresses"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 font-display text-xs tracking-wider uppercase hover:bg-gold/5 hover:text-gold transition-all group"
                              >
                                <MapPin className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                                Addresses
                              </Link>
                              <Link
                                href="/wishlist"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 font-display text-xs tracking-wider uppercase hover:bg-gold/5 hover:text-gold transition-all group"
                              >
                                <Heart className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                                Wishlist
                              </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gold/10 py-2">
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-5 py-3 w-full font-display text-xs tracking-wider uppercase text-rose-gold hover:bg-rose-gold/5 transition-all group"
                              >
                                <LogOut className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                                Sign Out
                              </button>
                            </div>

                            {/* Decorative bottom border */}
                            <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link href="/login">
                      <button className="relative w-10 h-10 flex items-center justify-center hover:text-gold transition-all group">
                        <span className="absolute inset-0 border border-transparent group-hover:border-gold/30 transition-colors" />
                        <User className="h-4 w-4" />
                        <span className="sr-only">Sign In</span>
                      </button>
                    </Link>
                  )}
                </div>

                {/* Art Deco Cart Button */}
                <button
                  className="relative w-10 h-10 flex items-center justify-center hover:text-gold transition-all group"
                  onClick={openCart}
                >
                  <span className="absolute inset-0 border border-transparent group-hover:border-gold/30 transition-colors" />
                  <ShoppingBag className="h-4 w-4" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gold text-[10px] text-primary flex items-center justify-center font-display font-bold"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Overlay - Full screen search */}
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          {/* Decorative bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </div>
      </header>

      {/* Fragrance Quiz Modal */}
      <FragranceQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
