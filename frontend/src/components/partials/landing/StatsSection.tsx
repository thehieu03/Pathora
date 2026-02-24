import React from "react";
import Link from "next/link";

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
    color: "text-[#FA8B02]",
  },
  {
    icon: PEOPLE_ICON,
    value: "3672",
    label: "Total Tours",
    color: "text-[#05073c]",
  },
  {
    icon: PEOPLE_ICON,
    value: "92,842",
    label: "Miles Covered",
    color: "text-[#05073c]",
  },
];

const StatsSection = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1320px] mx-auto px-[15px]">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left — text + cta */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-[38px] font-bold text-[#05073c] leading-tight">
              We Make
              <br />
              World Travel Easy
            </h2>
            <p className="text-[#717171] text-base leading-relaxed max-w-md">
              Providing unforgettable travel experiences to destinations
              worldwide. We make your dream trips a reality with personalized
              service and expert guides.
            </p>

            {/* Stats */}
            <div className="flex flex-col gap-5">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <img src={stat.icon} alt="" className="w-7 h-7" />
                  </div>
                  <div>
                    <span className={`text-[28px] font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                    <p className="text-[#717171] text-sm">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/tours"
              className="inline-flex items-center gap-2 bg-[#FA8B02] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#e07a00] transition-colors w-fit">
              Explore Now
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Right — images */}
          <div className="flex-1 relative h-[400px] hidden lg:block">
            <img
              src={EXPLORE_IMG}
              alt="Travel"
              className="absolute right-0 top-0 w-[300px] h-[380px] object-cover rounded-2xl shadow-xl"
            />
            <img
              src={BG_IMG}
              alt="Travel background"
              className="absolute left-0 bottom-0 w-[260px] h-[320px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
