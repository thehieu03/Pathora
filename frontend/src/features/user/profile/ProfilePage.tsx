"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiLock, FiSettings, FiUser } from "react-icons/fi";
import { LandingHeader } from "@/features/shared/components";
import { extractResult } from "@/utils/apiResponse";
import { useChangePasswordMutation, useGetUserInfoQuery, useUpdateUserMutation } from "@/store/api/auth/authApiSlice";
import type { UserInfo } from "@/store/domain/auth";
import type { ProfileTabType } from "./types";
import { ProfileTab } from "./components/ProfileTab";
import { PasswordTab } from "./components/PasswordTab";
import { SettingsTab } from "./components/SettingsTab";

const VALID_TABS: ProfileTabType[] = ["profile", "password", "settings"];

export function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab") as ProfileTabType | null;

  const activeTab: ProfileTabType = queryTab && VALID_TABS.includes(queryTab) ? queryTab : "profile";

  const { data: userInfoResponse, isLoading: isUserLoading } = useGetUserInfoQuery();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();


  const user = useMemo(() => extractResult<UserInfo>(userInfoResponse), [userInfoResponse]);

  const tabs = [
    { id: "profile" as const, label: t("common.profile") || "Thông tin cá nhân", icon: FiUser },
    { id: "password" as const, label: t("common.changePassword") || "Đổi mật khẩu", icon: FiLock },
    { id: "settings" as const, label: t("common.settings") || "Cài đặt", icon: FiSettings },
  ];

  const headerConfig: Record<ProfileTabType, { icon: typeof FiUser; title: string; subtitle: string }> = {
    profile: {
      icon: FiUser,
      title: t("common.profilePage.pageTitle") || "Tài khoản của tôi",
      subtitle: t("common.profilePage.pageSubtitle") || "Quản lý thông tin cá nhân của bạn",
    },
    password: {
      icon: FiLock,
      title: t("common.profilePage.passwordTitle") || "Đổi mật khẩu",
      subtitle: t("common.profilePage.passwordSubtitle") || "Cập nhật mật khẩu để bảo mật tài khoản",
    },
    settings: {
      icon: FiSettings,
      title: t("common.profilePage.settingsTitle") || "Cài đặt",
      subtitle: t("common.profilePage.settingsSubtitle") || "Tùy chỉnh thông báo và tùy chọn cá nhân",
    },
  };

  const currentHeader = headerConfig[activeTab];
  const HeaderIcon = currentHeader.icon;

  return (
    <>
      <LandingHeader variant="solid" />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <HeaderIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{currentHeader.title}</h1>
                  <p className="text-orange-100 mt-0.5 text-sm">{currentHeader.subtitle}</p>
                </div>
              </div>
              {user?.email && <p className="text-orange-200 text-xs mt-3 ml-[52px]">{user.email}</p>}
            </div>

            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("tab", tab.id);
                        router.replace(`?${params.toString()}`);
                      }}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                        activeTab === tab.id ? "text-orange-600" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {activeTab === tab.id ? <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" /> : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "profile" ? (
                <ProfileTab
                  user={user ?? null}
                  isLoading={isUserLoading}
                  isUpdating={isUpdatingUser}
                  onUpdate={async (payload) => {
                    await updateUser(payload).unwrap();
                  }}
                />
              ) : null}

              {activeTab === "password" ? (
                <PasswordTab
                  isUpdating={isChangingPassword}
                  onChangePassword={async (payload) => {
                    await changePassword(payload).unwrap();
                  }}
                />
              ) : null}

              {activeTab === "settings" ? <SettingsTab user={user ?? null} /> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
