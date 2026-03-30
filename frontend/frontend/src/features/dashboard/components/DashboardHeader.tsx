"use client";

import { Icon } from "@/components/ui";

interface DashboardHeaderProps {
  pageTitle: string;
  pageSubtitle: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  pageTitle,
  pageSubtitle,
  isLoading,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-10">
      {/* Left side */}
      <div className="relative">
        <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full mb-3 bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.18)]">
          Dashboard
        </span>
        <h1
          className="font-bold tracking-tight leading-none text-[#111827]"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", letterSpacing: "-0.04em" }}
        >
          {pageTitle}
        </h1>
        <p className="text-sm mt-2 text-[#9CA3AF]">{pageSubtitle}</p>
        <div className="absolute -bottom-2 left-0 h-0.5 rounded-full bg-[#F97316] w-[3rem]" />
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F97316]">
            Live
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium border transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] disabled:opacity-50"
          style={{
            borderColor: "#E5E7EB",
            color: "#6B7280",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Icon
            icon="heroicons:arrow-path"
            className={isLoading ? "animate-spin" : ""}
            width={16}
          />
          Refresh
        </button>
      </div>
    </div>
  );
}
