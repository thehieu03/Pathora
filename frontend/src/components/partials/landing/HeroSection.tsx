"use client";
import React, { useState } from "react";

const HERO_BG =
  "https://www.figma.com/api/mcp/asset/e4c27cca-3e11-49a0-bb16-22b1bdf0f4cc";
const PUBLIC_ICON =
  "https://www.figma.com/api/mcp/asset/554c0547-fd8d-4c08-bff9-b4b0129f531a";
const PRIVATE_ICON =
  "https://www.figma.com/api/mcp/asset/c0d410d5-3013-4c54-aa50-807d334a3f82";
const PEOPLE_ICON =
  "https://www.figma.com/api/mcp/asset/e4a75e02-46bb-4c17-94d3-685688ecf5a2";
const DATE_ICON =
  "https://www.figma.com/api/mcp/asset/8452a393-4dd5-406c-a3ce-2bac21cf6389";
const DEST_ICON =
  "https://www.figma.com/api/mcp/asset/bf2d5a5d-a72b-46e7-9c41-a78011b2ea6c";
const CLASS_ICON =
  "https://www.figma.com/api/mcp/asset/b067c485-6c91-4a06-98d2-87ac97fb3ae5";
const SEARCH_ICON =
  "https://www.figma.com/api/mcp/asset/c9b4683c-0ccd-4eed-bcd8-b21f304a2f34";
const CHEVRON_DOWN =
  "https://www.figma.com/api/mcp/asset/7dbdd798-a19c-4215-8b35-2b2d09839ec2";

type SelectFieldProps = {
  icon: string;
  label: string;
  placeholder: string;
  rounded?: string;
};

const SelectField = ({
  icon,
  label,
  placeholder,
  rounded,
}: SelectFieldProps) => (
  <button
    type="button"
    className={`flex items-start gap-2 px-4 py-4 bg-white min-w-[170px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${rounded ?? ""}`}
  >
    <img src={icon} alt="" className="w-6 h-6 shrink-0 mt-0.5" />
    <div className="flex flex-col gap-1.5">
      <span className="text-[#333] font-semibold text-base leading-none">
        {label}
      </span>
      <div className="flex items-center gap-4 opacity-70">
        <span className="text-[#333] text-base opacity-80 font-normal">
          {placeholder}
        </span>
        <img src={CHEVRON_DOWN} alt="" className="w-5 h-5 shrink-0" />
      </div>
    </div>
  </button>
);

type TourType = "public" | "private";

const HeroSection = () => {
  const [tourType, setTourType] = useState<TourType>("public");

  return (
    <section className="relative w-full min-h-[600px] md:h-[759px] overflow-hidden">
      <img
        src={HERO_BG}
        alt="Travel destination with beautiful scenery"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center pt-[100px] md:pt-[207px] gap-[40px] md:gap-[60px] px-4">
        <div className="flex flex-col items-center gap-4 text-white text-center">
          <h1 className="text-4xl md:text-[72px] font-normal leading-tight font-serif">
            Enjoy in the best way!
          </h1>
          <p className="text-lg md:text-2xl font-bold">
            Enjoy our services for your trip anytime
          </p>
        </div>

        <div className="bg-white/20 rounded-xl px-3 md:px-5 pt-5 pb-5 flex flex-col items-start justify-center w-full max-w-4xl">
          <div className="flex mb-[-1px]">
            <button
              onClick={() => setTourType("public")}
              className={`flex items-center gap-2.5 px-3 md:px-4 py-3 md:py-4 rounded-tl-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                tourType === "public" ? "bg-white" : "bg-white/40"
              }`}
              aria-pressed={tourType === "public"}
            >
              <img src={PUBLIC_ICON} alt="" className="w-5 md:w-6 h-5 md:h-6" />
              <span
                className={`font-semibold text-base md:text-lg ${
                  tourType === "public" ? "text-[#FA8B02]" : "text-white"
                }`}
              >
                Public Tours
              </span>
            </button>
            <button
              onClick={() => setTourType("private")}
              className={`flex items-center gap-2.5 px-3 md:px-4 py-3 md:py-4 rounded-tr-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                tourType === "private" ? "bg-white" : "bg-white/40"
              }`}
              aria-pressed={tourType === "private"}
            >
              <img src={PRIVATE_ICON} alt="" className="w-5 md:w-6 h-5 md:h-6" />
              <span
                className={`font-semibold text-base md:text-lg ${
                  tourType === "private" ? "text-[#FA8B02]" : "text-white"
                }`}
              >
                Private Tours
              </span>
            </button>
          </div>

          <div className="bg-white rounded-bl-xl rounded-br-xl rounded-tr-xl flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 p-2 md:p-3 w-full">
            <SelectField
              icon={PEOPLE_ICON}
              label="Number of people"
              placeholder="Choose number"
              rounded="rounded-bl-xl"
            />
            <div className="hidden md:block w-px h-[50px] bg-gray-200 shrink-0" />
            <SelectField
              icon={DATE_ICON}
              label="Date"
              placeholder="Choose Date"
            />
            <div className="hidden md:block w-px h-[50px] bg-gray-200 shrink-0" />
            <SelectField
              icon={DEST_ICON}
              label="Destination"
              placeholder="Select Location"
            />
            <div className="hidden md:block w-px h-[50px] bg-gray-200 shrink-0" />
            <SelectField
              icon={CLASS_ICON}
              label="Classification"
              placeholder="Select Classification"
            />

            <button
              type="button"
              className="bg-[#FA8B02] rounded-xl p-4 md:p-6 hover:bg-[#e07a00] transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA8B02] focus-visible:ring-offset-2 self-center md:self-auto"
              aria-label="Search tours"
            >
              <img src={SEARCH_ICON} alt="Search" className="w-6 md:w-8 h-6 md:h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
