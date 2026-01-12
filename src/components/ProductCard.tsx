"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  id: string;
  handle?: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  isNew?: boolean;
}

export function ProductCard({
  id,
  handle,
  name,
  brand,
  price,
  originalPrice,
  image,
  isNew,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { toggleItem, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const discount = originalPrice && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  const productUrl = `/product/${handle || id}`;

  return (
    <div className="group relative">
      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleItem(id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          isWishlisted
            ? "bg-[var(--primary)] text-white"
            : "bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--foreground)]"
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
      </button>

      <Link href={productUrl} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[var(--surface)] rounded-lg mb-3">
          {!imageError ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)]">
              <span className="text-sm">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isNew && (
              <span className="badge badge-primary">New</span>
            )}
            {discount && (
              <span className="badge badge-destructive">-{discount}%</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          {/* Brand */}
          {brand && (
            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
              {brand}
            </p>
          )}

          {/* Name */}
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
            {name}
          </h3>

          {/* Rating (static for now) */}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[var(--warning)] fill-current" />
            <span className="text-xs text-[var(--muted-foreground)]">4.6</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="font-semibold tabular-nums">£{Math.round(price)}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-[var(--muted-foreground)] line-through tabular-nums">
                £{Math.round(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
