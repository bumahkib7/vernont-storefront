"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingBag, Share2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/ProductGrid";
import { products, getProductById } from "@/data/products";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = getProductById(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("50ml");

  const sizes = [
    { size: "30ml", price: product ? product.price * 0.6 : 0 },
    { size: "50ml", price: product?.price || 0 },
    { size: "100ml", price: product ? product.price * 1.6 : 0 },
  ];

  const relatedProducts = products.filter(p => p.id !== id).slice(0, 4);

  if (!product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <p className="font-serif text-muted-foreground mb-8">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/fragrances">
            <Button className="btn-outline-luxury">Browse All Fragrances</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const currentPrice = sizes.find(s => s.size === selectedSize)?.price || product.price;

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="font-serif text-sm text-muted-foreground">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/fragrances" className="hover:text-gold">Fragrances</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative aspect-square bg-secondary">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-gold text-primary-foreground font-display text-xs tracking-wider">
                  New
                </Badge>
              )}
              {product.isBestseller && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-display text-xs tracking-wider">
                  Bestseller
                </Badge>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="font-serif text-gold tracking-[0.2em] uppercase text-sm mb-2">
                {product.brand}
              </p>
              <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-2">
                {product.name}
              </h1>
              <p className="font-serif text-muted-foreground mb-6">
                {product.category}
              </p>

              <p className="font-display text-2xl mb-8">
                ${currentPrice.toFixed(2)}
              </p>

              {product.description && (
                <p className="font-serif text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Size Selection */}
              <div className="mb-8">
                <p className="font-display text-sm tracking-wider uppercase mb-3">Size</p>
                <div className="flex gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-4 py-2 border font-serif text-sm transition-colors ${
                        selectedSize === s.size
                          ? "border-gold text-gold"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="font-display text-sm tracking-wider uppercase mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-secondary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-serif">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90 flex-1">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Bag
                </Button>
                <Button variant="outline" size="icon" className="border-border hover:border-gold">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-border hover:border-gold">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Notes */}
              {product.notes && (
                <div className="border-t border-border pt-8">
                  <p className="font-display text-sm tracking-wider uppercase mb-4">
                    Fragrance Notes
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-serif text-xs text-gold uppercase tracking-wider mb-2">Top</p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {product.notes.top.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="font-serif text-xs text-gold uppercase tracking-wider mb-2">Heart</p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {product.notes.heart.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="font-serif text-xs text-gold uppercase tracking-wider mb-2">Base</p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {product.notes.base.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <ProductGrid
            products={relatedProducts}
            title="You May Also Like"
            subtitle="Similar Fragrances"
          />
        </div>
      </section>
    </PageLayout>
  );
}
