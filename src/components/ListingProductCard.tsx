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
        className="group cursor-pointer flex flex-col items-center text-center"
        onClick={handleCardClick}
      >
        {/* Image — Pret a Voir style: pure white background, frameless */}
        <div className="relative w-full aspect-[4/3] bg-white mb-4">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-transparent animate-pulse delay-150" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
            className={`object-cover transition-transform duration-[400ms] group-hover:scale-[1.03] ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        {/* Product info — Pret a Voir style: Centered */}
        <div className="flex flex-col items-center justify-center gap-1 w-full px-2">
           <h3 className="text-[11px] lg:text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A1A1A]">
             {product.name}
           </h3>
           <p className="text-[10px] font-medium uppercase tracking-widest text-[#666] mb-1">
             {product.variants?.length ? product.variants.length : 1} COLOURS
           </p>
           
           <div className="flex items-end gap-2 justify-center">
             <p className={`text-[12px] font-bold tracking-widest uppercase tabular-nums ${hasDiscount ? "text-[#E31837]" : "text-[#1A1A1A]"}`}>
               {hasDiscount && "FROM "}£ {Number(product.price).toFixed(2)} GBP
             </p>
           </div>
           
           {/* Wishlist Heart — bottom centered static outline */}
           <button
             onClick={handleToggleWishlist}
             className="mt-1 p-1.5 hover:scale-110 transition-transform"
             aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
           >
             <Heart
               weight={isWishlisted ? "fill" : "regular"}
               className={`h-4 w-4 ${
                 isWishlisted ? "text-[#1A1A1A]" : "text-[#1A1A1A]"
               }`}
             />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
