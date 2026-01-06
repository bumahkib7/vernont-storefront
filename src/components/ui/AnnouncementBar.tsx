"use client";

import { useState, useEffect } from "react";
import { X, Truck, Gift, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  { icon: Truck, text: "Free UK Delivery on orders over £75" },
  { icon: Gift, text: "Complimentary gift wrapping on all orders" },
  { icon: Sparkles, text: "Free samples with every purchase" },
];

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const CurrentIcon = announcements[currentIndex].icon;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-[#0D0D0D] text-gold relative overflow-hidden"
    >
      {/* Art Deco decorative borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          {/* Left ornament */}
          <span className="hidden sm:flex items-center gap-2 mr-6">
            <span className="h-px w-8 bg-gold/40" />
            <span className="w-1 h-1 bg-gold rotate-45" />
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <CurrentIcon className="h-4 w-4" />
              <span className="font-display text-xs tracking-[0.2em] uppercase">
                {announcements[currentIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Right ornament */}
          <span className="hidden sm:flex items-center gap-2 ml-6">
            <span className="w-1 h-1 bg-gold rotate-45" />
            <span className="h-px w-8 bg-gold/40" />
          </span>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity text-gold/60 hover:text-gold"
          aria-label="Close announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Art Deco Progress diamonds */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-2">
        {announcements.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rotate-45 transition-all duration-300 ${
              i === currentIndex ? "bg-gold scale-110" : "bg-gold/30"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
