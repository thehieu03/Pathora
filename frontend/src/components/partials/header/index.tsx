"use client";
import React from "react";
import { useSelector } from "react-redux";
import Icon from "@/components/ui/Icon";
import SwitchDark from "./Tools/SwitchDark";
import HorizentalMenu from "./Tools/HorizentalMenu";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useNavbarType from "@/hooks/useNavbarType";
import useMenulayout from "@/hooks/useMenulayout";
import useSkin from "@/hooks/useSkin";
import Logo from "./Tools/Logo";
import SearchModal from "./Tools/SearchModal";
import Profile from "./Tools/Profile";
import Notification from "./Tools/Notification";
import useRtl from "@/hooks/useRtl";
import useMobileMenu from "@/hooks/useMobileMenu";

const Header = ({ className = "custom-class" }) => {
  const [collapsed, setMenuCollapsed] = useSidebar();
  const { width, breakpoints } = useWidth();
  const [navbarType] = useNavbarType();
  const [menuType] = useMenulayout();
  const [skin] = useSkin();
  const [isRtl] = useRtl();
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  const navbarTypeClass = () => {
    switch (navbarType) {
      case "floating":
        return "floating has-sticky-header";
      case "sticky":
        return "sticky top-0 z-999";
      case "static":
        return "static";
      case "hidden":
        return "hidden";
      default:
        return "sticky top-0";
    }
  };

  const borderSwitchClass = () => {
    if (skin === "bordered" && navbarType !== "floating") {
      return "border-b border-slate-200/60 dark:border-slate-700/60";
    } else if (skin === "bordered" && navbarType === "floating") {
      return "border border-slate-200 dark:border-slate-700";
    } else {
      return "dark:border-b dark:border-slate-700/60";
    }
  };

  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <header className={className + " " + navbarTypeClass()}>
      <div
        className={`app-header shadow-base dark:shadow-base3 bg-white px-[15px] md:px-6 dark:bg-slate-800 ${borderSwitchClass()} ${
          menuType === "horizontal" && width > breakpoints.xl
            ? "py-1"
            : "py-3 md:py-6"
        }`}
      >
        <div className="flex h-full items-center justify-between">
          {menuType === "vertical" && (
            <div className="flex items-center gap-2 md:gap-4 rtl:space-x-reverse">
              {collapsed && width >= breakpoints.xl && (
                <button
                  className="text-xl text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  onClick={() => setMenuCollapsed(!collapsed)}
                  aria-label={collapsed ? "Expand menu" : "Collapse menu"}
                >
                  <Icon
                    icon={isRtl ? "akar-icons:arrow-left" : "akar-icons:arrow-right"}
                  />
                </button>
              )}
              {width < breakpoints.xl && <Logo />}
              {width < breakpoints.xl && width >= breakpoints.md && (
                <button
                  className="cursor-pointer text-2xl text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  onClick={handleOpenMobileMenu}
                  aria-label="Open mobile menu"
                >
                  <Icon icon="heroicons-outline:menu-alt-3" />
                </button>
              )}
              <SearchModal />
            </div>
          )}

          {menuType === "horizontal" && (
            <div className="flex items-center gap-4 rtl:space-x-reverse">
              <Logo />
              {width <= breakpoints.xl && (
                <button
                  className="cursor-pointer text-2xl text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  onClick={handleOpenMobileMenu}
                  aria-label="Open mobile menu"
                >
                  <Icon icon="heroicons-outline:menu-alt-3" />
                </button>
              )}
            </div>
          )}

          {menuType === "horizontal" && width >= breakpoints.xl ? (
            <HorizentalMenu />
          ) : null}

          <div className="nav-tools flex items-center gap-3 lg:gap-6 rtl:space-x-reverse">
            <SwitchDark />
            {width < breakpoints.md && (
              <button
                className="cursor-pointer text-2xl text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                onClick={handleOpenMobileMenu}
                aria-label="Open mobile menu"
              >
                <Icon icon="heroicons-outline:menu-alt-3" />
              </button>
            )}
            {width >= breakpoints.md && <Notification />}
            {width >= breakpoints.md && <Profile />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
