"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "What makes Aurora different from other online stores?",
      answer:
        "At Aurora, we specialise in sourcing some of the highest quality and rarest beauty pieces available. Every item in our collection is carefully selected to ensure exceptional craftsmanship, premium materials, and timeless elegance. We focus on quality over quantity, offering pieces that truly stand out.",
    },
    {
      id: 2,
      question: "Are your products authentic and high quality?",
      answer:
        "Yes. We pride ourselves on offering only authentic, premium-quality pieces. Each product goes through a strict quality selection process before being made available on our store. Our goal is to deliver beauty that lasts.",
    },
    {
      id: 3,
      question: "How long does shipping take?",
      answer:
        "Orders are processed within 1–3 business days. Delivery times may vary depending on your location, but most orders arrive within 3–7 business days. You will receive tracking information once your order has been dispatched.",
    },
    {
      id: 4,
      question: "Do you ship nationwide?",
      answer:
        "Yes, we ship nationwide across South Africa. Shipping costs and delivery timelines will be calculated at checkout.",
    },
    {
      id: 5,
      question: "What is your return policy?",
      answer:
        "We accept returns on eligible items within a specified period from the date of delivery. Items must be unused, in their original packaging, and in resellable condition. Please contact our support team before returning any item so we can assist you.",
    },
    {
      id: 6,
      question: "What if I receive a damaged or incorrect item?",
      answer:
        "We sincerely apologise if this happens. Please contact us within 48 hours of receiving your order, including clear photos of the item and packaging. We will resolve the issue as quickly as possible.",
    },
    {
      id: 7,
      question: "What is your return policy? (Detailed)",
      answer: `We accept returns on eligible items within the specified return period from the date of delivery. Items must be unused, in their original packaging, and in their original condition.

All returned goods are carefully inspected and vetted upon receipt. Any products that show signs of damage, wear, alteration, or are not returned in their original form will be rejected and sent back to the customer.

Please contact our support team before returning any item so we can assist you with the return process.`,
    },
    {
      id: 8,
      question: "Do you offer wholesale or bulk purchasing?",
      answer: `Yes, we do offer wholesale and bulk purchasing options on selected pieces. If you are interested in placing a larger order, please contact us directly with the product details and quantities required.

Our team will review your request and provide availability, pricing, and terms accordingly.`,
    },
    {
      id: 9,
      question: "Is my payment information secure?",
      answer:
        "Yes. Aurora uses trusted and secure payment gateways. We do not store card details, and all transactions are encrypted to protect your information.",
    },
    {
      id: 10,
      question: "Are sale items refundable?",
      answer: `No. All sale, discounted, promotional, and clearance items are strictly non-refundable and non-exchangeable.

Please ensure you review product details carefully before purchasing sale items.`,
    },
    {
      id: 11,
      question: "Can Aurora cancel an order?",
      answer: `Aurora reserves the right to cancel or refuse any order at its sole discretion, including but not limited to:

• Stock unavailability
• Pricing errors
• Suspected fraudulent activity
• Payment verification issues

If an order is cancelled, a full refund will be issued to the original payment method where applicable.`,
    },
    {
      id: 12,
      question: "How can I contact Aurora?",
      answer: `For all enquiries, please use the Contact Us page on aurora-za.com or email our support team directly.

We aim to respond within 24–48 business hours.`,
    },
  ];

  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  // Intersection Observer for performance - only animate when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Only animate once
          }
        });
      },
      { threshold: 0.1 },
    );

    const faqContainer = document.getElementById("faqs");
    if (faqContainer) {
      observer.observe(faqContainer);
    }

    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        if (openIndex === index) {
          gsap.to(ref, {
            height: "auto",
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            force3D: true,
          });
        } else {
          gsap.to(ref, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            force3D: true,
          });
        }
      }
    });
  }, [openIndex]);

  useGSAP(() => {
    if (!isVisible) return;

    const items = document.querySelectorAll(".faq-item");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          force3D: true, // GPU acceleration
        },
      );
    }
  }, [isVisible]);

  return (
    <div
      id="faqs"
      className="bg-white py-12 md:py-16 px-4 md:px-15 relative z-50"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="w-full text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium">
            Questions? We've Got Answers
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 w-full">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq-item border overflow-hidden transition-colors ${
                openIndex === index
                  ? "border-[#d8c8ca] bg-[#fffdfd]"
                  : "border-border bg-white"
              }`}
            >
              {/* Question */}
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-4 md:px-6 py-4 md:py-5 text-left hover:bg-[#faf4f4] transition-colors cursor-pointer group"
              >
                <span className="font-medium pr-8 text-sm md:text-base">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <FaMinus className="w-4 h-4 text-[#811A21]" />
                  ) : (
                    <FaPlus className="w-4 h-4 text-foreground group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                <div className="px-4 md:px-6 pb-4 md:pb-5 text-sm text-[#9A9A9A] leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
