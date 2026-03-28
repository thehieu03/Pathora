"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type { UserInfo } from "@/store/domain/auth";
import { handleApiError } from "@/utils/apiResponse";
import { useNotificationPreferences } from "../hooks/useProfile";
import type { NotificationPreferences } from "../types";
import { ToggleSwitch } from "@/features/dashboard/settings/components/ToggleSwitch";

interface SettingsTabProps {
  user: UserInfo | null;
}

function SettingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-16 bg-gray-200 rounded-lg" />
      <div className="h-16 bg-gray-200 rounded-lg" />
      <div className="h-16 bg-gray-200 rounded-lg" />
    </div>
  );
}

export function SettingsTab({ user }: SettingsTabProps) {
  const { t } = useTranslation();
  const {
    preferences,
    isLoading,
    isUnavailable,
    isUpdating,
    updatePreferences,
    refetch,
  } = useNotificationPreferences();

  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);

  const canUseSms = useMemo(() => Boolean(user?.phoneNumber), [user?.phoneNumber]);

  const syncLocal = (next: NotificationPreferences) => {
    setLocalPreferences(next);
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (isUnavailable) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center space-y-3">
        <h3 className="text-base font-semibold text-gray-900">
          {t("common.profilePage.notificationPreferences.title") || "Notification Preferences"}
        </h3>
        <p className="text-sm text-gray-500">
          {t("common.profilePage.notificationPreferences.comingSoon") || "Notification preferences will be available soon."}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
        >
          {t("common.retry") || "Retry"}
        </button>
      </div>
    );
  }

  const current = localPreferences;

  const savePreferences = async (next: NotificationPreferences) => {
    const previous = current;
    syncLocal(next);

    try {
      await updatePreferences(next).unwrap();
    } catch (error) {
      syncLocal(previous);
      const apiError = handleApiError(error);
      toast.error(apiError.message || t("common.profilePage.updateFailed") || "Cập nhật thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("common.profilePage.settingsSectionTitle") || "Tùy chọn thông báo"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("common.profilePage.settingsSectionDesc") || "Chọn cách bạn muốn nhận thông báo từ chúng tôi"}
        </p>
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="font-medium text-gray-900">{t("common.settingsPage.emailNotifications") || "Thông báo qua email"}</h3>
          <p className="text-sm text-gray-500">{t("common.settingsPage.emailNotificationsDesc") || "Nhận thông báo qua email"}</p>
        </div>
        <ToggleSwitch
          enabled={current.emailNotifications}
          disabled={isUpdating}
          onChange={() => void savePreferences({ ...current, emailNotifications: !current.emailNotifications })}
          aria-label={t("common.settingsPage.emailNotifications") || "Email notifications"}
        />
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="font-medium text-gray-900">{t("common.settingsPage.smsNotifications") || "Thông báo qua SMS"}</h3>
          <p className="text-sm text-gray-500">{t("common.settingsPage.smsNotificationsDesc") || "Nhận thông báo qua SMS"}</p>
          {!canUseSms && (
            <p className="text-xs text-orange-600 mt-1">
              {t("common.profilePage.avatar.smsDisabled") || "Add a phone number to enable SMS"}
            </p>
          )}
        </div>
        <ToggleSwitch
          enabled={current.smsNotifications}
          disabled={isUpdating || !canUseSms}
          onChange={() => void savePreferences({ ...current, smsNotifications: !current.smsNotifications })}
          aria-label={t("common.settingsPage.smsNotifications") || "SMS notifications"}
        />
      </div>

      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div>
          <h3 className="font-medium text-gray-900">{t("common.settingsPage.newsletter") || "Bản tin"}</h3>
          <p className="text-sm text-gray-500">{t("common.settingsPage.newsletterDesc") || "Nhận bản tin và khuyến mãi"}</p>
        </div>
        <ToggleSwitch
          enabled={current.newsletter}
          disabled={isUpdating}
          onChange={() => void savePreferences({ ...current, newsletter: !current.newsletter })}
          aria-label={t("common.settingsPage.newsletter") || "Newsletter"}
        />
      </div>
    </div>
  );
}
