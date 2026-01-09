"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, formatPrice } from "@/context/CartContext";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, currency, itemCount, loading, error } = useCart();

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
            className="fixed inset-0 bg-black/20 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <span className="text-sm tracking-widest uppercase">
                Bag ({itemCount})
              </span>
              <button
                onClick={closeCart}
                className="hover:opacity-50 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="px-6 py-3 bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto relative">
              {loading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <p className="text-muted-foreground mb-8">Your bag is empty</p>
                  <Link
                    href="/fragrances"
                    onClick={closeCart}
                    className="text-sm tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-50 transition-opacity"
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <ul>
                  {items.map((item) => (
                    <li key={item.id} className="px-6 py-6 border-b border-border">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-24 bg-secondary flex-shrink-0">
                          {item.thumbnail && (
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={item.product_handle ? `/product/${item.product_handle}` : "#"}
                            onClick={closeCart}
                            className="hover:opacity-50 transition-opacity"
                          >
                            <h4 className="text-sm truncate">{item.title}</h4>
                          </Link>
                          {item.variant_title && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.variant_title}
                            </p>
                          )}
                          <p className="text-sm mt-2">
                            {formatPrice(item.unit_price, currency)}
                          </p>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={loading}
                                className="hover:opacity-50 transition-opacity disabled:opacity-30"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={loading}
                                className="hover:opacity-50 transition-opacity disabled:opacity-30"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={loading}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
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
              <div className="border-t border-border p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm">{formatPrice(subtotal, currency)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Shipping calculated at checkout
                </p>
                <Link href="/checkout" onClick={closeCart} className="block">
                  <button
                    className="w-full py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Checkout"}
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
