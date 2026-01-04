"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, formatPrice } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, currency, itemCount } = useCart();

  const freeShippingThreshold = currency === "GBP" ? 75 : currency === "EUR" ? 85 : 95;
  const remaining = freeShippingThreshold - subtotal;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-display text-xl tracking-wide">Your Bag</h2>
                <span className="text-sm text-muted-foreground font-serif">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-secondary/50">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-gold" />
                  {remaining > 0 ? (
                    <p className="font-serif text-sm">
                      Add <span className="font-semibold text-gold">{formatPrice(remaining, currency)}</span> for free UK delivery
                    </p>
                  ) : (
                    <p className="font-serif text-sm text-gold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      You qualify for free UK delivery!
                    </p>
                  )}
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  </motion.div>
                  <h3 className="font-display text-lg mb-2">Your bag is empty</h3>
                  <p className="font-serif text-muted-foreground text-sm mb-6">
                    Discover our exquisite collection of fragrances
                  </p>
                  <Button onClick={closeCart} className="btn-luxury bg-gold text-primary hover:bg-gold/90">
                    <Link href="/fragrances">Explore Fragrances</Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item, index) => (
                    <motion.li
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 bg-secondary flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-sm tracking-wide truncate">
                            {item.name}
                          </h4>
                          <p className="font-serif text-xs text-muted-foreground mt-1">
                            {item.size}
                          </p>
                          <p className="font-display text-sm mt-2">
                            {formatPrice(item.price, currency)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="p-1.5 hover:bg-secondary transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center font-serif text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="p-1.5 hover:bg-secondary transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="font-serif text-xs text-muted-foreground hover:text-foreground underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-muted-foreground">Subtotal</span>
                  <span className="font-display text-lg">{formatPrice(subtotal, currency)}</span>
                </div>
                <p className="font-serif text-xs text-muted-foreground text-center">
                  Shipping & taxes calculated at checkout
                </p>
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full btn-luxury bg-gold text-primary hover:bg-gold/90 py-6">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full font-serif text-sm text-center underline hover:text-gold transition-colors"
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
