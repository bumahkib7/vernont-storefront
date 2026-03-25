"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id);
  const productUrl = `/product/${product.handle || product.id}`;

  const handleCardClick = () => {
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
    setIsAddingToCart(true);
    try {
      await addItem(variantId, 1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAddingToCart(false);
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
      transition={{ duration: 0.15, delay: index * 0.05 }}
    >
      <div
        className="group relative cursor-pointer card-interactive p-0 overflow-hidden"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--surface)]">
          {/* Skeleton loader */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-[var(--surface)] animate-pulse" />
          )}

          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 left-3 w-8 h-8 rounded-sm bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-150"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? "fill-[var(--destructive)] text-[var(--destructive)]" : "text-[var(--muted-foreground)]"
              }`}
            />
          </button>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge badge-new">New</span>
            )}
            {product.isBestseller && (
              <span className="badge badge-bestseller">Bestseller</span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="badge badge-sale">Sale</span>
            )}
            {product.isPreOwned && product.conditionGrade && (
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase bg-[var(--foreground)] text-[var(--background)] rounded-sm">
                Grade {product.conditionGrade}
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-1.5">
          {/* Brand */}
          <p className="text-[11px] tracking-[0.1em] font-medium text-[var(--muted-foreground)] uppercase">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-medium text-[var(--foreground)] line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={`price tabular-nums ${product.originalPrice && product.originalPrice > product.price ? "price-sale" : ""}`}>
              {formatPriceMajor(product.price, currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="price-sm price-original tabular-nums">
                {formatPriceMajor(product.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full btn-primary btn-sm flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Bag"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
