"use client";

import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/infrastructure/authSlice";
import type { RootState, AppDispatch } from "@/store";
import type { UserInfo } from "@/types";
import { clearAuthSession } from "@/utils/authSession";

type LoginRequest = Record<string, unknown>;
type RegisterRequest = Record<string, unknown>;

export interface AuthContextValue {
  user: UserInfo | null;
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
    clearAuthSession();
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
