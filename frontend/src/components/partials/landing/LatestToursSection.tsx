import React from "react";
import Link from "next/link";

const TOURS = [
  {
    image:
      "https://www.figma.com/api/mcp/asset/b9cd8d76-4d7f-43c8-b45b-122fe4f71260",
    date: "Last Day is March 13!",
    title: "A classic European highlights itinerary.",
    avatar:
      "https://www.figma.com/api/mcp/asset/a96a537a-ec5f-414c-b344-d9f900f845f7",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/32fbeb93-7522-491f-9f41-13605309640b",
    date: "Last Day is March 13!",
    title: "Signature city highlights.",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/6cf6a7f0-afb4-4b77-95a1-4d4cce07178b",
    date: "Last Day is March 13!",
    title: "In Hotels Near Cities A Short Break!",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/b04dae5c-2842-4319-b4b3-27e85c19b69e",
    date: "Last Day is March 13!",
    title: "Discover Iceland Kayaking Tours",
  },
  {
    image:
      "https://www.figma.com/api/mcp/asset/0389d41e-0d8e-4b36-ae47-43f762b15938",
    date: "Last Day is March 13!",
    title: "Safari Adventure Tanzania",
  },
];

const LatestToursSection = () => {
  return (
    <section className="w-full max-w-[1320px] mx-auto">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6 px-[15px]">
        <h2 className="text-[30px] font-bold text-[#05073c]">
          Our Latest Tours
        </h2>
        <Link
          href="/tours"
          className="text-[#05073c] text-sm hover:text-[#FA8B02] transition-colors flex items-center gap-1">
          See all
          <span className="text-base">›</span>
        </Link>
      </div>

      {/* Tours row */}
      <div className="flex items-center gap-8 px-[15px] overflow-x-auto pb-2">
        {TOURS.map((tour, idx) => (
          <Link
            key={idx}
            href="/tours"
            className="flex flex-col items-center gap-3 shrink-0 group">
            <div className="relative">
              {tour.avatar && (
                <div className="absolute -inset-1 rounded-full">
                  <img
                    src={tour.avatar}
                    alt=""
                    className="w-[108px] h-[108px] rounded-full object-cover"
                  />
                </div>
              )}
              <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="text-center max-w-[130px]">
              <p className="text-[#eb662b] text-sm font-normal">{tour.date}</p>
              <p className="text-[#05073c] text-sm font-medium leading-snug mt-0.5">
                {tour.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestToursSection;
