"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CaretDown,
  X,
  SlidersHorizontal,
  GridFour,
  SquaresFour,
  Check,
  SpinnerGap,
  Medal,
  Eye,
  ArrowCounterClockwise,
  Gift,
  Truck,
  Plus,
  Minus,
} from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListingProductCard } from "@/components/ListingProductCard";
import { useProducts, useBrands } from "@/lib/hooks";
import { transformProducts } from "@/lib/transforms";
import { priceFromMinor } from "@/lib/schemas";
import { product as productConfig, content } from "@/config/vertical";
import { SEO_FAQS } from "@/config/seo/eyewear-faqs";

const QUICK_FILTERS = productConfig.quickFilters;
const SORT_OPTIONS = productConfig.sortOptions;

// Generate price ranges from min/max
function generatePriceRanges(min?: number, max?: number) {
  if (!min && !max) return [];

  const minPrice = min || 0;
  const maxPrice = max || 100000;
  const minMajor = priceFromMinor(minPrice);
  const maxMajor = priceFromMinor(maxPrice);

  const ranges: { label: string; min: number; max?: number }[] = [];

  if (maxMajor <= 200) {
    ranges.push({ label: `Under £${Math.ceil(maxMajor)}`, min: 0, max: maxPrice });
  } else {
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

  return ranges.slice(0, 5);
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
    <div className="pb-3 mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left py-1.5"
        aria-expanded={isOpen}
      >
        <span className="text-[#666] text-[10px] w-3 flex justify-center pb-0.5">
          {isOpen ? "^" : "v"}
        </span>
        <span className="text-[13px] text-[#1A1A1A]">{title}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
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
      className="flex items-center justify-between w-full py-1.5 text-sm hover:text-[var(--primary)] transition-colors group"
    >
      <span className="flex items-center gap-2">
        <span
          className={`w-3.5 h-3.5 flex items-center justify-center transition-all ${
            checked
              ? "bg-white border-2 border-[#1A1A1A]"
              : "border border-[#CCC] group-hover:border-[#999]"
          }`}
        >
          {checked && <div className="w-1.5 h-1.5 bg-[#1A1A1A]" />}
        </span>
        <span className={checked ? "font-medium" : ""}>{label}</span>
      </span>
      {count !== undefined && (
        <span className="text-[var(--muted-foreground)] text-xs tabular-nums">{count}</span>
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
  const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label || "Featured";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-md hover:border-[var(--primary)] transition-colors"
      >
        <span>Sort: {currentLabel}</span>
        <CaretDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 top-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-20 min-w-[200px] overflow-hidden"
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition-colors ${
                    value === option.value ? "text-[var(--primary)] font-medium" : ""
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActiveFilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)] text-white text-sm rounded-sm">
      {label}
      <button onClick={onRemove} className="hover:bg-white/20 rounded-full p-2 transition-colors" aria-label={`Remove ${label} filter`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/**
 * Collapsible FAQ row used in the bottom-of-page SEO section.
 * Closed by default, single-panel toggle, smooth height animation.
 */
function SeoFaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E5E5E5] last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span
          className="text-[15px] text-[#1A1A1A] group-hover:text-black transition-colors pr-6"
          style={{ fontFamily: "'Crimson Pro', 'Georgia', serif" }}
        >
          {question}
        </span>
        <span className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-[#666]">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[13px] leading-relaxed text-[#666] max-w-[700px]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Guarantees list rendered as icon + title + body cards. */
const SEO_GUARANTEES = [
  {
    Icon: Medal,
    title: "100% Authentic",
    body: "All eyewear sourced directly from authorized retailers and verified for authenticity.",
  },
  {
    Icon: Eye,
    title: "Expert Quality Assurance",
    body: "Every pair inspected by optometry professionals before shipping.",
  },
  {
    Icon: ArrowCounterClockwise,
    title: "30-Day Hassle-Free Returns",
    body: "Not satisfied? Return for a full refund, no questions asked.",
  },
  {
    Icon: Gift,
    title: "Complimentary Care Kit",
    body: "Premium cleaning cloth and protective case with every order.",
  },
  {
    Icon: Truck,
    title: "Fast, Secure Shipping",
    body: "Fully insured delivery with tracking to your door.",
  },
] as const;

const SEO_FRAME_STYLES = [
  { title: "Aviator", body: "Timeless teardrop design, universally flattering" },
  { title: "Cat-Eye", body: "Vintage-inspired feminine elegance" },
  { title: "Wayfarer", body: "Bold rectangular frames, iconic look" },
  { title: "Round", body: "Retro circular frames for every face shape" },
  { title: "Oversized", body: "Maximum coverage and fashion impact" },
  { title: "Sport", body: "Performance eyewear for active lifestyles" },
  { title: "Square", body: "Modern angular aesthetic" },
  { title: "Optical", body: "Prescription-ready eyeglasses" },
] as const;

function EyewearPageContent() {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [quickFilter, setQuickFilter] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 24;

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Build API query params from active filters
  const apiParams = useMemo(() => {
    const params: Parameters<typeof useProducts>[0] = { limit: PAGE_SIZE, page };

    // Check for sale parameter
    const saleParam = searchParams.get('sale');
    if (saleParam === 'true') {
      params.onSale = true;
    }

    // Quick filter → map to API params. Each pill maps to a proper filter
    // (not a blind text search on the pill value, which is how "New Arrivals"
    // used to return empty results — the backend was searching products for
    // the literal word "newest").
    if (quickFilter === "under-150") {
      params.maxPrice = 15000; // cents
    } else if (quickFilter === "newest") {
      // "New Arrivals" → sort by most recent, no text query
      params.sortBy = "newest";
      params.sortDirection = "desc";
    } else if (quickFilter === "sunglasses" || quickFilter === "optical") {
      params.query = quickFilter;
    } else if (quickFilter === "polarized") {
      params.query = "polarized";
    } else if (quickFilter) {
      // Frame shape filters (aviator, cat-eye, round, etc.)
      params.query = quickFilter;
    }

    // Sidebar filters → API params
    if (selectedCategories.length > 0) {
      params.categoryIds = selectedCategories;
    }
    if (selectedBrands.length > 0) {
      params.brandIds = selectedBrands;
    }
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      if (range) {
        params.minPrice = range.min * 100; // convert to cents
        if (range.max) params.maxPrice = range.max * 100;
      }
    }

    // Sizes filter
    if (selectedSizes.length > 0) {
      params.sizes = selectedSizes;
    }

    // Sort — all options are API-backed
    switch (sortBy) {
      case "price-low":
        params.sortBy = "price";
        params.sortDirection = "asc";
        break;
      case "price-high":
        params.sortBy = "price";
        params.sortDirection = "desc";
        break;
      case "newest":
        params.sortBy = "newest";
        params.sortDirection = "desc";
        break;
      case "bestselling":
        params.sortBy = "bestselling";
        break;
      case "rating":
        params.sortBy = "rating";
        break;
      // "featured" = default, no sortBy param needed
    }

    return params;
  }, [searchParams, quickFilter, selectedCategories, selectedBrands, selectedPriceRange, selectedSizes, sortBy, page]);

  const { data: productsData, isLoading, error } = useProducts(apiParams);
  const { data: brandsData } = useBrands();

  // Also fetch unfiltered data for filter options (categories, brands, price range)
  const { data: unfilteredData } = useProducts({ limit: 1 });
  const filters = unfilteredData?.filters || productsData?.filters;
  const categories = filters?.categories || [];
  const sizes = filters?.sizes || [];

  // Brands come from the dedicated /store/brands endpoint (useBrands). The
  // storefront products endpoint currently returns filters: null, so we
  // cannot rely on productsData.filters.brands for either the sidebar
  // checkboxes or the URL-param → brand matching. Normalize here to the
  // shape the rest of the page expects: { id, name, count }.
  const brands = useMemo(
    () =>
      (brandsData?.brands ?? [])
        .filter((b) => b.product_count > 0)
        .map((b) => ({ id: b.id, name: b.name, slug: b.slug, count: b.product_count })),
    [brandsData]
  );

  // Initialize filters from URL params. Match `?brand=<slug|name|id>` against
  // the brands list from useBrands().
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam && brands.length > 0) {
      const paramLower = brandParam.toLowerCase();
      const matchedBrand = brands.find(
        (b) =>
          b.id === brandParam ||
          b.slug.toLowerCase() === paramLower ||
          b.name.toLowerCase() === paramLower
      );
      if (matchedBrand && !selectedBrands.includes(matchedBrand.id)) {
        setSelectedBrands([matchedBrand.id]);
      }
    }

    // Check for sale parameter
    const saleParam = searchParams.get('sale');
    if (saleParam === 'true') {
      // Sale filter will be handled in apiParams
    }
  }, [searchParams, brands, selectedBrands]);
  const priceRanges = useMemo(() => {
    return generatePriceRanges(filters?.priceRange?.min, filters?.priceRange?.max);
  }, [filters?.priceRange]);

  // Check if we have any filters to display in sidebar
  const hasFiltersToShow = categories.length > 0 || brands.length > 0 || sizes.length > 0 || priceRanges.length > 0;

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
    setPage(0);
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((b) => b !== brandId) : [...prev, brandId]
    );
    setPage(0);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setPage(0);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setSelectedSizes([]);
    setQuickFilter("");
    setPage(0);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRange !== null || selectedSizes.length > 0 || quickFilter !== "";
  const activeFilterCount = selectedCategories.length + selectedBrands.length + (selectedPriceRange !== null ? 1 : 0) + selectedSizes.length + (quickFilter ? 1 : 0);

  const displayProducts = useMemo(() => {
    if (!productsData?.items) return [];
    return transformProducts(productsData.items);
  }, [productsData]);

  // Compute dynamic page title based on active filters
  const pageTitle = useMemo(() => {
    const saleParam = searchParams.get('sale');
    if (saleParam === 'true') {
      return "Sale Eyewear";
    }
    if (selectedBrands.length === 1) {
      const brand = brands.find(b => b.id === selectedBrands[0]);
      if (brand) return `${brand.name} Eyewear`;
    }
    if (selectedBrands.length > 1) {
      return "Designer Eyewear";
    }
    return productConfig.catalogTitle;
  }, [searchParams, selectedBrands, brands]);

  const FilterContent = () => (
    <>
      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title="Category">
          <div className="space-y-0.5">
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
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
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
          <div className="space-y-0.5">
            {priceRanges.map((range, index) => (
              <Checkbox
                key={range.label}
                checked={selectedPriceRange === index}
                onChange={() => { setSelectedPriceRange(selectedPriceRange === index ? null : index); setPage(0); }}
                label={range.label}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <FilterSection title="Frame Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-sm border rounded-md transition-all ${
                  selectedSizes.includes(size)
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-[var(--primary)] hover:underline mt-2"
        >
          Clear all filters
        </button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main>
        {/* Page Header - Compact Pret A Voir layout */}
        <section className="px-4 lg:px-8 py-4">
          <div className="flex flex-col gap-2">
            <h1
              className="text-2xl font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {pageTitle}
            </h1>
            <p className="text-[13px] text-[#666]">
              {(() => {
                const total = productsData?.total;
                if (!total) return productConfig.catalogDescription;
                // "X products" when a filter is active (brand/category/etc) — saying
                // "across N brands" would be misleading since the result set has
                // been narrowed to a subset.
                if (hasActiveFilters) {
                  return `${total} ${total === 1 ? "product" : "products"}`;
                }
                const brandCount = brandsData?.brands?.filter((b) => b.product_count > 0).length ?? 0;
                if (brandCount > 0) {
                  return `${total} products across ${brandCount} ${brandCount === 1 ? "brand" : "brands"}`;
                }
                return `${total} ${total === 1 ? "product" : "products"}`;
              })()}
            </p>
          </div>
        </section>

        {/* Toolbar */}
        <div className="sticky top-[60px] z-30 bg-white border-b border-[#E5E5E5]">
          <div className="px-4 lg:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {hasFiltersToShow && (
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-md hover:border-[var(--primary)] transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 bg-[var(--primary)] text-white text-xs flex items-center justify-center rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                )}
                <p className="text-sm text-[var(--muted-foreground)] tabular-nums">
                  {isLoading ? "Loading..." : `${displayProducts.length} of ${productsData?.total ?? 0} products`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-1 border border-[var(--border)] rounded-md p-1">
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 rounded transition-colors ${gridCols === 3 ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"}`}
                    aria-label="3 columns"
                  >
                    <SquaresFour className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`p-1.5 rounded transition-colors ${gridCols === 4 ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"}`}
                    aria-label="4 columns"
                  >
                    <GridFour className="w-4 h-4" />
                  </button>
                </div>

                <SortDropdown value={sortBy} onChange={(v) => { setSortBy(v); setPage(0); }} />
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                <span className="text-sm text-[var(--muted-foreground)]">Active filters:</span>
                {quickFilter && (
                  <ActiveFilterBadge
                    label={QUICK_FILTERS.find(f => f.value === quickFilter)?.label || quickFilter}
                    onRemove={() => setQuickFilter("")}
                  />
                )}
                {selectedCategories.map((catId) => {
                  const cat = categories.find(c => c.id === catId);
                  return cat ? (
                    <ActiveFilterBadge
                      key={catId}
                      label={cat.name}
                      onRemove={() => toggleCategory(catId)}
                    />
                  ) : null;
                })}
                {selectedBrands.map((brandId) => {
                  const brand = brands.find(b => b.id === brandId);
                  return brand ? (
                    <ActiveFilterBadge
                      key={brandId}
                      label={brand.name}
                      onRemove={() => toggleBrand(brandId)}
                    />
                  ) : null;
                })}
                {selectedPriceRange !== null && priceRanges[selectedPriceRange] && (
                  <ActiveFilterBadge
                    label={priceRanges[selectedPriceRange].label}
                    onRemove={() => setSelectedPriceRange(null)}
                  />
                )}
                {selectedSizes.map((size) => (
                  <ActiveFilterBadge
                    key={size}
                    label={size}
                    onRemove={() => toggleSize(size)}
                  />
                ))}
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex border-t border-[#E5E5E5]">
          {hasFiltersToShow && (
            <aside className="hidden lg:block w-64 flex-shrink-0 py-6 border-r border-[#E5E5E5]">
              <div className="px-4 pr-6">
                <FilterContent />
              </div>
            </aside>
          )}

          <section className="flex-1 px-4 lg:px-6 py-6">
            
            {/* Quick Filters - Pret a Voir Black Pills */}
            <div className="flex justify-center flex-wrap gap-3 mb-8">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => { setQuickFilter(filter.value === quickFilter ? "" : filter.value); setPage(0); }}
                  className={`px-6 py-1.5 text-[11px] font-bold tracking-widest rounded-full transition-all ${
                    quickFilter === filter.value
                      ? "bg-[#666] text-white border-2 border-[#666]"
                      : "bg-black text-white border-2 border-black hover:bg-[#333] hover:border-[#333]"
                  }`}
                >
                  {filter.label.toUpperCase()} +
                </button>
              ))}
            </div>
            {isLoading ? (
              <div className={`grid grid-cols-2 lg:grid-cols-${gridCols} gap-6 lg:gap-8`}>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border border-[#E5E5E5] p-2 lg:p-4 bg-white"
                  >
                    <div className="relative w-full aspect-[4/3] bg-[#FAFAFA] mb-4 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>
                    <div className="flex flex-col items-center gap-2 px-1 mb-2">
                      <div className="h-3 w-3/4 bg-[#F0F0F0] rounded-sm animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                      <div className="h-3 w-1/3 bg-[#F0F0F0] rounded-sm animate-pulse" style={{ animationDelay: `${i * 80 + 50}ms` }} />
                      <div className="h-3 w-16 bg-[#F0F0F0] rounded-sm animate-pulse" style={{ animationDelay: `${i * 80 + 100}ms` }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-[var(--muted-foreground)] mb-4">Unable to load products.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try again
                </button>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface)] flex items-center justify-center">
                  <SlidersHorizontal className="h-6 w-6 text-[var(--muted-foreground)]" />
                </div>
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-[var(--muted-foreground)] mb-4">Try adjusting your filters</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-primary">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6 lg:gap-8`}>
                {displayProducts.map((product, index) => (
                  <ListingProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}

            {displayProducts.length > 0 && (() => {
              const total = productsData?.total ?? 0;
              const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
              const isLastPage = page >= totalPages - 1;
              return (
                <div className="flex flex-col items-center gap-4 mt-12">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Page {page + 1} of {totalPages}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={page === 0}
                      onClick={() => { setPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="px-5 py-2 text-sm border border-[var(--border)] rounded-md hover:border-[var(--primary)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    <button
                      disabled={isLastPage}
                      onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="px-5 py-2 text-sm border border-[var(--border)] rounded-md hover:border-[var(--primary)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Next
                    </button>
                  </div>
                </div>
              );
            })()}
          </section>
        </div>

        {/* SEO Content Section — sits below the product grid so shoppers see
            products first. Gated on !hasActiveFilters so brand- or
            category-filtered views don't render generic multi-brand copy.
            Redesigned with proper hierarchy: serif display headings, icon
            cards for the guarantees, bordered style cards, and a
            collapsible FAQ accordion. */}
        {!hasActiveFilters && (
          <section className="border-t border-[#E5E5E5] bg-[#FAFAFA]">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-20">

              {/* Editorial intro — serif display heading + lede */}
              <div className="max-w-[720px] mx-auto text-center mb-20">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-4">
                  The Vernont Collection
                </p>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl leading-tight text-[#1A1A1A] mb-6"
                  style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                >
                  Designer sunglasses &amp; luxury eyewear, curated.
                </h2>
                <p className="text-[15px] leading-relaxed text-[#555]">
                  Discover frames from the world&apos;s most prestigious brands &mdash; Miu Miu, Maui Jim,
                  Ray-Ban, Oakley, and more. Each piece is selected for its exceptional quality,
                  timeless design, and superior craftsmanship &mdash; whether you&apos;re seeking polarized
                  sunglasses for outdoor adventures, prescription frames for everyday wear, or
                  statement optical pieces that express your unique style.
                </p>
              </div>

              {/* Guarantees — icon cards on a clean 5-up grid */}
              <div className="mb-20">
                <div className="text-center mb-10">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-3">Our Promise</p>
                  <h3
                    className="text-2xl md:text-3xl text-[#1A1A1A]"
                    style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                  >
                    Why shoppers choose Vernont
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {SEO_GUARANTEES.map(({ Icon, title, body }) => (
                    <div
                      key={title}
                      className="bg-white border border-[#E5E5E5] rounded-sm p-6 flex flex-col items-center text-center hover:border-[#1A1A1A] transition-colors duration-300"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-[#1A1A1A]" weight="regular" />
                      </div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                        {title}
                      </h4>
                      <p className="text-[12px] leading-relaxed text-[#666]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Polarized feature block — editorial 2-column */}
              <div className="mb-20 bg-white border border-[#E5E5E5] rounded-sm p-8 md:p-12">
                <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-3">Featured</p>
                    <h3
                      className="text-2xl md:text-3xl text-[#1A1A1A] leading-tight"
                      style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                    >
                      Premium polarized sunglasses
                    </h3>
                  </div>
                  <div className="space-y-4 text-[14px] leading-relaxed text-[#555]">
                    <p>
                      Our polarized collection features advanced lens technology that reduces glare
                      and enhances visual clarity &mdash; perfect for driving, water sports, skiing, and
                      everyday outdoor activities. Polarized lenses eliminate reflected light from
                      horizontal surfaces like roads, water, and snow.
                    </p>
                    <p>
                      Choose from top brands like Maui Jim (renowned for their color-enhancing
                      PolarizedPlus2 technology), Ray-Ban (iconic style meets performance), and
                      Oakley (sport-optimized optical engineering). All our polarized sunglasses
                      provide 100% UVA and UVB protection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shop by style — bordered cards in a 4-up grid */}
              <div className="mb-20">
                <div className="text-center mb-10">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-3">By Shape</p>
                  <h3
                    className="text-2xl md:text-3xl text-[#1A1A1A]"
                    style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                  >
                    Find your perfect frame
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SEO_FRAME_STYLES.map(({ title, body }) => (
                    <div
                      key={title}
                      className="group bg-white border border-[#E5E5E5] rounded-sm p-6 hover:border-[#1A1A1A] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                    >
                      <h4
                        className="text-xl text-[#1A1A1A] mb-2"
                        style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                      >
                        {title}
                      </h4>
                      <p className="text-[12px] leading-relaxed text-[#666]">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ — collapsible accordion */}
              <div>
                <div className="text-center mb-10">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-3">Questions</p>
                  <h3
                    className="text-2xl md:text-3xl text-[#1A1A1A]"
                    style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", fontWeight: 400 }}
                  >
                    Frequently asked
                  </h3>
                </div>
                <div className="max-w-[820px] mx-auto bg-white border border-[#E5E5E5] rounded-sm px-6 md:px-10">
                  {SEO_FAQS.map(({ q, a }) => (
                    <SeoFaqItem key={q} question={q} answer={a} />
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed left-0 top-0 h-full w-full max-w-sm bg-[var(--background)] z-50 lg:hidden overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
                    <span className="font-semibold">Filters</span>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <FilterContent />
                  </div>
                  <div className="sticky bottom-0 p-4 bg-[var(--background)] border-t border-[var(--border)]">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full btn-primary btn-lg"
                    >
                      Show {displayProducts.length} products
                    </button>
                  </div>
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

export default function EyewearPageClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <SpinnerGap className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        </main>
        <Footer />
      </div>
    }>
      <EyewearPageContent />
    </Suspense>
  );
}
