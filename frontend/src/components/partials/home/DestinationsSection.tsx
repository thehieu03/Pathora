"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "../shared/LandingImage";
import { Badge, Card } from "@/components/ui";
import { SectionContainer } from "../shared/shared";
import { useTranslation } from "react-i18next";
import { homeService } from "@/services/homeService";
import { TrendingDestination, TopAttraction } from "@/types/home";

const FALLBACK_DESTINATIONS = [
  {
    image:
      "https://www.figma.com/api/mcp/asset/dfe68e43-da11-41a8-b647-e0bdcc2720c4",
    city: "Paris",
    country: "France",
    toursCount: 12,
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/5389dbb9-c81c-4796-b57d-b521bbbe8de1",
    city: "Singapore",
    country: "Singapore",
    toursCount: 8,
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/c51cdf1f-a737-41bc-adf9-7cba8f4be0c3",
    city: "Rome",
    country: "Italy",
    toursCount: 15,
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/2c81a72e-438c-43a1-a5e4-9dfdbe595748",
    city: "Bangkok",
    country: "Thailand",
    toursCount: 10,
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/8d79382c-bc93-46a0-a421-d3b11f7366ed",
    city: "Bali",
    country: "Indonesia",
    toursCount: 9,
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/daf96572-083c-4601-9e01-4d98b0cf1add",
    city: "Phuket",
    country: "Thailand",
    toursCount: 7,
  },
];

const FALLBACK_ATTRACTIONS = [
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
];

interface DestinationData {
  image: string;
  city: string;
  country: string;
  toursCount: number;
}

interface AttractionData {
  image: string;
  name: string;
  location: string;
}

export const TrendingDestinationsSection = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await homeService.getTrendingDestinations(6);
        if (data && data.length > 0) {
          const mapped = data.map((dest: TrendingDestination) => ({
            image: dest.imageUrl || FALLBACK_DESTINATIONS[0].image,
            city: dest.city,
            country: dest.country,
            toursCount: dest.toursCount,
          }));
          setDestinations(mapped);
        } else {
          setDestinations(FALLBACK_DESTINATIONS);
        }
      } catch {
        setDestinations(FALLBACK_DESTINATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <SectionContainer>
        <section className="w-full">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden aspect-[3/4] bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </section>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <section className="w-full">
        <div className="mb-8">
          <h2 suppressHydrationWarning className="text-2xl md:text-[30px] font-bold text-landing-heading">
            {t("landing.destinations.trendingTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              href="/tours"
              className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent">
              <Image
                src={dest.image}
                alt={dest.city}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-3 right-3 text-white">
                <p className="font-bold text-base leading-tight">{dest.city}</p>
                <p className="text-xs text-white/80">{dest.country}</p>
                <Badge
                  label={t("landing.destinations.tours", {
                    count: dest.toursCount,
                  })}
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
  const { t } = useTranslation();
  const [attractions, setAttractions] = useState<AttractionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const data = await homeService.getTopAttractions(8);
        if (data && data.length > 0) {
          const mapped = data.map((attr: TopAttraction) => ({
            image: attr.imageUrl || FALLBACK_ATTRACTIONS[0].image,
            name: attr.name,
            location:
              attr.city && attr.country
                ? `${attr.city}, ${attr.country}`
                : attr.location || "Unknown",
          }));
          setAttractions(mapped);
        } else {
          setAttractions(FALLBACK_ATTRACTIONS);
        }
      } catch {
        setAttractions(FALLBACK_ATTRACTIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  if (loading) {
    return (
      <SectionContainer>
        <section className="w-full">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-landing-border rounded-xl p-3 flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <section className="w-full">
        <div className="mb-8">
          <h2 suppressHydrationWarning className="text-2xl md:text-[30px] font-bold text-landing-heading">
            {t("landing.destinations.topAttractionsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {attractions.slice(0, 8).map((attr) => (
            <Link
              key={attr.name}
              href="/tours"
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent rounded-xl">
              <Card
                className="bg-white! border border-landing-border rounded-xl! hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-landing-accent"
                bodyClass="p-3 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={attr.image}
                    alt={attr.name}
                    fill
                    sizes="64px"
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
