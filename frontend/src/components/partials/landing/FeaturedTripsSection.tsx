import React from "react";
import Link from "next/link";

const LEFT_ARROW =
  "https://www.figma.com/api/mcp/asset/1c608644-cb94-4804-9cff-4e782edccc08";
const RIGHT_ARROW =
  "https://www.figma.com/api/mcp/asset/407121e3-8fab-4a67-afc4-550ca02fe4f7";

const TRIPS = [
  {
    image:
      "https://www.figma.com/api/mcp/asset/cba7aec7-ceed-442e-bb33-847ec178ce1f",
    location: "Paris, France",
    title: "Centipede Tour - Guided Arizona Desert Tour by ATV",
    rating: 5,
    days: 4,
    price: "$189.25",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/37712908-e90f-4584-ae49-c8167c1a62da",
    location: "New York, USA",
    title: "Molokini and Turtle Town Snorkeling Adventure Aboard",
    rating: 5,
    days: 4,
    price: "$225",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/83b1b314-6526-414a-b1a4-d52931855ca8",
    location: "London, UK",
    title: "Westminster Walking Tour & Westminster Abbey Entry",
    rating: 5,
    days: 4,
    price: "$943",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/1d8dc25c-2a42-4c07-8605-14b785e6eb69",
    location: "Sydney, Australia",
    title: "Australian Wilderness Explorer Full Day Safari",
    rating: 5,
    days: 3,
    price: "$320",
  },
];

const StarRating = ({ count }: { count: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-[#e2ad64] text-[10px]">
        ★
      </span>
    ))}
  </div>
);

const TripCard = ({
  image,
  location,
  title,
  rating,
  days,
  price,
}: (typeof TRIPS)[0]) => (
  <Link
    href="/tours"
    className="group bg-white border border-[#e7e6e6] rounded-xl overflow-hidden w-[300px] shrink-0 flex flex-col hover:shadow-lg transition-shadow duration-300">
    {/* Image */}
    <div className="h-[215px] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col gap-2 flex-1">
      <div className="flex items-center gap-1 text-[#717171] text-base">
        <svg
          className="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <span className="text-sm">{location}</span>
      </div>
      <h3 className="text-[#05073c] font-medium text-[15px] leading-snug">
        {title}
      </h3>
      <StarRating count={rating} />
    </div>

    {/* Footer */}
    <div className="px-5 pb-4 border-t border-[#e7e6e6] pt-2.5 flex items-center justify-between">
      <div className="flex items-center gap-1 text-[#05073c] text-xs">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{days} days</span>
      </div>
      <div className="text-[#05073c] text-sm">
        <span className="text-gray-500 text-xs font-normal">From </span>
        <span className="font-medium text-[15px]">{price}</span>
      </div>
    </div>
  </Link>
);

const FeaturedTripsSection = () => {
  return (
    <section className="w-full max-w-[1320px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-[15px]">
        <h2 className="text-[30px] font-bold text-[#05073c]">Featured Trips</h2>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:bg-[#FA8B02] hover:border-[#FA8B02] transition-colors group">
            <img
              src={LEFT_ARROW}
              alt="Previous"
              className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
            />
          </button>
          <button className="w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:bg-[#FA8B02] hover:border-[#FA8B02] transition-colors group">
            <img
              src={RIGHT_ARROW}
              alt="Next"
              className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
            />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex gap-8 px-[15px] overflow-x-auto pb-2">
        {TRIPS.map((trip, idx) => (
          <TripCard key={idx} {...trip} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedTripsSection;
