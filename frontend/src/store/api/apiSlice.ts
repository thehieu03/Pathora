import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCurrentApiLanguage } from "../../api/languageHeader";

const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY || "http://localhost:5182";

const getCookie = (
  name: string,
  cookieSource?: string | null,
): string | null => {
  const cookieValue =
    cookieSource ?? (typeof window !== "undefined" ? document.cookie : null);
  if (!cookieValue) return null;

  const value = `; ${cookieValue}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

export const prepareApiHeaders = (
  headers: Headers,
  cookieSource?: string | null,
  preferredLanguage?: string | null,
) => {
  const token = getCookie("access_token", cookieSource);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  headers.set("Accept-Language", getCurrentApiLanguage(preferredLanguage));
  return headers;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => prepareApiHeaders(headers),
  }),
  tagTypes: ["Products", "Orders", "Customers", "Dashboard", "events", "Auth"],
  endpoints: () => ({}),
});
