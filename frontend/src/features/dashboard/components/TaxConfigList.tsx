"use client";

import { useEffect, useState } from "react";
import { taxConfigService } from "@/api/services/taxConfigService";
import type { TaxConfig } from "@/types/taxConfig";

interface TaxConfigListProps {
  onEdit: (config: TaxConfig) => void;
  onDelete: (id: string) => void;
  refreshKey?: number;
}

export function TaxConfigList({ onEdit, onDelete, refreshKey: _refreshKey }: TaxConfigListProps) {
  const [configs, setConfigs] = useState<TaxConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, [_refreshKey]);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taxConfigService.getAll();
      if (response.success && response.data) {
        setConfigs(response.data);
      } else {
        setError(response.error?.[0]?.message || "Failed to load tax configurations");
      }
    } catch (err) {
      setError("An error occurred while loading tax configurations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tax configurations found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tax Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tax Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tax Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Effective Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {configs.map((config) => (
            <tr key={config.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {config.taxName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {config.taxCode || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {config.taxRate}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {config.effectiveDate ? new Date(config.effectiveDate).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {config.description || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    config.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {config.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(config)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(config.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


