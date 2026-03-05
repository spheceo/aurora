"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Reviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      rating: 5,
      date: "January 2025",
      title: "Absolutely beautiful!",
      comment:
        "The crystal quality exceeded my expectations. The colors are stunning and it looks even better in person. Will definitely be ordering more.",
    },
    {
      id: 2,
      name: "James K.",
      rating: 4,
      date: "December 2024",
      title: "Great addition to my collection",
      comment:
        "Perfect size and beautiful clarity. Arrived safely packaged. Only giving 4 stars because shipping took a bit longer than expected.",
    },
    {
      id: 3,
      name: "Emma L.",
      rating: 5,
      date: "January 2025",
      title: "Mesmerizing piece",
      comment:
        "This crystal has such a powerful presence. The energy is amazing and it's become the centerpiece of my meditation space.",
    },
    {
      id: 4,
      name: "Michael R.",
      rating: 5,
      date: "January 2025",
      title: "Stunning quality",
      comment:
        "I've purchased crystals from many places, but Aurora has the best quality I've seen. The attention to detail is remarkable.",
    },
    {
      id: 5,
      name: "Lisa T.",
      rating: 5,
      date: "December 2024",
      title: "Perfect gift",
      comment:
        "Bought this as a gift for my sister and she absolutely loved it. The packaging was beautiful and the crystal is gorgeous.",
    },
    {
      id: 6,
      name: "David P.",
      rating: 4,
      date: "November 2024",
      title: "Very satisfied",
      comment:
        "Great crystal, excellent customer service. The photos on the website don't do it justice - it's even more beautiful in person.",
    },
  ];

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

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
      { threshold: 0.1 }, // Trigger when 10% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!isVisible) return;

      const cards = containerRef.current?.querySelectorAll(".review-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            force3D: true, // GPU acceleration
          },
        );
      }
    },
    { scope: containerRef, dependencies: [isVisible] },
  );

  return (
    <div
      id="reviews"
      ref={containerRef}
      className="bg-white py-12 md:py-16 px-4 md:px-15 relative z-50"
    >
      <div className="space-y-8">
        {/* Reviews Header */}
        <div>
          <div className="flex items-center gap-6 flex-wrap">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium">
              What Our Customers Say
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(averageRating)
                        ? "text-[#811A21] fill-[#811A21]"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#9A9A9A]">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="review-card border border-border bg-white p-4 md:p-6 space-y-4 hover:border-[#d8c8ca] hover:bg-[#fffdfd] transition-colors"
            >
              {/* Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={`${review.id}-${star}`}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "text-[#811A21] fill-[#811A21]"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>

              {/* Review Title & Name */}
              <div className="space-y-1">
                <h3 className="font-medium">{review.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                  <span>{review.name}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-sm text-[#9A9A9A] leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
