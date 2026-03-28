"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface AvatarUploadProps {
  value: string;
  fullName: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onValidationChange?: (error: string) => void;
}

const MAX_AVATAR_URL_LENGTH = 500;
const PREVIEW_TIMEOUT_MS = 5000;

const getInitials = (fullName: string) => {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

const isBlockedScheme = (value: string): boolean => /^(javascript:|data:)/i.test(value.trim());

const isHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export function AvatarUpload({ value, fullName, disabled = false, onChange, onValidationChange }: AvatarUploadProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState(value || "");
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notifyValidation = (nextError: string) => {
    onValidationChange?.(nextError);
  };
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const clearPreviewTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const validateInput = (nextValue: string): string => {
    if (!nextValue.trim()) return "";
    if (nextValue.length > MAX_AVATAR_URL_LENGTH) {
      return t("common.profilePage.avatar.urlTooLong") || "Avatar URL is too long";
    }
    if (isBlockedScheme(nextValue)) {
      return t("common.profilePage.avatar.invalidUrl") || "Invalid image URL";
    }
    if (!isHttpUrl(nextValue)) {
      return t("common.profilePage.avatar.invalidUrl") || "Invalid image URL";
    }
    return "";
  };

  const handlePreview = () => {
    const nextError = validateInput(input);
    if (nextError) {
      setError(nextError);
      notifyValidation(nextError);
      return;
    }

    setError("");
    notifyValidation("");
    setIsLoading(true);
    setPreviewUrl(input.trim());

    clearPreviewTimeout();
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      const timeoutError = t("common.profilePage.avatar.previewTimeout") || "Preview timed out";
      setError(timeoutError);
      notifyValidation(timeoutError);
    }, PREVIEW_TIMEOUT_MS);
  };

  const handleImageLoaded = () => {
    clearPreviewTimeout();
    setIsLoading(false);
    setError("");
    notifyValidation("");
    onChange(previewUrl);
  };

  const handleImageError = () => {
    clearPreviewTimeout();
    setIsLoading(false);
    const invalidError = t("common.profilePage.avatar.invalidUrl") || "Invalid image URL";
    setError(invalidError);
    notifyValidation(invalidError);
  };

  const handleRemove = () => {
    clearPreviewTimeout();
    setInput("");
    setPreviewUrl("");
    setIsLoading(false);
    setError("");
    notifyValidation("");
    onChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border border-gray-200 bg-orange-500/10 flex items-center justify-center">
          {previewUrl && !error ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={previewUrl}
              src={previewUrl}
              alt={t("common.profilePage.avatar.alt") || "Avatar preview"}
              className="h-full w-full object-cover"
              onLoad={handleImageLoaded}
              onError={handleImageError}
            />
          ) : (
            <span className="text-xl font-semibold text-orange-600">{initials}</span>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={input}
            disabled={disabled}
            onChange={(event) => {
              const nextValue = event.target.value;
              setInput(nextValue);
              const nextError = validateInput(nextValue);
              setError(nextError);
              notifyValidation(nextError);
            }}
            placeholder={t("common.profilePage.avatar.pasteUrl") || "Paste image URL"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={disabled || !input.trim()}
              onClick={handlePreview}
              className="px-3 py-1.5 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300"
            >
              {t("common.profilePage.avatar.preview") || "Preview"}
            </button>
            <button
              type="button"
              disabled={disabled || (!input && !previewUrl)}
              onClick={handleRemove}
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400"
            >
              {t("common.profilePage.avatar.remove") || "Remove"}
            </button>
          </div>
        </div>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
