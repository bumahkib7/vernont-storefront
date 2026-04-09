"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { DisplayProduct } from "@/lib/transforms";

interface ListingProductCardProps {
  product: DisplayProduct;
  index?: number;
}

export function ListingProductCard({ product, index = 0 }: ListingProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id);
  const productUrl = `/product/${product.handle || product.id}`;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleCardClick = () => router.push(productUrl);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
    >
      <div
        className="group cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image — SGH listing style: gray background, large, frameless */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F0F0F0] mb-3">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-[#EBEBEB] animate-pulse" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain p-6 lg:p-8 transition-transform duration-300 group-hover:scale-105 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* Discount badge — top right, SGH style */}
          {hasDiscount && (
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#1A1A1A] text-white text-[10px] font-medium tracking-wider rounded-sm">
              {Math.round((1 - product.price / product.originalPrice!) * 100)}% off
            </span>
          )}

          {/* Wishlist — bottom right, appears on hover */}
          <button
            onClick={handleToggleWishlist}
            className="absolute bottom-3 right-3 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#666]"
              }`}
            />
          </button>
        </div>

        {/* Product info — SGH listing style: brand LEFT, price RIGHT */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] font-bold uppercase tracking-[0.03em] text-[#1A1A1A]">
              {product.brand}
            </p>
            <p className="text-[12px] text-[#666] truncate">
              {product.name}
            </p>
            {product.variants && product.variants.length > 1 && (
              <p className="text-[11px] text-[#999]">
                {product.variants.length} colors
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            {hasDiscount && (
              <p className="text-[12px] text-[#999] line-through tabular-nums">
                {formatPriceMajor(product.originalPrice!, currency)}
              </p>
            )}
            <p className={`text-[13px] font-medium tabular-nums ${hasDiscount ? "text-[#E31837]" : "text-[#1A1A1A]"}`}>
              {formatPriceMajor(product.price, currency)}
            </p>
            {hasDiscount && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mt-0.5">
                Last Chance
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
