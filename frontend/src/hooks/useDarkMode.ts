import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleDarkMode } from "@/store/layout";
import type { LayoutState } from "@/types/index";
import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  getPreferredTheme,
  getSystemPrefersDark,
} from "./themePreference";

const useDarkmode = (): [boolean, (mode: boolean) => void] => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: { layout: LayoutState }) => state.layout.darkMode);
  const hasResolvedInitialTheme = useRef(false);

  // ** Return a wrapped version of useState's setter function
  const setDarkMode = (mode: boolean) => {
    dispatch(handleDarkMode(mode));
  };

  useEffect(() => {
    if (hasResolvedInitialTheme.current) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const preferredTheme = getPreferredTheme(storedTheme, getSystemPrefersDark());
    const preferredIsDark = preferredTheme === "dark";

    if (preferredIsDark !== isDark) {
      dispatch(handleDarkMode(preferredIsDark));
      return;
    }

    hasResolvedInitialTheme.current = true;
  }, [dispatch, isDark]);

  useEffect(() => {
    if (!hasResolvedInitialTheme.current) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const theme = isDark ? "dark" : "light";
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeClass(theme, window.document.documentElement, window.document.body);
  }, [isDark]);

  return [isDark, setDarkMode];
};

export default useDarkmode;
