"use client";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import Link from "next/link";
import { FaXmark } from "react-icons/fa6";
import { LuMouse, LuSearch } from "react-icons/lu";
import Cart from "./cart";
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
    // Set initial state explicitly
    gsap.set(heroRef.current, { y: 0, scale: 1, filter: 'blur(0px)' });

    // Delay ScrollTrigger creation to let Lenis initialize
    const timeout = setTimeout(() => {
      ScrollTrigger.create({
        trigger: "#signature-picks",
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(heroRef.current, {
            y: 50 * progress,
            scale: 1 - 0.10 * progress,
            filter: `blur(${1 * progress}px)`
          });
        },
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, { scope: heroRef });

  return (
    <div
      id="hero"
      ref={heroRef}
      className="h-dvh flex flex-col sticky top-0 z-10 will-change-transform"
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
        <img
          src="/cover/02.png"
          alt="Cover Image"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent flex flex-col items-start justify-between px-15 pb-15 pt-10">
          {/*Navbar*/}
          <div className="flex items-center justify-between w-full h-18">
            <div className="w-full">
              <h1 className="text-2xl font-medium">Aurora.</h1>
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
          <div className="w-full flex justify-between items-center">
            <div className="space-y-3">
              <p className="font-medium">[Crystals]</p>
              <h1 className="w-170 text-7xl font-medium">
                Earth's Beauty, Captured in Crystal.
              </h1>
              <div className="flex items-center gap-3 text-[#C4C4C4] mt-4">
                <LuMouse />
                Scroll for more info.
              </div>
            </div>
            <div className="w-87.5 flex flex-col gap-4">
              <p>
                Each crystal is formed over centuries, carrying the raw beauty
                of the earth and selected for its clarity, color, and presence.
              </p>
              <div className="flex gap-6">
                <button className="bg-background text-foreground px-7 py-3 rounded-full group cursor-pointer">
                  <a href="/shop" className="flex gap-3 items-center">
                    Shop Now{" "}
                    <FaArrowRight className="-rotate-45 group-hover:rotate-0 group-hover:translate-x-1 transition-all duration-300 ease-out" />
                  </a>
                </button>
                <button className="group cursor-pointer">
                  <a href="/about" className="flex gap-3 items-center">
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
