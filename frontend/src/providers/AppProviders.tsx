"use client";
import React from "react";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import "../assets/css/app.css";
import "../i18n/config";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      {/*<AuthProvider>*/}
      {children}
      <ToastContainer />
      {/*</AuthProvider>*/}
    </StoreProvider>
  );
}
