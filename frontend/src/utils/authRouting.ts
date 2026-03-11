import type { UserRoleVm } from "@/store/domain/auth";

export const ADMIN_DEFAULT_PATH = "/dashboard";
export const USER_DEFAULT_PATH = "/home";

const ADMIN_PORTAL = "admin";
const ADMIN_ROLE_TYPES = new Set([1, 2, 9]);

export const ADMIN_ROUTE_PREFIXES = [
  "/dashboard",
  "/tour-management",
  "/tour-instances",
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
