"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function CTA() {
  return (
    <div
      id="cta"
      className="bg-background py-16 md:py-20 lg:py-24 px-4 md:px-15 relative z-50"
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium">
            Find Your Obsession
          </h2>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-3 md:py-4 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 text-sm font-medium tracking-wider uppercase group cursor-pointer hover:scale-105 active:scale-95"
          >
            Shop Now
            <FaArrowRight className="-rotate-45 group-hover:rotate-0 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
