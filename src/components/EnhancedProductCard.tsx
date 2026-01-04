"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useCart, formatPrice } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  description?: string;
}

interface EnhancedProductCardProps {
  product: Product;
  index?: number;
}

export function EnhancedProductCard({ product, index = 0 }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addItem, currency, openCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: "50ml",
      quantity: 1,
      image: product.image,
    });
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
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.id}`}>
        <div
          className="group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
            {/* Skeleton loader */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-secondary animate-pulse" />
            )}

            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setIsImageLoaded(true)}
              unoptimized
            />

            {/* Overlay gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-gold text-primary font-display text-xs tracking-wider px-3 py-1">
                  New
                </Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-primary text-primary-foreground font-display text-xs tracking-wider px-3 py-1">
                  Bestseller
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-700"
                }`}
              />
            </motion.button>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4 flex gap-2"
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-primary font-display text-sm tracking-wider uppercase hover:bg-gold/90 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag
              </button>
              <Link
                href={`/product/${product.id}`}
                className="w-12 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Info */}
          <div className="pt-5 text-center">
            <p className="font-serif text-gold tracking-[0.2em] uppercase text-xs mb-1">
              {product.brand}
            </p>
            <h3 className="font-display text-lg tracking-wide mb-1 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
            <p className="font-serif text-muted-foreground text-sm mb-2">
              {product.category}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < product.rating! ? "fill-gold text-gold" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="font-serif text-xs text-muted-foreground ml-1">
                  ({product.rating})
                </span>
              </div>
            )}

            <p className="font-display text-lg tracking-wide">
              {formatPrice(product.price, currency)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
