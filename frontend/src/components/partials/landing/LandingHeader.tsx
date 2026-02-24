"use client";
import React, { useState } from "react";
import Link from "next/link";

const LOGO =
  "https://www.figma.com/api/mcp/asset/b9cd8d76-4d7f-43c8-b45b-122fe4f71260";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "About Us", href: "/about" },
  { label: "Tour Packages", href: "/tours" },
  { label: "Our Policies", href: "/policies" },
];

const LandingHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 h-[88px] bg-[rgba(255,255,255,0.12)] backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0">
        <div className="relative h-16 w-32">
          <img
            src={LOGO}
            alt="Pathora"
            className="h-full w-full object-contain"
          />
        </div>
      </Link>

      {/* Nav links */}
      <nav className="hidden lg:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`text-white font-semibold text-lg transition-colors hover:text-[#FA8B02] ${
              link.active ? "border-b-2 border-[#FA8B02]" : ""
            }`}>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="hidden lg:flex items-center gap-3">
        <button className="flex items-center gap-1 text-white/60 font-semibold text-lg hover:text-white transition-colors">
          Eng
          <svg
            className="w-5 h-5 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <Link
          href="/login"
          className="px-5 py-2.5 text-white font-semibold text-lg border border-white/40 rounded-full hover:bg-white/10 transition-colors">
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2.5 bg-[#FA8B02] text-white font-semibold text-lg rounded-full hover:bg-[#e07a00] transition-colors">
          Sign Up
        </Link>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="lg:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu">
        <svg
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}>
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#1a1a2e]/95 backdrop-blur-md p-6 flex flex-col gap-4 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white font-semibold text-lg"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link
              href="/login"
              className="px-5 py-2 text-white border border-white/40 rounded-full font-semibold">
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-[#FA8B02] text-white rounded-full font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
