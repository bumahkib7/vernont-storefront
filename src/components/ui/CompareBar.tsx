"use client";

import Image from "next/image";
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
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1A1A1A] text-white rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.25)] px-3 py-3 flex items-center gap-4"
      >
        {/* Product thumbnails */}
        <div className="flex items-center gap-2 pl-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative w-12 h-12 border border-white/20 bg-white overflow-hidden"
            >
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F5F5F5] text-[#999]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M12 3v18" />
                  </svg>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(item.id);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center text-[8px] font-bold hover:bg-red-500 hover:text-white transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                ×
              </button>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - itemCount }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-12 h-12 border border-dashed border-white/20 flex items-center justify-center"
            >
              <span className="text-white/30 text-xs">+</span>
            </div>
          ))}
        </div>

        {/* Compare button */}
        <button
          onClick={openDrawer}
          className="bg-white text-[#1A1A1A] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[#F5F5F5] transition-colors"
        >
          Compare ({itemCount})
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
