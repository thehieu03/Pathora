import { isAxiosError } from "axios";

import type { ApiError, ApiResponse } from "../types/api";

export const extractItems = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const data = payload as {
    result?: unknown;
    data?: unknown;
  };

  if (data.result && typeof data.result === "object") {
    const resultObj = data.result as { items?: unknown };
    if (Array.isArray(resultObj.items)) {
      return resultObj.items as T[];
    }
    if (Array.isArray(data.result)) {
      return data.result as T[];
    }
  }

  if (data.data && typeof data.data === "object") {
    const dataObj = data.data as { items?: unknown };
    if (Array.isArray(dataObj.items)) {
      return dataObj.items as T[];
    }
    if (Array.isArray(data.data)) {
      return data.data as T[];
    }
  }

  return [];
};

export const extractResult = <T>(payload: unknown): T | null => {
  if (payload == null) {
    return null;
  }

  if (typeof payload !== "object") {
    return payload as T;
  }

  const data = payload as {
    result?: unknown;
    data?: unknown;
    value?: unknown;
  };

  if (data.result !== undefined) {
    return data.result as T;
  }

  if (data.data !== undefined) {
    return data.data as T;
  }

  if (data.value !== undefined) {
    return data.value as T;
  }

  return payload as T;
};

export const extractData = <T>(payload: unknown): T | null => {
  if (payload == null) {
    return null;
  }

  if (typeof payload === "object" && "success" in payload) {
    const response = payload as ApiResponse<T>;
    if (!response.success) {
      return null;
    }
    return response.data ?? null;
  }

  return extractResult<T>(payload);
};

export const handleApiError = (error: unknown): ApiError => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | {
          message?: string;
          errors?: Array<{
            code?: string;
            errorMessage?: string;
            message?: string;
            details?: string;
          }>;
        }
      | undefined;

    const firstError = responseData?.errors?.[0];

    return {
      code: firstError?.code ?? String(error.response?.status ?? "UNKNOWN_ERROR"),
      message:
        firstError?.errorMessage ??
        firstError?.message ??
        responseData?.message ??
        "DEFAULT_ERROR",
      details: firstError?.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message || "DEFAULT_ERROR",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "DEFAULT_ERROR",
  };
};
