import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { logApiError, resolveErrorToast } from "./errorHandling";
import {
  createRetryConfig,
  getRetryDelayMs,
  shouldRetryError,
} from "./retryPolicy";

export interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

export interface ResponseErrorDependencies {
  request: (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>;
  wait: (delayMs: number) => Promise<void>;
  showError: (key: string, details?: string) => void;
  onUnauthorized: () => void;
}

export const waitForRetry = (delayMs: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
};

export const handleResponseError = async (
  error: AxiosError,
  deps: ResponseErrorDependencies,
): Promise<AxiosResponse> => {
  logApiError(error);

  const retryConfig = createRetryConfig();
  const requestConfig = error.config as RetryableRequestConfig | undefined;
  const retryCount = requestConfig?.__retryCount ?? 0;

  if (requestConfig && shouldRetryError(error, retryCount, retryConfig)) {
    const nextRetryCount = retryCount + 1;
    requestConfig.__retryCount = nextRetryCount;
    await deps.wait(getRetryDelayMs(nextRetryCount, retryConfig.baseDelayMs));
    return deps.request(requestConfig);
  }

  const errorToast = resolveErrorToast(error);
  deps.showError(errorToast.key, errorToast.details);

  if (error.response?.status === 401 || error.response?.status === 403) {
    deps.onUnauthorized();
  }

  return Promise.reject(error);
};
