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
      question: "What makes Aurora crystals special?",
      answer:
        "Our crystals are carefully selected from trusted sources worldwide for their exceptional clarity, color, and energetic properties. Each piece is hand-chosen to ensure it meets our high standards of quality and authenticity.",
    },
    {
      id: 2,
      question: "How do I care for my crystal?",
      answer:
        "To maintain your crystal's beauty, clean it gently with a soft cloth and lukewarm water. Avoid harsh chemicals or ultrasonic cleaners. Store it in a soft pouch or separate from other jewelry to prevent scratches. Some crystals can be charged in moonlight or cleansed with sage.",
    },
    {
      id: 3,
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide! Shipping costs and delivery times vary by location. International orders typically arrive within 7-14 business days. You'll receive a tracking number once your order ships so you can follow your package's journey.",
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer:
        "We accept returns within 14 days of delivery. Items must be in their original condition and packaging. Please contact us at hello@aurora.com to initiate a return. Refunds are processed within 5-7 business days of receiving the returned item.",
    },
    {
      id: 5,
      question: "Are your crystals ethically sourced?",
      answer:
        "Absolutely. We are committed to ethical sourcing and work directly with suppliers who adhere to fair labor practices and environmental responsibility. We believe in transparency and can provide information about the origin of your crystal upon request.",
    },
    {
      id: 6,
      question: "Can I request a specific crystal size or shape?",
      answer:
        "While our online collection features curated pieces, we do offer custom sourcing for specific requirements. Contact us with your preferences and we'll do our best to find the perfect crystal for you. Custom orders may require additional time for sourcing.",
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
        <div className="text-right">
          <p className="text-[10px] font-medium text-[#8a7678] tracking-widest uppercase mb-3">
            [Frequently Asked Questions]
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium">
            Questions? We've Got Answers
          </h2>
          <p className="text-sm md:text-base text-[#9A9A9A] mt-3 ml-auto w-full max-w-[42rem]">
            Quick answers on shipping, sourcing, returns, and crystal care.
          </p>
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
                <div className="px-4 md:px-6 pb-4 md:pb-5 text-sm text-[#9A9A9A] leading-relaxed">
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
