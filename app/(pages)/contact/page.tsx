"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import gsap from "gsap";

export default function Contact() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-15 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-xs font-medium">Back</span>
          </Link>
          <Link href="/" className="cursor-pointer">
            <h1 className="text-xl font-medium">Aurora.</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="group cursor-pointer hidden sm:block">
              <span className="text-xs">Shop</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <Link href="/about" className="group cursor-pointer hidden sm:block">
              <span className="text-xs">About</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Contact Hero */}
      <div ref={heroRef} className="px-4 md:px-15 pt-16 md:pt-20 pb-12 md:pb-16">
        <div>
          <p className="hero-animate text-[10px] font-medium text-[#9A9A9A] tracking-widest uppercase mb-4">
            [Get in Touch]
          </p>
          <h1 className="hero-animate text-4xl md:text-5xl lg:text-7xl font-medium leading-tight mb-8">
            Let's Start
            <br />
            a Conversation
          </h1>
          <p className="hero-animate text-base md:text-lg text-[#9A9A9A] max-w-3xl">
            Have a question about our crystals? Looking for something specific?
            We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div ref={contentRef} className="px-4 md:px-15 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Form */}
          <div className="content-animate">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 border border-border bg-transparent outline-none focus:border-foreground transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 border border-border bg-transparent outline-none focus:border-foreground transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  className="w-full px-4 py-3 border border-border bg-transparent outline-none focus:border-foreground transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border bg-transparent outline-none focus:border-foreground transition-colors resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors text-xs font-medium tracking-wider uppercase cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="content-animate space-y-12">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Email Us</h3>
                <a
                  href="mailto:hello@aurora.crystals"
                  className="text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                >
                  hello@aurora.crystals
                </a>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Response Time</h3>
                <p className="text-[#9A9A9A]">
                  We typically respond to all inquiries within 24-48 hours
                  during business days.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Custom Orders</h3>
                <p className="text-[#9A9A9A]">
                  Looking for something specific? We can help you find the
                  perfect crystal or create a custom order tailored to your
                  needs.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="text-sm font-medium mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/aurora_crystalss/"
                  target="_blank"
                  className="px-4 py-2 border border-border text-xs hover:bg-foreground hover:text-background hover:border-foreground transition-all cursor-pointer"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@aurora_crystalss"
                  target="_blank"
                  className="px-4 py-2 border border-border text-xs hover:bg-foreground hover:text-background hover:border-foreground transition-all cursor-pointer"
                >
                  TikTok
                </a>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-sm text-[#9A9A9A]">
                Can't find what you're looking for? Browse our collection or
                get in touch for personalized recommendations.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-4 text-sm font-medium group cursor-pointer"
              >
                <span>Shop Collection</span>
                <FaArrowLeft className="rotate-180 group-hover:rotate-180 group-hover:translate-x-1 transition-all duration-300 w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
