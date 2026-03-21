"use client";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Suspense, useState } from "react";
import Card from "@/components/ui/Card";
import { AdminSidebar, TopBar } from "@/features/dashboard/components/AdminSidebar";

function SearchContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const destination = searchParams.get("destination");
  const classification = searchParams.get("classification");
  const date = searchParams.get("date");
  const people = searchParams.get("people");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Search Results</h1>
          <p className="text-sm text-stone-400 mt-0.5 font-normal">Tour search results matching your criteria</p>
        </div>
      </div>

      <Card bodyClass="p-6">
        <h2 className="text-base font-semibold text-stone-800 tracking-tight mb-4">Search Parameters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destination && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stone-400">Destination</span>
              <p className="text-sm font-medium text-stone-700">{destination}</p>
            </div>
          )}
          {classification && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stone-400">Classification</span>
              <p className="text-sm font-medium text-stone-700">{classification}</p>
            </div>
          )}
          {date && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stone-400">Date</span>
              <p className="text-sm font-medium text-stone-700">{date}</p>
            </div>
          )}
          {people && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-stone-400">People</span>
              <p className="text-sm font-medium text-stone-700">{people}</p>
            </div>
          )}
        </div>
      </Card>

      <Card bodyClass="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-700 mb-2">No results found</h3>
        <p className="text-sm text-stone-400 max-w-sm">Try adjusting your search parameters or browse available tours below.</p>
      </Card>
    </div>
  );
}

function SearchLoadingFallback() {
  return (
    <div className="space-y-5">
      <div className="skeleton h-8 w-48 rounded mb-1" />
      <div className="skeleton h-4 w-64 rounded mb-5" />
      <div className="skeleton h-32 rounded-xl" />
      <div className="skeleton h-64 rounded-xl" />
    </div>
  );
}

export default function SearchPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
      <TopBar onMenuClick={() => setSidebarOpen(true)} title="Search Results" subtitle="Tour search" />
      <main id="main-content" className="p-6">
        <Suspense fallback={<SearchLoadingFallback />}>
          <SearchContent />
        </Suspense>
      </main>
    </AdminSidebar>
  );
}
