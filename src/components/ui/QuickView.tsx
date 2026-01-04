"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Heart, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart, formatPrice } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
}

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  if (!product) return null;

  const sizes = [
    { size: "30ml", price: product.price * 0.6 },
    { size: "50ml", price: product.price },
    { size: "100ml", price: product.price * 1.6 },
  ];

  const currentPrice = sizes.find((s) => s.size === selectedSize)?.price || product.price;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: currentPrice,
      size: selectedSize,
      quantity,
      image: product.image,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-[100] mx-4"
          >
            <div className="bg-background overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-square bg-secondary">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-8 flex flex-col justify-center">
                  <p className="font-serif text-gold tracking-[0.2em] uppercase text-sm mb-2">
                    {product.brand}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl tracking-wide mb-2">
                    {product.name}
                  </h2>
                  <p className="font-serif text-muted-foreground mb-4">
                    {product.category}
                  </p>

                  <p className="font-display text-2xl mb-6">
                    {formatPrice(currentPrice, currency)}
                  </p>

                  {product.description && (
                    <p className="font-serif text-muted-foreground text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>
                  )}

                  {/* Size Selection */}
                  <div className="mb-6">
                    <p className="font-display text-sm tracking-wider uppercase mb-3">Size</p>
                    <div className="flex gap-3">
                      {sizes.map((s) => (
                        <button
                          key={s.size}
                          onClick={() => setSelectedSize(s.size)}
                          className={`px-4 py-2 border font-serif text-sm transition-colors ${
                            selectedSize === s.size
                              ? "border-gold text-gold bg-gold/10"
                              : "border-border hover:border-gold"
                          }`}
                        >
                          {s.size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-6">
                    <p className="font-display text-sm tracking-wider uppercase mb-3">Quantity</p>
                    <div className="flex items-center border border-border w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-secondary transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-serif">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-secondary transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 btn-luxury bg-gold text-primary hover:bg-gold/90"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Bag
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleItem(product.id)}
                      className="border-border hover:border-gold"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isWishlisted ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  {/* View Full Details */}
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="font-serif text-sm text-center mt-6 underline hover:text-gold transition-colors"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
