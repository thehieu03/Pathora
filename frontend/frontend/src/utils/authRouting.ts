import type { UserRoleVm } from "@/store/domain/auth";

export const ADMIN_DEFAULT_PATH = "/dashboard";
export const USER_DEFAULT_PATH = "/home";

const ADMIN_PORTAL = "admin";
const ADMIN_ROLE_TYPES = new Set([1, 2, 9]);

export const ADMIN_ROUTE_PREFIXES = [
  "/dashboard",
  "/tour-requests",
  "/tour-management",
  "/tour-instances",
  "/pricing-policies",
  "/tax-configs",
] as const;

type RoleLike = Pick<UserRoleVm, "type">;

export interface AuthRoutingInput {
  defaultPath?: string | null;
  portal?: string | null;
  roles?: RoleLike[] | null;
  fallbackPath?: string;
}

const isValidPath = (path?: string | null): path is string =>
  typeof path === "string" && path.startsWith("/") && path.length > 1;

export const isAdminPortal = (portal?: string | null): boolean =>
  portal?.toLowerCase() === ADMIN_PORTAL;

export const hasAdminRole = (roles?: RoleLike[] | null): boolean =>
  !!roles?.some((role) => ADMIN_ROLE_TYPES.has(role.type));

export const resolvePostLoginPath = ({
  defaultPath,
  portal,
  roles,
  fallbackPath = USER_DEFAULT_PATH,
}: AuthRoutingInput): string => {
  if (isValidPath(defaultPath)) {
    return defaultPath;
  }

  if (isAdminPortal(portal) || hasAdminRole(roles)) {
    return ADMIN_DEFAULT_PATH;
  }

  return isValidPath(fallbackPath) ? fallbackPath : USER_DEFAULT_PATH;
};

export const isAdminRoutePath = (pathname: string): boolean =>
  ADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export const isLoginEntryPath = (
  pathname: string,
  searchParams: URLSearchParams,
): boolean => {
  if (pathname === "/") {
    return true;
  }

  return pathname === "/home" && searchParams.get("login") === "true";
};

/**
 * Validates that a `next` path is a safe internal relative path.
 * Prevents open-redirect vulnerabilities by rejecting external URLs,
 * absolute paths, or paths with protocols.
 */
export const isSafeNextPath = (next?: string | null): next is string => {
  if (!next || typeof next !== "string") {
    return false;
  }

  // Must start with /
  if (!next.startsWith("/")) {
    return false;
  }

  // Must be a relative path (no protocol, no host)
  try {
    const url = new URL(next, "http://localhost");
    // If it has a different origin, it's not safe
    if (url.origin !== "http://localhost") {
      return false;
    }
  } catch {
    return false;
  }

  // Should not contain null bytes or other dangerous characters
  if (next.includes("\0") || next.includes("\n")) {
    return false;
  }

  return true;
};

/**
 * Resolves the post-login destination, prioritizing a valid `next` parameter
 * for non-admin users when present.
 */
export const resolveLoginDestination = ({
  next,
  defaultPath,
  portal,
  roles,
  fallbackPath = USER_DEFAULT_PATH,
}: {
  next?: string | null;
  defaultPath?: string | null;
  portal?: string | null;
  roles?: RoleLike[] | null;
  fallbackPath?: string;
}): string => {
  // First priority: valid next parameter for non-admin users
  if (isSafeNextPath(next) && !isAdminPortal(portal) && !hasAdminRole(roles)) {
    return next;
  }

  // Fall back to existing resolvePostLoginPath logic
  return resolvePostLoginPath({ defaultPath, portal, roles, fallbackPath });
};
