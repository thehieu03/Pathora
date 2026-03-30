import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, UserInfo } from "@/types";

// Safe localStorage access for SSR
const storedUser =
  typeof window !== "undefined"
    ? (JSON.parse(localStorage.getItem("user") || "null") as UserInfo | null)
    : null;

const initialState: AuthState = {
  user: storedUser || null,
  isAuth: !!storedUser,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
      state.isAuth = !!action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      }
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logOut: (state) => {
      state.user = null;
      state.isAuth = false;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setUser, logOut, setToken, setCredentials } = authSlice.actions;
export default authSlice.reducer;
