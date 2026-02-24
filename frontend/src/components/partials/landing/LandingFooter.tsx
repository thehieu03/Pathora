"use client";
import React from "react";
import Link from "next/link";
import { Button, Icon, Textinput } from "@/components/ui";
import { useTranslation } from "react-i18next";

const FOOTER_BG =
  "https://www.figma.com/api/mcp/asset/b457b48b-2c4f-49e0-a589-ec3d2233e4c1";

const companyLinkKeys = [
  "landing.footer.links.company.aboutUs",
  "landing.footer.links.company.reviews",
  "landing.footer.links.company.contactUs",
  "landing.footer.links.company.travelGuides",
  "landing.footer.links.company.dataPolicy",
  "landing.footer.links.company.cookiePolicy",
  "landing.footer.links.company.legal",
  "landing.footer.links.company.sitemap",
];
const supportLinkKeys = [
  "landing.footer.links.support.getInTouch",
  "landing.footer.links.support.helpCenter",
  "landing.footer.links.support.liveChat",
  "landing.footer.links.support.howItWorks",
];

const socialIcons = [
  { name: "facebook", icon: "mdi:facebook" },
  { name: "twitter", icon: "mdi:twitter" },
  { name: "instagram", icon: "mdi:instagram" },
  { name: "youtube", icon: "mdi:youtube" },
];

export const LandingFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden text-white">
      <img
        src={FOOTER_BG}
        alt={t("landing.footer.backgroundAlt")}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-landing-heading/90" />

      <div className="relative z-10 max-w-360 mx-auto px-4 md:px-18.75 py-16">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/15 pb-8 mb-10 gap-4">
          <p className="text-[#eb662b] font-medium">
            {t("landing.footer.speakToExpert")}{" "}
            <span className="font-bold">1-800-453-6744</span>
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/70">
              {t("landing.footer.followUs")}
            </span>
            {socialIcons.map((s) => (
              <Link
                key={s.name}
                href={`https://${s.name}.com`}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-landing-accent hover:border-landing-accent transition-colors text-white/70 hover:text-white"
              >
                <Icon icon={s.icon} className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">
              {t("landing.footer.contact.title")}
            </h4>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("landing.footer.contact.address")}
            </p>
            <p className="text-white/60 text-sm mt-3">hi@pathora.com</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">
              {t("landing.footer.company.title")}
            </h4>
            <ul className="flex flex-col gap-2">
              {companyLinkKeys.map((linkKey) => (
                <li key={linkKey}>
                  <Link
                    href="#"
                    className="text-white/60 text-sm hover:text-landing-accent transition-colors"
                  >
                    {t(linkKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">
              {t("landing.footer.support.title")}
            </h4>
            <ul className="flex flex-col gap-2">
              {supportLinkKeys.map((linkKey) => (
                <li key={linkKey}>
                  <Link
                    href="#"
                    className="text-white/60 text-sm hover:text-landing-accent transition-colors"
                  >
                    {t(linkKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">
              {t("landing.footer.newsletter.title")}
            </h4>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {t("landing.footer.newsletter.description")}
            </p>
            <div className="flex gap-2">
              <Textinput
                type="email"
                placeholder={t("landing.footer.newsletter.placeholder")}
                className="flex-1 !bg-white !border-white/20 !rounded-xl !px-4 !py-3 !text-landing-heading !text-sm placeholder:!text-gray-400"
              />
              <Button
                text={t("landing.footer.newsletter.send")}
                className="bg-landing-accent text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-landing-accent-hover transition-colors shrink-0"
              />
            </div>

            <h4 className="text-white font-semibold text-lg mt-8 mb-3">
              {t("landing.footer.mobileApps.title")}
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="#"
                className="text-white/60 text-sm hover:text-landing-accent transition-colors flex items-center gap-2"
              >
                <Icon icon="mdi:apple" className="w-4 h-4" />{" "}
                {t("landing.footer.mobileApps.ios")}
              </Link>
              <Link
                href="#"
                className="text-white/60 text-sm hover:text-landing-accent transition-colors flex items-center gap-2"
              >
                <Icon icon="mdi:android" className="w-4 h-4" />{" "}
                {t("landing.footer.mobileApps.android")}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 mt-10 pt-6 text-center text-white/40 text-sm">
          {t("landing.footer.copyright", {
            year: new Date().getFullYear(),
          })}
        </div>
      </div>
    </footer>
  );
};
