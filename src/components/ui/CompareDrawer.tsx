"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, ArrowRight, GitCompare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/context/CompareContext";
import { formatPriceMajor } from "@/context/CartContext";

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
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[var(--background)] z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <GitCompare className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-semibold">Compare ({itemCount}/3)</span>
              </div>
              <div className="flex items-center gap-4">
                {itemCount > 0 && (
                  <button
                    onClick={clearCompare}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {itemCount === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mb-4">
                    <GitCompare className="w-8 h-8 text-[var(--muted-foreground)]" />
                  </div>
                  <p className="font-medium text-lg mb-2">No products to compare</p>
                  <p className="text-[var(--muted-foreground)] text-sm mb-6 max-w-xs">
                    Add products from the shop to compare them side by side
                  </p>
                  <Link
                    href="/fragrances"
                    onClick={closeDrawer}
                    className="btn-primary"
                  >
                    Browse Fragrances
                  </Link>
                </div>
              ) : (
                <div className="p-6">
                  {/* Product Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative bg-[var(--surface)] rounded-lg overflow-hidden border border-[var(--border)]"
                      >
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--destructive)] hover:text-white hover:border-[var(--destructive)] transition-colors"
                          aria-label="Remove from compare"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <Link href={`/product/${item.handle}`} onClick={closeDrawer}>
                          <div className="aspect-square relative bg-[var(--surface)]">
                            {item.thumbnail ? (
                              <Image
                                src={item.thumbnail}
                                alt={item.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)]">
                                <GitCompare className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wide font-medium">
                              {item.brand}
                            </p>
                            <p className="font-medium text-sm line-clamp-2 leading-tight mt-0.5">
                              {item.name}
                            </p>
                            <p className="font-semibold text-sm mt-2 tabular-nums">
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
                        href="/fragrances"
                        onClick={closeDrawer}
                        className="aspect-[3/4] rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center mb-2 group-hover:bg-[var(--primary)]/10 transition-colors">
                          <Plus className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)] group-hover:text-[var(--primary)]">
                          Add product
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Comparison Table */}
                  {itemCount >= 2 && (
                    <div className="space-y-6">
                      {/* Price Comparison - Highlighted */}
                      <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--border)]">
                        <h4 className="font-semibold text-sm mb-3">Price</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {items.map((item) => (
                            <div key={item.id}>
                              <p className="font-bold text-lg tabular-nums">
                                {formatPriceMajor(item.price, "GBP")}
                              </p>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <p className="text-sm text-[var(--muted-foreground)] line-through tabular-nums">
                                  {formatPriceMajor(item.originalPrice, "GBP")}
                                </p>
                              )}
                            </div>
                          ))}
                          {Array.from({ length: 3 - itemCount }).map((_, i) => (
                            <div key={`empty-price-${i}`} className="text-[var(--muted-foreground)]">—</div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--border)]">
                        <h4 className="font-semibold text-sm mb-3">Fragrance Notes</h4>
                        <div className="space-y-3">
                          {["top", "heart", "base"].map((noteType) => (
                            <div key={noteType}>
                              <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide mb-1">
                                {noteType === "top" ? "Top Notes" : noteType === "heart" ? "Heart Notes" : "Base Notes"}
                              </p>
                              <div className="grid grid-cols-3 gap-4">
                                {items.map((item) => {
                                  const notes = item.notes?.[noteType as keyof typeof item.notes] || [];
                                  return (
                                    <p key={item.id} className="text-sm">
                                      {notes.length > 0 ? notes.join(", ") : "—"}
                                    </p>
                                  );
                                })}
                                {Array.from({ length: 3 - itemCount }).map((_, i) => (
                                  <div key={`empty-${noteType}-${i}`} className="text-[var(--muted-foreground)]">—</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--border)]">
                        <h4 className="font-semibold text-sm mb-3">Performance</h4>
                        <div className="space-y-4">
                          {/* Longevity */}
                          <div>
                            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Longevity</p>
                            <div className="grid grid-cols-3 gap-4">
                              {items.map((item) => {
                                const longevity = item.longevity ?? 5;
                                return (
                                  <div key={item.id} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-[var(--primary)] rounded-full transition-all"
                                          style={{ width: `${longevity * 10}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium tabular-nums w-8">{longevity}/10</span>
                                    </div>
                                  </div>
                                );
                              })}
                              {Array.from({ length: 3 - itemCount }).map((_, i) => (
                                <div key={`empty-long-${i}`} className="text-[var(--muted-foreground)]">—</div>
                              ))}
                            </div>
                          </div>
                          {/* Sillage */}
                          <div>
                            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Sillage</p>
                            <div className="grid grid-cols-3 gap-4">
                              {items.map((item) => {
                                const sillage = item.sillage ?? 5;
                                return (
                                  <div key={item.id} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-[var(--accent)] rounded-full transition-all"
                                          style={{ width: `${sillage * 10}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-medium tabular-nums w-8">{sillage}/10</span>
                                    </div>
                                  </div>
                                );
                              })}
                              {Array.from({ length: 3 - itemCount }).map((_, i) => (
                                <div key={`empty-sil-${i}`} className="text-[var(--muted-foreground)]">—</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Single product hint */}
                  {itemCount === 1 && (
                    <div className="text-center py-8 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                      <p className="text-[var(--muted-foreground)]">
                        Add at least one more product to compare
                      </p>
                      <Link
                        href="/fragrances"
                        onClick={closeDrawer}
                        className="inline-flex items-center gap-2 mt-3 text-sm text-[var(--primary)] hover:underline"
                      >
                        Browse more fragrances
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {itemCount > 0 && (
              <div className="border-t border-[var(--border)] p-4 bg-[var(--background)]">
                <button
                  onClick={closeDrawer}
                  className="w-full text-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors py-2"
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
