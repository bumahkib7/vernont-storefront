"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/context/CompareContext";
import { formatPriceMajor } from "@/context/CartContext";
import { resolveImageUrl } from "@/lib/api";
import { product as productConfig } from "@/config/vertical";

export function CompareDrawer() {
  const { items, removeFromCompare, clearCompare, isDrawerOpen, closeDrawer, itemCount } = useCompare();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.15)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-[#E5E5E5]">
              <h2
                className="text-lg tracking-wide"
                style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
              >
                Compare ({itemCount}/3)
              </h2>
              <div className="flex items-center gap-4">
                {itemCount > 0 && (
                  <button
                    onClick={clearCompare}
                    className="text-[12px] text-[#999] hover:text-[#1A1A1A] transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-[#F5F5F5] rounded-sm transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {itemCount === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <svg className="w-12 h-12 text-[#CCC] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M12 3v18" />
                  </svg>
                  <p
                    className="text-xl mb-2"
                    style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                  >
                    No products to compare
                  </p>
                  <p className="text-[13px] text-[#666] mb-6 max-w-xs">
                    Add products from the shop to compare them side by side
                  </p>
                  <Link
                    href="/eyewear"
                    onClick={closeDrawer}
                    className="px-8 py-3 bg-[#1A1A1A] text-white text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-[#333] transition-colors"
                  >
                    Browse Eyewear
                  </Link>
                </div>
              ) : (
                <div className="p-6">
                  {/* Product Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative border border-[#E5E5E5] overflow-hidden"
                      >
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute top-2 right-2 z-10 w-6 h-6 bg-white border border-[#E5E5E5] flex items-center justify-center text-[#999] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors"
                          aria-label="Remove"
                        >
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                        <Link href={`/product/${item.handle}`} onClick={closeDrawer}>
                          <div className="aspect-square relative bg-white">
                            {resolveImageUrl(item.thumbnail) ? (
                              <Image
                                src={resolveImageUrl(item.thumbnail)!}
                                alt={item.name}
                                fill
                                sizes="200px"
                                className="object-contain p-3"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-[#CCC]">
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                  <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M12 3v18" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-3 border-t border-[#E5E5E5]">
                            {item.brand && (
                              <p className="text-[10px] text-[#999] uppercase tracking-widest font-medium">
                                {item.brand}
                              </p>
                            )}
                            <p className="text-[12px] font-medium text-[#1A1A1A] line-clamp-2 leading-tight mt-0.5">
                              {item.name}
                            </p>
                            <p className="text-[13px] font-medium text-[#1A1A1A] mt-2 tabular-nums">
                              {formatPriceMajor(item.price, "GBP")}
                            </p>
                          </div>
                        </Link>
                      </div>
                    ))}
                    {/* Empty slots */}
                    {Array.from({ length: 3 - itemCount }).map((_, i) => (
                      <Link
                        key={`empty-${i}`}
                        href="/eyewear"
                        onClick={closeDrawer}
                        className="aspect-[3/4] border border-dashed border-[#E5E5E5] flex flex-col items-center justify-center hover:border-[#1A1A1A] transition-colors group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-2 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </div>
                        <span className="text-[11px] text-[#999] group-hover:text-[#1A1A1A] transition-colors">
                          Add product
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Comparison Table */}
                  {itemCount >= 2 && (
                    <div className="space-y-6">
                      {/* Price */}
                      <div className="border border-[#E5E5E5] p-4">
                        <h4
                          className="text-[14px] mb-3"
                          style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                        >
                          Price
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          {items.map((item) => (
                            <div key={item.id}>
                              <p className="text-[15px] font-medium tabular-nums">
                                {formatPriceMajor(item.price, "GBP")}
                              </p>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <p className="text-[12px] text-[#999] line-through tabular-nums">
                                  {formatPriceMajor(item.originalPrice, "GBP")}
                                </p>
                              )}
                            </div>
                          ))}
                          {Array.from({ length: 3 - itemCount }).map((_, i) => (
                            <div key={`ep-${i}`} className="text-[#CCC]">—</div>
                          ))}
                        </div>
                      </div>

                      {/* Spec groups */}
                      {productConfig.comparisonSpecs.map((group) => (
                        <div key={group.title} className="border border-[#E5E5E5] p-4">
                          <h4
                            className="text-[14px] mb-3"
                            style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
                          >
                            {group.title}
                          </h4>
                          <div className="space-y-3">
                            {group.specs.map((spec) => (
                              <div key={spec.key}>
                                <p className="text-[10px] text-[#999] uppercase tracking-widest mb-1">
                                  {spec.label}
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                  {items.map((item) => {
                                    let value: unknown;
                                    if (spec.fromItem) {
                                      value = (item as unknown as Record<string, unknown>)[spec.key];
                                    } else if (spec.key === "lensType") {
                                      const lt = item.lensType;
                                      value = lt && lt.length > 0 ? lt.join(", ") : null;
                                    } else if (item.measurements && spec.key in item.measurements) {
                                      value = item.measurements[spec.key as keyof typeof item.measurements];
                                    } else {
                                      value = (item as unknown as Record<string, unknown>)[spec.key];
                                    }
                                    return (
                                      <p key={item.id} className={`text-[13px] text-[#1A1A1A] ${spec.unit ? "tabular-nums" : ""}`}>
                                        {value != null ? `${value}${spec.unit || ""}` : "—"}
                                      </p>
                                    );
                                  })}
                                  {Array.from({ length: 3 - itemCount }).map((_, i) => (
                                    <div key={`e-${spec.key}-${i}`} className="text-[#CCC]">—</div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Single product hint */}
                  {itemCount === 1 && (
                    <div className="text-center py-8 border border-[#E5E5E5]">
                      <p className="text-[#666] text-[13px]">
                        Add at least one more product to compare
                      </p>
                      <Link
                        href="/eyewear"
                        onClick={closeDrawer}
                        className="inline-flex items-center gap-2 mt-3 text-[12px] text-[#1A1A1A] hover:underline"
                      >
                        Browse more eyewear →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {itemCount > 0 && (
              <div className="border-t border-[#E5E5E5] p-4 bg-white">
                <button
                  onClick={closeDrawer}
                  className="w-full text-center text-[12px] text-[#666] hover:text-[#1A1A1A] transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
