"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { logOut, setUser } from "@/store/infrastructure/authSlice";
import { authApiSlice } from "@/store/api/auth/authApiSlice";
import type { AppDispatch } from "@/store";
import {
  clearAuthSession,
  markAuthenticatedSession,
  syncAuthPortalSession,
} from "@/utils/authSession";
import { resolvePostLoginPath } from "@/utils/postLoginRouting";

interface UserInfoRoutingMetadata {
  defaultPath?: string | null;
  portal?: string | null;
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      clearAuthSession();
      dispatch(logOut());
      router.replace("/home?login=true");
      return;
    }

    dispatch(
      authApiSlice.endpoints.getUserInfo.initiate(undefined, {
        forceRefetch: true,
      }),
    ).then((result) => {
      if ("data" in result && result.data?.data) {
        dispatch(setUser(result.data.data));

        const routingMetadata = result.data.data as UserInfoRoutingMetadata;
        syncAuthPortalSession(
          routingMetadata.portal,
          routingMetadata.defaultPath,
        );
        markAuthenticatedSession();
        router.replace(
          resolvePostLoginPath(
            routingMetadata.defaultPath,
            routingMetadata.portal,
          ),
        );
      } else {
        clearAuthSession();
        dispatch(logOut());
        router.replace("/home?login=true");
      }
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
