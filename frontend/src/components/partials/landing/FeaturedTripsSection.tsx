"use client";
import Link from "next/link";
import Image from "./LandingImage";
import { Icon } from "@/components/ui";
import { SectionContainer, StarRating } from "./shared";
import { useTranslation } from "react-i18next";

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
  <TripCardContent
    image={image}
    location={location}
    title={title}
    rating={rating}
    days={days}
    price={price}
  />
);

const TripCardContent = ({
  image,
  location,
  title,
  rating,
  days,
  price,
}: (typeof TRIPS)[0]) => {
  const { t } = useTranslation();

  return (
    <Link
      href="/tours"
      className="group bg-white border border-landing-border rounded-xl overflow-hidden w-full flex flex-col hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-53.75 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-1 text-landing-body text-base">
          <Icon icon="heroicons-solid:map-pin" className="w-4 h-4 shrink-0" />
          <span className="text-sm truncate">{location}</span>
        </div>
        <h3 className="h-11 overflow-hidden text-landing-heading font-medium text-[15px] leading-snug">
          {title}
        </h3>
        <StarRating count={rating} />
      </div>

      <div className="px-5 pb-4 border-t border-landing-border pt-2.5 flex items-center justify-between">
        <div className="flex w-24 items-center gap-1 text-landing-heading text-xs">
          <Icon
            icon="heroicons-outline:calendar"
            className="w-4 h-4 text-gray-500"
          />
          <span className="truncate">{t("landing.featured.days", { count: days })}</span>
        </div>
        <div className="w-26 text-right text-landing-heading text-sm">
          <span className="text-gray-500 text-xs font-normal">
            {t("landing.featured.from")}{" "}
          </span>
          <span className="font-medium text-[15px]">{price}</span>
        </div>
      </div>
    </Link>
  );
};

export const FeaturedTripsSection = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <section className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="min-h-10 md:min-h-12 text-2xl md:text-[30px] font-bold text-landing-heading">
            {t("landing.featured.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {TRIPS.map((trip, idx) => (
            <TripCard key={idx} {...trip} />
          ))}
        </div>
      </section>
    </SectionContainer>
  );
};
