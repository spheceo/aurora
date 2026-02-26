"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function TermsOfService() {
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

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-dvh bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-15 py-4">
          <Link href="/" className="inline-flex items-center cursor-pointer">
            <Image src="/logo.png" alt="Aurora logo" width={34} height={34} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="group cursor-pointer">
              <span className="text-xs">Shop</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
            <Link href="/contact" className="group cursor-pointer">
              <span className="text-xs">Contact</span>
              <div className="bg-foreground h-px transition-all origin-left scale-x-0 group-hover:scale-x-100" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div ref={heroRef} className="px-15 pt-20 pb-16">
        <div>
          <p className="hero-animate text-[10px] font-medium text-[#9A9A9A] tracking-widest uppercase mb-4">
            [Legal]
          </p>
          <h1 className="hero-animate text-5xl lg:text-7xl font-medium leading-tight mb-8">
            Terms of Service
          </h1>
          <p className="hero-animate text-sm text-[#9A9A9A]">
            Last updated: {currentDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="px-15 pb-20 space-y-16">
        {/* Introduction */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-4 text-[#9A9A9A]">
            <p>
              Welcome to Aurora. These Terms of Service govern your use of our
              website aurora.crystals and the purchase of our products. By accessing
              our website or making a purchase, you agree to be bound by these terms.
            </p>
            <p>
              Please read these terms carefully. If you do not agree with any part
              of these terms, you may not access our website or purchase our products.
            </p>
          </div>
        </section>

        {/* Products and Services */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Products and Services</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                All products offered on aurora.crystals are natural crystals and
                minerals. Due to the natural variations in crystals:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Each product is unique and may vary slightly in color, size, and shape from the images shown</li>
                <li>We make every effort to accurately represent our products through photography and descriptions</li>
                <li>Natural imperfections and variations are part of the beauty of natural crystals</li>
                <li>Product colors may appear differently depending on your monitor or device settings</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Orders and Payment */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Orders and Payment</h2>
            <div className="space-y-4 text-[#9A9A9A]">

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Order Acceptance</h3>
                <p className="text-sm">
                  We reserve the right to refuse or cancel any order for any reason,
                  including but not limited to product availability, errors in
                  pricing or product information, or suspected fraud.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Pricing</h3>
                <p className="text-sm">
                  All prices are listed in South African Rand (ZAR) and are subject
                  to change without notice. We are not responsible for typographical
                  errors in pricing.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Payment</h3>
                <p className="text-sm">
                  Payment is processed at the time of purchase through Shopify's
                  secure payment system. We accept major credit cards and other
                  payment methods as displayed at checkout. By providing payment
                  information, you represent that you are authorized to use the
                  payment method.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping and Delivery */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Shipping and Delivery</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                We strive to process and ship orders as quickly as possible.
                However, shipping times are estimates and not guarantees:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Orders are typically processed within 1-3 business days</li>
                <li>Shipping times vary based on location and shipping method selected</li>
                <li>We are not responsible for delays caused by shipping carriers, customs, or other factors beyond our control</li>
                <li>Risk of loss transfers to you upon delivery to the shipping carrier</li>
              </ul>
              <p className="text-sm">
                International orders may be subject to customs duties, taxes, and
                other fees imposed by the destination country. These charges are
                the responsibility of the customer.
              </p>
            </div>
          </div>
        </section>

        {/* Returns and Refunds */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Returns and Refunds</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                We want you to be completely satisfied with your purchase. Please
                review our return policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Returns are accepted within 14 days of delivery</li>
                <li>Items must be in their original condition and packaging</li>
                <li>Return shipping costs are the responsibility of the customer unless the item is defective or incorrect</li>
                <li>Refunds will be processed within 5-7 business days of receiving the returned item</li>
                <li>Sale items and final sale products are not eligible for return</li>
              </ul>
              <p className="text-sm">
                To initiate a return, please contact us through our website or email.
              </p>
            </div>
          </div>
        </section>

        {/* Product Care */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Product Care</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                Crystals are natural materials that require proper care:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Keep crystals away from harsh chemicals and cleaning agents</li>
                <li>Some crystals may fade if exposed to direct sunlight for extended periods</li>
                <li>Clean gently with a soft, dry cloth</li>
                <li>Some crystals are water-soluble and should not be submerged in water</li>
                <li>Handle with care to avoid chipping or breakage</li>
              </ul>
              <p className="text-sm">
                We are not responsible for damage to products resulting from improper
                care or handling.
              </p>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Intellectual Property</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                All content on aurora.crystals, including but not limited to text,
                graphics, logos, images, and software, is the property of Aurora or
                its content suppliers and is protected by copyright and other
                intellectual property laws.
              </p>
              <p className="text-sm">
                You may not reproduce, modify, distribute, or otherwise use any
                content from our website without our prior written consent.
              </p>
            </div>
          </div>
        </section>

        {/* User Accounts */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">User Accounts</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                If you create an account on our website, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring that the information you provide is accurate and complete</li>
              </ul>
              <p className="text-sm">
                We reserve the right to suspend or terminate accounts that violate
                these terms or engage in fraudulent activity.
              </p>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Limitation of Liability</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                To the fullest extent permitted by law, Aurora shall not be liable
                for any indirect, incidental, special, consequential, or punitive
                damages, including but not limited to loss of profits, data, or
                other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Your use or inability to use our website or services</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Statements or conduct of any third party on the website</li>
                <li>Errors, mistakes, or inaccuracies in content</li>
                <li>Personal injury or property damage related to our products</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Indemnification */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Indemnification</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p className="text-sm">
                You agree to indemnify and hold harmless Aurora, its officers,
                directors, employees, and agents from any claims, damages,
                losses, liabilities, and expenses (including legal fees) arising
                from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Your use of our website or services</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you post or share on our website</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Governing Law</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p className="text-sm">
                These Terms of Service are governed by and construed in accordance
                with the laws of South Africa. Any disputes arising under these
                terms shall be subject to the exclusive jurisdiction of the courts
                of South Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Modifications */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Modifications to Terms</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p className="text-sm">
                We reserve the right to modify these Terms of Service at any time.
                Changes will be posted on this page with an updated "Last updated"
                date. Your continued use of our website after such changes
                constitutes acceptance of the new terms.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Contact Us</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p>Website: aurora.crystals</p>
                <p>
                  Email:{" "}
                  <a href="mailto:hello@aurora.crystals" className="text-foreground hover:underline cursor-pointer">
                    hello@aurora.crystals
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agreement */}
        <section className="content-animate max-w-4xl border-t border-border pt-16">
          <div className="space-y-4 text-[#9A9A9A]">
            <h2 className="text-3xl font-medium text-foreground">Your Agreement</h2>
            <p className="text-sm">
              By accessing aurora.crystals or purchasing our products, you acknowledge
              that you have read, understood, and agree to be bound by these Terms
              of Service and our Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
