"use client";
import React, { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useGetUserInfoQuery, useChangePasswordMutation, useUpdateUserMutation } from "@/store/api/auth/authApiSlice";
import type { UserInfo } from "@/store/domain/auth";
import { Button } from "@/components/ui";
import { extractResult } from "@/utils/apiResponse";
import { handleApiError } from "@/utils/apiResponse";
import { FiUser, FiLock, FiSettings, FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

type TabType = "profile" | "password" | "settings";

function ProfileContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "profile";

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [settingsData, setSettingsData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const { data: userInfo, isLoading } = useGetUserInfoQuery();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

  React.useEffect(() => {
    if (userInfo) {
      const user = extractResult<UserInfo>(userInfo);
      if (user) {
        setProfileData({
          fullName: user.fullName || "",
          phoneNumber: user.phoneNumber || "",
          address: user.address || "",
        });
      }
    }
  }, [userInfo]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t("common.auth.passwordMismatch") || "Mật khẩu xác nhận không khớp");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(t("common.auth.passwordMinLength") || "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      setPasswordSuccess(t("common.auth.passwordChangedSuccess") || "Đổi mật khẩu thành công");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const apiError = handleApiError(error);
      setPasswordError(apiError.message || t("common.auth.passwordChangeFailed") || "Đổi mật khẩu thất bại");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");

    try {
      await updateUser({
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
      }).unwrap();

      setProfileSuccess(t("common.profilePage.updateSuccess") || "Cập nhật thông tin thành công");
    } catch (error) {
      const apiError = handleApiError(error);
      setProfileError(apiError.message || t("common.profilePage.updateFailed") || "Cập nhật thất bại");
    }
  };

  const [profileError, setProfileError] = useState("");

  const tabs = [
    { id: "profile" as TabType, label: t("common.profile") || "Thông tin cá nhân", icon: FiUser },
    { id: "password" as TabType, label: t("common.changePassword") || "Đổi mật khẩu", icon: FiLock },
    { id: "settings" as TabType, label: t("common.settings") || "Cài đặt", icon: FiSettings },
  ];

  const user = userInfo ? extractResult<UserInfo>(userInfo) : null;

  const headerConfig: Record<TabType, { icon: typeof FiUser; title: string; subtitle: string }> = {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          {t("common.back") || "Quay lại"}
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Dynamic Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <HeaderIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {currentHeader.title}
                </h1>
                <p className="text-orange-100 mt-0.5 text-sm">
                  {currentHeader.subtitle}
                </p>
              </div>
            </div>
            {user?.email && (
              <p className="text-orange-200 text-xs mt-3 ml-[52px]">
                {user.email}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? "text-orange-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("common.profilePage.profileSectionTitle") || "Thông tin cá nhân"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("common.profilePage.profileSectionDesc") || "Cập nhật họ tên, số điện thoại và địa chỉ của bạn"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("common.auth.fullName") || "Họ và tên"}
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("common.auth.phoneNumber") || "Số điện thoại"}
                    </label>
                    <input
                      type="tel"
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("common.auth.address") || "Địa chỉ"}
                    </label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("common.email") || "Email"}
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                {profileError && (
                  <div className="text-red-500 text-sm">{profileError}</div>
                )}
                {profileSuccess && (
                  <div className="text-green-500 text-sm">{profileSuccess}</div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdatingUser}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                  >
                    <FiSave className="w-4 h-4" />
                    {isUpdatingUser ? t("common.loading") || "Đang lưu..." : t("common.save") || "Lưu"}
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("common.profilePage.passwordSectionTitle") || "Bảo mật tài khoản"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("common.profilePage.passwordSectionDesc") || "Đổi mật khẩu thường xuyên để bảo vệ tài khoản"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("common.auth.currentPassword") || "Mật khẩu hiện tại"}
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("common.auth.newPassword") || "Mật khẩu mới"}
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("common.auth.confirmPassword") || "Xác nhận mật khẩu mới"}
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="text-red-500 text-sm">{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="text-green-500 text-sm">{passwordSuccess}</div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                  >
                    <FiLock className="w-4 h-4" />
                    {isChangingPassword ? t("common.loading") || "Đang đổi..." : t("common.changePassword") || "Đổi mật khẩu"}
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "settings" && (
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
                    <h3 className="font-medium text-gray-900">
                      {t("common.settingsPage.emailNotifications") || "Thông báo qua email"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("common.settingsPage.emailNotificationsDesc") || "Nhận thông báo qua email"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsData({ ...settingsData, emailNotifications: !settingsData.emailNotifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settingsData.emailNotifications ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settingsData.emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t("common.settingsPage.smsNotifications") || "Thông báo qua SMS"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("common.settingsPage.smsNotificationsDesc") || "Nhận thông báo qua SMS"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsData({ ...settingsData, smsNotifications: !settingsData.smsNotifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settingsData.smsNotifications ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settingsData.smsNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t("common.settingsPage.newsletter") || "Bản tin"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("common.settingsPage.newsletterDesc") || "Nhận bản tin và khuyến mãi"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsData({ ...settingsData, newsletter: !settingsData.newsletter })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settingsData.newsletter ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settingsData.newsletter ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}
