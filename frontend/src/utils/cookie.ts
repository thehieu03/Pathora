export const getCookie = (name: string, cookieSource?: string | null): string | null => {
  const cookieValue =
    cookieSource ?? (typeof document !== "undefined" ? document.cookie : null);
  if (!cookieValue) return null;

  const value = `; ${cookieValue}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};
