"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { logOut, setUser } from "@/store/infrastructure/authSlice";
import { authApiSlice } from "@/store/api/auth/authApiSlice";
import type { AppDispatch } from "@/store";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      dispatch(logOut());
      router.replace("/");
      return;
    }

    dispatch(
      authApiSlice.endpoints.getUserInfo.initiate(undefined, {
        forceRefetch: true,
      }),
    ).then((result) => {
      if ("data" in result && result.data?.data) {
        dispatch(setUser(result.data.data));
      } else {
        dispatch(logOut());
      }
      router.replace("/");
    });
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
