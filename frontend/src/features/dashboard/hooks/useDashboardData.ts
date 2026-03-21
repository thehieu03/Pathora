import { useState, useEffect, useCallback } from "react";

import { adminService } from "@/api/services/adminService";
import type { AdminDashboard } from "@/types/admin";

export interface UseDashboardDataReturn {
  data: AdminDashboard | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.getDashboard();
      setData(result);
    } catch {
      setData(null);
      setError("error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, isLoading, error, refetch: load };
}
