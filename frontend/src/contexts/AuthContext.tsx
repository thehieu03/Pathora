// "use client";

// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { setUser, logOut as logoutAction } from "@/store/api/auth/authSlice";
// import type { User } from "@/types";
// import type { RootState } from "@/store";
// import authService, { type LoginRequest, type RegisterRequest, type LoginResponse } from "@/services/authService";
// import { extractResult } from "@/utils/apiResponse";
// import Loading from "@/components/Loading";

// interface AuthContextValue {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (data: LoginRequest) => Promise<void>;
//   register: (data: RegisterRequest) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// const setSessionCookies = (accessToken: string, expiresIn: number): void => {
//   const maxAge = Math.max(expiresIn, 60);
//   document.cookie = `access_token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
//   document.cookie = "auth_status=authenticated; path=/; max-age=86400; SameSite=Lax";
// };

// const clearSessionCookies = (): void => {
//   document.cookie = "access_token=; path=/; max-age=0";
//   document.cookie = "auth_status=; path=/; max-age=0";
// };

// export const useAuth = (): AuthContextValue => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const [isLoading, setIsLoading] = useState(true);
//   const initializedRef = useRef(false);

//   useEffect(() => {
//     if (initializedRef.current) return;
//     initializedRef.current = true;

//     const initAuth = () => {
//       try {
//         const storedUser = localStorage.getItem("user");
//         const hasAccessToken = document.cookie.includes("access_token=");

//         if (storedUser && hasAccessToken) {
//           dispatch(setUser(JSON.parse(storedUser)));
//         } else {
//           clearSessionCookies();
//           localStorage.removeItem("user");
//           dispatch(logoutAction());
//         }
//       } catch {
//         clearSessionCookies();
//         localStorage.removeItem("user");
//         dispatch(logoutAction());
//       }
//       setIsLoading(false);
//     };

//     initAuth();
//   }, [dispatch]);

//   const login = useCallback(
//     async (data: LoginRequest) => {
//       const response = await authService.login(data);
//       const result = extractResult<LoginResponse>(response.data);

//       if (!result) {
//         throw new Error("Login failed");
//       }

//       setSessionCookies(result.accessToken, result.expiresIn || 8 * 60 * 60);
//       localStorage.setItem("user", JSON.stringify(result.user));
//       dispatch(setUser(result.user));
//     },
//     [dispatch]
//   );

//   const register = useCallback(
//     async (data: RegisterRequest) => {
//       await authService.register(data);
//     },
//     []
//   );

//   const logout = useCallback(() => {
//     clearSessionCookies();
//     localStorage.removeItem("user");
//     dispatch(logoutAction());
//     router.push("/login");
//   }, [dispatch, router]);

//   const value = useMemo(
//     () => ({
//       user,
//       isAuthenticated: !!user,
//       isLoading,
//       login,
//       register,
//       logout,
//     }),
//     [user, isLoading, login, register, logout]
//   );

//   if (isLoading) {
//     return <Loading />;
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export default AuthContext;
