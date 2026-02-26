"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { toast } from "@/components/ui/custom-toast";
import { api } from "@/lib/orpc";
import { z } from "zod";
import { ProductsResponseSchema } from "@/lib/products";
import gsap from "gsap";
import Cart from "@/components/cart";

type Product = z.infer<typeof ProductsResponseSchema>[number];
type ProductClientProps = {
  product: Product | null;
  recommendedProducts: Product[];
};

export default function ProductClient({ product, recommendedProducts }: ProductClientProps) {
  const { addItem } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const mainImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (!product) return;

    const images = product.assets.filter((a) => a.url);
    if (images.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product]);

  useEffect(() => {
    if (product) {
      // Animate main image
      if (mainImageRef.current) {
        gsap.fromTo(
          mainImageRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        );
      }

      // Animate content
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelectorAll(".animate-content"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }

      // Animate thumbnails
      if (thumbsRef.current) {
        gsap.fromTo(
          thumbsRef.current.children,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          }
        );
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product && !product.soldOut) {
      // Add the product multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      toast(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
      setQuantity(1); // Reset quantity after adding
    }
  };

  const handleCheckout = () => {
    if (product && !product.soldOut) {
      const lineItems = [
        {
          variantId: product.variantId,
          quantity: quantity,
        },
      ];

      toast.promise(
        api.checkout({ lineItems }),
        {
          loading: "Creating checkout...",
          success: (data) => {
            window.location.href = data.checkoutUrl;
            return "Redirecting to checkout...";
          },
          error: "Failed to create checkout",
        }
      );
    }
  };

  if (!product) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Product not found</h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors text-xs font-medium tracking-wider uppercase cursor-pointer"
          >
            <span>Back to Shop</span>
            <FaArrowRight className="-rotate-45" />
          </Link>
        </div>
      </div>
    );
  }

  const images = product.assets.filter((a) => a.url);
  const hasMultipleImages = images.length > 1;

  // Format price to show only the currency symbol and amount
  const formatPrice = (price: string) => {
    return price.replace(" ZAR", "").trim();
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-15 py-3 md:py-4">
          <Link href="/" className="inline-flex items-center cursor-pointer">
            <Image src="/logo.png" alt="Aurora logo" width={34} height={34} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="group cursor-pointer hidden sm:block">
              <span className="text-xs">About</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <Link href="/contact" className="group cursor-pointer hidden sm:block">
              <span className="text-xs">Contact</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <Cart />
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="px-4 md:px-15 pt-4 md:pt-6 pb-3 md:pb-4">
        <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
          <Link href="/" className="hover:text-foreground transition-colors cursor-pointer">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors cursor-pointer">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[150px] md:max-w-[200px]">
            {product.title}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-4 md:px-15 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Images */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image */}
            <div
              ref={mainImageRef}
              className="relative aspect-square overflow-hidden bg-secondary/30 group"
            >
              {images[selectedImageIndex]?.url ? (
                <Image
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].altText || product.title}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    product.soldOut ? "opacity-30" : "group-hover:scale-105"
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-border/50" />
                </div>
              )}

              {/* Sold Out Badge */}
              {product.soldOut && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 bg-background/80 backdrop-blur-sm">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {hasMultipleImages && (
              <div ref={thumbsRef} className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 overflow-hidden bg-secondary/30 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? "border-foreground"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div ref={contentRef} className="lg:col-span-7 space-y-8">
            <div className="space-y-4 animate-content">
              <p className="text-[10px] font-medium text-[#9A9A9A] tracking-widest uppercase">
                [Product Details]
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
                {product.title}
              </h1>
              <p
                className={`text-xl md:text-2xl font-medium ${
                  product.soldOut ? "text-[#9A9A9A]" : ""
                }`}
              >
                {product.soldOut ? "—" : formatPrice(product.price)}
              </p>
            </div>

            <div className="space-y-4 animate-content">
              <h2 className="text-sm font-medium">Description</h2>
              <div className="text-[#9A9A9A] leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {/* Quantity Selector */}
            {!product.soldOut && (
              <div className="animate-content">
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer text-foreground"
                  >
                    <FaArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer text-foreground"
                  >
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {!product.soldOut && (
              <div className="animate-content flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 md:px-8 py-3 md:py-4 border border-border text-foreground transition-colors text-sm font-medium tracking-wider uppercase cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium tracking-wider uppercase cursor-pointer"
                >
                  Checkout Now
                </button>
              </div>
            )}

            {product.soldOut && (
              <div className="animate-content">
                <p className="text-sm text-[#9A9A9A]">
                  This product is currently out of stock.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="border-t border-border">
          <div className="px-4 md:px-15 py-10 md:py-12">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-medium text-[#9A9A9A] tracking-widest uppercase mb-3">
                  [You May Also Like]
                </p>
                <h2 className="text-2xl md:text-3xl font-medium">Recommended Products</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {recommendedProducts.map((recProduct) => (
                  <Link
                    key={recProduct.id}
                    href={`/product/${recProduct.numericId}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden bg-secondary/30 mb-2">
                      {recProduct.assets[0]?.url ? (
                        <Image
                          src={recProduct.assets[0].url}
                          alt={
                            recProduct.assets[0].altText || recProduct.title
                          }
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            recProduct.soldOut
                              ? "opacity-30"
                              : "group-hover:opacity-90"
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 bg-border/50" />
                        </div>
                      )}

                      {recProduct.soldOut && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 bg-background/80 backdrop-blur-sm">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-medium leading-tight truncate">
                          {recProduct.title}
                        </h3>
                        <p
                          className={`text-xs font-medium whitespace-nowrap ${
                            recProduct.soldOut ? "text-[#9A9A9A]" : ""
                          }`}
                        >
                          {recProduct.soldOut
                            ? "—"
                            : formatPrice(recProduct.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
