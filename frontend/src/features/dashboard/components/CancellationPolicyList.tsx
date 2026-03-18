"use client";

import { useEffect, useState } from "react";
import { cancellationPolicyService } from "@/api/services/cancellationPolicyService";
import type { CancellationPolicy } from "@/types/cancellationPolicy";
import { TourScopeMap, CancellationPolicyStatusMap } from "@/types/cancellationPolicy";

interface CancellationPolicyListProps {
  onEdit: (policy: CancellationPolicy) => void;
  onDelete: (id: string) => void;
  refreshKey?: number;
}

export function CancellationPolicyList({ onEdit, onDelete, refreshKey: _refreshKey }: CancellationPolicyListProps) {
  const [policies, setPolicies] = useState<CancellationPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPolicies();
  }, [_refreshKey]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cancellationPolicyService.getAll();
      if (response.isSuccess && response.data) {
        setPolicies(response.data);
      } else {
        setError(response.errors?.[0]?.message || "Failed to load cancellation policies");
      }
    } catch (err) {
      setError("An error occurred while loading cancellation policies");
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
        No cancellation policies found. Create one to get started.
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
              Tour Scope
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Penalty %
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Apply On
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
          {policies.map((policy) => (
            <tr key={policy.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {policy.policyCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {TourScopeMap[policy.tourScope] || policy.tourScopeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {policy.minDaysBeforeDeparture} days
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {policy.maxDaysBeforeDeparture} days
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {policy.penaltyPercentage}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {policy.applyOn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    policy.status === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {CancellationPolicyStatusMap[policy.status] || policy.statusName}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(policy)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
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
