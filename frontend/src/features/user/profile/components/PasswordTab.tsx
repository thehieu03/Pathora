"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui";
import { handleApiError } from "@/utils/apiResponse";

interface PasswordTabProps {
  isUpdating: boolean;
  onChangePassword: (payload: { oldPassword: string; newPassword: string }) => Promise<void>;
}

function PasswordTabSkeleton() {
  return (
    <div className="space-y-4 animate-pulse max-w-md">
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-lg" />
    </div>
  );
}

export function PasswordTab({ isUpdating, onChangePassword }: PasswordTabProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showSkeleton] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error(t("common.auth.passwordMismatch") || "Mật khẩu xác nhận không khớp");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error(t("common.auth.passwordMinLength") || "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await onChangePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      toast.success(t("common.profilePage.password.changedSuccess") || "Password changed successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const apiError = handleApiError(error);
      toast.error(t(apiError.message) || t("common.auth.passwordChangeFailed") || "Đổi mật khẩu thất bại");
      setForm((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
    }
  };

  if (showSkeleton) {
    return <PasswordTabSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{t("common.profilePage.passwordSectionTitle") || "Bảo mật tài khoản"}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("common.profilePage.passwordSectionDesc") || "Đổi mật khẩu thường xuyên để bảo vệ tài khoản"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("common.profilePage.password.currentPassword") || t("common.auth.currentPassword") || "Mật khẩu hiện tại"}
        </label>
        <input
          type="password"
          value={form.oldPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("common.profilePage.password.newPassword") || t("common.auth.newPassword") || "Mật khẩu mới"}
        </label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1.5">
          {t("common.profilePage.password.constraints") || "Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("common.profilePage.password.confirmPassword") || t("common.auth.confirmPassword") || "Xác nhận mật khẩu mới"}
        </label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isUpdating}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          <FiLock className="w-4 h-4" />
          {isUpdating ? t("common.loading") || "Đang đổi..." : t("common.changePassword") || "Đổi mật khẩu"}
        </Button>
      </div>
    </form>
  );
}
