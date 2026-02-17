"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaXmark } from "react-icons/fa6";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        type="button"
        className="md:hidden text-white p-2 relative z-[60]"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
      </button>

      {/* Backdrop Overlay */}
      <button
        type="button"
        aria-label="Close menu overlay"
        onClick={toggleMenu}
        className={`fixed inset-0 bg-black/50 z-[50] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[75vw] max-w-[300px] bg-background z-[55] md:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2"
              aria-label="Close menu"
            >
              <FaXmark size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-6">
            <Link
              href="/shop"
              onClick={toggleMenu}
              className="text-2xl font-medium hover:text-foreground/80 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              onClick={toggleMenu}
              className="text-2xl font-medium hover:text-foreground/80 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={toggleMenu}
              className="text-2xl font-medium hover:text-foreground/80 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
