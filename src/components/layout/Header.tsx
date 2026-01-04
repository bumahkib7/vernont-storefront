"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, Search, ShoppingBag, User, X, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { FragranceQuiz } from "@/components/ui/FragranceQuiz";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const navigation = [
  { name: "Collections", href: "/collections" },
  { name: "Fragrances", href: "/fragrances" },
  { name: "For Her", href: "/for-her" },
  { name: "For Him", href: "/for-him" },
  { name: "Gifts", href: "/gifts" },
  { name: "Our Story", href: "/about" },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

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
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-md shadow-sm"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}>
        {/* Animated Announcement Bar */}
        <AnnouncementBar />

        {/* Main Header */}
        <div className="border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-6 mt-10">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="text-lg font-display tracking-wide hover:text-gold transition-colors"
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <button
                        onClick={() => setIsQuizOpen(true)}
                        className="flex items-center gap-2 text-lg font-display tracking-wide text-gold"
                      >
                        <Sparkles className="h-5 w-5" />
                        Find Your Scent
                      </button>
                    </motion.div>
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link href="/" className="flex-1 lg:flex-none group">
                <motion.h1
                  className="font-display text-2xl md:text-3xl tracking-[0.3em] uppercase text-center lg:text-left"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Vernont
                </motion.h1>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-serif tracking-wider uppercase hover:text-gold transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="flex items-center gap-2 text-sm font-serif tracking-wider uppercase text-gold hover:text-gold/80 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Quiz
                </button>
              </nav>

              {/* Right Icons */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Currency Selector - Desktop only */}
                <div className="hidden md:block">
                  <CurrencySelector />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="hover:text-gold transition-colors"
                >
                  {isSearchOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span className="sr-only">Search</span>
                </Button>

                <Link href="/wishlist">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hidden sm:flex hover:text-gold transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <AnimatePresence>
                      {wishlistCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-xs text-white rounded-full flex items-center justify-center"
                        >
                          {wishlistCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <span className="sr-only">Wishlist</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex hover:text-gold transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:text-gold transition-colors"
                  onClick={openCart}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-xs text-primary rounded-full flex items-center justify-center font-semibold"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">Cart</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border overflow-hidden"
              >
                <div className="container mx-auto px-4 py-4">
                  <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search for fragrances, collections..."
                      className="w-full pl-12 pr-4 py-3 bg-secondary border border-border rounded-none font-serif text-base placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Fragrance Quiz Modal */}
      <FragranceQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
}
