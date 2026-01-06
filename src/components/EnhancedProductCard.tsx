"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { DisplayProduct } from "@/lib/transforms";

interface EnhancedProductCardProps {
  product: DisplayProduct;
  index?: number;
}

export function EnhancedProductCard({ product, index = 0 }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addItem, currency, openCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id);
  const productUrl = `/product/${product.handle || product.id}`;

  const handleCardClick = () => {
    router.push(productUrl);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(productUrl);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variantId = product.variantId || product.variants[0]?.id;
    if (!variantId) {
      console.error("No variant ID available for product:", product.id);
      return;
    }
    try {
      await addItem(variantId, 1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.165, 0.84, 0.44, 1] }}
    >
      <div
        className="group relative cursor-pointer"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
          {/* Art Deco Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
            {/* Skeleton loader */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-secondary animate-pulse" />
            )}

            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ease-out ${
                isHovered ? "scale-105" : "scale-100"
              } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setIsImageLoaded(true)}
              unoptimized
            />

            {/* Art Deco Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            />

            {/* Art Deco Inner Frame - appears on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="absolute inset-4 border border-gold/50 pointer-events-none"
            />

            {/* Corner Ornaments */}
            <div className="absolute top-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <span className="absolute top-0 left-0 w-full h-px bg-gold" />
              <span className="absolute top-0 left-0 h-full w-px bg-gold" />
            </div>
            <div className="absolute top-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <span className="absolute top-0 right-0 w-full h-px bg-gold" />
              <span className="absolute top-0 right-0 h-full w-px bg-gold" />
            </div>
            <div className="absolute bottom-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <span className="absolute bottom-0 left-0 w-full h-px bg-gold" />
              <span className="absolute bottom-0 left-0 h-full w-px bg-gold" />
            </div>
            <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <span className="absolute bottom-0 right-0 w-full h-px bg-gold" />
              <span className="absolute bottom-0 right-0 h-full w-px bg-gold" />
            </div>

            {/* Art Deco Badges */}
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              {product.isNew && (
                <span
                  className="bg-gold text-primary font-display text-[10px] tracking-[0.15em] uppercase px-3 py-1.5"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  New
                </span>
              )}
              {product.isBestseller && (
                <span
                  className="bg-primary text-primary-foreground font-display text-[10px] tracking-[0.15em] uppercase px-3 py-1.5"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  Bestseller
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span
                  className="bg-rose-gold text-white font-display text-[10px] tracking-[0.15em] uppercase px-3 py-1.5"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
                >
                  Sale
                </span>
              )}
            </div>

            {/* Art Deco Wishlist Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleWishlist}
              className="absolute top-5 right-5 w-9 h-9 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-gold transition-colors duration-300 group/heart"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? "fill-rose-gold text-rose-gold" : "text-gray-700 group-hover/heart:text-primary"
                }`}
              />
            </motion.button>

            {/* Art Deco Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
              transition={{ duration: 0.4, ease: [0.165, 0.84, 0.44, 1] }}
              className="absolute bottom-5 left-5 right-5 flex gap-2"
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-primary font-display text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Add to Bag
              </button>
              <button
                onClick={handleQuickView}
                className="w-11 flex items-center justify-center bg-white/95 backdrop-blur-sm hover:bg-gold transition-colors duration-300 group/eye"
              >
                <Eye className="h-4 w-4 group-hover/eye:text-primary" />
              </button>
            </motion.div>
          </div>

          {/* Art Deco Info Section */}
          <div className="pt-6 text-center relative">
            {/* Decorative line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <span className="h-px w-6 bg-gold/30" />
              <span className="w-1 h-1 bg-gold/50 rotate-45" />
              <span className="h-px w-6 bg-gold/30" />
            </div>

            <p className="font-display text-gold tracking-[0.25em] uppercase text-[10px] mb-2 mt-2">
              {product.brand}
            </p>
            <h3 className="font-display text-lg tracking-[0.08em] mb-1.5 group-hover:text-gold transition-colors duration-300">
              {product.name}
            </h3>
            <p className="font-serif text-muted-foreground text-sm mb-3 italic">
              {product.category}
            </p>

            <div className="flex items-center justify-center gap-3">
              <p className="font-display text-lg tracking-[0.05em]">
                {formatPriceMajor(product.price, currency)}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="font-serif text-sm text-muted-foreground line-through">
                  {formatPriceMajor(product.originalPrice, currency)}
                </p>
              )}
            </div>
          </div>
        </div>
    </motion.div>
  );
}
