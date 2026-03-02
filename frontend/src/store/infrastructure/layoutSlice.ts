import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LayoutState, SkinMode, ContentWidth, MenuLayoutType, NavbarType, FooterType } from "../domain/layout";
import themeConfig from "@/configs/themeConfig";

const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const item = window.localStorage.getItem(key);
  try {
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const initialRtl = (): boolean =>
  getFromLocalStorage("direction", themeConfig.layout.isRTL);
const initialDarkMode = (): boolean => {
  if (typeof window === "undefined") {
    return themeConfig.layout.darkMode;
  }

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "dark") {
    return true;
  }
  if (storedTheme === "light") {
    return false;
  }

  const legacyDarkMode = window.localStorage.getItem("darkMode");
  if (legacyDarkMode === "true") {
    return true;
  }
  if (legacyDarkMode === "false") {
    return false;
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return themeConfig.layout.darkMode;
};
const initialSidebarCollapsed = (): boolean =>
  getFromLocalStorage("sidebarCollapsed", themeConfig.layout.menu.isCollapsed);
const initialSemiDarkMode = (): boolean =>
  getFromLocalStorage("semiDarkMode", themeConfig.layout.semiDarkMode);
const initialSkin = (): SkinMode =>
  getFromLocalStorage("skin", themeConfig.layout.skin);
const initialType = (): MenuLayoutType =>
  getFromLocalStorage("type", themeConfig.layout.type);
const initialMonochrome = (): boolean =>
  getFromLocalStorage("monochrome", themeConfig.layout.isMonochrome);

const initialState: LayoutState = {
  isRTL: initialRtl(),
  darkMode: initialDarkMode(),
  isCollapsed: initialSidebarCollapsed(),
  customizer: themeConfig.layout.customizer,
  semiDarkMode: initialSemiDarkMode(),
  skin: initialSkin(),
  contentWidth: themeConfig.layout.contentWidth,
  type: initialType(),
  menuHidden: themeConfig.layout.menu.isHidden,
  navBarType: themeConfig.layout.navBarType,
  footerType: themeConfig.layout.footerType,
  mobileMenu: themeConfig.layout.mobileMenu,
  isMonochrome: initialMonochrome(),
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    handleDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("darkMode", String(action.payload));
        window.localStorage.setItem("theme", action.payload ? "dark" : "light");
      }
    },
    handleSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
      window.localStorage.setItem("sidebarCollapsed", String(action.payload));
    },
    handleCustomizer: (state, action: PayloadAction<boolean>) => {
      state.customizer = action.payload;
    },
    handleSemiDarkMode: (state, action: PayloadAction<boolean>) => {
      state.semiDarkMode = action.payload;
      window.localStorage.setItem("semiDarkMode", String(action.payload));
    },
    handleRtl: (state, action: PayloadAction<boolean>) => {
      state.isRTL = action.payload;
      window.localStorage.setItem("direction", JSON.stringify(action.payload));
    },
    handleSkin: (state, action: PayloadAction<SkinMode>) => {
      state.skin = action.payload;
      window.localStorage.setItem("skin", JSON.stringify(action.payload));
    },
    handleContentWidth: (state, action: PayloadAction<ContentWidth>) => {
      state.contentWidth = action.payload;
    },
    handleType: (state, action: PayloadAction<MenuLayoutType>) => {
      state.type = action.payload;
      window.localStorage.setItem("type", JSON.stringify(action.payload));
    },
    handleMenuHidden: (state, action: PayloadAction<boolean>) => {
      state.menuHidden = action.payload;
    },
    handleNavBarType: (state, action: PayloadAction<NavbarType>) => {
      state.navBarType = action.payload;
    },
    handleFooterType: (state, action: PayloadAction<FooterType>) => {
      state.footerType = action.payload;
    },
    handleMobileMenu: (state, action: PayloadAction<boolean>) => {
      state.mobileMenu = action.payload;
    },
    handleMonoChrome: (state, action: PayloadAction<boolean>) => {
      state.isMonochrome = action.payload;
      window.localStorage.setItem("monochrome", JSON.stringify(action.payload));
    },
  },
});

export const {
  handleDarkMode,
  handleSidebarCollapsed,
  handleCustomizer,
  handleSemiDarkMode,
  handleRtl,
  handleSkin,
  handleContentWidth,
  handleType,
  handleMenuHidden,
  handleNavBarType,
  handleFooterType,
  handleMobileMenu,
  handleMonoChrome,
} = layoutSlice.actions;

export default layoutSlice.reducer;
