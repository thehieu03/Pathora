"use client";

import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";
import type { RootState, AppDispatch } from "@/store";
import type { User } from "@/types";

type LoginRequest = Record<string, unknown>;
type RegisterRequest = Record<string, unknown>;

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): AuthContextValue => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      document.cookie = "access_token=; path=/; max-age=0";
      document.cookie = "auth_status=; path=/; max-age=0";
    }
    dispatch(logOut());
  };

  return {
    user: authState?.user ?? null,
    isAuthenticated: !!authState?.isAuth,
    isLoading: false,
    login: async () => {
      throw new Error("useAuth.login is not implemented.");
    },
    register: async () => {
      throw new Error("useAuth.register is not implemented.");
    },
    logout,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return children;
};
