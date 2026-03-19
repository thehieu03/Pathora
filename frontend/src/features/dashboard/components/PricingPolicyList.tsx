"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { pricingPolicyService } from "@/api/services/pricingPolicyService";
import type { PricingPolicy } from "@/types/pricingPolicy";
import { PricingPolicyStatusMap, TourTypeMap } from "@/types/pricingPolicy";

// Helper to get translated name
function getDisplayName(policy: PricingPolicy, language: string): string {
  if (policy.translations?.[language]?.name) {
    return policy.translations[language].name!;
  }
  // Fallback to default name
  return policy.name;
}

interface PricingPolicyListProps {
  onEdit: (policy: PricingPolicy) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  refreshKey?: number;
}

export function PricingPolicyList({ onEdit, onDelete, onSetDefault, refreshKey }: PricingPolicyListProps) {
  const [policies, setPolicies] = useState<PricingPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "en";

  useEffect(() => {
    loadPolicies();
  }, [refreshKey]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pricingPolicyService.getAll();
      if (response.success && response.data) {
        setPolicies(response.data);
      } else {
        setError(response.error?.[0]?.message || "Failed to load pricing policies");
      }
    } catch (err) {
      setError("An error occurred while loading pricing policies");
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

  if (policies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pricing policies found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Policy Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tour Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Default
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiers
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {policies.map((policy) => (
            <tr key={policy.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {policy.policyCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getDisplayName(policy, currentLanguage)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {TourTypeMap[policy.tourType] || policy.tourTypeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    policy.status === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {PricingPolicyStatusMap[policy.status] || policy.statusName}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {policy.isDefault && (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {policy.tiers.length} tiers
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(policy)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                {!policy.isDefault && (
                  <button
                    onClick={() => onSetDefault(policy.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => onDelete(policy.id)}
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


