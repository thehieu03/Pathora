import React from "react";
import Link from "next/link";

const CTA_BG =
  "https://www.figma.com/api/mcp/asset/c0b4ba20-2e30-407e-b2b2-0efd16039d3a";

const FEATURES = [
  {
    icon: "https://www.figma.com/api/mcp/asset/45f6d555-1113-4f37-a8d7-1b28ac3a50bf",
    title: "Easy Relaxed & Transparent Pricing",
    desc: "We provide transparent pricing with no hidden fees so you can travel worry-free.",
  },
  {
    icon: "https://www.figma.com/api/mcp/asset/0e4f30cf-57a5-434b-80df-c9227a4eba14",
    title: "Stress & Discounted Booking",
    desc: "Book your tours at discounted prices with our easy and stress-free booking process.",
  },
  {
    icon: "https://www.figma.com/api/mcp/asset/0eb2872f-4f6d-4b29-a4a5-f8643708ff96",
    title: "Full Payment & Visa Support",
    desc: "We handle all payment processing and provide full visa support for your journey.",
  },
  {
    icon: "https://www.figma.com/api/mcp/asset/cc5dfd42-a3bc-458d-8f77-f2d2f23478bc",
    title: "Reliable Top Services",
    desc: "Our experienced team ensures top-notch service throughout your entire travel experience.",
  },
];

const BRANDS = [
  "https://www.figma.com/api/mcp/asset/d2c6b813-f322-40ec-a872-73b1cd8cd18b",
  "https://www.figma.com/api/mcp/asset/31707d35-0a56-4e06-93be-5d4b081e5317",
  "https://www.figma.com/api/mcp/asset/9f642099-8ece-4fd8-9b08-af3771fdb8b8",
  "https://www.figma.com/api/mcp/asset/e508f9e2-929e-4b25-9805-396ce68e5420",
  "https://www.figma.com/api/mcp/asset/90ee612e-a5b0-4c92-8969-4a16f30faecb",
  "https://www.figma.com/api/mcp/asset/6d6be691-31de-4ec4-b0c1-154966a1841a",
];

export const CTASection = () => (
  <section className="relative w-full h-[420px] overflow-hidden">
    <img
      src={CTA_BG}
      alt="Mountain"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
      <h2 className="text-[48px] font-bold mb-4">Keep things flexible</h2>
      <p className="text-lg text-white/80 max-w-xl mb-8">
        Go ahead and take that trip — we know how important it is to travel on
        your schedule.
      </p>
      <Link
        href="/tours"
        className="inline-flex items-center gap-2 bg-[#FA8B02] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#e07a00] transition-colors text-lg">
        Explore Now
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </section>
);

export const WhyChooseSection = () => (
  <section className="w-full bg-[#f8fafc] py-16">
    <div className="max-w-[1320px] mx-auto px-[15px]">
      <div className="text-center mb-12">
        <h2 className="text-[30px] font-bold text-[#05073c]">
          Why choose Tour
        </h2>
        <p className="text-[#717171] text-base mt-2">
          We offer the best travel experience every time
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feat, idx) => (
          <div key={idx} className="flex flex-col items-start gap-4">
            <div className="w-14 h-14 bg-[#FA8B02]/10 rounded-xl flex items-center justify-center">
              <img src={feat.icon} alt="" className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-[#05073c] text-base leading-snug">
              {feat.title}
            </h3>
            <p className="text-[#717171] text-sm leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const TrustedBrandsSection = () => (
  <section className="w-full bg-white py-12 border-t border-[#e7e6e6]">
    <div className="max-w-[1320px] mx-auto px-[15px]">
      <p className="text-center text-[#717171] font-medium text-sm uppercase tracking-widest mb-8">
        Trusted by all the largest travel brands
      </p>
      <div className="flex flex-wrap items-center justify-center gap-10">
        {BRANDS.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="Brand"
            className="h-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
    </div>
  </section>
);
