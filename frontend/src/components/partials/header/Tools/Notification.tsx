"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { MenuItem } from "@headlessui/react";
import { notificationService } from "@/services/notificationService";
import { RootState } from "@/lib/store";
import { extractResult } from "@/utils/apiResponse";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdOnUtc: string;
  isRead: boolean;
  targetUrl?: string;
}

interface NotificationsResponse {
  notifications: NotificationItem[];
}

interface UnreadCountResponse {
  count: number;
}

const Notification = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isAuth = useSelector((state: RootState) => state.auth?.isAuth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const isLoggedIn = !authLoading && (isAuthenticated || isAuth === true);

  const fetchNotifications = useCallback(async () => {
    if (authLoading || (!isAuthenticated && isAuth !== true)) {
      setLoading(false);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    if (fetchError) {
      console.log("Notification: Skipping fetch due to previous error");
      return;
    }

    try {
      setLoading(true);
      const [notificationsRes, countRes] = await Promise.all([
        notificationService.getTop10Unread(),
        notificationService.getUnreadCount(),
      ]);

      const notificationsResult = extractResult<NotificationsResponse>(notificationsRes?.data);
      const countResult = extractResult<UnreadCountResponse>(countRes?.data);
      setNotifications(notificationsResult?.notifications || []);
      setUnreadCount(countResult?.count ?? 0);
      
      setFetchError(false);
    } catch (error) {
      console.warn("Failed to fetch notifications:", error);
      setFetchError(true);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAuth, authLoading, fetchError]);

  useEffect(() => {
    if (!authLoading && (isAuthenticated || isAuth === true)) {
      fetchNotifications();

      const intervalId = setInterval(() => {
        fetchNotifications();
      }, 60000);

      return () => clearInterval(intervalId);
    } else {
      setLoading(false);
      setNotifications([]);
      setUnreadCount(0);
      setFetchError(false);
    }
  }, [isAuthenticated, isAuth, authLoading, fetchNotifications]);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return t("notification.justNow");

    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t("notification.justNow");
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t("notification.minutesAgo", { count: diffInMinutes });
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t("notification.hoursAgo", { count: diffInHours });
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return t("notification.daysAgo", { count: diffInDays });
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!isLoggedIn) return;

    try {
      // Mark as read
      await notificationService.markAsRead([notification.id]);

      // Refresh notifications and count
      await fetchNotifications();

      // Navigate if targetUrl exists
      if (notification.targetUrl) {
        router.push(notification.targetUrl);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const notifyLabel = () => {
    return (
      <span className="relative flex cursor-pointer flex-col items-center justify-center rounded-full text-[20px] text-slate-900 lg:h-8 lg:w-8 lg:bg-slate-100 dark:text-white lg:dark:bg-slate-900">
        <Icon icon="heroicons-outline:bell" className="animate-tada" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 z-99 flex h-4 w-4 flex-col items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white lg:top-0 lg:right-0">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
    );
  };

  if (authLoading || (!isAuthenticated && isAuth !== true)) {
    return null;
  }

  return (
    <Dropdown classMenuItems="md:w-75 top-14.5" label={notifyLabel()}>
      <div className="flex justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-600">
        <div className="text-sm leading-6 font-medium text-slate-800 dark:text-slate-200">
          {t("notification.title")}
        </div>
        <div className="text-xs text-slate-800 md:text-right dark:text-slate-200">
          <Link href="/notifications" className="underline">
            {t("notification.viewAll")}
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <div className="px-4 py-8 text-center">
            <Icon
              icon="heroicons:arrow-path"
              className="mx-auto mb-2 animate-spin text-2xl text-slate-400"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t("common.loading")}
            </span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t("notification.noNotifications")}
            </span>
          </div>
        ) : (
          notifications.map((item, i) => (
            <MenuItem key={i}>
              {({ active }) => (
                <div
                  className={`${
                    active
                      ? "dark:bg-opacity-70 bg-slate-100 text-slate-800 dark:bg-slate-700"
                      : "text-slate-600 dark:text-slate-300"
                  } block w-full cursor-pointer px-4 py-2 text-sm`}
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className="flex ltr:text-left rtl:text-right">
                    <div className="flex-none ltr:mr-3 rtl:ml-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                        <Icon
                          icon="heroicons:bell"
                          className={`${
                            active
                              ? "text-slate-600 dark:text-slate-300"
                              : "text-slate-500 dark:text-slate-400"
                          } text-lg`}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div
                        className={`${
                          active
                            ? "text-slate-800 dark:text-slate-200"
                            : "text-slate-600 dark:text-slate-300"
                        } text-sm font-medium`}
                      >
                        {item.title}
                      </div>
                      <div
                        className={`${
                          active
                            ? "text-slate-600 dark:text-slate-300"
                            : "text-slate-500 dark:text-slate-400"
                        } mt-1 line-clamp-2 text-xs leading-4`}
                      >
                        {item.message}
                      </div>
                      <div className="mt-1 text-xs text-slate-400 dark:text-slate-400">
                        {formatTimeAgo(item.createdOnUtc)}
                      </div>
                    </div>
                    {!item.isRead && (
                      <div className="flex-0">
                        <span className="bg-danger-500 inline-block h-2.5 w-2.5 rounded-full border border-white dark:border-slate-400"></span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </MenuItem>
          ))
        )}
      </div>
    </Dropdown>
  );
};

export default Notification;
