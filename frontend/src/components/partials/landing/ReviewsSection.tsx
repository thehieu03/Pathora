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
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-[#FA8B02] text-base">
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
    <section className="w-full bg-white py-16">
      <div className="max-w-[1320px] mx-auto px-[15px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[30px] font-bold text-[#05073c]">
            Customer Reviews
          </h2>
          <p className="text-[#717171] text-base mt-2">
            What our travellers say
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Left arrow */}
          <button
            onClick={prev}
            className="absolute left-0 w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:bg-[#FA8B02] hover:border-[#FA8B02] transition-colors group z-10">
            <img
              src={LEFT_ARROW}
              alt="Previous"
              className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
            />
          </button>

          {/* Review card */}
          <div className="max-w-2xl mx-auto text-center px-16">
            <div className="flex justify-center mb-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <p className="text-[#717171] text-base leading-relaxed mb-6 italic">
              "{review.text}"
            </p>
            <div className="flex justify-center mb-2">
              <StarRating count={review.stars} />
            </div>
            <p className="font-semibold text-[#05073c] text-base">
              {review.name}
            </p>
            <p className="text-[#717171] text-sm">{review.role}</p>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="absolute right-0 w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:bg-[#FA8B02] hover:border-[#FA8B02] transition-colors group z-10">
            <img
              src={RIGHT_ARROW}
              alt="Next"
              className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
            />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-[#FA8B02] w-6" : "bg-[#e7e6e6]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
