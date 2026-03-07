import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCurrentApiLanguage } from "../../api/languageHeader";
import { getCookie } from "@/utils/cookie";

const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY || "http://localhost:5182";

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
    credentials: "include",
    prepareHeaders: (headers) => prepareApiHeaders(headers),
  }),
  tagTypes: ["Products", "Orders", "Customers", "Dashboard", "events", "Auth"],
  endpoints: () => ({}),
});
