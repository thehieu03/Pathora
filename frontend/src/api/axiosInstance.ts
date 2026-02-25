import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ToastPosition } from "react-toastify";
import { showErrorToast } from "./showErrorToast";

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_GATEWAY || "http://localhost:5182";

interface ToastConfig {
  position: ToastPosition;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
}

export const toastConfig: ToastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export interface ApiErrorDetail {
  errorMessage: string;
  details?: string;
}

export interface ApiErrorResponse {
  errors?: ApiErrorDetail[];
  message?: string;
  status?: number;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  baseURL?: string;
}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const handleStatusError = (status: number): void => {
  switch (status) {
    case 400:
      showErrorToast("BAD_REQUEST");
      break;
    case 401:
      showErrorToast("UNAUTHORIZED");
      break;
    case 403:
      showErrorToast("FORBIDDEN");
      break;
    case 404:
      showErrorToast("NOT_FOUND");
      break;
    case 500:
      showErrorToast("SERVER_ERROR");
      break;
    default:
      showErrorToast("DEFAULT_ERROR");
  }
};

const handleErrorResponse = (
  response: AxiosResponse<ApiErrorResponse>,
): void => {
  const data = response?.data;

  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    data.errors.forEach((error: ApiErrorDetail) => {
      if (error.errorMessage) {
        showErrorToast(error.errorMessage, error.details);
      }
    });
  } else if (data?.message) {
    showErrorToast(data.message);
  } else {
    handleStatusError(response.status);
  }
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      handleErrorResponse(response);

      if (response.status === 401) {
        document.cookie =
          "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
      }
    } else if (error.request) {
      showErrorToast("NETWORK_ERROR");
    } else {
      showErrorToast("DEFAULT_ERROR");
    }

    return Promise.reject(error);
  },
);

interface ApiHelper {
  get: <T = unknown>(
    url: string,
    config?: CustomAxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: CustomAxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: CustomAxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: CustomAxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
  delete: <T = unknown>(
    url: string,
    config?: CustomAxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>;
}

export const api: ApiHelper = {
  get: <T = unknown>(
    url: string,
    config: CustomAxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => {
    if (config.baseURL) {
      const customInstance = axios.create({
        ...axiosInstance.defaults,
        baseURL: config.baseURL,
      });
      const requestHandler = axiosInstance.interceptors.request.handlers?.[0];
      const responseHandler = axiosInstance.interceptors.response.handlers?.[0];

      if (requestHandler) {
        customInstance.interceptors.request.use(
          requestHandler.fulfilled,
          requestHandler.rejected,
        );
      }
      if (responseHandler) {
        customInstance.interceptors.response.use(
          responseHandler.fulfilled,
          responseHandler.rejected,
        );
      }
      return customInstance.get<T>(url, { ...config, baseURL: undefined });
    }
    return axiosInstance.get<T>(url, config);
  },
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config: CustomAxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => {
    if (config.baseURL) {
      const customInstance = axios.create({
        ...axiosInstance.defaults,
        baseURL: config.baseURL,
      });
      const requestHandler = axiosInstance.interceptors.request.handlers?.[0];
      const responseHandler = axiosInstance.interceptors.response.handlers?.[0];

      if (requestHandler) {
        customInstance.interceptors.request.use(
          requestHandler.fulfilled,
          requestHandler.rejected,
        );
      }
      if (responseHandler) {
        customInstance.interceptors.response.use(
          responseHandler.fulfilled,
          responseHandler.rejected,
        );
      }
      return customInstance.post<T>(url, data, {
        ...config,
        baseURL: undefined,
      });
    }
    return axiosInstance.post<T>(url, data, config);
  },
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config: CustomAxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => {
    if (config.baseURL) {
      const customInstance = axios.create({
        ...axiosInstance.defaults,
        baseURL: config.baseURL,
      });
      const requestHandler = axiosInstance.interceptors.request.handlers?.[0];
      const responseHandler = axiosInstance.interceptors.response.handlers?.[0];

      if (requestHandler) {
        customInstance.interceptors.request.use(
          requestHandler.fulfilled,
          requestHandler.rejected,
        );
      }
      if (responseHandler) {
        customInstance.interceptors.response.use(
          responseHandler.fulfilled,
          responseHandler.rejected,
        );
      }
      return customInstance.put<T>(url, data, {
        ...config,
        baseURL: undefined,
      });
    }
    return axiosInstance.put<T>(url, data, config);
  },
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config: CustomAxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => {
    if (config.baseURL) {
      const customInstance = axios.create({
        ...axiosInstance.defaults,
        baseURL: config.baseURL,
      });
      const requestHandler = axiosInstance.interceptors.request.handlers?.[0];
      const responseHandler = axiosInstance.interceptors.response.handlers?.[0];

      if (requestHandler) {
        customInstance.interceptors.request.use(
          requestHandler.fulfilled,
          requestHandler.rejected,
        );
      }
      if (responseHandler) {
        customInstance.interceptors.response.use(
          responseHandler.fulfilled,
          responseHandler.rejected,
        );
      }
      return customInstance.patch<T>(url, data, {
        ...config,
        baseURL: undefined,
      });
    }
    return axiosInstance.patch<T>(url, data, config);
  },
  delete: <T = unknown>(
    url: string,
    config: CustomAxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => {
    if (config.baseURL) {
      const customInstance = axios.create({
        ...axiosInstance.defaults,
        baseURL: config.baseURL,
      });
      const requestHandler = axiosInstance.interceptors.request.handlers?.[0];
      const responseHandler = axiosInstance.interceptors.response.handlers?.[0];

      if (requestHandler) {
        customInstance.interceptors.request.use(
          requestHandler.fulfilled,
          requestHandler.rejected,
        );
      }
      if (responseHandler) {
        customInstance.interceptors.response.use(
          responseHandler.fulfilled,
          responseHandler.rejected,
        );
      }
      return customInstance.delete<T>(url, { ...config, baseURL: undefined });
    }
    return axiosInstance.delete<T>(url, config);
  },
};

export default axiosInstance;
