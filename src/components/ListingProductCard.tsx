"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "@/components/icons";
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
        className="group cursor-pointer flex flex-col items-center text-center border border-[#E5E5E5] p-2 lg:p-4 bg-white"
        onClick={handleCardClick}
      >
        {/* Image — bordered container. When the product has 2+ images, the
            secondary image crossfades in on hover so shoppers can preview a
            second angle without opening the PDP. Falls back silently to the
            single image when there's only one. */}
        <div className="relative w-full aspect-[4/3] bg-white mb-4">
          {/* Wishlist Heart — Top Right absolute */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-0 right-0 z-10 p-2 hover:scale-110 transition-transform"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              weight={isWishlisted ? "fill" : "regular"}
              className={`h-5 w-5 ${
                isWishlisted ? "text-[#1A1A1A]" : "text-[#666]"
              }`}
            />
          </button>

          {!isImageLoaded && (
            <div className="absolute inset-0 bg-transparent animate-pulse delay-150" />
          )}

          {/* Primary image — fades out on group-hover if a secondary exists.
              Uses object-contain so the full product (sunglasses shot) stays
              visible and centered rather than being cropped to fit a 4/3 box. */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
            className={`object-contain p-2 transition-all duration-[400ms] group-hover:scale-[1.03] ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            } ${
              product.images && product.images.length > 1
                ? "group-hover:opacity-0"
                : ""
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* Secondary image — only rendered when there's a second distinct
              image. loading=eager so the browser fetches it alongside the
              primary on initial paint — without this, Next.js lazy-loads it
              and there's a blank white flash the first time the user hovers
              while the fetch happens. */}
          {product.images && product.images.length > 1 && product.images[1] !== product.image && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
              loading="eager"
              className="object-contain p-2 transition-all duration-[400ms] opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
            />
          )}
        </div>

        {/* Product info — Pret a Voir style: Natural mixed-case format */}
        <div className="flex flex-col items-center justify-center gap-1.5 w-full px-1 mb-2">
           <h3 className="text-[12px] font-normal leading-tight text-[#1A1A1A]">
             {product.name}
           </h3>
           
           <div className="flex items-center gap-2 justify-center mt-0.5 text-[11px] font-medium tracking-wide">
             <span className="text-[#1A1A1A]">
               £ {Number(product.price).toFixed(2)}
             </span>
             {hasDiscount && (
               <span className="text-[#999] line-through">
                 £ {Number(product.originalPrice).toFixed(2)}
               </span>
             )}
           </div>
           
           {/* Stock indicator — Pret A Voir styled green check */}
           <div className="flex items-center justify-center gap-1 mt-1 text-[#108c5c] text-[11px]">
             <span className="font-sans">✓</span> <span>In Stock</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
