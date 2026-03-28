"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui";
import { handleApiError } from "@/utils/apiResponse";
import type { UserInfo } from "@/store/domain/auth";
import { AvatarUpload } from "./AvatarUpload";
import type { ProfileFormData } from "../types";
import { VIETNAM_PHONE_REGEX } from "../types";

interface ProfileTabProps {
  user: UserInfo | null;
  isLoading: boolean;
  isUpdating: boolean;
  onUpdate: (payload: { fullName?: string; phoneNumber?: string; address?: string; avatar?: string }) => Promise<void>;
}

function ProfileTabSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-56 bg-gray-200 rounded" />
      <div className="h-24 w-24 bg-gray-200 rounded-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 bg-gray-200 rounded-lg" />
        <div className="md:col-span-2 h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function ProfileTab({ user, isLoading, isUpdating, onUpdate }: ProfileTabProps) {
  const { t } = useTranslation();
  const initialData = useMemo<ProfileFormData>(
    () => ({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      avatar: user?.avatar || "",
    }),
    [user?.fullName, user?.phoneNumber, user?.address, user?.avatar],
  );

  const [profileData, setProfileData] = useState<ProfileFormData>(initialData);
  const [initialProfileData, setInitialProfileData] = useState<ProfileFormData>(initialData);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [avatarError, setAvatarError] = useState("");

  if (
    profileData.fullName === "" &&
    profileData.phoneNumber === "" &&
    profileData.address === "" &&
    profileData.avatar === "" &&
    (initialData.fullName !== "" || initialData.phoneNumber !== "" || initialData.address !== "" || initialData.avatar !== "")
  ) {
    setProfileData(initialData);
    setInitialProfileData(initialData);
  }

  const phoneError = useMemo(() => {
    if (!profileData.phoneNumber) return "";
    return VIETNAM_PHONE_REGEX.test(profileData.phoneNumber)
      ? ""
      : t("common.auth.phoneNumberInvalid") || "Số điện thoại không đúng định dạng";
  }, [profileData.phoneNumber, t]);

  const fullNameError = useMemo(() => {
    const trimmed = profileData.fullName.trim();
    if (!trimmed) return t("common.profilePage.fullNameRequired") || "Full name is required";
    if (trimmed.length > 100) return t("common.profilePage.fullNameTooLong") || "Full name must be 100 characters or less";
    return "";
  }, [profileData.fullName, t]);

  const addressError = useMemo(() => {
    if (profileData.address.length > 500) {
      return t("common.profilePage.addressTooLong") || "Address must be 500 characters or less";
    }
    return "";
  }, [profileData.address, t]);

  const isDirty = useMemo(
    () =>
      profileData.fullName !== initialProfileData.fullName ||
      profileData.phoneNumber !== initialProfileData.phoneNumber ||
      profileData.address !== initialProfileData.address ||
      profileData.avatar !== initialProfileData.avatar,
    [profileData, initialProfileData],
  );

  const isSubmitDisabled = isUpdating || !isDirty || !!phoneError || !!fullNameError || !!addressError || !!avatarError;

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setSaveState("saving");

    try {
      await onUpdate({
        fullName: profileData.fullName.trim(),
        phoneNumber: profileData.phoneNumber.trim() || undefined,
        address: profileData.address.trim() || undefined,
        avatar: profileData.avatar.trim() || undefined,
      });

      setInitialProfileData(profileData);
      setSaveState("saved");
      toast.success(t("common.profilePage.updateSuccess") || "Cập nhật thông tin thành công");
      window.setTimeout(() => setSaveState("idle"), 2000);
    } catch (error) {
      const apiError = handleApiError(error);
      setSaveState("idle");
      toast.error(apiError.message || t("common.profilePage.updateFailed") || "Cập nhật thất bại");
    }
  };

  if (isLoading) {
    return <ProfileTabSkeleton />;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{t("common.profilePage.profileSectionTitle") || "Thông tin cá nhân"}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("common.profilePage.profileSectionDesc") || "Cập nhật họ tên, số điện thoại và địa chỉ của bạn"}
        </p>
      </div>

      <AvatarUpload
        value={profileData.avatar}
        fullName={profileData.fullName}
        disabled={isUpdating}
        onValidationChange={setAvatarError}
        onChange={(avatar) => setProfileData((prev) => ({ ...prev, avatar }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("common.auth.fullName") || "Họ và tên"}</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData((prev) => ({ ...prev, fullName: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              fullNameError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fullNameError ? <p className="text-red-500 text-xs mt-1">{fullNameError}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("common.auth.phoneNumber") || "Số điện thoại"}</label>
          <input
            type="tel"
            value={profileData.phoneNumber}
            onChange={(e) => setProfileData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="0912345678"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              phoneError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {phoneError ? <p className="text-red-500 text-xs mt-1">{phoneError}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("common.auth.address") || "Địa chỉ"}</label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              addressError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {addressError ? <p className="text-red-500 text-xs mt-1">{addressError}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("common.email") || "Email"}</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
            isSubmitDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          <FiSave className="w-4 h-4" />
          {saveState === "saving" || isUpdating
            ? t("common.saving") || "Đang lưu..."
            : saveState === "saved"
              ? t("common.saved") || "✓ Saved"
              : t("common.save") || "Lưu"}
        </Button>
      </div>
    </form>
  );
}
