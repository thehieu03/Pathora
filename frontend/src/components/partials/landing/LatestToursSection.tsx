"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { SectionContainer } from "./shared";
import { useTranslation } from "react-i18next";

const TOURS = [
  {
    image:
      "https://www.figma.com/api/mcp/asset/b9cd8d76-4d7f-43c8-b45b-122fe4f71260",
    dateKey: "landing.latestTours.items.0.date",
    titleKey: "landing.latestTours.items.0.title",
    avatar:
      "https://www.figma.com/api/mcp/asset/a96a537a-ec5f-414c-b344-d9f900f845f7",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/32fbeb93-7522-491f-9f41-13605309640b",
    dateKey: "landing.latestTours.items.1.date",
    titleKey: "landing.latestTours.items.1.title",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/6cf6a7f0-afb4-4b77-95a1-4d4cce07178b",
    dateKey: "landing.latestTours.items.2.date",
    titleKey: "landing.latestTours.items.2.title",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/b04dae5c-2842-4319-b4b3-27e85c19b69e",
    dateKey: "landing.latestTours.items.3.date",
    titleKey: "landing.latestTours.items.3.title",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/0389d41e-0d8e-4b36-ae47-43f762b15938",
    dateKey: "landing.latestTours.items.4.date",
    titleKey: "landing.latestTours.items.4.title",
  },
];

export const LatestToursSection = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <section className="w-full">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-[30px] font-bold text-landing-heading">
            {t("landing.latestTours.title")}
          </h2>
          <Button
            link="/tours"
            text={t("landing.latestTours.seeAll")}
            icon="heroicons-outline:chevron-right"
            iconPosition="right"
            iconClass="text-[14px]"
            className="text-landing-heading text-sm hover:text-landing-accent transition-colors bg-transparent"
          />
        </div>

        {/* Tours row */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 overflow-x-auto pb-2">
          {TOURS.map((tour, idx) => (
            <Link
              key={idx}
              href="/tours"
              className="flex flex-row md:flex-col items-center gap-3 md:gap-3 shrink-0 group w-full md:w-auto"
            >
              <div className="relative shrink-0">
                {tour.avatar && (
                  <div className="absolute -inset-1 rounded-full hidden md:block">
                    <img
                      src={tour.avatar}
                      alt={t("landing.latestTours.avatarAlt")}
                      className="w-27 h-27 rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="relative w-15 h-15 md:w-25 md:h-25 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                  <img
                    src={tour.image}
                    alt={t(tour.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="text-left md:text-center max-w-full md:max-w-32.5 flex-1">
                <p className="text-[#eb662b] text-[10px] md:text-sm font-normal">
                  {t(tour.dateKey)}
                </p>
                <p className="text-landing-heading text-xs md:text-sm font-medium leading-snug mt-0.5">
                  {t(tour.titleKey)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SectionContainer>
  );
};
