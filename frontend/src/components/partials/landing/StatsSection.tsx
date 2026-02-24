"use client";
import React from "react";
import { Button, Icon } from "@/components/ui";
import { SectionContainer } from "./shared";

const PEOPLE_ICON =
  "https://www.figma.com/api/mcp/asset/e4a75e02-46bb-4c17-94d3-685688ecf5a2";
const EXPLORE_IMG =
  "https://www.figma.com/api/mcp/asset/30dcc58d-b255-4542-b355-c189d426f5ae";
const BG_IMG =
  "https://www.figma.com/api/mcp/asset/df0842ed-1963-4245-9b95-9027ab4bf23b";

const stats = [
  {
    icon: PEOPLE_ICON,
    value: "240",
    label: "Total Travellers",
    color: "text-landing-accent",
  },
  {
    icon: PEOPLE_ICON,
    value: "3672",
    label: "Total Tours",
    color: "text-landing-heading",
  },
  {
    icon: PEOPLE_ICON,
    value: "92,842",
    label: "Miles Covered",
    color: "text-landing-heading",
  },
];

export const StatsSection = () => {
  return (
    <section className="w-full bg-white py-8 md:py-16">
      <SectionContainer>
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 flex flex-col gap-4 md:gap-6 w-full">
            <h2 className="text-2xl md:text-[38px] font-bold text-landing-heading leading-tight">
              We Make
              <br />
              World Travel Easy
            </h2>
            <p className="text-landing-body text-sm md:text-base leading-relaxed max-w-md">
              Travel your way—discover new destinations, choose the tour that
              fits your style, and let Pathora handle the details from booking
              to documents and visa support.
            </p>

            <div className="flex flex-row md:flex-col gap-4 md:gap-5 overflow-x-auto pb-2 md:pb-0">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 bg-white shadow-sm md:shadow-none rounded-lg p-3 md:p-0 min-w-25 md:min-w-0 shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                    <img
                      src={stat.icon}
                      alt=""
                      className="w-5 h-5 md:w-7 md:h-7"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <span
                      className={`text-lg md:text-[28px] font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                    <p className="text-landing-body text-[10px] md:text-sm whitespace-nowrap md:whitespace-normal">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              link="/tours"
              text="Explore Our Tours"
              icon="heroicons-outline:chevron-right"
              iconPosition="right"
              iconClass="text-[12px] md:text-[16px]"
              className="inline-flex items-center justify-center gap-2 bg-landing-accent text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-full hover:bg-landing-accent-hover transition-colors w-fit text-sm md:text-base mt-2 md:mt-0"
            />
          </div>

          <div className="flex-1 relative h-50 md:h-100 w-full lg:block">
            <img
              src={EXPLORE_IMG}
              alt="Travel"
              className="absolute right-0 top-0 w-[60%] md:w-75 h-[90%] md:h-95 object-cover rounded-xl md:rounded-2xl shadow-xl"
            />
            <img
              src={BG_IMG}
              alt="Travel background"
              className="absolute left-0 bottom-0 w-[50%] md:w-65 h-[80%] md:h-80 object-cover rounded-xl md:rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};
