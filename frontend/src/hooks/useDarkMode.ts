import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleDarkMode } from "@/store/layout";
import { THEME_STORAGE_KEY, applyThemeClass } from "./themePreference";

const useDarkmode = (): [boolean, (mode: boolean) => void] => {
  const dispatch = useDispatch();

  const forceLightTheme = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    window.localStorage.setItem("darkMode", "false");
    applyThemeClass(
      "light",
      window.document.documentElement,
      window.document.body,
    );
  };

  const setDarkMode: (mode: boolean) => void = () => {
    dispatch(handleDarkMode(false));
    forceLightTheme();
  };

  useEffect(() => {
    dispatch(handleDarkMode(false));
    forceLightTheme();
  }, [dispatch]);

  return [false, setDarkMode];
};

export default useDarkmode;
