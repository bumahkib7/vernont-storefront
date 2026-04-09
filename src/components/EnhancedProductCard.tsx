"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { DisplayProduct } from "@/lib/transforms";

interface EnhancedProductCardProps {
  product: DisplayProduct;
  index?: number;
}

export function EnhancedProductCard({ product, index = 0 }: EnhancedProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id);
  const productUrl = `/product/${product.handle || product.id}`;

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
      transition={{ duration: 0.15, delay: index * 0.03 }}
    >
      <div
        className="group cursor-pointer text-center"
        onClick={handleCardClick}
      >
        {/* Image — SGH style: completely frameless, product floating on white */}
        <div className="relative aspect-[3/2] overflow-hidden mb-3">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-[#FAFAFA] animate-pulse" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain p-2 transition-transform duration-300 group-hover:scale-105 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* No overlays — SGH keeps product images completely clean */}
        </div>

        {/* Product info — SGH style: brand, price, SHOP NOW */}
        <div className="space-y-0.5">
          <p className="text-[12px] font-medium uppercase tracking-[0.05em] text-[#1A1A1A]">
            {product.brand}
          </p>
          <p className="text-[13px] font-medium tabular-nums text-[#1A1A1A]">
            {formatPriceMajor(product.price, currency)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-[12px] text-[#999] line-through tabular-nums">
              {formatPriceMajor(product.originalPrice, currency)}
            </p>
          )}
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] underline underline-offset-4 text-[#1A1A1A] pt-1 hover:opacity-60 transition-opacity">
            Shop Now
          </p>
        </div>
      </div>
    </motion.div>
  );
}
