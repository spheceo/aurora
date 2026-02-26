"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function PrivacyPolicy() {
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
            Privacy Policy
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
              At Aurora, we value your trust and are committed to protecting your
              personal information. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our
              website aurora.crystals and make a purchase.
            </p>
            <p>
              By using our website and services, you agree to the terms of this
              Privacy Policy. If you do not agree with these terms, please do not
              use our website.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Information We Collect</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>We collect several types of information to provide and improve our services:</p>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
                <p className="text-sm">
                  When you make a purchase, we collect personal information such as your
                  name, email address, shipping address, billing address, and payment
                  information. This information is necessary to process and fulfill your
                  orders.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Payment Information</h3>
                <p className="text-sm">
                  Payment processing is handled by Shopify and their payment processors.
                  We do not store your complete credit card information on our servers.
                  All payment transactions are encrypted and secure.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Usage Data</h3>
                <p className="text-sm">
                  We automatically collect information about your visit to our website,
                  including your IP address, browser type, device information, pages
                  viewed, and time spent on pages. This helps us understand how our
                  website is used and improve our services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">How We Use Your Information</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>We use the information we collect for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>To process and fulfill your orders</li>
                <li>To send you order confirmations and shipping updates</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our website, products, and services</li>
                <li>To analyze website usage and trends</li>
                <li>To comply with legal obligations</li>
                <li>To send promotional communications (with your consent)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Information Sharing</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>We respect your privacy and do not sell your personal information. We may share your information only in the following circumstances:</p>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Service Providers</h3>
                <p className="text-sm">
                  We share information with third-party service providers who perform
                  services on our behalf, including payment processing, shipping,
                  data analytics, and website hosting.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Legal Requirements</h3>
                <p className="text-sm">
                  We may disclose your information if required to do so by law or in
                  response to valid legal requests from law enforcement or other
                  government authorities.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">Business Transfers</h3>
                <p className="text-sm">
                  In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred to the new owner.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Data Security</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                We implement appropriate technical and organizational measures to
                protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
              <p className="text-sm">
                Payment transactions are encrypted using SSL technology and processed
                through secure payment gateways. We regularly review our security
                practices to ensure the protection of your information.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Your Rights</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
              <p className="text-sm">
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Cookies and Tracking</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                We use cookies and similar tracking technologies to collect information
                about your browsing activities. Cookies are small files stored on your
                device that help us improve your experience and analyze website usage.
              </p>
              <p className="text-sm">
                You can control cookies through your browser settings. However,
                disabling cookies may affect the functionality of our website.
              </p>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="content-animate max-w-4xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-medium">Children's Privacy</h2>
            <div className="space-y-4 text-[#9A9A9A]">
              <p>
                Our website and services are not intended for children under the age of
                16. We do not knowingly collect personal information from children.
                If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us, and we will take
                steps to delete such information.
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
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
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

        {/* Changes */}
        <section className="content-animate max-w-4xl border-t border-border pt-16">
          <div className="space-y-4 text-[#9A9A9A]">
            <h2 className="text-3xl font-medium text-foreground">Changes to This Policy</h2>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. The updated version
              will be indicated by a revised "Last updated" date, and the new
              provisions will be effective when posted. We encourage you to review
              this Privacy Policy periodically.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
