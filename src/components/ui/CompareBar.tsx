"use client";

import Image from "next/image";
import { X, GitCompare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/context/CompareContext";

export function CompareBar() {
  const { items, removeFromCompare, openDrawer, itemCount } = useCompare();

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[var(--foreground)] text-white rounded-full shadow-xl px-2 py-2 flex items-center gap-3"
      >
        {/* Product thumbnails */}
        <div className="flex items-center -space-x-2 pl-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative w-10 h-10 rounded-full border-2 border-[var(--foreground)] bg-white overflow-hidden"
            >
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] text-[var(--muted-foreground)]">
                  <GitCompare className="w-4 h-4" />
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(item.id);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--destructive)] text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - itemCount }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-10 h-10 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center"
            >
              <span className="text-white/40 text-xs">+</span>
            </div>
          ))}
        </div>

        {/* Compare button */}
        <button
          onClick={openDrawer}
          className="flex items-center gap-2 bg-white text-[var(--foreground)] px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <GitCompare className="w-4 h-4" />
          Compare ({itemCount})
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
