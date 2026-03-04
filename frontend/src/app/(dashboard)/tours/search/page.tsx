"use client";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";

function SearchContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const destination = searchParams.get("destination");
  const classification = searchParams.get("classification");
  const date = searchParams.get("date");
  const people = searchParams.get("people");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Results</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {destination && (
              <div>
                <span className="text-sm text-gray-500">Destination:</span>
                <p className="font-medium">{destination}</p>
              </div>
            )}
            {classification && (
              <div>
                <span className="text-sm text-gray-500">Classification:</span>
                <p className="font-medium">{classification}</p>
              </div>
            )}
            {date && (
              <div>
                <span className="text-sm text-gray-500">Date:</span>
                <p className="font-medium">{date}</p>
              </div>
            )}
            {people && (
              <div>
                <span className="text-sm text-gray-500">People:</span>
                <p className="font-medium">{people}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            Search results coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-9 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-32"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
