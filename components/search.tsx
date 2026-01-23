"use client";
import { useEffect, useRef, useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { LuChevronDown, LuSearch, LuX } from "react-icons/lu";
import { api } from "@/lib/orpc";
import { z } from "zod";
import { ProductsResponseSchema } from "@/lib/products";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/custom-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/custom-dropdown";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { toast } from "@/components/ui/custom-toast";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

type Product = z.infer<typeof ProductsResponseSchema>[number];

type PriceRange = "all" | "0-150" | "150-300" | "300-500";

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: "all", label: "All Prices" },
  { value: "0-150", label: "R0 - R150" },
  { value: "150-300", label: "R150 - R300" },
  { value: "300-500", label: "R300 - R500+" },
];

// Helper to extract numeric price from string like "450.00 ZAR"
const getNumericPrice = (priceStr: string): number => {
  const match = priceStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

export default function Search() {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [priceRangeParam, setPriceRangeParam] = useQueryState("p", parseAsString.withDefault(""));
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { addItem } = useCartStore();

  // Derive price range from param or default to "all"
  const priceRange: PriceRange = (["all", "0-150", "150-300", "300-500"].includes(priceRangeParam) ? priceRangeParam : "all") as PriceRange;

  const setPriceRange = (value: PriceRange) => {
    setPriceRangeParam(value === "all" ? null : value);
  };

  // Filter products by price range
  const filteredProducts = products.filter((product) => {
    if (priceRange === "all") return true;
    const price = getNumericPrice(product.price);
    if (priceRange === "0-150") return price >= 0 && price <= 150;
    if (priceRange === "150-300") return price > 150 && price <= 300;
    if (priceRange === "300-500") return price > 300;
    return true;
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery(null);
      setPriceRangeParam(null);
    }
  };

  // Open dialog if query or price param is present
  useEffect(() => {
    if (query || priceRangeParam) setOpen(true);
  }, [query, priceRangeParam]);

  // Initial fetch when dialog opens
  useEffect(() => {
    if (open && !hasSearched) {
      const trimmedQuery = query.trim();
      // On initial load with no query, show 5 products. If there's a query, show all.
      api.products({
        first: trimmedQuery ? undefined : 5,
        query: trimmedQuery || undefined
      }).then((data) => {
        setProducts(data);
        setHasSearched(true);
      });
    }
  }, [open]);

  // Debounced search - waits 50ms after user stops typing
  useEffect(() => {
    if (!hasSearched) return; // Skip debounce on initial load

    // Clear any existing timeout
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const trimmedQuery = query.trim();
      // When searching, show all results. When query is empty, show 5
      api.products({
        first: trimmedQuery ? undefined : 5,
        query: trimmedQuery || undefined
      }).then((data) => {
        setProducts(data);
      });
    }, 50);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="cursor-pointer outline-none">
          <LuSearch />
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-5xl! sm:max-w-5xl! w-[75vw] max-h-[70vh] overflow-y-auto p-0 bg-background border-border rounded-none overscroll-contain"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search products</DialogTitle>
          <DialogDescription>Find items available in the store.</DialogDescription>
        </DialogHeader>

        {/* Sticky Header and Controls */}
        <div className="sticky top-0 z-10 bg-background">
          {/* Header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wider text-foreground">Search Products</h2>
            <DialogClose className="hover:opacity-70 transition-opacity outline-none cursor-pointer">
              <LuX className="w-4 h-4 text-foreground" />
            </DialogClose>
          </div>

          {/* Search Controls */}
          <div className="px-6 py-4 border-b border-border">
          <div className="flex gap-2">
            <div className="px-4 py-2.5 border border-border flex items-center gap-3 flex-1">
              <LuSearch className="text-[#9A9A9A] w-4 h-4" />
              <input
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="placeholder:text-[#9A9A9A] outline-none w-full text-sm bg-transparent text-foreground"
              />
            </div>
            {/* Price Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2.5 border border-border flex items-center gap-2 hover:bg-secondary transition-colors whitespace-nowrap cursor-pointer text-xs text-foreground">
                  <span>{priceRanges.find((r) => r.value === priceRange)?.label}</span>
                  <LuChevronDown className="w-3 h-3 text-[#9A9A9A]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border rounded-none min-w-[200px]">
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
          </div>
        </div>
        </div>

        {/* Results */}
        <div className="px-6 py-6 min-h-[280px]">
          {hasSearched && !filteredProducts?.length ? (
            <div className="flex flex-col items-center justify-center h-[280px]">
              <LuSearch className="w-8 h-8 text-[#9A9A9A] mb-3" />
              <p className="text-[#9A9A9A] text-sm">No products found</p>
            </div>
          ) : filteredProducts?.length ? (
            <>
              <p className="text-[10px] text-[#9A9A9A] mb-4 uppercase tracking-wider">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Result' : 'Results'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.numericId}`} className="group cursor-pointer">
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden bg-secondary/30 mb-2">
                      {product.assets[0]?.url ? (
                        <Image
                          src={product.assets[0].url}
                          alt={product.assets[0].altText || product.title}
                          fill
                          className={`object-cover transition-opacity duration-300 ${product.soldOut ? "opacity-30" : "group-hover:opacity-90"}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-border/50" />
                        </div>
                      )}

                      {/* Sold Out Badge */}
                      {product.soldOut && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 bg-background/80 backdrop-blur-sm text-foreground">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-xs font-medium leading-tight truncate uppercase tracking-wide text-foreground">
                          {product.title}
                        </h3>
                        <p className={`text-xs font-medium whitespace-nowrap ${product.soldOut ? "text-[#9A9A9A]" : "text-foreground"}`}>
                          {product.soldOut ? "—" : product.price.replace(" ZAR", "")}
                        </p>
                      </div>
                      {!product.soldOut && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product);
                            toast("Added to cart");
                          }}
                          className="w-full py-1.5 border border-border text-[10px] font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 uppercase tracking-wider text-foreground cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
