const DEFAULT_API_GATEWAY_BASE_URL = "http://localhost:5182";

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, "");

export const resolveApiGatewayBaseUrl = (
  configuredValue: string | undefined = process.env.NEXT_PUBLIC_API_GATEWAY,
): string => {
  const trimmed = configuredValue?.trim();
  if (trimmed && trimmed.length > 0) {
    return normalizeBaseUrl(trimmed);
  }

  return DEFAULT_API_GATEWAY_BASE_URL;
};

export const API_GATEWAY_BASE_URL = resolveApiGatewayBaseUrl();
export const GOOGLE_LOGIN_URL = `${API_GATEWAY_BASE_URL}/api/auth/google-login`;
