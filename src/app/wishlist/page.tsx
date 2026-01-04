"use client";

import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedProductCard } from "@/components/EnhancedProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";

export default function WishlistPage() {
  const { items, itemCount } = useWishlist();

  const wishlistProducts = products.filter((product) => items.includes(product.id));

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto mb-6 border-2 border-gold rounded-full flex items-center justify-center"
          >
            <Heart className="h-7 w-7 text-gold" />
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Your Wishlist
          </h1>
          <p className="font-serif text-muted-foreground">
            {itemCount === 0
              ? "Your wishlist is empty"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} saved for later`}
          </p>
        </div>

        {itemCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="font-serif text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your collection by saving your favourite fragrances.
              Click the heart icon on any product to add it to your wishlist.
            </p>
            <Link href="/fragrances">
              <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90">
                Explore Fragrances
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {wishlistProducts.map((product, index) => (
                <EnhancedProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/fragrances">
                <Button variant="outline" className="btn-outline-luxury">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
