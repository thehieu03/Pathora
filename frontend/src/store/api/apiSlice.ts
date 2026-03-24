import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";
import { API_GATEWAY_BASE_URL } from "@/configs/apiGateway";
import { getCurrentApiLanguage } from "../../api/languageHeader";
import { getCookie } from "../../utils/cookie";

const baseUrl = API_GATEWAY_BASE_URL;

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

/**
 * Guards against the Next.js HMR loop.
 *
 * When the dev server reloads a changed module (e.g. a component or a slice),
 * RTK Query's apiSlice is also re-created, which resets its internal cache.
 * Components that are still mounted then re-trigger queries with a brand-new
 * RTK Query instance that has no knowledge of the previous auth session.
 *
 * The guard detects this situation by checking whether the Redux store already
 * has an `auth` slice with a valid session. If it does NOT (fresh store) but
 * we are in the browser with an existing auth cookie, we are inside an HMR
 * re-mount. In that case we return a fake 401 to tell RTK Query to skip the
 * request without throwing — preventing the auth-interceptor redirect loop
 * that would otherwise cause continuous re-fetching.
 */
const hmrAwareBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: unknown; headers?: Record<string, string> },
  unknown,
  { status: number; error: string }
> = async (args, store, extraOptions) => {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    // Access auth state via the store — this is the root store, not the apiSlice internals.
    const state = store.getState as () => RootState;
    const authState = state().auth;
    const hasValidAuthSession = Boolean(
      authState?.isAuth && authState?.user,
    );

    // HMR scenario: new RTK Query instance, but user still has a real cookie.
    if (!hasValidAuthSession && getCookie("access_token")) {
      // Returning { data: undefined } with an error result tells RTK Query
      // "this request failed, but don't throw". RTK Query will then use the
      // cached value (if any) or mark the query as errored without
      // re-triggering the interceptor chain.
      return {
        data: undefined as unknown as { status: number; error: string },
        error: { status: 999, error: "HMR_RESET" },
      };
    }
  }

  return fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => prepareApiHeaders(headers),
  })(args, store as Parameters<typeof fetchBaseQuery>[1], extraOptions);
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: hmrAwareBaseQuery,
  tagTypes: ["Products", "Orders", "Customers", "Dashboard", "events", "Auth"],
  endpoints: () => ({}),
});
