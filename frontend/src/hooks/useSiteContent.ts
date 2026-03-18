import { useState, useEffect, useCallback } from "react";
import { getCurrentApiLanguage } from "@/api/languageHeader";
import API_ENDPOINTS from "@/api/endpoints";
import { getCookie } from "@/utils/cookie";

export interface SiteContent {
  [key: string]: unknown;
}

interface UseSiteContentResult {
  content: SiteContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSiteContent(pageKey: string): UseSiteContentResult {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!pageKey) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getCookie("access_token");
      const language = getCurrentApiLanguage();
      const response = await fetch(API_ENDPOINTS.SITE_CONTENT.GET_BY_PAGE(pageKey, language), {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }

      const data = await response.json();

      if (data.result?.items) {
        setContent(data.result.items);
      } else if (data.items) {
        setContent(data.items);
      } else {
        setContent({});
      }
    } catch (err) {
      console.error("Error fetching site content:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: fetchContent };
}

export default useSiteContent;
