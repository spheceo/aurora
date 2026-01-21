"use client";
import { useEffect, useRef, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.products().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Animate products on load
  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".product-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [loading]);

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

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
          !product.title.toLowerCase().includes(query) &&
          !product.description.toLowerCase().includes(query)
        ) {
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

  const clearFilters = () => {
    setSearchQuery("");
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
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-15 py-5">
          <Link href="/" className="flex items-center gap-3 group">
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <Link href="/">
            <h1 className="text-2xl font-medium">Aurora.</h1>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="group">
              <span className="text-sm">About</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <Link href="/contact" className="group">
              <span className="text-sm">Contact</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <div className="h-5 w-px bg-border" />
            <Cart />
          </div>
        </div>
      </nav>

      {/* Shop Hero */}
      <div ref={heroRef} className="px-15 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="space-y-4">
            <p className="hero-animate text-sm font-medium text-[#9A9A9A] tracking-wider uppercase">
              [Collection]
            </p>
            <h1 className="hero-animate text-6xl lg:text-7xl font-medium leading-tight">
              Our Crystal
              <br />
              Collection
            </h1>
          </div>
          <p className="hero-animate text-lg text-[#9A9A9A] max-w-md lg:text-right">
            Explore our curated selection of natural crystals, each chosen for
            its unique energy, clarity, and timeless beauty.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-[73px] z-40 bg-background border-y border-border">
        <div className="px-15 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" />
                <input
                  type="text"
                  placeholder="Search crystals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-transparent placeholder:text-[#9A9A9A] outline-none focus:border-foreground transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-border rounded-full transition-colors"
                  >
                    <LuX className="w-4 h-4 text-[#9A9A9A]" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Price Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-5 py-3 rounded-full border border-border flex items-center gap-2 hover:bg-secondary transition-colors text-sm">
                    <span>{priceRanges.find((r) => r.value === priceRange)?.label}</span>
                    <LuChevronDown className="w-4 h-4 text-[#9A9A9A]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border-border">
                  {priceRanges.map((range) => (
                    <DropdownMenuItem
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      className={priceRange === range.value ? "bg-secondary" : ""}
                    >
                      {range.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-5 py-3 rounded-full border border-border flex items-center gap-2 hover:bg-secondary transition-colors text-sm">
                    <LuArrowUpDown className="w-4 h-4" />
                    <span>{sortOptions.find((s) => s.value === sortBy)?.label}</span>
                    <LuChevronDown className="w-4 h-4 text-[#9A9A9A]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-background border-border">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={sortBy === option.value ? "bg-secondary" : ""}
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
                  className="px-5 py-3 rounded-full bg-foreground text-background flex items-center gap-2 hover:bg-foreground/90 transition-colors text-sm"
                >
                  <LuX className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              )}

              {/* Results Count */}
              <span className="text-sm text-[#9A9A9A] ml-auto">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-15 py-12">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
              <LuSearch className="w-10 h-10 text-[#9A9A9A]" />
            </div>
            <h2 className="text-2xl font-medium">No crystals found</h2>
            <p className="text-[#9A9A9A] text-center max-w-md">
              We couldn't find any crystals matching your criteria. Try adjusting your
              filters or search query.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center gap-2"
            >
              Clear all filters
              <FaArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card group cursor-pointer opacity-0"
              >
                {/* Product Image Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary mb-5">
                  {product.assets[0]?.url ? (
                    <Image
                      src={product.assets[0].url}
                      alt={product.assets[0].altText || product.title}
                      fill
                      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                        product.soldOut ? "opacity-50 grayscale" : ""
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-border" />
                    </div>
                  )}

                  {/* Sold Out Badge */}
                  {product.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-foreground text-background text-sm font-semibold px-4 py-2 rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {!product.soldOut && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(product);
                        toast("Added to cart", {
                          description: product.title,
                        });
                      }}
                      className="absolute bottom-4 right-4 p-4 rounded-full bg-foreground text-background opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                    </button>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-main transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p
                      className={`font-bold text-lg whitespace-nowrap ${
                        product.soldOut ? "text-[#9A9A9A]" : ""
                      }`}
                    >
                      {product.soldOut ? "—" : product.price.replace(" ZAR", "")}
                    </p>
                  </div>
                  <p className="text-sm text-[#9A9A9A] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-15 py-20 border-t border-border">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-medium mb-3">Can't find what you're looking for?</h2>
            <p className="text-[#9A9A9A] text-lg">
              Contact us for custom orders or special requests.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center gap-3 group"
          >
            <span className="font-medium">Get in Touch</span>
            <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
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
        <div className="flex items-center justify-between px-15 py-5">
          <div className="w-32 h-5 bg-secondary rounded animate-pulse" />
          <div className="w-24 h-7 bg-secondary rounded animate-pulse" />
          <div className="flex items-center gap-6">
            <div className="w-12 h-5 bg-secondary rounded animate-pulse" />
            <div className="w-14 h-5 bg-secondary rounded animate-pulse" />
            <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <div className="px-15 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="space-y-4">
            <div className="w-24 h-4 bg-secondary rounded animate-pulse" />
            <div className="space-y-2">
              <div className="w-80 h-16 bg-secondary rounded animate-pulse" />
              <div className="w-64 h-16 bg-secondary rounded animate-pulse" />
            </div>
          </div>
          <div className="w-96 h-20 bg-secondary rounded animate-pulse" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-[73px] z-40 bg-background border-y border-border">
        <div className="px-15 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md h-12 bg-secondary rounded-full animate-pulse" />
            <div className="w-32 h-12 bg-secondary rounded-full animate-pulse" />
            <div className="w-40 h-12 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="px-15 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-secondary rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-32 h-6 bg-secondary rounded animate-pulse" />
                  <div className="w-16 h-6 bg-secondary rounded animate-pulse" />
                </div>
                <div className="w-full h-4 bg-secondary rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-secondary rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
