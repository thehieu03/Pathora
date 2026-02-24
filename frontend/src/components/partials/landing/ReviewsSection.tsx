"use client";
import React, { useState } from "react";

const AVATAR =
  "https://www.figma.com/api/mcp/asset/a96a537a-ec5f-414c-b344-d9f900f845f7";
const LEFT_ARROW =
  "https://www.figma.com/api/mcp/asset/1c608644-cb94-4804-9cff-4e782edccc08";
const RIGHT_ARROW =
  "https://www.figma.com/api/mcp/asset/407121e3-8fab-4a67-afc4-550ca02fe4f7";

const REVIEWS = [
  {
    avatar: AVATAR,
    name: "Jonathan Samuel",
    role: "Traveller",
    text: "The trip was absolutely amazing! The knowledge of destinations was impressive and made the journey doubly enjoyable. I'll definitely book again with Pathora.",
    stars: 5,
  },
  {
    avatar: AVATAR,
    name: "Joe Wild",
    role: "Adventure Traveller",
    text: "Outstanding service from start to finish. The personalized attention and expertise were exceptional. I've never had such a seamless travel experience.",
    stars: 5,
  },
  {
    avatar: AVATAR,
    name: "Maria Chen",
    role: "Family Traveler",
    text: "Pathora made our family vacation unforgettable. Every detail was perfectly planned and our guide was knowledgeable and friendly.",
    stars: 5,
  },
];

const StarRating = ({ count }: { count: number }) => (
  <div className="flex items-center gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-[#FA8B02] text-base" aria-hidden="true">
        ★
      </span>
    ))}
  </div>
);

const ReviewsSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? REVIEWS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === REVIEWS.length - 1 ? 0 : c + 1));
  const review = REVIEWS[current];

  return (
    <section className="w-full bg-white py-12 md:py-16" aria-labelledby="reviews-heading">
      <div className="max-w-[1320px] mx-auto px-4 md:px-[15px]">
        <div className="text-center mb-10 md:mb-12">
          <h2 id="reviews-heading" className="text-2xl md:text-[30px] font-bold text-[#05073c]">
            Customer Reviews
          </h2>
          <p className="text-[#717171] text-base mt-2">
            What our travellers say
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <button
            onClick={prev}
            className="absolute left-0 w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:bg-[#FA8B02] hover:border-[#FA8B02] transition-colors group z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA8B02]"
            aria-label="Previous review"
          >
            <img
              src={LEFT_ARROW}
              alt=""
              className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
            />
          </button>

          <div className="max-w-2xl mx-auto text-center px-12 md:px-16">
            <div className="flex justify-center mb-4">
              <img
                src={review.avatar}
                alt={`${review.name}'s avatar`}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
              />
            </div>
            <blockquote className="text-[#717171] text-base leading-relaxed mb-6 italic">
              &ldquo;{review.text}&rdquo;
            </blockquote>
            <div className="flex justify-center mb-2">
              <StarRating count={review.stars} />
            </div>
            <p className="font-semibold text-[#05073c] text-base">
              {review.name}
            </p>
            <p className="text-[#717171] text-sm">{review.role}</p>
          </div>

          <button
            onClick={next}
            className="absolute right-0 w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:bg-[#FA8B02] hover:border-[#FA8B02] transition-colors group z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA8B02]"
            aria-label="Next review"
          >
            <img
              src={RIGHT_ARROW}
              alt=""
              className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
            />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Review slides">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA8B02] ${
                i === current ? "bg-[#FA8B02] w-6" : "bg-[#e7e6e6] w-2"
              }`}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
