"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { taxConfigService } from "@/api/services/taxConfigService";
import type { TaxConfig, CreateTaxConfigRequest, UpdateTaxConfigRequest } from "@/types/taxConfig";

interface TaxConfigFormProps {
  config?: TaxConfig | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaxConfigForm({ config, onSuccess, onCancel }: TaxConfigFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{
    taxName: string;
    taxRate: number;
    description: string;
    effectiveDate: string;
    isActive: boolean;
  }>({
    defaultValues: {
      taxName: config?.taxName || "",
      taxRate: config?.taxRate || 10,
      description: config?.description || "",
      effectiveDate: config?.effectiveDate ? config.effectiveDate.split('T')[0] : new Date().toISOString().split('T')[0],
      isActive: config?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (config) {
      reset({
        taxName: config.taxName,
        taxRate: config.taxRate,
        description: config.description || "",
        effectiveDate: config.effectiveDate ? config.effectiveDate.split('T')[0] : "",
        isActive: config.isActive ?? true,
      });
    }
  }, [config, reset]);

  const onSubmit = async (data: { taxName: string; taxRate: number; description: string; effectiveDate: string; isActive: boolean }) => {
    setLoading(true);
    try {
      let response;
      if (config) {
        const payload: UpdateTaxConfigRequest = {
          id: config.id,
          taxName: data.taxName,
          taxRate: data.taxRate,
          description: data.description || undefined,
          effectiveDate: new Date(data.effectiveDate + "T00:00:00Z").toISOString(),
          isActive: data.isActive,
        };
        response = await taxConfigService.update(payload);
      } else {
        const payload: CreateTaxConfigRequest = {
          taxName: data.taxName,
          taxRate: data.taxRate,
          description: data.description || undefined,
          effectiveDate: new Date(data.effectiveDate + "T00:00:00Z").toISOString(),
        };
        response = await taxConfigService.create(payload);
      }

      if (response.success) {
        onSuccess();
      } else {
        alert(response.error?.[0]?.message || "Failed to save tax configuration");
      }
    } catch (err) {
      alert("An error occurred while saving the tax configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tax Name</label>
        <input
          type="text"
          {...register("taxName", { required: "Tax name is required" })}
          placeholder="e.g., VAT, Service Tax"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.taxName && <p className="mt-1 text-sm text-red-600">{errors.taxName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
          <input
            type="number"
            step="0.01"
            {...register("taxRate", {
              required: "Tax rate is required",
              min: { value: 0, message: "Cannot be negative" },
              max: { value: 100, message: "Cannot exceed 100%" },
              valueAsNumber: true
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.taxRate && <p className="mt-1 text-sm text-red-600">{errors.taxRate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Effective Date</label>
          <input
            type="date"
            {...register("effectiveDate", { required: "Effective date is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.effectiveDate && <p className="mt-1 text-sm text-red-600">{errors.effectiveDate.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Enter tax description or notes"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Active
        </label>
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
          {loading ? "Saving..." : config ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}


