import { useState, useEffect, useCallback } from "react";
import { api } from "@/api/axiosInstance";
import API_ENDPOINTS from "@/api/endpoints";

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
      const response = await api.get(API_ENDPOINTS.SITE_CONTENT.GET_BY_PAGE(pageKey));

      const data = response.data;
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
