import React from "react";
import Link from "next/link";

const FOOTER_BG =
  "https://www.figma.com/api/mcp/asset/b457b48b-2c4f-49e0-a589-ec3d2233e4c1";

const companyLinks = [
  "About Us",
  "Tourz Reviews",
  "Contact Us",
  "Travel Guides",
  "Data Policy",
  "Cookie Policy",
  "Legal",
  "Sitemap",
];
const supportLinks = [
  "Get in Touch",
  "Help center",
  "Live chat",
  "How it works",
];

const LandingFooter = () => {
  return (
    <footer className="relative overflow-hidden text-white">
      {/* Background */}
      <img
        src={FOOTER_BG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#05073c]/90" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-[75px] py-16">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/15 pb-8 mb-10">
          <p className="text-[#eb662b] font-medium">
            Speak to our expert at{" "}
            <span className="font-bold">1-800-453-6744</span>
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/70">Follow Us</span>
            {["facebook", "twitter", "instagram", "youtube"].map((s) => (
              <Link
                key={s}
                href={`https://${s}.com`}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#FA8B02] hover:border-[#FA8B02] transition-colors text-white/70 hover:text-white text-xs">
                {s[0].toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">Contact</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              328 Queensberry Street, North Melbourne VIC 3051, Australia.
            </p>
            <p className="text-white/60 text-sm mt-3">hi@pathora.com</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">Company</h4>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-white/60 text-sm hover:text-[#FA8B02] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">Support</h4>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-white/60 text-sm hover:text-[#FA8B02] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-xl mb-5">
              Newsletter
            </h4>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Subscribe to the free newsletter and stay up to date
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white border border-white/20 rounded-xl px-4 py-3 text-[#05073c] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA8B02]"
              />
              <button className="bg-[#FA8B02] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#e07a00] transition-colors shrink-0">
                Send
              </button>
            </div>

            <h4 className="text-white font-semibold text-lg mt-8 mb-3">
              Mobile Apps
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="#"
                className="text-white/60 text-sm hover:text-[#FA8B02] transition-colors flex items-center gap-2">
                <span className="text-xs">●</span> iOS App
              </Link>
              <Link
                href="#"
                className="text-white/60 text-sm hover:text-[#FA8B02] transition-colors flex items-center gap-2">
                <span className="text-xs">●</span> Android App
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 mt-10 pt-6 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Pathora. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
