"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { cancellationPolicyService } from "@/api/services/cancellationPolicyService";
import type { CancellationPolicy, CreateCancellationPolicyRequest, UpdateCancellationPolicyRequest, CancellationPolicyTranslations } from "@/types/cancellationPolicy";
import { TourScopeMap, CancellationPolicyStatusMap } from "@/types/cancellationPolicy";
import { TranslationTabForm } from "./TranslationTabForm";

interface CancellationPolicyFormProps {
  policy?: CancellationPolicy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CancellationPolicyForm({ policy, onSuccess, onCancel }: CancellationPolicyFormProps) {
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<CancellationPolicyTranslations>(policy?.translations || {});
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
      alert("Min days cannot be greater than Max days");
      return;
    }

    setLoading(true);
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
        alert(response.error?.[0]?.message || "Failed to save cancellation policy");
      }
    } catch (err) {
      alert("An error occurred while saving the cancellation policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tour Scope</label>
        <select
          {...register("tourScope", { required: true, valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {Object.entries(TourScopeMap).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Days Before Departure</label>
          <input
            type="number"
            {...register("minDaysBeforeDeparture", {
              required: "Min days is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.minDaysBeforeDeparture && <p className="mt-1 text-sm text-red-600">{errors.minDaysBeforeDeparture.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Days Before Departure</label>
          <input
            type="number"
            {...register("maxDaysBeforeDeparture", {
              required: "Max days is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.maxDaysBeforeDeparture && <p className="mt-1 text-sm text-red-600">{errors.maxDaysBeforeDeparture.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Penalty Percentage</label>
          <input
            type="number"
            step="0.01"
            {...register("penaltyPercentage", {
              required: "Penalty percentage is required",
              min: { value: 0, message: "Cannot be negative" },
              max: { value: 100, message: "Cannot exceed 100%" },
              valueAsNumber: true
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.penaltyPercentage && <p className="mt-1 text-sm text-red-600">{errors.penaltyPercentage.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Apply On</label>
          <select
            {...register("applyOn")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="FullAmount">Full Amount</option>
            <option value="DepositOnly">Deposit Only</option>
          </select>
        </div>
      </div>

      {/* Translation Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Translations</h3>
        <TranslationTabForm translations={translations} onChange={setTranslations} />
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


