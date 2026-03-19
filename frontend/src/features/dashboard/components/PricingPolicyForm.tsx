"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { pricingPolicyService } from "@/api/services/pricingPolicyService";
import type { PricingPolicy, PricingPolicyTier, CreatePricingPolicyRequest, UpdatePricingPolicyRequest, PricingPolicyTranslations } from "@/types/pricingPolicy";
import { PricingTierInput } from "./PricingTierInput";
import { TranslationTabForm } from "./TranslationTabForm";

interface PricingPolicyFormProps {
  policy?: PricingPolicy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PricingPolicyForm({ policy, onSuccess, onCancel }: PricingPolicyFormProps) {
  const [loading, setLoading] = useState(false);
  const [tiers, setTiers] = useState<PricingPolicyTier[]>(policy?.tiers || []);
  const [translations, setTranslations] = useState<PricingPolicyTranslations>(policy?.translations || {});
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{
    name: string;
    tourType: number;
    isDefault: boolean;
  }>({
    defaultValues: {
      name: policy?.name || "",
      tourType: policy?.tourType || 2,
      isDefault: policy?.isDefault || false,
    },
  });

  useEffect(() => {
    if (policy) {
      reset({
        name: policy.name,
        tourType: policy.tourType,
        isDefault: policy.isDefault,
      });
      setTiers(policy.tiers);
      setTranslations(policy.translations || {});
    }
  }, [policy, reset]);

  const onSubmit = async (data: { name: string; tourType: number; isDefault: boolean }) => {
    if (tiers.length === 0) {
      alert("Please add at least one pricing tier");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (policy) {
        const payload: UpdatePricingPolicyRequest = {
          id: policy.id,
          name: data.name,
          tourType: data.tourType,
          tiers,
          translations,
        };
        response = await pricingPolicyService.update(payload);
      } else {
        const payload: CreatePricingPolicyRequest = {
          name: data.name,
          tourType: data.tourType,
          tiers,
          isDefault: data.isDefault,
          translations,
        };
        response = await pricingPolicyService.create(payload);
      }

      if (response.success) {
        onSuccess();
      } else {
        alert(response.error?.[0]?.message || "Failed to save pricing policy");
      }
    } catch (err) {
      alert("An error occurred while saving the pricing policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Policy Name</label>
        <input
          type="text"
          {...register("name", { required: "Policy name is required" })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tour Type</label>
        <select
          {...register("tourType", { required: true })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value={1}>Private</option>
          <option value={2}>Public</option>
        </select>
      </div>

      {!policy && (
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isDefault")}
            id="isDefault"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
            Set as default policy
          </label>
        </div>
      )}

      <div>
        <PricingTierInput tiers={tiers} onChange={setTiers} />
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


