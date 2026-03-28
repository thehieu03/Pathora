"use client";

import { useMemo } from "react";
import { useGetNotificationPreferencesQuery, useUpdateNotificationPreferencesMutation } from "@/store/api/auth/authApiSlice";
import type { NotificationPreferences } from "../types";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../types";
import { extractResult } from "@/utils/apiResponse";

const isNotImplementedStatus = (status?: number): boolean => status === 404 || status === 501;

export function useNotificationPreferences() {
  const query = useGetNotificationPreferencesQuery();
  const [updatePreferences, updateState] = useUpdateNotificationPreferencesMutation();

  const preferences = useMemo<NotificationPreferences>(() => {
    const extracted = extractResult<NotificationPreferences>(query.data);
    return extracted ?? DEFAULT_NOTIFICATION_PREFERENCES;
  }, [query.data]);

  const status = typeof query.error === "object" && query.error && "status" in query.error
    ? Number((query.error as { status?: number | string }).status)
    : undefined;

  return {
    preferences,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isUnavailable: isNotImplementedStatus(status),
    error: query.error,
    refetch: query.refetch,
    updatePreferences,
    isUpdating: updateState.isLoading,
  };
}
