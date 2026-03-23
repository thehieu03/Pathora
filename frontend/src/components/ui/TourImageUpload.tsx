"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(
  file: File,
  t: (key: string, fallback: string) => string,
): string | undefined {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return t("tourAdmin.validation.invalidFileType", "Invalid file type. Only PNG, JPG, WEBP allowed.");
  }
  if (file.size > MAX_FILE_SIZE) {
    return t("tourAdmin.validation.fileTooLarge", "File too large. Maximum size is 10MB.");
  }
  return undefined;
}

interface TourImageUploadProps {
  thumbnail: File | null;
  setThumbnail: (file: File | null) => void;
  images: File[];
  setImages: (files: File[]) => void;
  t: (key: string, fallback: string) => string;
  thumbnailError?: string;
  imagesError?: string;
  onThumbnailError?: (msg: string | undefined) => void;
  onImagesError?: (msg: string | undefined) => void;
}

export default function TourImageUpload({
  thumbnail,
  setThumbnail,
  images,
  setImages,
  t,
  thumbnailError,
  imagesError,
  onThumbnailError,
  onImagesError,
}: TourImageUploadProps) {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const error = validateFile(file, t);
      onThumbnailError?.(error);
      if (!error) {
        setThumbnail(file);
      }
    },
    [setThumbnail, onThumbnailError, t],
  );

  const handleGalleryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;

      const MAX_IMAGES = 20;
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) {
        onImagesError?.(t("tourAdmin.validation.maxImagesReached", `Maximum ${MAX_IMAGES} images allowed.`));
        return;
      }

      const toAdd = files.slice(0, remaining);
      const errors: string[] = [];
      const validFiles: File[] = [];

      for (const file of toAdd) {
        const error = validateFile(file, t);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        setImages([...images, ...validFiles]);
      }
      onImagesError?.(errors.length > 0 ? errors.join("; ") : undefined);
    },
    [images, setImages, onImagesError, t],
  );

  const removeGalleryImage = useCallback(
    (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    },
    [images, setImages],
  );

  const thumbnailUrl = thumbnail ? URL.createObjectURL(thumbnail) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Thumbnail ── */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("tourAdmin.basicInfo.thumbnail", "Ảnh đại diện (Thumbnail)")}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t(
              "tourAdmin.basicInfo.thumbnailDesc",
              "Kích thước khuyến nghị: 600x600 pixels",
            )}
          </p>
        </div>

        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailChange}
        />

        {thumbnailUrl ? (
          <div className="relative group">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-orange-200 shadow-md">
              <Image
                src={thumbnailUrl}
                alt="Thumbnail preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white shadow-sm transition-all"
                  >
                    <Icon icon="heroicons:arrow-path" className="size-3.5" />
                    {t("tourAdmin.basicInfo.replace", "Đổi ảnh")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnail(null)}
                    className="flex items-center gap-1.5 rounded-xl bg-red-500/90 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 shadow-sm transition-all"
                  >
                    <Icon icon="heroicons:trash" className="size-3.5" />
                    {t("common.remove", "Xóa")}
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 text-center">
              {thumbnail.name}
            </p>
            {thumbnailError && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 text-center">
                {thumbnailError}
              </p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600 flex flex-col items-center justify-center gap-3 hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer"
          >
            <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Icon
                icon="heroicons:photo"
                className="size-6 text-orange-500"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t(
                  "tourAdmin.basicInfo.uploadThumbnail",
                  "Tải lên ảnh đại diện",
                )}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                PNG, JPG, WEBP ·{" "}
                {t("tourAdmin.basicInfo.maxSize", "Tối đa 10MB")}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ── Gallery ── */}
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("tourAdmin.basicInfo.gallery", "Thư viện ảnh (Gallery)")}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t(
              "tourAdmin.basicInfo.galleryDesc",
              "Có thể tải lên nhiều ảnh, kích thước khuyến nghị: 600x600 pixels",
            )}
          </p>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleGalleryChange}
        />

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={`gallery-${index}`}
                  className="relative group aspect-square"
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-stone-200 dark:border-stone-600 shadow-sm">
                    <Image
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-1.5 -right-1.5 size-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md hover:bg-red-600"
                    title={t("common.remove", "Xóa")}
                  >
                    <Icon icon="heroicons:x-mark" className="size-3" weight="bold" />
                  </button>
                  {/* Index badge */}
                  <span className="absolute bottom-1 left-1 rounded-md bg-black/50 text-white text-[10px] font-semibold px-1.5 py-0.5">
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Add more button */}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="w-full py-8 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600 flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer"
        >
          <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Icon
              icon="heroicons:plus"
              className="size-5 text-orange-500"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {images.length > 0
                ? t(
                    "tourAdmin.basicInfo.addMoreImages",
                    "Thêm ảnh khác",
                  )
                : t(
                    "tourAdmin.basicInfo.uploadGallery",
                    "Tải lên thư viện ảnh",
                  )}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              PNG, JPG, WEBP ·{" "}
              {t("tourAdmin.basicInfo.maxSize", "Tối đa 10MB")}
            </p>
          </div>
        </button>

        {images.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            {images.length}{" "}
            {t("tourAdmin.basicInfo.imagesSelected", "ảnh đã chọn")}
          </p>
        )}
        {imagesError && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400 text-center">
            {imagesError}
          </p>
        )}
      </div>
    </div>
  );
}
