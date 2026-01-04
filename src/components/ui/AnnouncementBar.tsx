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
      className="bg-gold text-primary relative overflow-hidden"
    >
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <CurrentIcon className="h-4 w-4" />
              <span className="font-serif text-sm tracking-wide">
                {announcements[currentIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {announcements.map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-primary w-3" : "bg-primary/40"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
