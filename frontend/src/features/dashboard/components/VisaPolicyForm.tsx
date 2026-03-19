"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { visaPolicyService } from "@/api/services/visaPolicyService";
import type { VisaPolicy, CreateVisaPolicyRequest, UpdateVisaPolicyRequest, VisaPolicyTranslations } from "@/types/visaPolicy";
import { TranslationTabForm, TranslationField } from "./TranslationTabForm";

interface VisaPolicyFormProps {
  policy?: VisaPolicy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

/** Fields cho VisaPolicy translation — khớp với backend VisaPolicyTranslationData (region, note) */
const visaPolicyTranslationFields: TranslationField[] = [
  {
    key: "region",
    label: "Region",
    placeholder: {
      vi: "Nhập tên khu vực/vùng",
      en: "Enter region name",
    },
    type: "text",
  },
  {
    key: "note",
    label: "Note",
    placeholder: {
      vi: "Nhập ghi chú về chính sách visa",
      en: "Enter visa policy notes",
    },
    type: "textarea",
  },
];

export function VisaPolicyForm({ policy, onSuccess, onCancel }: VisaPolicyFormProps) {
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<VisaPolicyTranslations>(
    policy?.translations || { vi: { region: "", note: "" }, en: { region: "", note: "" } }
  );
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{
    region: string;
    processingDays: number;
    bufferDays: number;
    fullPaymentRequired: boolean;
    isActive: boolean;
  }>({
    defaultValues: {
      region: policy?.region || "",
      processingDays: policy?.processingDays || 30,
      bufferDays: policy?.bufferDays || 7,
      fullPaymentRequired: policy?.fullPaymentRequired || false,
      isActive: policy?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (policy) {
      reset({
        region: policy.region,
        processingDays: policy.processingDays,
        bufferDays: policy.bufferDays,
        fullPaymentRequired: policy.fullPaymentRequired,
        isActive: policy.isActive,
      });
      // Ensure both languages exist with correct field names
      const existingTranslations = policy.translations || {};
      setTranslations({
        vi: { region: "", note: "", ...existingTranslations.vi },
        en: { region: "", note: "", ...existingTranslations.en },
      });
    }
  }, [policy, reset]);

  const onSubmit = async (data: { region: string; processingDays: number; bufferDays: number; fullPaymentRequired: boolean; isActive: boolean }) => {
    setLoading(true);
    try {
      let response;
      if (policy) {
        const payload: UpdateVisaPolicyRequest = {
          id: policy.id,
          region: data.region,
          processingDays: data.processingDays,
          bufferDays: data.bufferDays,
          fullPaymentRequired: data.fullPaymentRequired,
          isActive: data.isActive,
          translations,
        };
        response = await visaPolicyService.update(payload);
      } else {
        const payload: CreateVisaPolicyRequest = {
          region: data.region,
          processingDays: data.processingDays,
          bufferDays: data.bufferDays,
          fullPaymentRequired: data.fullPaymentRequired,
          translations,
        };
        response = await visaPolicyService.create(payload);
      }

      if (response.success) {
        onSuccess();
      } else {
        alert(response.error?.[0]?.message || "Failed to save visa policy");
      }
    } catch (err) {
      alert("An error occurred while saving the visa policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Region</label>
        <input
          type="text"
          {...register("region", { required: "Region is required" })}
          placeholder="e.g., Southeast Asia, Europe, USA"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Processing Days</label>
          <input
            type="number"
            {...register("processingDays", {
              required: "Processing days is required",
              min: { value: 1, message: "Must be at least 1" },
              valueAsNumber: true
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.processingDays && <p className="mt-1 text-sm text-red-600">{errors.processingDays.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Buffer Days</label>
          <input
            type="number"
            {...register("bufferDays", {
              required: "Buffer days is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.bufferDays && <p className="mt-1 text-sm text-red-600">{errors.bufferDays.message}</p>}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("fullPaymentRequired")}
          id="fullPaymentRequired"
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label htmlFor="fullPaymentRequired" className="ml-2 block text-sm text-gray-900">
          Full Payment Required for Visa Processing
        </label>
      </div>

      {policy && (
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isActive")}
            id="isActive"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active
          </label>
        </div>
      )}

      {/* Translation Section — truyền đúng fields cho VisaPolicy (region + note) */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Translations</h3>
        <TranslationTabForm
          translations={translations}
          onChange={setTranslations}
          fields={visaPolicyTranslationFields}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : policy ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
