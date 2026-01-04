"use client";

import { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, currencySymbols } from "@/context/CartContext";

const currencies = [
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
];

export function CurrencySelector() {
  const { currency, setCurrency } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies.find((c) => c.code === currency);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-serif text-sm hover:text-gold transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{currentCurrency?.flag}</span>
        <span>{currencySymbols[currency]}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-xl z-50"
            >
              <div className="py-2">
                <p className="px-4 py-2 font-display text-xs tracking-wider uppercase text-muted-foreground border-b border-border">
                  Select Currency
                </p>
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 font-serif text-sm hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span>{curr.flag}</span>
                      <span>{curr.code}</span>
                      <span className="text-muted-foreground text-xs">{currencySymbols[curr.code]}</span>
                    </div>
                    {currency === curr.code && (
                      <Check className="h-4 w-4 text-gold" />
                    )}
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 bg-secondary/50 border-t border-border">
                <p className="font-serif text-xs text-muted-foreground">
                  Prices shown in your selected currency. Payment in GBP.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
