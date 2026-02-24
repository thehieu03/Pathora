"use client";
import React, { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { reportService } from "@/services/reportService";
import { useTranslation } from "react-i18next";
import { extractItems } from "@/utils/apiResponse";

const GroupChart2 = ({ onRefresh }) => {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await reportService.getDashboardStatistics();

      const stats = extractItems<any>(response);
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to fetch dashboard statistics:", error);
      // Set empty array on error to prevent UI breaks
      setStatistics([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStatistics();
  }, [fetchDashboardStatistics]);

  // Expose refresh function to parent
  useEffect(() => {
    if (onRefresh) {
      onRefresh(fetchDashboardStatistics);
    }
  }, [onRefresh, fetchDashboardStatistics]);

  // Show loading state
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Card bodyClass="pt-4 pb-3 px-4">
              <div className="flex animate-pulse space-x-3 rtl:space-x-reverse">
                <div className="flex-none">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {statistics.map((item, i) => (
        <div key={item.id || i}>
          <Card bodyClass="pt-4 pb-3 px-4">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="flex-none">
                <div
                  className={`${item.bg} ${item.text} flex h-12 w-12 flex-col items-center justify-center rounded-full text-2xl`}
                >
                  <Icon icon={item.icon} />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {item.title}
                </div>
                <div className="text-lg font-medium text-slate-900 dark:text-white">
                  {item.count}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </>
  );
};

export default GroupChart2;
