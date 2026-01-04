"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 text-center">
          <p className="text-xs tracking-widest uppercase font-serif">
            Complimentary shipping on orders over $150 | Free gift wrapping
          </p>
        </div>
      </div>

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
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-display tracking-wide hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex-1 lg:flex-none">
              <h1 className="font-display text-2xl md:text-3xl tracking-[0.3em] uppercase text-center lg:text-left">
                Vernont
              </h1>
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
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
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
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-xs text-primary-foreground rounded-full flex items-center justify-center">
                  0
                </span>
                <span className="sr-only">Cart</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-border py-4 animate-fade-in">
            <div className="container mx-auto px-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search for fragrances, collections..."
                  className="w-full pl-12 pr-4 py-3 bg-secondary border-none rounded-none font-serif text-base placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
