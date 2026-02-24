"use client";
import React from "react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { NavArrows, SectionContainer } from "./shared";

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
    <SectionContainer>
      <section className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-[30px] font-bold text-landing-heading">
            Trending Destination
          </h2>
          <NavArrows />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <Badge
                  label={dest.tours}
                  className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5 mt-1 inline-block"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SectionContainer>
  );
};

export const TopAttractionsSection = () => {
  return (
    <SectionContainer>
      <section className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-[30px] font-bold text-landing-heading">
            Top Attractions
          </h2>
          <NavArrows />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {ATTRACTIONS.map((attr, idx) => (
            <Link key={idx} href="/tours" className="group">
              <Card
                className="!bg-white border border-landing-border !rounded-xl hover:shadow-md transition-shadow duration-300"
                bodyClass="p-3 flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={attr.image}
                    alt={attr.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <p className="font-medium text-landing-heading text-sm leading-snug">
                    {attr.name}
                  </p>
                  <p className="text-landing-body text-xs mt-0.5">
                    {attr.location}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </SectionContainer>
  );
};
