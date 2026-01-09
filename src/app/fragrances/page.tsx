"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { priceFromMinor } from "@/lib/schemas";

// Map frontend sort options to API params
function getSortParams(sortBy: string): { sortBy?: string; sortDirection?: string } {
  switch (sortBy) {
    case "price-low":
      return { sortBy: "price", sortDirection: "asc" };
    case "price-high":
      return { sortBy: "price", sortDirection: "desc" };
    case "newest":
      return { sortBy: "createdAt", sortDirection: "desc" };
    default:
      return {};
  }
}

// Generate price ranges from min/max
function generatePriceRanges(min?: number, max?: number) {
  if (!min && !max) return [];

  const minPrice = min || 0;
  const maxPrice = max || 100000;
  const minMajor = priceFromMinor(minPrice);
  const maxMajor = priceFromMinor(maxPrice);

  // Create sensible ranges based on actual price range
  const ranges: { label: string; min: number; max?: number }[] = [];

  if (maxMajor <= 200) {
    ranges.push({ label: `Under £${Math.ceil(maxMajor)}`, min: 0, max: maxPrice });
  } else {
    // Create ranges in £100 increments
    const step = 10000; // £100 in pence
    let current = Math.floor(minPrice / step) * step;

    while (current < maxPrice) {
      const nextStep = current + step;
      if (current === 0) {
        ranges.push({ label: `Under £${priceFromMinor(nextStep)}`, min: 0, max: nextStep });
      } else if (nextStep >= maxPrice) {
        ranges.push({ label: `Over £${priceFromMinor(current)}`, min: current, max: undefined });
      } else {
        ranges.push({
          label: `£${priceFromMinor(current)} - £${priceFromMinor(nextStep)}`,
          min: current,
          max: nextStep
        });
      }
      current = nextStep;
    }
  }

  return ranges.slice(0, 5); // Max 5 ranges
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-6 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <span className="text-sm tracking-widest uppercase">{title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center justify-between w-full py-2 text-sm hover:opacity-70 transition-opacity"
    >
      <span className="flex items-center gap-3">
        <span
          className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
            checked ? "bg-foreground border-foreground" : "border-foreground/40"
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-background" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </span>
        <span>{label}</span>
      </span>
      {count !== undefined && (
        <span className="text-muted-foreground">{count}</span>
      )}
    </button>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
  ];

  const currentLabel = options.find((o) => o.value === value)?.label || "Featured";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:opacity-50 transition-opacity"
      >
        <span>{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-full mt-2 bg-background border border-border z-20 min-w-[180px]"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors ${
                    value === option.value ? "text-muted-foreground" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FragrancesPage() {
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // First fetch to get filter options
  const { data: productsData, isLoading, error } = useProducts({ limit: 100 });

  // Extract filter options from API response
  const filters = productsData?.filters;
  const categories = filters?.categories || [];
  const brands = filters?.brands || [];
  const sizes = filters?.sizes || [];
  const priceRanges = useMemo(() => {
    return generatePriceRanges(filters?.priceRange?.min, filters?.priceRange?.max);
  }, [filters?.priceRange]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((b) => b !== brandId) : [...prev, brandId]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setSelectedSizes([]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRange !== null || selectedSizes.length > 0;

  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    let products = transformProducts(productsData.items);

    // Client-side filtering (API filtering could be added later)
    if (selectedCategories.length > 0) {
      products = products.filter((p) =>
        selectedCategories.some((catId) =>
          p.category?.toLowerCase().includes(catId.toLowerCase())
        )
      );
    }

    if (selectedBrands.length > 0) {
      products = products.filter((p) =>
        selectedBrands.some((brandId) => {
          const brand = brands.find(b => b.id === brandId);
          return brand && p.brand?.toLowerCase() === brand.name.toLowerCase();
        })
      );
    }

    if (selectedPriceRange !== null && priceRanges[selectedPriceRange]) {
      const range = priceRanges[selectedPriceRange];
      const minMajor = priceFromMinor(range.min);
      const maxMajor = range.max ? priceFromMinor(range.max) : Infinity;
      products = products.filter((p) => p.price >= minMajor && p.price < maxMajor);
    }

    if (selectedSizes.length > 0) {
      products = products.filter((p) =>
        p.variants.some((v) =>
          selectedSizes.some((size) => v.title?.toLowerCase().includes(size.toLowerCase()))
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "newest":
        return [...products].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return products;
    }
  }, [productsData, selectedCategories, selectedBrands, selectedPriceRange, selectedSizes, sortBy, brands, priceRanges]);

  const FilterContent = () => (
    <>
      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title="Category">
          <div className="space-y-1">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                label={category.name}
                count={category.count}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title="Brand">
          <div className="space-y-1">
            {brands.map((brand) => (
              <Checkbox
                key={brand.id}
                checked={selectedBrands.includes(brand.id)}
                onChange={() => toggleBrand(brand.id)}
                label={brand.name}
                count={brand.count}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price */}
      {priceRanges.length > 0 && (
        <FilterSection title="Price">
          <div className="space-y-1">
            {priceRanges.map((range, index) => (
              <Checkbox
                key={range.label}
                checked={selectedPriceRange === index}
                onChange={() => setSelectedPriceRange(selectedPriceRange === index ? null : index)}
                label={range.label}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <FilterSection title="Size">
          <div className="space-y-1">
            {sizes.map((size) => (
              <Checkbox
                key={size}
                checked={selectedSizes.includes(size)}
                onChange={() => toggleSize(size)}
                label={size}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear all filters
        </button>
      )}
    </>
  );

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Page Header */}
        <section className="px-6 lg:px-12 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <h1 className="text-4xl lg:text-5xl mb-4">Fragrances</h1>
          <p className="text-muted-foreground max-w-xl">
            Our complete collection of fragrances, each one crafted with intention and care.
          </p>
        </section>

        {/* Toolbar */}
        <div className="px-6 lg:px-12 pb-8 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-4">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm hover:opacity-50 transition-opacity"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center">
                  {selectedCategories.length + selectedBrands.length + (selectedPriceRange !== null ? 1 : 0) + selectedSizes.length}
                </span>
              )}
            </button>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${displayProducts.length} products`}
            </p>
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 px-6 lg:px-12 py-12 border-r border-border">
            <FilterContent />
          </aside>

          {/* Products Grid */}
          <section className="flex-1 px-6 lg:px-12 py-12">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-secondary mb-4" />
                    <div className="h-4 bg-secondary w-3/4 mb-2" />
                    <div className="h-4 bg-secondary w-1/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Unable to load products.</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No products match your filters.</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-50 transition-opacity"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 bg-black/20 z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 h-full w-full max-w-sm bg-background z-50 lg:hidden overflow-y-auto"
              >
                <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                  <span className="text-sm tracking-widest uppercase">Filters</span>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="hover:opacity-50 transition-opacity"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <FilterContent />
                </div>
                <div className="sticky bottom-0 p-6 bg-background border-t border-border">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full py-4 bg-foreground text-background text-sm tracking-widest uppercase"
                  >
                    View {displayProducts.length} Products
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
