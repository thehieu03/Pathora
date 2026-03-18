"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { depositPolicyService } from "@/api/services/depositPolicyService";
import type { DepositPolicy, CreateDepositPolicyRequest, UpdateDepositPolicyRequest } from "@/types/depositPolicy";
import { TourScopeMap, DepositTypeMap } from "@/types/depositPolicy";

interface DepositPolicyFormProps {
  policy?: DepositPolicy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DepositPolicyForm({ policy, onSuccess, onCancel }: DepositPolicyFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{
    tourScope: number;
    depositType: number;
    depositValue: number;
    minDaysBeforeDeparture: number;
  }>({
    defaultValues: {
      tourScope: policy?.tourScope || 1,
      depositType: policy?.depositType || 1,
      depositValue: policy?.depositValue || 10,
      minDaysBeforeDeparture: policy?.minDaysBeforeDeparture || 7,
    },
  });

  useEffect(() => {
    if (policy) {
      reset({
        tourScope: policy.tourScope,
        depositType: policy.depositType,
        depositValue: policy.depositValue,
        minDaysBeforeDeparture: policy.minDaysBeforeDeparture,
      });
    }
  }, [policy, reset]);

  const onSubmit = async (data: { tourScope: number; depositType: number; depositValue: number; minDaysBeforeDeparture: number }) => {
    setLoading(true);
    try {
      let response;
      if (policy) {
        const payload: UpdateDepositPolicyRequest = {
          id: policy.id,
          ...data,
        };
        response = await depositPolicyService.update(payload);
      } else {
        const payload: CreateDepositPolicyRequest = data;
        response = await depositPolicyService.create(payload);
      }

      if (response.isSuccess) {
        onSuccess();
      } else {
        alert(response.errors?.[0]?.message || "Failed to save deposit policy");
      }
    } catch (err) {
      alert("An error occurred while saving the deposit policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Deposit Type</label>
          <select
            {...register("depositType", { required: true, valueAsNumber: true })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Object.entries(DepositTypeMap).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Deposit Value</label>
          <input
            type="number"
            step="0.01"
            {...register("depositValue", {
              required: "Deposit value is required",
              min: { value: 0.01, message: "Must be greater than 0" },
              valueAsNumber: true
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.depositValue && <p className="mt-1 text-sm text-red-600">{errors.depositValue.message}</p>}
        </div>

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
