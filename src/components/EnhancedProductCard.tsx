"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Plus, Star, GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
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
  const { addToCompare, removeFromCompare, isComparing, isCompareFull } = useCompare();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id);
  const isInCompare = isComparing(product.id);
  const productUrl = `/product/${product.handle || product.id}`;

  // Get notes preview (top notes only)
  const notesPreview = product.notes?.top?.slice(0, 3).join(", ") || "";

  // Mock rating - in production, this would come from the API
  const rating = 4.6;
  const reviewCount = 89;

  // Stock status - in production, derive from inventory data
  const stockStatus = "in_stock" as "in_stock" | "low_stock" | "out_of_stock";
  const deliveryEstimate = "Tue-Thu";

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

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare) {
      removeFromCompare(product.id);
    } else if (!isCompareFull) {
      addToCompare({
        id: product.id,
        name: product.name,
        brand: product.brand,
        thumbnail: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        handle: product.handle,
        notes: product.notes,
        longevity: product.longevity,
        sillage: product.sillage,
      });
    }
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
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]">
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
            unoptimized
          />

          {/* Wishlist Button - always visible */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-150"
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
          </div>

          {/* Compare Button - appears on hover */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleToggleCompare}
            disabled={isCompareFull && !isInCompare}
            className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 ${
              isInCompare
                ? "bg-[var(--primary)] text-white"
                : isCompareFull
                ? "bg-white/60 text-[var(--muted-foreground)] cursor-not-allowed"
                : "bg-white/90 backdrop-blur-sm text-[var(--foreground)] hover:bg-white"
            }`}
            aria-label={isInCompare ? "Remove from compare" : "Add to compare"}
          >
            <GitCompare className="h-3 w-3" />
            {isInCompare ? "Comparing" : "Compare"}
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Brand */}
          <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
            {product.brand}
          </p>

          {/* Name - 2 lines max */}
          <h3 className="font-semibold text-[var(--foreground)] line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Notes Preview - 1 line */}
          {notesPreview && (
            <p className="text-sm text-[var(--subtle)] line-clamp-1">
              Top: {notesPreview}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="star-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating) ? "fill-current" : "fill-none opacity-30"
                  }`}
                />
              ))}
            </div>
            <span className="rating-text tabular-nums">{rating}</span>
            <span className="rating-count">({reviewCount})</span>
          </div>

          {/* Size Options */}
          {product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {product.variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]"
                >
                  {variant.title}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-[var(--muted-foreground)]">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}

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

          {/* Decision Row - Stock + Delivery */}
          <p className="decision-row truncate">
            <span className={stockStatus === "in_stock" ? "in-stock" : stockStatus === "low_stock" ? "low-stock" : "out-of-stock"}>
              {stockStatus === "in_stock" ? "In stock" : stockStatus === "low_stock" ? "Low stock" : "Out of stock"}
            </span>
            {stockStatus !== "out_of_stock" && (
              <> &bull; Delivers {deliveryEstimate}</>
            )}
          </p>

          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || stockStatus === "out_of_stock"}
            className="w-full btn-secondary btn-sm flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Bag"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
