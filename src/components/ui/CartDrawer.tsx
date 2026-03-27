"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Loader2, ShoppingBag, Truck, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, formatPrice } from "@/context/CartContext";
import { useStoreConfig } from "@/context/StoreConfigContext";
import { resolveImageUrl } from "@/lib/api";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, currency, itemCount, loading, error } = useCart();
  const { shippingInfo } = useStoreConfig();

  // Free shipping progress — only shown when backend has a threshold configured
  const freeShippingThreshold = shippingInfo?.free_shipping_threshold
    ? Number(shippingInfo.free_shipping_threshold) * 100 // convert pounds to pence
    : null;
  const freeShippingProgress = freeShippingThreshold
    ? Math.min((subtotal / freeShippingThreshold) * 100, 100)
    : 0;
  const amountToFreeShipping = freeShippingThreshold
    ? freeShippingThreshold - subtotal
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--background)] z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium tracking-wider text-sm uppercase">
                  BAG ({itemCount})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress — only when backend has threshold configured */}
            {items.length > 0 && freeShippingThreshold && (
              <div className="px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
                {amountToFreeShipping > 0 ? (
                  <>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Truck className="w-4 h-4 text-[var(--primary)]" />
                      <span>
                        Add <strong className="text-[var(--primary)]">{formatPrice(amountToFreeShipping, currency)}</strong> for free shipping
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[var(--success)]">
                    <Truck className="w-4 h-4" />
                    <span className="font-medium">You&apos;ve unlocked free shipping!</span>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="px-4 py-3 bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm">
                {error}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto relative">
              {loading && (
                <div className="absolute inset-0 bg-[var(--background)]/50 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-[var(--muted-foreground)]" />
                  </div>
                  <p className="font-medium text-lg mb-2">Your bag is empty</p>
                  <p className="text-[var(--muted-foreground)] text-sm mb-6">
                    Add something nice to get started
                  </p>
                  <Link
                    href="/eyewear"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Shop Eyewear
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {items.map((item) => (
                    <li key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <Link
                          href={item.product_handle ? `/product/${item.product_handle}` : "#"}
                          onClick={closeCart}
                          className="relative w-20 h-20 bg-[var(--surface)] rounded-lg flex-shrink-0 overflow-hidden"
                        >
                          {resolveImageUrl(item.thumbnail) ? (
                            <Image
                              src={resolveImageUrl(item.thumbnail)!}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)]">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={item.product_handle ? `/product/${item.product_handle}` : "#"}
                            onClick={closeCart}
                            className="hover:text-[var(--primary)] transition-colors"
                          >
                            <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                          </Link>
                          {item.variant_title && (
                            <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-[var(--surface)] text-[var(--foreground)] text-xs font-medium rounded border border-[var(--border)]">
                              {item.variant_title}
                            </span>
                          )}
                          <p className="font-semibold text-sm mt-1.5 tabular-nums">
                            {formatPrice(item.unit_price, currency)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="inline-flex items-center border border-[var(--border)] rounded-md">
                              <button
                                onClick={async () => {
                                  try {
                                    await updateQuantity(item.id, item.quantity - 1);
                                  } catch (err) {
                                    toast.error("Failed to update quantity");
                                  }
                                }}
                                disabled={loading}
                                className="p-1.5 hover:bg-[var(--surface)] transition-colors disabled:opacity-30 rounded-l-md"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                              <button
                                onClick={async () => {
                                  try {
                                    await updateQuantity(item.id, item.quantity + 1);
                                  } catch (err) {
                                    toast.error("Failed to update quantity");
                                  }
                                }}
                                disabled={loading}
                                className="p-1.5 hover:bg-[var(--surface)] transition-colors disabled:opacity-30 rounded-r-md"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={async () => {
                                try {
                                  await removeItem(item.id);
                                } catch (err) {
                                  toast.error("Failed to remove item");
                                }
                              }}
                              disabled={loading}
                              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors disabled:opacity-30"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--border)] p-4 space-y-4 bg-[var(--background)]">
                {/* Free samples banner */}
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] bg-[var(--surface)] rounded-lg p-3">
                  <Gift className="w-4 h-4 text-[var(--accent)]" />
                  <span>Free samples included with your order</span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)]">Subtotal</span>
                  <span className="font-semibold text-lg tabular-nums">{formatPrice(subtotal, currency)}</span>
                </div>

                <p className="text-xs text-[var(--muted-foreground)] text-center">
                  Shipping calculated at checkout
                </p>

                <Link href="/checkout" onClick={closeCart} className="block">
                  <button
                    className="w-full btn-primary btn-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "CHECKOUT"
                    )}
                  </button>
                </Link>

                <button
                  onClick={closeCart}
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
