"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProductByHandle, useProducts } from "@/lib/hooks";
import { transformProduct, transformProducts } from "@/lib/transforms";
import { useCart, formatPriceMajor } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/ProductJsonLd";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addItem, currency } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const { data: productData, isLoading, error } = useProductByHandle(id);
  const { data: relatedData } = useProducts({ limit: 5 });

  const product = useMemo(() => {
    if (!productData?.product) return null;
    return transformProduct(productData.product);
  }, [productData]);

  const relatedProducts = useMemo(() => {
    if (!relatedData?.items) return [];
    return transformProducts(relatedData.items)
      .filter(p => p.id !== id && p.handle !== id)
      .slice(0, 4);
  }, [relatedData, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="aspect-[3/4] bg-secondary animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-24 bg-secondary" />
              <div className="h-8 w-48 bg-secondary" />
              <div className="h-6 w-20 bg-secondary" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="px-6 lg:px-12 py-32 text-center">
          <h1 className="text-3xl mb-4">Product not found</h1>
          <Link href="/fragrances" className="text-sm tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-50 transition-opacity">
            Back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const isWishlisted = isInWishlist(product.id);
  const productImages = product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id || product.variantId;
    if (!variantId) return;

    try {
      await addItem(variantId, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://vernont.com/product/${id}`;

  return (
    <div className="min-h-screen">
      <Header />

      {productData?.product && <ProductJsonLd product={productData.product} url={productUrl} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://vernont.com" },
          { name: "Fragrances", url: "https://vernont.com/fragrances" },
          { name: product.name, url: productUrl },
        ]}
      />

      <main>
        {/* Breadcrumb */}
        <nav className="px-6 lg:px-12 py-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/fragrances" className="hover:text-foreground transition-colors">Fragrances</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product */}
        <section className="px-6 lg:px-12 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-24">
            {/* Images */}
            <div>
              <div className="relative aspect-[3/4] bg-secondary mb-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={productImages[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
                {product.isNew && (
                  <span className="absolute top-4 left-4 text-[11px] tracking-widest uppercase">New</span>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-20 transition-opacity ${
                        selectedImage === index ? "opacity-100" : "opacity-50 hover:opacity-75"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:py-8">
              {product.brand && (
                <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                  {product.brand}
                </p>
              )}
              <h1 className="text-3xl lg:text-4xl mb-2">{product.name}</h1>
              {product.category && (
                <p className="text-muted-foreground mb-6">{product.category}</p>
              )}

              <div className="flex items-center gap-3 mb-8">
                <span className="text-xl">{formatPriceMajor(currentPrice, currency)}</span>
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                  <span className="text-muted-foreground line-through">
                    {formatPriceMajor(currentOriginalPrice, currency)}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm tracking-widest uppercase mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`px-5 py-3 text-sm border-2 transition-all ${
                          selectedVariantIndex === index
                            ? "border-foreground bg-foreground text-background font-medium"
                            : "border-foreground/30 hover:border-foreground"
                        }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-sm tracking-widest uppercase mb-3">Quantity</p>
                <div className="inline-flex items-center border-2 border-foreground/30">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-foreground hover:text-background transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-foreground hover:text-background transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-sm tracking-widest uppercase font-medium transition-all ${
                    isAdded
                      ? "bg-accent text-accent-foreground"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Added
                    </span>
                  ) : (
                    "Add to Bag"
                  )}
                </button>
                <button
                  onClick={() => toggleItem(product.id)}
                  className={`p-4 border-2 transition-colors ${
                    isWishlisted
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/30 hover:border-foreground"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Shipping */}
              <div className="text-sm text-muted-foreground space-y-2 pt-8 border-t border-border">
                <p>Complimentary shipping on orders over £150</p>
                <p>30-day returns</p>
              </div>

              {/* Notes */}
              {product.notes && (product.notes.top.length > 0 || product.notes.heart.length > 0 || product.notes.base.length > 0) && (
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm tracking-widest uppercase mb-4">Notes</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {product.notes.top.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-1">Top</p>
                        <p>{product.notes.top.join(", ")}</p>
                      </div>
                    )}
                    {product.notes.heart.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-1">Heart</p>
                        <p>{product.notes.heart.join(", ")}</p>
                      </div>
                    )}
                    {product.notes.base.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-1">Base</p>
                        <p>{product.notes.base.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="px-6 lg:px-12 py-16 lg:py-24 bg-secondary">
            <h2 className="text-sm tracking-widest uppercase text-muted-foreground mb-12">
              You may also like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
