"use client";

import useDarkmode from "@/hooks/useDarkMode";

/**
 * Invisible component that syncs the Redux dark mode state
 * to the <body> class on every page. Must be rendered inside
 * StoreProvider so it can read Redux state.
 */
export default function DarkModeSync() {
  useDarkmode(); // This hook adds/removes "dark" class on <body>
  return null;
}
