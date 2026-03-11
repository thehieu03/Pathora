import { apiSlice } from "../apiSlice";
import { setUser, setToken, logOut } from "../../infrastructure/authSlice";
import type { UserInfo } from "../../domain/auth";
import type { ApiSharedResponse } from "@/types";
import {
  clearAuthSession,
  persistAuthSession,
} from "../../../utils/authSession";

// ─── Cookie helpers ────────────────────────────────────────────────────────

type AuthDispatch = (
  action: ReturnType<typeof setToken> | ReturnType<typeof logOut>,
) => void;

export const clearSessionAndLogout = (
  dispatch: AuthDispatch,
): void => {
  clearAuthSession();
  dispatch(logOut());
};

const isUnauthorizedError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as {
    error?: {
      status?: number;
    };
  };

  return maybeError.error?.status === 401;
};

// ─── Request / Response shapes ─────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  portal?: string | null;
  defaultPath?: string | null;
}

export const applySuccessfulAuthSession = (
  tokens: TokenData,
  dispatch: AuthDispatch,
): void => {
  persistAuthSession(
    tokens.accessToken,
    tokens.refreshToken,
    tokens.portal,
    tokens.defaultPath,
  );
  dispatch(setToken(tokens.accessToken));
};

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

          applySuccessfulAuthSession(tokens, dispatch);

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
          clearSessionAndLogout(dispatch);
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
        } catch (error) {
          if (isUnauthorizedError(error)) {
            clearSessionAndLogout(dispatch);
          }
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

          applySuccessfulAuthSession(tokens, dispatch);
        } catch {
          // token expired — force logout
          clearSessionAndLogout(dispatch);
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
        clearSessionAndLogout(dispatch);
        try {
          await queryFulfilled;
        } catch {
          // server-side revocation failed but client is already logged out
        }
      },
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
} = authApiSlice;
