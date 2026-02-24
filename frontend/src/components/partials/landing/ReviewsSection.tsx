"use client";
import { useState } from "react";
import { Button } from "@/components/ui";
import { SectionContainer, StarRating } from "./shared";

const AVATAR =
  "https://www.figma.com/api/mcp/asset/a96a537a-ec5f-414c-b344-d9f900f845f7";

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

const QuoteIcon = () => (
  <svg
    width="42"
    height="36"
    viewBox="0 0 42 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-6">
    <path
      d="M0 36V22.5C0 19.1 0.55 15.85 1.65 12.75C2.8 9.6 4.4 6.75 6.45 4.2C8.55 1.6 10.95 0 13.65 0L16.8 5.4C14.6 6.6 12.7 8.4 11.1 10.8C9.55 13.15 8.65 15.7 8.4 18.45H16.8V36H0ZM25.2 36V22.5C25.2 19.1 25.75 15.85 26.85 12.75C28 9.6 29.6 6.75 31.65 4.2C33.75 1.6 36.15 0 38.85 0L42 5.4C39.8 6.6 37.9 8.4 36.3 10.8C34.75 13.15 33.85 15.7 33.6 18.45H42V36H25.2Z"
      className="fill-landing-accent"
    />
  </svg>
);

export const ReviewsSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? REVIEWS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === REVIEWS.length - 1 ? 0 : c + 1));
  const review = REVIEWS[current];

  return (
    <section
      className="w-full bg-white py-16 md:py-20"
      aria-labelledby="reviews-heading">
      <SectionContainer>
        <div className="text-center mb-12">
          <h2
            id="reviews-heading"
            className="text-2xl md:text-[30px] font-bold text-landing-heading">
            Customer Reviews
          </h2>
          <p className="text-landing-body text-base mt-2">
            What our travellers say
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <Button
            onClick={prev}
            className="hidden md:flex absolute left-0 md:left-4 lg:left-16 w-[45px] h-[45px] rounded-full border border-landing-border items-center justify-center hover:bg-landing-accent hover:border-landing-accent transition-colors group z-10 bg-transparent"
            icon="heroicons-outline:chevron-left"
            iconClass="text-[20px] text-landing-body group-hover:text-white transition-colors"
            ariaLabel="Previous review"
          />

          <div className="max-w-[650px] mx-auto text-center px-4 md:px-16 lg:px-20">
            <QuoteIcon />

            <p className="text-landing-body text-base md:text-lg leading-relaxed mb-8">
              {review.text}
            </p>

            <div className="flex justify-center mb-4">
              <img
                src={review.avatar}
                alt={`${review.name}'s avatar`}
                className="w-[60px] h-[60px] rounded-full object-cover"
              />
            </div>

            <div className="flex justify-center mb-2">
              <StarRating count={review.stars} size="md" />
            </div>

            <p className="font-semibold text-landing-heading text-base">
              {review.name}
            </p>
            <p className="text-landing-body text-sm">{review.role}</p>
          </div>

          <Button
            onClick={next}
            className="hidden md:flex absolute right-0 md:right-4 lg:right-16 w-[45px] h-[45px] rounded-full border border-landing-border items-center justify-center hover:bg-landing-accent hover:border-landing-accent transition-colors group z-10 bg-transparent"
            icon="heroicons-outline:chevron-right"
            iconClass="text-[20px] text-landing-body group-hover:text-white transition-colors"
            ariaLabel="Next review"
          />
        </div>

        <div
          className="flex justify-center gap-2 mt-10"
          role="tablist"
          aria-label="Review slides">
          {REVIEWS.map((_, i) => (
            <Button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current ? "bg-landing-accent w-7" : "bg-landing-border w-2.5"
              }`}
              ariaLabel={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
};
