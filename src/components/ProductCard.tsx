"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  category,
  isNew,
  isBestseller,
}: ProductCardProps) {
  return (
    <div className="group relative">
      {/* Image Container */}
      <Link href={`/product/${id}`} className="block relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-gold text-primary-foreground font-display text-xs tracking-wider">
              New
            </Badge>
          )}
          {isBestseller && (
            <Badge className="bg-primary text-primary-foreground font-display text-xs tracking-wider">
              Bestseller
            </Badge>
          )}
          {originalPrice && (
            <Badge className="bg-rose-gold text-white font-display text-xs tracking-wider">
              Sale
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background hover:text-gold"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="w-full bg-background text-foreground hover:bg-gold hover:text-primary-foreground font-display tracking-widest uppercase text-xs">
            Quick Add
          </Button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4 text-center">
        {category && (
          <p className="text-xs font-serif text-muted-foreground uppercase tracking-wider mb-1">
            {category}
          </p>
        )}
        {brand && (
          <p className="text-xs font-serif text-gold uppercase tracking-wider mb-1">
            {brand}
          </p>
        )}
        <Link href={`/product/${id}`}>
          <h3 className="font-display text-base tracking-wide group-hover:text-gold transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="font-serif text-base">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="font-serif text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
