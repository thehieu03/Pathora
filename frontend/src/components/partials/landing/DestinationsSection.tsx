import React from "react";
import Link from "next/link";

const LEFT_ARROW =
  "https://www.figma.com/api/mcp/asset/1c608644-cb94-4804-9cff-4e782edccc08";
const RIGHT_ARROW =
  "https://www.figma.com/api/mcp/asset/407121e3-8fab-4a67-afc4-550ca02fe4f7";

const DESTINATIONS = [
  {
    image:
      "https://www.figma.com/api/mcp/asset/dfe68e43-da11-41a8-b647-e0bdcc2720c4",
    city: "Paris",
    country: "France",
    tours: "12 Tours",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/5389dbb9-c81c-4796-b57d-b521bbbe8de1",
    city: "Singapore",
    country: "Singapore",
    tours: "8 Tours",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/c51cdf1f-a737-41bc-adf9-7cba8f4be0c3",
    city: "Rome",
    country: "Italy",
    tours: "15 Tours",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/2c81a72e-438c-43a1-a5e4-9dfdbe595748",
    city: "Bangkok",
    country: "Thailand",
    tours: "10 Tours",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/8d79382c-bc93-46a0-a421-d3b11f7366ed",
    city: "Bali",
    country: "Indonesia",
    tours: "9 Tours",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/daf96572-083c-4601-9e01-4d98b0cf1add",
    city: "Phuket",
    country: "Thailand",
    tours: "7 Tours",
  },
];

const ATTRACTIONS = [
  {
    image:
      "https://www.figma.com/api/mcp/asset/132ea952-f2d5-445e-9fee-4466c6d442e9",
    name: "Colosseum",
    location: "Italy",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/9b513ed4-0c16-46ad-b479-3d582dea018e",
    name: "Statue of Liberty",
    location: "New York",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/0c3cedba-bd30-49bb-8dda-2d1494be1ceb",
    name: "Tower of London",
    location: "London",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/80cb780f-6be5-4a14-8df5-ee5ca9e3c9e0",
    name: "Vatican Museums",
    location: "Vatican City",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/707dd87e-a020-46bb-ba62-b63ac4456083",
    name: "Stonehenge",
    location: "England",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/dfe68e43-da11-41a8-b647-e0bdcc2720c4",
    name: "Antelope Canyon",
    location: "Arizona",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/5389dbb9-c81c-4796-b57d-b521bbbe8de1",
    name: "National Memorial",
    location: "Washington D.C.",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/c51cdf1f-a737-41bc-adf9-7cba8f4be0c3",
    name: "Louvre",
    location: "Paris",
  },
];

export const TrendingDestinationsSection = () => {
  return (
    <section className="w-full max-w-[1320px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-[15px]">
        <h2 className="text-[30px] font-bold text-[#05073c]">
          Trending Destination
        </h2>
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

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 px-[15px]">
        {DESTINATIONS.map((dest, idx) => (
          <Link
            key={idx}
            href="/tours"
            className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src={dest.image}
              alt={dest.city}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-3 right-3 text-white">
              <p className="font-bold text-base leading-tight">{dest.city}</p>
              <p className="text-xs text-white/80">{dest.country}</p>
              <p className="text-xs text-white/70 mt-0.5">{dest.tours}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export const TopAttractionsSection = () => {
  return (
    <section className="w-full max-w-[1320px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-[15px]">
        <h2 className="text-[30px] font-bold text-[#05073c]">
          Top Attractions
        </h2>
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

      {/* Attractions grid 4 cols x 2 rows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 px-[15px]">
        {ATTRACTIONS.map((attr, idx) => (
          <Link
            key={idx}
            href="/tours"
            className="group flex items-center gap-3 bg-white border border-[#e7e6e6] rounded-xl p-3 hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <img
                src={attr.image}
                alt={attr.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <p className="font-medium text-[#05073c] text-sm leading-snug">
                {attr.name}
              </p>
              <p className="text-[#717171] text-xs mt-0.5">{attr.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
