"use client";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import Link from "next/link";
import { FaXmark } from "react-icons/fa6";
import { LuMouse } from "react-icons/lu";
import Cart from "./cart";
import MobileNav from "./mobile-nav";
import { FaArrowRight } from "react-icons/fa";

import { forwardRef, Ref, useRef } from "react";
import Search from "./search";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default forwardRef(function Hero(
  { data }: { data: string },
  ref: Ref<HTMLDivElement>,
) {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Set initial state explicitly with GPU acceleration
    gsap.set(heroRef.current, {
      y: 0,
      scale: 1,
      opacity: 1,
      force3D: true,
    });

    // Delay ScrollTrigger creation to let Lenis initialize
    const timeout = setTimeout(() => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: "#signature-picks",
        start: "top bottom",
        end: "top top",
        scrub: 0.5, // Add smooth scrubbing for better performance
        onUpdate: (self) => {
          const progress = self.progress;
          // Use transform3d and opacity instead of expensive blur filter
          gsap.set(heroRef.current, {
            y: 50 * progress,
            scale: 1 - 0.10 * progress,
            opacity: 1 - (0.2 * progress), // Replace blur with opacity
            force3D: true, // GPU acceleration
          });
        },
      });
      ScrollTrigger.refresh();

      return () => scrollTrigger.kill();
    }, 100);

    return () => clearTimeout(timeout);
  }, { scope: heroRef });

  return (
    <div
      id="hero"
      ref={heroRef}
      className="h-svh md:h-dvh bg-black flex flex-col md:sticky md:top-0 z-10 will-change-transform will-change-opacity"
    >
      {/*
        Banner only displays if banner content
        exists in Shopify's metafield data
      */}
      {data && (
        <div className="w-full py-1 bg-background">
          <Marquee autoFill>
            <h1 className="mr-12 uppercase font-medium flex flex-row gap-12 items-center">
              {data}
              <FaXmark className="strokeWidth={0.5}" />
            </h1>
          </Marquee>
        </div>
      )}

      {/*Hero*/}
      <div className="bg-black text-white flex-1 relative overflow-hidden">
        <Image
          src="/cover/02.png"
          alt="Cover Image"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent flex flex-col items-start justify-between px-4 md:px-15 pt-[calc(env(safe-area-inset-top)+2rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] md:pb-15 md:pt-10">
          {/*Navbar - Mobile*/}
          <div className="flex md:hidden items-center justify-between w-full h-16">
            <Image
              src="/logo.png"
              alt="Aurora Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="flex items-center gap-4">
              <Search />
              <Cart />
              <MobileNav />
            </div>
          </div>

          {/*Navbar - Desktop*/}
          <div className="hidden md:flex items-center justify-between w-full h-18">
            <div className="w-full">
              <Image
                src="/logo.png"
                alt="Aurora Logo"
                width={50}
                height={50}
                className="rounded-lg"
              />
            </div>
            <div className="w-fit px-6 flex items-center gap-6">
              <div className="group cursor-pointer">
                <Link href="/shop">Shop</Link>
                <div className="bg-white h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
              </div>
              <div className="group cursor-pointer">
                <Link href="/about">About</Link>
                <div className="bg-white h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
              </div>
              <div className="group cursor-pointer">
                <Link href="/contact">Contact</Link>
                <div className="bg-white h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
              </div>

              {/*Veritcal Line*/}
              <div className="h-6 w-[1.5px] rounded-2xl bg-white" />

              <Search />
              <Cart />
            </div>
          </div>

          {/*Rest of the Hero*/}
          <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-0">
            <div className="space-y-3 w-full md:w-auto">
              <p className="font-medium text-sm md:text-base">[Crystals]</p>
              <h1 className="w-full md:w-170 text-4xl sm:text-5xl md:text-7xl font-medium">
                Earth's Beauty, Captured in Crystal.
              </h1>
              <div className="flex items-center gap-3 text-[#C4C4C4] mt-4 text-sm md:text-base">
                <LuMouse />
                Scroll for more info.
              </div>
            </div>
            <div className="w-full md:w-87.5 flex flex-col gap-4">
              <p className="text-sm md:text-base">
                Each crystal is formed over centuries, carrying the raw beauty
                of the earth and selected for its clarity, color, and presence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <button className="bg-background text-foreground px-7 py-3 rounded-full group cursor-pointer">
                  <a href="/shop" className="flex gap-3 items-center justify-center">
                    Shop Now{" "}
                    <FaArrowRight className="-rotate-45 group-hover:rotate-0 group-hover:translate-x-1 transition-all duration-300 ease-out" />
                  </a>
                </button>
                <button className="group cursor-pointer">
                  <a href="/about" className="flex gap-3 items-center justify-center">
                    Learn More{" "}
                    <FaArrowRight className="-rotate-45 group-hover:rotate-0 group-hover:translate-x-1 transition-all duration-300 ease-out" />
                  </a>
                  <div className="bg-white h-[1.5px] mt-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
