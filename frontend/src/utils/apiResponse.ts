import { isAxiosError } from "axios";

import type { ApiError, ServiceResponse } from "../types/api";

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

  return null;
};

export const extractData = <T>(payload: unknown): T | null => {
  if (payload == null) {
    return null;
  }

  if (typeof payload === "object" && "success" in payload) {
    const response = payload as ServiceResponse<T>;
    if (!response.success) {
      return null;
    }
    return response.data ?? null;
  }

  return extractResult<T>(payload);
};

interface BackendErrorItem {
  code?: string;
  errorMessage?: string;
  message?: string;
  details?: string;
}

interface BackendErrorPayload {
  message?: string;
  errors?: BackendErrorItem[];
}

// Map backend error codes/messages to translation keys
const mapToTranslationKey = (errorMessage: string): string => {
  // Map backend error codes to translation keys for login-specific errors
  if (errorMessage === "User.NotFound" || errorMessage === "User.InvalidPassword") {
    return "error_response.INVALID_CREDENTIALS";
  }
  if (errorMessage === "User.Disabled" || errorMessage === "User.IsDisabled") {
    return "error_response.USER_DISABLED";
  }
  // Return original to allow fallback to error_response lookup
  return errorMessage;
};

const shouldUseDetailsAsErrorCode = (details: string | undefined): boolean => {
  if (!details) {
    return false;
  }

  return (
    details === "User.NotFound" ||
    details === "User.InvalidPassword" ||
    details === "User.Disabled" ||
    details === "User.IsDisabled"
  );
};

const extractBackendErrorPayload = (
  payload: unknown,
): { rawMessage: string; rawCode: string; rawDetails?: string } => {
  // Handle plain string response (ASP.NET Core often returns this)
  if (typeof payload === "string" && payload.trim().length > 0) {
    return {
      rawMessage: payload,
      rawCode: "UNKNOWN_ERROR",
    };
  }

  if (!payload || typeof payload !== "object") {
    return {
      rawMessage: "DEFAULT_ERROR",
      rawCode: "UNKNOWN_ERROR",
    };
  }

  const body = payload as BackendErrorPayload;
  const firstError = body.errors?.[0];

  return {
    rawMessage:
      firstError?.errorMessage ??
      firstError?.message ??
      body.message ??
      "DEFAULT_ERROR",
    rawCode: firstError?.code ?? "UNKNOWN_ERROR",
    rawDetails: firstError?.details,
  };
};

export const handleApiError = (error: unknown): ApiError => {
  if (isAxiosError(error)) {
    const { rawMessage, rawCode, rawDetails } = extractBackendErrorPayload(
      error.response?.data,
    );
    const rawMappingCandidate = shouldUseDetailsAsErrorCode(rawDetails)
      ? rawDetails
      : rawMessage;

    // Map to translation key for specific error types
    const translationKey = mapToTranslationKey(rawMappingCandidate);

    // Determine a meaningful display message:
    // - If rawMessage was "DEFAULT_ERROR" (i.e. empty/unparseable response), use HTTP status
    // - If rawMessage is a raw backend string, show it directly
    // - Otherwise show the translation key
    let displayMessage: string;
    if (rawMessage === "DEFAULT_ERROR") {
      const status = error.response?.status;
      displayMessage =
        status === 401
          ? "Unauthorized — please log in again"
          : status === 403
          ? "Forbidden — you don't have permission"
          : status === 404
          ? "Not Found"
          : status === 500
          ? "Server error — please try again later"
          : status != null
          ? `HTTP Error ${status}`
          : "DEFAULT_ERROR";
    } else {
      displayMessage = rawMessage;
    }

    return {
      code:
        rawCode !== "UNKNOWN_ERROR"
          ? rawCode
          : String(error.response?.status ?? "UNKNOWN_ERROR"),
      message: displayMessage,
      details: rawDetails,
    };
  }

  if (error && typeof error === "object" && "status" in error) {
    const rtkError = error as {
      status?: number | string;
      data?: unknown;
      error?: string;
    };
    const { rawMessage, rawCode, rawDetails } = extractBackendErrorPayload(rtkError.data);
    const fallbackMessage = rtkError.error ?? rawMessage;
    const rawMappingCandidate = shouldUseDetailsAsErrorCode(rawDetails)
      ? rawDetails
      : fallbackMessage;

    if (process.env.NODE_ENV === "development") {
      console.warn("[handleApiError][rtk]", {
        status: rtkError.status,
        rawMessage,
        rawDetails,
      });
    }

    return {
      code: rawCode !== "UNKNOWN_ERROR" ? rawCode : String(rtkError.status ?? "UNKNOWN_ERROR"),
      message: mapToTranslationKey(rawMappingCandidate),
      details: rawDetails,
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
