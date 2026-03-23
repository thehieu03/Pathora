"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const reviews = [
  {
    name: "Sarah Johnson",
    location: "United Kingdom",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    text: "Absolutely incredible experience! The Ha Long Bay tour exceeded all expectations. The guides were knowledgeable and the scenery was breathtaking.",
  },
  {
    name: "Michael Chen",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    text: "Pathora made planning our Vietnam trip effortless. The booking process was smooth and the tours were well-organized. Highly recommended!",
  },
  {
    name: "Emma Williams",
    location: "Australia",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    text: "Best travel experience ever! The local guides gave us insights we never would have gotten on our own. Every detail was perfect.",
  },
];

export const BoldReviewsSection = () => {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleMouseEnter = () => clearInterval(intervalRef.current);
  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
  };

  return (
    <section
      ref={ref}
      className={`py-20 md:py-28 bg-[#050510] transition-all duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-white/40 uppercase tracking-widest">
            {t("landing.reviews.eyebrow") || "Testimonials"}
          </span>
          <h2
            className="mt-3 text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            {t("landing.reviews.title") || "What Travelers Say"}
          </h2>
        </div>

        {/* Review Cards */}
        <div className="relative">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className={`transition-all duration-700 ${
                idx === activeIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
              }`}
            >
              <div className="p-8 md:p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-[#fb8b02] text-lg">★</span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 italic">
                  {`\u201C${review.text}\u201D`}
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                  />
                  <div>
                    <p className="font-semibold text-white">{review.name}</p>
                    <p className="text-white/40 text-sm">📍 {review.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-6 bg-[#fb8b02]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
