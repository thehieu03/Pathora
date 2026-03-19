"use client";

import { useRouter } from "next/navigation";

import { Icon } from "@/components/ui";
import { useLogoutMutation } from "@/store/api/auth/authApiSlice";

const REFRESH_TOKEN_COOKIE_KEY = "refresh_token=";

const extractRefreshToken = (cookieSource: string): string => {
  const tokenValue = cookieSource
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(REFRESH_TOKEN_COOKIE_KEY))
    ?.slice(REFRESH_TOKEN_COOKIE_KEY.length);

  if (!tokenValue) {
    return "";
  }

  try {
    return decodeURIComponent(tokenValue);
  } catch {
    return tokenValue;
  }
};

export function AdminLogoutButton() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    const refreshToken = extractRefreshToken(
      typeof document === "undefined" ? "" : document.cookie,
    );

    try {
      await logout({ refreshToken }).unwrap();
    } catch {
      // auth slice is cleared in onQueryStarted even when API logout fails
    }

    router.push("/home");
  };

  return (
    <button
      type="button"
      onClick={() => {
        void handleLogout();
      }}
      disabled={isLoading}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
      <Icon icon="heroicons:arrow-right-on-rectangle" className="size-5" />
      <span>{isLoading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}


