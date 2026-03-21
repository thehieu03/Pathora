"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cancellationPolicyService } from "@/api/services/cancellationPolicyService";
import type { CancellationPolicy, CreateCancellationPolicyRequest, UpdateCancellationPolicyRequest, CancellationPolicyTranslations } from "@/types/cancellationPolicy";
import { TourScopeMap, CancellationPolicyStatusMap } from "@/types/cancellationPolicy";
import { TranslationTabForm, TranslationField } from "./TranslationTabForm";
import { Icon } from "@/components/ui/Icon";

interface CancellationPolicyFormProps {
  policy?: CancellationPolicy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const cancellationPolicyTranslationFields: TranslationField[] = [
  {
    key: "description",
    label: "Description",
    placeholder: {
      vi: "Nhập mô tả chính sách hủy tour",
      en: "Enter cancellation policy description",
    },
    type: "textarea",
  },
];

export function CancellationPolicyForm({ policy, onSuccess, onCancel }: CancellationPolicyFormProps) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<CancellationPolicyTranslations>(
    policy?.translations || { vi: { description: "" }, en: { description: "" } }
  );
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{
    tourScope: number;
    minDaysBeforeDeparture: number;
    maxDaysBeforeDeparture: number;
    penaltyPercentage: number;
    applyOn: string;
  }>({
    defaultValues: {
      tourScope: policy?.tourScope || 1,
      minDaysBeforeDeparture: policy?.minDaysBeforeDeparture || 0,
      maxDaysBeforeDeparture: policy?.maxDaysBeforeDeparture || 7,
      penaltyPercentage: policy?.penaltyPercentage || 10,
      applyOn: policy?.applyOn || "FullAmount",
    },
  });

  useEffect(() => {
    if (policy) {
      reset({
        tourScope: policy.tourScope,
        minDaysBeforeDeparture: policy.minDaysBeforeDeparture,
        maxDaysBeforeDeparture: policy.maxDaysBeforeDeparture,
        penaltyPercentage: policy.penaltyPercentage,
        applyOn: policy.applyOn,
      });
      setTranslations(policy.translations || {});
    }
  }, [policy, reset]);

  const onSubmit = async (data: { tourScope: number; minDaysBeforeDeparture: number; maxDaysBeforeDeparture: number; penaltyPercentage: number; applyOn: string }) => {
    if (data.minDaysBeforeDeparture > data.maxDaysBeforeDeparture) {
      alert(t("cancellationPolicy.validation.minDaysGreaterThanMax", "Min days cannot be greater than Max days"));
      return;
    }

    setSaving(true);
    setSubmitError(null);
    try {
      let response;
      if (policy) {
        const payload: UpdateCancellationPolicyRequest = {
          id: policy.id,
          ...data,
          translations,
        };
        response = await cancellationPolicyService.update(payload);
      } else {
        const payload: CreateCancellationPolicyRequest = {
          ...data,
          translations,
        };
        response = await cancellationPolicyService.create(payload);
      }

      if (response.success) {
        onSuccess();
      } else {
        setSubmitError(response.error?.[0]?.message || t("cancellationPolicy.error.saveFailed", "Failed to save cancellation policy"));
      }
    } catch {
      setSubmitError(t("cancellationPolicy.error.saveFailed", "An error occurred while saving the cancellation policy"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <motion.div
          className="bg-red-50 border border-red-200/50 rounded-2xl p-4 flex items-start gap-3"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
        >
          <Icon icon="heroicons:exclamation-circle" className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{submitError}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            {t("cancellationPolicy.form.tourScope", "Tour Scope")}
          </label>
          <select
            {...register("tourScope", { required: true, valueAsNumber: true })}
            className="block w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm text-stone-700 hover:border-stone-300 transition-colors"
          >
            {Object.entries(TourScopeMap).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            {t("cancellationPolicy.form.minDays", "Min Days")}
          </label>
          <input
            type="number"
            {...register("minDaysBeforeDeparture", {
              required: t("cancellationPolicy.validation.minDaysRequired", "Min days is required"),
              min: { value: 0, message: t("cancellationPolicy.validation.cannotBeNegative", "Cannot be negative") },
              valueAsNumber: true
            })}
            className="block w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm text-stone-700 hover:border-stone-300 transition-colors"
          />
          {errors.minDaysBeforeDeparture && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon icon="heroicons:exclamation-circle" className="size-3" />
              {errors.minDaysBeforeDeparture.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            {t("cancellationPolicy.form.maxDays", "Max Days")}
          </label>
          <input
            type="number"
            {...register("maxDaysBeforeDeparture", {
              required: t("cancellationPolicy.validation.maxDaysRequired", "Max days is required"),
              min: { value: 0, message: t("cancellationPolicy.validation.cannotBeNegative", "Cannot be negative") },
              valueAsNumber: true
            })}
            className="block w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm text-stone-700 hover:border-stone-300 transition-colors"
          />
          {errors.maxDaysBeforeDeparture && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon icon="heroicons:exclamation-circle" className="size-3" />
              {errors.maxDaysBeforeDeparture.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            {t("cancellationPolicy.form.penaltyPercentage", "Penalty %")}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              {...register("penaltyPercentage", {
                required: t("cancellationPolicy.validation.penaltyRequired", "Penalty percentage is required"),
                min: { value: 0, message: t("cancellationPolicy.validation.cannotBeNegative", "Cannot be negative") },
                max: { value: 100, message: t("cancellationPolicy.validation.cannotExceed100", "Cannot exceed 100%") },
                valueAsNumber: true
              })}
              className="block w-full px-3.5 py-2.5 pr-10 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm text-stone-700 hover:border-stone-300 transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400 pointer-events-none">%</span>
          </div>
          {errors.penaltyPercentage && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <Icon icon="heroicons:exclamation-circle" className="size-3" />
              {errors.penaltyPercentage.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            {t("cancellationPolicy.form.applyOn", "Apply On")}
          </label>
          <select
            {...register("applyOn")}
            className="block w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 text-sm text-stone-700 hover:border-stone-300 transition-colors"
          >
            <option value="FullAmount">{t("cancellationPolicy.applyOn.FullAmount", "Full Amount")}</option>
            <option value="DepositOnly">{t("cancellationPolicy.applyOn.DepositOnly", "Deposit Only")}</option>
          </select>
        </div>
      </div>

      <div className="border-t border-stone-200 pt-6">
        <h3 className="text-sm font-bold text-stone-800 tracking-tight mb-4 flex items-center gap-2">
          <Icon icon="heroicons:language" className="size-4 text-amber-500" />
          {t("cancellationPolicy.form.translations", "Translations")}
        </h3>
        <TranslationTabForm
          translations={translations}
          onChange={setTranslations}
          fields={cancellationPolicyTranslationFields}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 active:scale-[0.98] transition-all duration-200"
        >
          {t("cancellationPolicy.action.cancel", "Cancel")}
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent rounded-xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-amber-500/30 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
        >
          {saving ? (
            <>
              <Icon icon="heroicons:arrow-path" className="size-4 animate-spin" />
              {t("cancellationPolicy.action.saving", "Saving...")}
            </>
          ) : (
            <>
              <Icon icon="heroicons:check" className="size-4" />
              {policy ? t("cancellationPolicy.action.update", "Update") : t("cancellationPolicy.action.create", "Create")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
