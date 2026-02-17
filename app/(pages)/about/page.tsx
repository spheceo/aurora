"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import gsap from "gsap";
import Cart from "@/components/cart";

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate hero on mount
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

    // Animate content sections
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll(".content-animate"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-15 py-3 md:py-4">
          <div className="flex-1">
            <Link href="/" className="inline-flex items-center gap-2 group cursor-pointer">
              <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-xs font-medium">Back</span>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="cursor-pointer">
              <h1 className="text-xl font-medium">Aurora.</h1>
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            <Cart />
          </div>
        </div>
      </nav>

      {/* About Hero */}
      <div ref={heroRef} className="px-4 md:px-15 pt-16 md:pt-20 pb-12 md:pb-16">
        <div>
          <p className="hero-animate text-[10px] font-medium text-[#9A9A9A] tracking-widest uppercase mb-4">
            [Our Story]
          </p>
          <h1 className="hero-animate text-4xl md:text-5xl lg:text-7xl font-medium leading-tight mb-8">
            Bringing Nature's
            <br />
            Beauty to You
          </h1>
          <p className="hero-animate text-base md:text-lg text-[#9A9A9A] max-w-3xl">
            We believe in the power of natural crystals to transform spaces and
            elevate everyday moments. Each piece in our collection is carefully
            selected for its unique energy and timeless beauty.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div ref={contentRef} className="px-4 md:px-15 pb-16 md:pb-20 space-y-16 md:space-y-24">
        {/* Mission Section */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-medium">Our Mission</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                At Aurora, we're passionate about connecting people with the
                raw beauty of the earth. Our crystals are more than just
                decorative pieces—they're natural formations that have evolved
                over millions of years, each carrying its own unique story.
              </p>
              <p>
                We source our crystals from trusted suppliers who share our
                commitment to ethical practices and quality. Every piece is
                hand-chosen for its clarity, color, and the energy it brings to
                a space.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-medium">What We Value</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Authenticity</h3>
                <p className="text-[#9A9A9A]">
                  Every crystal we offer is 100% natural. We believe in the
                  genuine beauty formed by nature, never artificial.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Quality</h3>
                <p className="text-[#9A9A9A]">
                  We carefully inspect each piece to ensure it meets our high
                  standards for clarity, color, and overall quality.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Sustainability</h3>
                <p className="text-[#9A9A9A]">
                  We work with suppliers who prioritize responsible mining
                  practices and environmental stewardship.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Connection</h3>
                <p className="text-[#9A9A9A]">
                  We're here to help you find the perfect crystal that resonates
                  with your energy and space.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="content-animate">
          <div className="border-t border-border pt-12 md:pt-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h2 className="text-xl md:text-2xl font-medium mb-2">
                  Ready to find your perfect crystal?
                </h2>
                <p className="text-[#9A9A9A] text-sm">
                  Explore our curated collection of natural crystals.
                </p>
              </div>
              <Link
                href="/shop"
                className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 group text-xs font-medium tracking-wider uppercase cursor-pointer w-full sm:w-auto"
              >
                <span>Shop Collection</span>
                <FaArrowLeft className="rotate-180 group-hover:-rotate-180 group-hover:translate-x-1 transition-all duration-300 w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
