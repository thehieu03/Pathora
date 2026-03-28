import { apiSlice } from "../apiSlice";
import { setUser, setToken, logOut } from "../../infrastructure/authSlice";
import type { UserInfo } from "../../domain/auth";
import type { ApiSharedResponse } from "@/types";
import { isAdminPortal } from "@/utils/authRouting";

// ─── Cookie helpers ────────────────────────────────────────────────────────

const DAY_SECONDS = 60 * 60 * 24;

const isProduction = process.env.NODE_ENV === "production";
const setCookie = (name: string, value: string, maxAge = DAY_SECONDS): void => {
  const secure = isProduction ? "; Secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
};

const setAuthSessionCookies = (portal: string | null): void => {
  setCookie("auth_status", "1", DAY_SECONDS * 7);
  setCookie("auth_portal", isAdminPortal(portal) ? "admin" : "user", DAY_SECONDS * 7);
};

const clearAuthSessionCookies = (): void => {
  removeCookie("auth_status");
  removeCookie("auth_portal");
};

// ─── Request / Response shapes ─────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
  portal: string | null;
  defaultPath: string | null;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// ─── RTK Query endpoints ───────────────────────────────────────────────────

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /api/auth/register
     * Register a new user account.
     */
    register: builder.mutation<ApiSharedResponse<string>, RegisterRequest>({
      query: (body) => ({
        url: "/api/auth/register",
        method: "POST",
        body,
      }),
    }),

    /**
     * POST /api/auth/login
     * On success: stores tokens in cookies, fetches user info, updates Redux.
     */
    login: builder.mutation<ApiSharedResponse<TokenData>, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const tokens = data.data;
          if (!tokens) return;

          setCookie("access_token", tokens.accessToken);
          setCookie("refresh_token", tokens.refreshToken, DAY_SECONDS * 7);
          setAuthSessionCookies(tokens.portal);
          dispatch(setToken(tokens.accessToken));

          // Fetch user info right after login to populate Redux
          const result = await dispatch(
            authApiSlice.endpoints.getUserInfo.initiate(undefined, {
              forceRefetch: true,
            }),
          );
          if ("data" in result && result.data?.data) {
            dispatch(setUser(result.data.data));
          }
        } catch {
          // errors are handled by axiosInstance / apiSlice globally
        }
      },
    }),

    /**
     * GET /api/auth/me
     * Returns current user info and syncs it to Redux auth state.
     */
    getUserInfo: builder.query<ApiSharedResponse<UserInfo>, void>({
      query: () => "/api/auth/me",
      providesTags: ["Auth"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setUser(data.data));
          }
        } catch {
          // unauthenticated — leave state as-is
        }
      },
    }),

    /**
     * POST /api/auth/refresh
     * Rotates the access/refresh token pair and updates cookies + Redux.
     */
    refreshToken: builder.mutation<
      ApiSharedResponse<TokenData>,
      RefreshRequest
    >({
      query: (body) => ({
        url: "/api/auth/refresh",
        method: "POST",
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const tokens = data.data;
          if (!tokens) return;

          setCookie("access_token", tokens.accessToken);
          setCookie("refresh_token", tokens.refreshToken, DAY_SECONDS * 7);
          setAuthSessionCookies(tokens.portal);
          dispatch(setToken(tokens.accessToken));
        } catch {
          // token expired — force logout
          removeCookie("access_token");
          removeCookie("refresh_token");
          clearAuthSessionCookies();
          dispatch(logOut());
        }
      },
    }),

    /**
     * POST /api/auth/logout
     * Revokes the refresh token on the server and clears client state.
     */
    logout: builder.mutation<ApiSharedResponse<unknown>, LogoutRequest>({
      query: (body) => ({
        url: "/api/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        // Clear client state immediately (optimistic), regardless of server result
        removeCookie("access_token");
        removeCookie("refresh_token");
        clearAuthSessionCookies();
        dispatch(logOut());
        try {
          await queryFulfilled;
        } catch {
          // server-side revocation failed but client is already logged out
        }
      },
    }),

    /**
     * PUT /api/user/change-password
     * Change user password.
     */
    changePassword: builder.mutation<ApiSharedResponse<void>, { oldPassword: string; newPassword: string }>({
      query: (body) => ({
        url: "/api/auth/change-password",
        method: "PUT",
        body,
      }),
    }),

    /**
     * PUT /api/auth/me
     * Update current user profile.
     */
    updateUser: builder.mutation<ApiSharedResponse<void>, { fullName?: string; phoneNumber?: string; address?: string; avatar?: string }>({
      query: (body) => ({
        url: "/api/auth/me",
        method: "PUT",
        body: { request: body },
      }),
      invalidatesTags: ["Auth"],
    }),

    /**
     * GET /api/user/notification-preferences
     * Get user notification preferences.
     */
    getNotificationPreferences: builder.query<ApiSharedResponse<{ emailNotifications: boolean; smsNotifications: boolean; newsletter: boolean }>, void>({
      query: () => "/api/user/notification-preferences",
      providesTags: ["Auth"],
    }),

    /**
     * PUT /api/user/notification-preferences
     * Update user notification preferences.
     */
    updateNotificationPreferences: builder.mutation<ApiSharedResponse<void>, { emailNotifications: boolean; smsNotifications: boolean; newsletter: boolean }>({
      query: (body) => ({
        url: "/api/user/notification-preferences",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserInfoQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useUpdateUserMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = authApiSlice;
