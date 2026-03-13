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
  "https://www.figma.com/api/mcp/asset/31a73fdb-dc1a-4937-9980-024dcb89ba42";

/* ── Policy Sections Data ──────────────────────────────────── */
interface PolicySection {
  icon: string;
  titleKey: string;
  items: string[];
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    icon: "heroicons-outline:document-text",
    titleKey: "bookingPayment",
    items: [
      "bookingPaymentItem1",
      "bookingPaymentItem2",
      "bookingPaymentItem3",
      "bookingPaymentItem4",
    ],
  },
  {
    icon: "heroicons-outline:arrow-path",
    titleKey: "cancellationRefund",
    items: [
      "cancellationRefundItem1",
      "cancellationRefundItem2",
      "cancellationRefundItem3",
      "cancellationRefundItem4",
      "cancellationRefundItem5",
    ],
  },
  {
    icon: "heroicons-outline:arrow-path",
    titleKey: "modificationRescheduling",
    items: [
      "modificationItem1",
      "modificationItem2",
      "modificationItem3",
      "modificationItem4",
    ],
  },
  {
    icon: "heroicons-outline:shield-check",
    titleKey: "healthSafety",
    items: [
      "healthSafetyItem1",
      "healthSafetyItem2",
      "healthSafetyItem3",
      "healthSafetyItem4",
    ],
  },
  {
    icon: "heroicons-outline:lock-closed",
    titleKey: "privacyPolicy",
    items: [
      "privacyPolicyItem1",
      "privacyPolicyItem2",
      "privacyPolicyItem3",
      "privacyPolicyItem4",
    ],
  },
  {
    icon: "heroicons-outline:exclamation-circle",
    titleKey: "liabilityDisclaimer",
    items: [
      "liabilityItem1",
      "liabilityItem2",
      "liabilityItem3",
      "liabilityItem4",
    ],
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
          {t("landing.policies.transparencyFirst")}
        </span>

        {/* Heading */}
        <h1 className="text-5xl md:text-[60px] font-bold leading-tight text-white">
          {t("landing.policies.our")}{" "}
          <span className="text-[#fa8b02]">{t("landing.policies.policy")}</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-[519px] text-base leading-[26px] text-white/70">
          {t("landing.policies.heroSubtitle")}
        </p>

        {/* Breadcrumb */}
        <div className="mt-6 flex items-center gap-2 text-sm">
          <Link
            href="/home"
            className="text-white/50 hover:text-white/80 transition-colors">
            {t("landing.nav.home")}
          </Link>
          <Icon
            icon="heroicons-outline:chevron-right"
            className="w-3.5 h-3.5 text-white/50"
          />
          <span className="text-white/80">{t("landing.nav.ourPolicies")}</span>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Last Updated Notice Bar                                    */
/* ═══════════════════════════════════════════════════════════ */
const LastUpdatedBar = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-[#fff7ed] border-b border-[#ffedd4]">
      <div className="max-w-[1152px] mx-auto px-6 md:px-32">
        <div className="flex items-center gap-2 h-10 pl-6">
          <Icon
            icon="heroicons-outline:exclamation-circle"
            className="w-4 h-4 text-[#fa8b02] flex-shrink-0"
          />
          <p className="text-xs text-[#4a5565]">
            <span>{t("landing.policies.lastUpdated")}</span>{" "}
            <span className="font-semibold text-[#05073c]">
              {t("landing.policies.lastUpdatedDate")}
            </span>
            <span>. {t("landing.policies.policiesApplyNote")}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Intro Box                                                  */
/* ═══════════════════════════════════════════════════════════ */
const IntroBox = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-2xl px-7 py-7">
      <p className="text-sm leading-[22.75px] text-[#4a5565]">
        {t("landing.policies.introPrefix")}{" "}
        <span className="font-semibold text-[#05073c]">Pathora</span>
        {t("landing.policies.introSuffix")}
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  Policy Card                                                */
/* ═══════════════════════════════════════════════════════════ */
const PolicyCard = ({ section }: { section: PolicySection }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-[#f3f4f6] rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-7 h-20 bg-[#f9fafb]/50 border-b border-[#f3f4f6]">
        <div className="w-10 h-10 rounded-[14px] bg-[#fff7ed] flex items-center justify-center flex-shrink-0">
          <Icon icon={section.icon} className="w-5 h-5 text-[#fa8b02]" />
        </div>
        <h2 className="text-base font-bold text-[#05073c]">
          {t(`landing.policies.sections.${section.titleKey}`)}
        </h2>
      </div>

      {/* Bullet list */}
      <ul className="flex flex-col gap-3 px-7 py-5">
        {section.items.map((itemKey) => (
          <li key={itemKey} className="flex items-start gap-[18px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fa8b02] mt-[7px] flex-shrink-0" />
            <p className="text-sm leading-[22.75px] text-[#4a5565]">
              {t(`landing.policies.items.${itemKey}`)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  CTA Banner                                                 */
/* ═══════════════════════════════════════════════════════════ */
const CTABanner = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#05073c] rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center gap-6">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-[#fa8b02]/20 flex items-center justify-center flex-shrink-0">
        <Icon
          icon="heroicons-outline:phone"
          className="w-7 h-7 text-[#fa8b02]"
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="text-base font-bold text-white">
          {t("landing.policies.ctaTitle")}
        </h3>
        <p className="text-sm text-white/60 mt-1">
          {t("landing.policies.ctaDescription")}
        </p>
      </div>

      {/* Button */}
      <Link
        href="/contact"
        className="bg-[#fa8b02] text-white font-semibold text-sm px-6 py-3 rounded-[14px] hover:brightness-110 transition-all whitespace-nowrap">
        {t("landing.policies.contactSupport")}
      </Link>
    </div>
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
/*  Main Policy Page                                           */
/* ═══════════════════════════════════════════════════════════ */
export const PolicyPage = () => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen overflow-x-hidden">
      {/* Header */}
      <LandingHeader variant="solid" />

      {/* Hero */}
      <HeroBanner />

      {/* Last Updated Notice */}
      <LastUpdatedBar />

      {/* Policy Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-[896px] mx-auto px-6 flex flex-col gap-12">
          {/* Intro */}
          <IntroBox />

          {/* Policy Sections */}
          <div className="flex flex-col gap-8">
            {POLICY_SECTIONS.map((section) => (
              <PolicyCard key={section.titleKey} section={section} />
            ))}
          </div>

          {/* CTA */}
          <CTABanner />
        </div>
      </section>

      {/* Floating Buttons */}
      <FloatingButtons />

      {/* Footer */}
      <LandingFooter />
    </main>
  );
};

export default PolicyPage;
