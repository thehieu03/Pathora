"use client";
import React from "react";
import Link from "next/link";
import { Badge, Icon } from "@/components/ui";
import { NavArrows, SectionContainer, StarRating } from "./shared";

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
    className="group bg-white border border-landing-border rounded-xl overflow-hidden w-full md:w-[300px] shrink-0 flex flex-col hover:shadow-lg transition-shadow duration-300">
    <div className="h-[215px] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    <div className="p-5 flex flex-col gap-2 flex-1">
      <Badge
        icon="heroicons-solid:map-pin"
        label={location}
        className="bg-transparent text-landing-body text-sm px-0 py-0 inline-flex items-center gap-1 w-fit"
      />
      <h3 className="text-landing-heading font-medium text-[15px] leading-snug">
        {title}
      </h3>
      <StarRating count={rating} />
    </div>

    <div className="px-5 pb-4 border-t border-landing-border pt-2.5 flex items-center justify-between">
      <div className="flex items-center gap-1 text-landing-heading text-xs">
        <Icon
          icon="heroicons-outline:calendar"
          className="w-4 h-4 text-gray-500"
        />
        <span>{days} days</span>
      </div>
      <div className="text-landing-heading text-sm">
        <span className="text-gray-500 text-xs font-normal">From </span>
        <span className="font-medium text-[15px]">{price}</span>
      </div>
    </div>
  </Link>
);

export const FeaturedTripsSection = () => {
  return (
    <SectionContainer>
      <section className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-[30px] font-bold text-landing-heading">
            Featured Trips
          </h2>
          <NavArrows />
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 overflow-x-auto pb-2">
          {TRIPS.map((trip, idx) => (
            <TripCard key={idx} {...trip} />
          ))}
        </div>
      </section>
    </SectionContainer>
  );
};
