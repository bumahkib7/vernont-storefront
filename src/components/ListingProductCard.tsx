"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "@/components/icons";
import { motion } from "framer-motion";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import type { DisplayProduct } from "@/lib/transforms";

interface ListingProductCardProps {
  product: DisplayProduct;
  index?: number;
}

export function ListingProductCard({ product, index = 0 }: ListingProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isComparing, isCompareFull } = useCompare();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id);
  const isInCompare = isComparing(product.id);
  const productUrl = `/product/${product.handle || product.id}`;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleCardClick = () => router.push(productUrl);

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
        handle: product.handle || product.id,
        frameMaterial: product.frameMaterial,
        frameShape: product.frameShape,
      });
    }
  };

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
          {/* Social proof badge — top left */}
          {product.isBestseller ? (
            <span className="absolute top-1.5 left-1.5 z-10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-[#1A1A1A] text-white rounded-sm">
              Bestseller
            </span>
          ) : product.isNew ? (
            <span className="absolute top-1.5 left-1.5 z-10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-[#F5F5F5] text-[#1A1A1A] border border-[#E5E5E5] rounded-sm">
              New
            </span>
          ) : null}

          {/* Action buttons — Top Right absolute */}
          <div className="absolute top-0 right-0 z-10 flex flex-col gap-1 p-1.5">
            <button
              onClick={handleToggleWishlist}
              className="p-1.5 hover:scale-110 transition-transform"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                weight={isWishlisted ? "fill" : "regular"}
                className={`h-5 w-5 ${isWishlisted ? "text-[#1A1A1A]" : "text-[#666]"}`}
              />
            </button>
            <button
              onClick={handleToggleCompare}
              className={`p-1.5 hover:scale-110 transition-all rounded-full ${
                isInCompare
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#666] hover:text-[#1A1A1A]"
              } ${isCompareFull && !isInCompare ? "opacity-30 cursor-not-allowed" : ""}`}
              aria-label={isInCompare ? "Remove from compare" : "Add to compare"}
              title={isCompareFull && !isInCompare ? "Compare is full (max 3)" : isInCompare ? "Remove from compare" : "Compare"}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M12 3v18" />
              </svg>
            </button>
          </div>

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
            quality={80}
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
              quality={80}
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
               <span className="text-[#767676] line-through">
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
