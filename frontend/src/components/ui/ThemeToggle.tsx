"use client";

import React from "react";

import useDarkMode from "@/hooks/useDarkMode";

import Icon from "./Icon";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const [isDark, setDarkMode] = useDarkMode();
  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isDark}
      className={`lg:h-8 lg:w-8 lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${className}`}
      onClick={() => setDarkMode(!isDark)}
    >
      {isDark ? (
        <Icon icon="heroicons-outline:sun" aria-hidden="true" />
      ) : (
        <Icon icon="heroicons-outline:moon" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
