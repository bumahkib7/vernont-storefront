"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
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
  name,
  price,
  originalPrice,
  image,
  isNew,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isNew && (
          <span className="absolute top-4 left-4 text-[11px] tracking-widest uppercase">
            New
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm">£{price.toFixed(0)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              £{originalPrice.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
