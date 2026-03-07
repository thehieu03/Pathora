"use client";
import Button from "@/components/ui/Button";
import React from "react";
import Link from "next/link";
import Image from "../shared/LandingImage";
import { Icon } from "@/components/ui";
import { LandingHeader } from "../shared/LandingHeader";
import { LandingFooter } from "../shared/LandingFooter";
import { useTranslation } from "react-i18next";

/* ── Image Assets ──────────────────────────────────────────── */
const HERO_BG =
  "https://www.figma.com/api/mcp/asset/41ced469-52d1-417a-aae6-f3ba4905b182";
const WHO_WE_ARE_IMG =
  "https://www.figma.com/api/mcp/asset/dc585a8e-217d-4dde-9bf8-8bce83b11c29";

/* ── Team Data ─────────────────────────────────────────────── */
interface TeamMember {
  name: string;
  role: string;
  description: string;
  toursLed: number;
  image: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Le Anh Thu",
    role: "Master Tigress",
    description:
      "Disciplined and fierce leader with unmatched strength and precision.",
    toursLed: 320,
    image:
      "https://www.figma.com/api/mcp/asset/0ea21104-3b97-48ed-b725-d3fcf0ee6486",
  },
  {
    name: "Phong Thai",
    role: "Master Viper",
    description:
      "Graceful and agile, specializing in fluid movements and elegant techniques.",
    toursLed: 210,
    image:
      "https://www.figma.com/api/mcp/asset/a3caa128-9842-4560-81e6-0a73263c6152",
  },
  {
    name: "Nguyen The Hieu",
    role: "Master Crane",
    description:
      "Patient and wise, mastering aerial combat with extraordinary balance.",
    toursLed: 185,
    image:
      "https://www.figma.com/api/mcp/asset/db143d75-3a2b-4cba-9cb2-834ab9468540",
  },
  {
    name: "Ngo Quoc Huy",
    role: "Master Mantis",
    description:
      "Small but mighty, bringing quick reflexes and surprising power to every challenge.",
    toursLed: 143,
    image:
      "https://www.figma.com/api/mcp/asset/8c5b96f4-4b7a-40f9-8c8e-c9bc23b4fdaa",
  },
  {
    name: "Gorner Robin",
    role: "Master Monkey",
    description:
      "Playful and energetic, combining humor with incredible acrobatic skills.",
    toursLed: 98,
    image:
      "https://www.figma.com/api/mcp/asset/691b9bfd-c838-429e-a825-46288f09bdfd",
  },
];

/* ── Timeline Data ─────────────────────────────────────────── */
interface MilestoneItem {
  year: string;
  titleKey: string;
  descKey: string;
}

const MILESTONES: MilestoneItem[] = [
  { year: "2010", titleKey: "founded", descKey: "foundedDesc" },
  { year: "2014", titleKey: "first10k", descKey: "first10kDesc" },
  { year: "2018", titleKey: "expanded60", descKey: "expanded60Desc" },
  { year: "2022", titleKey: "digitalFirst", descKey: "digitalFirstDesc" },
  { year: "2025", titleKey: "happy92k", descKey: "happy92kDesc" },
];

/* ── Stats Data ────────────────────────────────────────────── */
const STATS = [
  {
    icon: "heroicons-outline:map-pin",
    value: "240+",
    labelKey: "destinations",
  },
  {
    icon: "heroicons-outline:users",
    value: "92K+",
    labelKey: "happyTravelers",
  },
  {
    icon: "heroicons-outline:globe-alt",
    value: "3,600+",
    labelKey: "toursOffered",
  },
  {
    icon: "heroicons-outline:heart",
    value: "98%",
    labelKey: "satisfactionRate",
  },
];

/* ── Values Data ───────────────────────────────────────────── */
const VALUES = [
  {
    icon: "heroicons-outline:globe-alt",
    titleKey: "globalExpertise",
    descKey: "globalExpertiseDesc",
  },
  {
    icon: "heroicons-outline:shield-check",
    titleKey: "safeTrusted",
    descKey: "safeTrustedDesc",
  },
  {
    icon: "heroicons-outline:heart",
    titleKey: "tailoredForYou",
    descKey: "tailoredForYouDesc",
  },
  {
    icon: "heroicons-outline:bolt",
    titleKey: "seamlessExperience",
    descKey: "seamlessExperienceDesc",
  },
];

/* ═══════════════════════════════════════════════════════════ */
/*  Hero Banner                                                */
/* ═══════════════════════════════════════════════════════════ */
const HeroBanner = () => {
  const { t } = useTranslation();
  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background */}
      <Image
        src={HERO_BG}
        alt=""
        width={1474}
        height={640}
        className="absolute inset-0 w-full h-full object-cover"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05073c]/70 via-[#05073c]/40 to-[#05073c]/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[1.2px] text-[#fa8b02] bg-[#fa8b02]/20 border border-[#fa8b02]/40 mb-4">
          {t("landing.aboutUs.ourStory")}
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-[60px] font-bold leading-tight text-white">
          {t("landing.aboutUs.weAre")}{" "}
          <span className="text-[#fa8b02]">Pathora</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-[563px] text-base leading-[26px] text-white/70">
          {t("landing.aboutUs.heroSubtitle")}
        </p>

        {/* Breadcrumb */}
        <div className="mt-6 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-white/50 hover:text-white/80 transition-colors">
            {t("landing.nav.home")}
          </Link>
          <Icon
            icon="heroicons-outline:chevron-right"
            className="w-3.5 h-3.5 text-white/50"
          />
          <span className="text-white/80">{t("landing.nav.aboutUs")}</span>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Stats Bar                                                  */
/* ═══════════════════════════════════════════════════════════ */
const StatsBar = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-[#05073c] px-6 md:px-22 py-10">
      <div className="max-w-[1152px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.labelKey}
            className="flex flex-col items-center gap-1 text-center">
            <Icon icon={stat.icon} className="w-5 h-5 text-white" />
            <p className="text-[30px] font-bold leading-9 text-white">
              {stat.value}
            </p>
            <p className="text-xs text-white/50">
              {t(`landing.aboutUs.stats.${stat.labelKey}`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Who We Are                                                 */
/* ═══════════════════════════════════════════════════════════ */
const WhoWeAreSection = () => {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1152px] mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row gap-14 items-center">
        {/* Left: Image */}
        <div className="relative w-full lg:w-[536px] flex-shrink-0">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={WHO_WE_ARE_IMG}
              alt={t("landing.aboutUs.whoWeAre")}
              width={536}
              height={320}
              className="w-full h-[320px] object-cover"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#05073c]/50 to-transparent" />
          </div>
          {/* Experience badge */}
          <div className="absolute bottom-[-20px] right-5 bg-[#fa8b02] rounded-2xl shadow-xl px-6 py-4 text-white">
            <p className="text-2xl font-bold leading-8">15+</p>
            <p className="text-xs font-medium opacity-90">
              {t("landing.aboutUs.yearsExperience")}
            </p>
          </div>
        </div>

        {/* Right: Text */}
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[1.2px] text-[#fa8b02] mb-2">
            {t("landing.aboutUs.whoWeAre")}
          </p>
          <h2 className="text-4xl font-bold leading-[45px] text-[#05073c]">
            {t("landing.aboutUs.passionateTravelers")} <br />
            <span className="text-[#fa8b02]">
              {t("landing.aboutUs.expertGuides")}
            </span>
          </h2>
          <p className="mt-5 text-sm leading-[22.75px] text-[#6a7282]">
            {t("landing.aboutUs.whoWeAreDesc1")}
          </p>
          <p className="mt-4 text-sm leading-[22.75px] text-[#6a7282]">
            {t("landing.aboutUs.whoWeAreDesc2")}
          </p>
          <Link
            href="/tours"
            className="mt-8 inline-flex items-center gap-2 bg-[#fa8b02] text-white font-semibold text-sm px-7 py-3.5 rounded-[14px] shadow-[0_4px_6px_#ffd6a8,0_2px_4px_#ffd6a8] hover:brightness-110 transition-all">
            {t("landing.aboutUs.exploreOurTours")}
            <Icon icon="heroicons-outline:arrow-right" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Values Section                                             */
/* ═══════════════════════════════════════════════════════════ */
const ValuesSection = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-[#f9fafb] py-16">
      <div className="max-w-[1152px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[1.2px] text-[#fa8b02] mb-2">
            {t("landing.aboutUs.whyChooseUs")}
          </p>
          <h2 className="text-4xl font-bold text-[#05073c]">
            {t("landing.aboutUs.valuesTitle")}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div
              key={v.titleKey}
              className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-[14px] bg-[#fff7ed] flex items-center justify-center mb-5">
                <Icon icon={v.icon} className="w-6 h-6 text-[#fa8b02]" />
              </div>
              <h3 className="text-sm font-bold text-[#05073c] mb-2">
                {t(`landing.aboutUs.values.${v.titleKey}`)}
              </h3>
              <p className="text-xs leading-[19.5px] text-[#6a7282]">
                {t(`landing.aboutUs.values.${v.descKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Timeline / Our Journey                                     */
/* ═══════════════════════════════════════════════════════════ */
const TimelineSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16">
      <div className="max-w-[768px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[1.2px] text-[#fa8b02] mb-2">
            {t("landing.aboutUs.ourJourney")}
          </p>
          <h2 className="text-4xl font-bold text-[#05073c]">
            {t("landing.aboutUs.journeyTitle")}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#fa8b02] via-[#ffd6a8] to-transparent" />

          <div className="flex flex-col gap-8">
            {MILESTONES.map((m) => (
              <div key={m.year} className="relative pl-[60px]">
                {/* Dot */}
                <div className="absolute left-0 top-1 w-9 h-9 rounded-full border-[1.6px] border-[#fa8b02] bg-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#fa8b02]" />
                </div>
                {/* Content */}
                <p className="text-xs font-bold text-[#fa8b02] mb-1">
                  {m.year}
                </p>
                <h3 className="text-base font-bold text-[#05073c] leading-6 mb-1">
                  {t(`landing.aboutUs.timeline.${m.titleKey}`)}
                </h3>
                <p className="text-sm leading-[22.75px] text-[#6a7282]">
                  {t(`landing.aboutUs.timeline.${m.descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Team Section                                               */
/* ═══════════════════════════════════════════════════════════ */
const TeamSection = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-[#f9fafb] py-16">
      <div className="max-w-[1152px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[1.2px] text-[#fa8b02] mb-2">
            {t("landing.aboutUs.teamSubtitle")}
          </p>
          <h2 className="text-4xl font-bold text-[#05073c]">
            {t("landing.aboutUs.teamTitle")}
          </h2>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-[#f3f4f6] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Photo */}
              <div className="h-44 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={176}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="p-4 text-center">
                <h3 className="text-sm font-bold text-[#05073c]">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-[#fa8b02] mt-0.5">
                  {member.role}
                </p>
                <p className="text-xs leading-[19.5px] text-[#6a7282] mt-3">
                  {member.description}
                </p>
                {/* Tours badge */}
                <div className="mt-4 flex items-center justify-center gap-1.5 bg-[#fff7ed] rounded-[14px] py-1.5 px-3">
                  <Icon
                    icon="heroicons-outline:trophy"
                    className="w-3 h-3 text-[#fa8b02]"
                  />
                  <span className="text-xs font-semibold text-[#fa8b02]">
                    {member.toursLed} {t("landing.aboutUs.toursLed")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  CTA Section                                                */
/* ═══════════════════════════════════════════════════════════ */
const CTABanner = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-[#05073c] py-16 md:py-20">
      <div className="max-w-[768px] mx-auto px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[1.2px] text-[#fa8b02] mb-3">
          {t("landing.aboutUs.readyToExplore")}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-10">
          {t("landing.aboutUs.ctaTitle")} <br />
          {t("landing.aboutUs.ctaTitleWith")}{" "}
          <span className="text-[#fa8b02]">Pathora</span>
        </h2>
        <p className="mt-4 text-sm leading-5 text-white/60 max-w-[428px] mx-auto">
          {t("landing.aboutUs.ctaDescription")}
        </p>
        <Link
          href="/tours"
          className="mt-8 inline-flex items-center gap-2 bg-[#fa8b02] text-white font-semibold text-base px-8 py-4 rounded-[14px] shadow-[0_10px_15px_rgba(126,42,12,0.3),0_4px_6px_rgba(126,42,12,0.3)] hover:brightness-110 transition-all">
          {t("landing.aboutUs.browsePackageTours")}
          <Icon icon="heroicons-outline:arrow-right" className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Floating Buttons                                           */
/* ═══════════════════════════════════════════════════════════ */
const FloatingButtons = () => (
  <div className="fixed right-4 bottom-[40%] z-50 flex flex-col gap-3 items-center">
    <a
      href="#"
      aria-label="Facebook"
      className="w-11 h-11 rounded-full bg-[#1877f2] shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity">
      <Icon icon="mdi:facebook" className="w-5 h-5 text-white" />
    </a>
    <Button
      aria-label="Chat"
      className="w-11 h-11 rounded-full bg-[#fa8b02] shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity">
      <Icon
        icon="heroicons-outline:chat-bubble-oval-left"
        className="w-5 h-5 text-white"
      />
    </Button>
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
/*  Main About Us Page                                         */
/* ═══════════════════════════════════════════════════════════ */
export const AboutUsPage = () => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      {/* Header */}
      <LandingHeader variant="solid" />

      {/* Hero */}
      <HeroBanner />

      {/* Stats */}
      <StatsBar />

      {/* Who We Are */}
      <WhoWeAreSection />

      {/* Values */}
      <ValuesSection />

      {/* Timeline */}
      <TimelineSection />

      {/* Team */}
      <TeamSection />

      {/* CTA */}
      <CTABanner />

      {/* Floating Buttons */}
      <FloatingButtons />

      {/* Footer */}
      <LandingFooter />
    </main>
  );
};

export default AboutUsPage;
