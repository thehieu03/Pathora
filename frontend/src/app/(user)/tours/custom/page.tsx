"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import CustomTourLoading from "./loading";

const CustomTourPage = dynamic(
  () =>
    import("@/features/custom-tour/components").then((m) => m.CustomTourPage),
  { loading: () => <CustomTourLoading /> },
);

// Check auth status from cookie - returns true if authenticated
function checkAuthStatus(): boolean {
  if (typeof document === "undefined") return false;
  const authStatus = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_status="))
    ?.split("=")[1];
  return Boolean(authStatus);
}

export default function CustomTour() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize the auth check to avoid recalculating
  const isAuthenticated = useMemo(() => checkAuthStatus(), []);

  useEffect(() => {
    // If not authenticated, redirect to login with next destination
    if (!isAuthenticated) {
      const currentPath = "/tours/custom";
      const queryString = searchParams.toString();
      const nextDestination = currentPath + (queryString ? `?${queryString}` : "");
      router.replace(`/home?login=true&next=${encodeURIComponent(nextDestination)}`);
    }
  }, [isAuthenticated, router, searchParams]);

  // Show loading while redirecting or if not authenticated
  if (!isAuthenticated) {
    return <CustomTourLoading />;
  }

  return <CustomTourPage />;
}
