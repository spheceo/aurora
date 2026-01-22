"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/orpc";
import { useCartStore } from "@/lib/zustand/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { ProductsResponseSchema } from "@/lib/products";
import { LuSearch, LuChevronDown, LuArrowUpDown, LuX } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { toast } from "@/components/ui/sonner";
import { parseAsString, useQueryState } from "nuqs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import gsap from "gsap";
import Cart from "@/components/cart";

type Product = z.infer<typeof ProductsResponseSchema>[number];

type PriceRange = "all" | "0-150" | "150-300" | "300-500";
type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: "all", label: "All Prices" },
  { value: "0-150", label: "R0 - R150" },
  { value: "150-300", label: "R150 - R300" },
  { value: "300-500", label: "R300+" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const getNumericPrice = (priceStr: string): number => {
  const match = priceStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export default function Shop() {
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [priceRangeParam, setPriceRangeParam] = useQueryState("price", parseAsString.withDefault(""));
  const [sortParam, setSortParam] = useQueryState("sort", parseAsString.withDefault(""));
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Derive price range and sort from params or default
  const priceRange: PriceRange = (["all", "0-150", "150-300", "300-500"].includes(priceRangeParam) ? priceRangeParam : "all") as PriceRange;
  const sortBy: SortOption = (["default", "price-asc", "price-desc", "name-asc", "name-desc"].includes(sortParam) ? sortParam : "default") as SortOption;

  const setPriceRange = (value: PriceRange) => {
    setPriceRangeParam(value === "all" ? null : value);
  };

  const setSortBy = (value: SortOption) => {
    setSortParam(value === "default" ? null : value);
  };

  useEffect(() => {
    api.products().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery.length > 0) {
          const query = trimmedQuery.toLowerCase();
          const matchesSearch =
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query);
          if (!matchesSearch) {
            return false;
          }
        }
        // Price filter
        if (priceRange !== "all") {
          const price = getNumericPrice(product.price);
          if (priceRange === "0-150" && (price < 0 || price > 150)) return false;
          if (priceRange === "150-300" && (price <= 150 || price > 300)) return false;
          if (priceRange === "300-500" && price <= 300) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return getNumericPrice(a.price) - getNumericPrice(b.price);
          case "price-desc":
            return getNumericPrice(b.price) - getNumericPrice(a.price);
          case "name-asc":
            return a.title.localeCompare(b.title);
          case "name-desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [products, searchQuery, priceRange, sortBy]);

  // Animate hero on mount
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".hero-animate"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }
  }, []);

  // Animate products (handles both initial load and filter changes)
  const prevLengthRef = useRef(0);
  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".product-card");
      const isInitialLoad = prevLengthRef.current === 0;

      // Kill any existing animations on these cards
      gsap.killTweensOf(cards);

      gsap.fromTo(
        cards,
        { opacity: 0, y: isInitialLoad ? 40 : 20 },
        {
          opacity: 1,
          y: 0,
          duration: isInitialLoad ? 0.6 : 0.4,
          stagger: isInitialLoad ? 0.08 : 0.05,
          ease: isInitialLoad ? "power3.out" : "power2.out",
        }
      );

      prevLengthRef.current = cards.length;
    }
  }, [filteredProducts.length, loading]);

  const clearFilters = () => {
    setSearchQuery(null);
    setPriceRange("all");
    setSortBy("default");
  };

  const hasActiveFilters = searchQuery || priceRange !== "all" || sortBy !== "default";

  if (loading) {
    return <ShopSkeleton />;
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-15 py-4">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-xs font-medium">Back</span>
          </Link>
          <Link href="/" className="cursor-pointer">
            <h1 className="text-xl font-medium">Aurora.</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="group cursor-pointer">
              <span className="text-xs">About</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <Link href="/contact" className="group cursor-pointer">
              <span className="text-xs">Contact</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <div className="h-4 w-px bg-border" />
            <Cart />
          </div>
        </div>
      </nav>

      {/* Shop Hero */}
      <div ref={heroRef} className="px-15 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3">
            <p className="hero-animate text-[10px] font-medium text-[#9A9A9A] tracking-widest uppercase">
              [Collection]
            </p>
            <h1 className="hero-animate text-5xl lg:text-6xl font-medium leading-tight">
              Our Crystal
              <br />
              Collection
            </h1>
          </div>
          <p className="hero-animate text-sm text-[#9A9A9A] max-w-md lg:text-right">
            Explore our curated selection of natural crystals, each chosen for
            its unique energy, clarity, and timeless beauty.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-[65px] z-40 bg-background border-y border-border">
        <div className="px-15 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-border bg-transparent placeholder:text-[#9A9A9A] text-sm outline-none focus:border-foreground transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery(null)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-border transition-colors cursor-pointer"
                  >
                    <LuX className="w-3 h-3 text-[#9A9A9A]" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Price Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 border border-border flex items-center gap-2 hover:bg-secondary transition-colors text-xs cursor-pointer">
                    <span>{priceRanges.find((r) => r.value === priceRange)?.label}</span>
                    <LuChevronDown className="w-3 h-3 text-[#9A9A9A]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border-border rounded-none min-w-[200px]">
                  {priceRanges.map((range) => (
                    <DropdownMenuItem
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      className={`text-foreground hover:bg-secondary cursor-pointer rounded-none ${priceRange === range.value ? "bg-secondary" : ""}`}
                    >
                      {range.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-4 py-2 border border-border flex items-center gap-2 hover:bg-secondary transition-colors text-xs cursor-pointer">
                    <LuArrowUpDown className="w-3 h-3" />
                    <span>{sortOptions.find((s) => s.value === sortBy)?.label}</span>
                    <LuChevronDown className="w-3 h-3 text-[#9A9A9A]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border-border rounded-none min-w-[200px]">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`text-foreground hover:bg-secondary cursor-pointer rounded-none ${sortBy === option.value ? "bg-secondary" : ""}`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-foreground text-background flex items-center gap-1.5 hover:bg-foreground/90 transition-colors text-xs cursor-pointer"
                >
                  <LuX className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}

              {/* Results Count */}
              <span className="text-xs text-[#9A9A9A] ml-auto">
                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-15 py-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <LuSearch className="w-8 h-8 text-[#9A9A9A]" />
            <h2 className="text-lg font-medium">No products found</h2>
            <p className="text-sm text-[#9A9A9A] text-center max-w-md">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 px-5 py-2.5 bg-foreground text-background hover:bg-foreground/90 transition-colors text-xs font-medium tracking-wider uppercase cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2.5 gap-y-5"
          >
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.numericId}`}
                className="product-card group cursor-pointer opacity-0 max-w-[180px] block"
              >
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden mb-2">
                  {product.assets[0]?.url ? (
                    <Image
                      src={product.assets[0].url}
                      alt={product.assets[0].altText || product.title}
                      fill
                      className={`object-cover transition-opacity duration-300 ${
                        product.soldOut ? "opacity-30" : "group-hover:opacity-90"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                      <div className="w-8 h-8 rounded-full bg-border/50" />
                    </div>
                  )}

                  {/* Sold Out Label */}
                  {product.soldOut && (
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 bg-background/80 backdrop-blur-sm">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium leading-tight truncate">
                      {product.title}
                    </h3>
                    <p className={`text-sm font-medium whitespace-nowrap ${product.soldOut ? "text-[#9A9A9A]" : ""}`}>
                      {product.soldOut ? "—" : product.price.replace(" ZAR", "")}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  {!product.soldOut && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(product);
                        toast("Added to cart");
                      }}
                      className="w-full py-2 border border-border text-xs font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-15 py-16 border-t border-border">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-medium mb-2">Can't find what you're looking for?</h2>
            <p className="text-[#9A9A9A] text-sm">
              Contact us for custom orders or special requests.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center gap-2 group text-xs font-medium tracking-wider uppercase cursor-pointer"
          >
            <span>Get in Touch</span>
            <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="min-h-dvh bg-background">
      {/* Nav Skeleton */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-15 py-4">
          <div className="w-16 h-3 bg-secondary/30 animate-pulse" />
          <div className="w-20 h-5 bg-secondary/30 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-3 bg-secondary/30 animate-pulse" />
            <div className="w-12 h-3 bg-secondary/30 animate-pulse" />
            <div className="w-6 h-6 bg-secondary/30 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <div className="px-15 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="w-20 h-3 bg-secondary/30 animate-pulse" />
            <div className="space-y-2">
              <div className="w-72 h-14 bg-secondary/30 animate-pulse" />
              <div className="w-56 h-14 bg-secondary/30 animate-pulse" />
            </div>
          </div>
          <div className="w-80 h-16 bg-secondary/30 animate-pulse" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-[65px] z-40 bg-background border-y border-border">
        <div className="px-15 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-sm h-9 bg-secondary/30 animate-pulse" />
            <div className="w-28 h-9 bg-secondary/30 animate-pulse" />
            <div className="w-36 h-9 bg-secondary/30 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="px-15 py-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="space-y-2.5">
              <div className="aspect-square bg-secondary/30 animate-pulse" />
              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <div className="w-2/3 h-4 bg-secondary/30 animate-pulse" />
                  <div className="w-1/4 h-4 bg-secondary/30 animate-pulse" />
                </div>
                <div className="w-full h-8 bg-secondary/30 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
