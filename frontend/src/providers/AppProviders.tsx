"use client";
import React, { useEffect } from "react";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "../assets/css/app.css";
import { hydrateClientLanguage } from "../i18n/config";
import DarkModeSync from "./DarkModeSync";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    hydrateClientLanguage();
  }, []);

  return (
    <StoreProvider>
      <DarkModeSync />
      {/*<AuthProvider>*/}
      {children}
      <ToastContainer />
      {/*</AuthProvider>*/}
    </StoreProvider>
  );
}
