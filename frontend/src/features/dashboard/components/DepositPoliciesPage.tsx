"use client";

import { useState } from "react";
import { depositPolicyService } from "@/api/services/depositPolicyService";
import type { DepositPolicy } from "@/types/depositPolicy";
import { DepositPolicyList } from "./DepositPolicyList";
import { DepositPolicyForm } from "./DepositPolicyForm";

export function DepositPoliciesPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingPolicy, setEditingPolicy] = useState<DepositPolicy | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingPolicy(null);
    setView("form");
  };

  const handleEdit = (policy: DepositPolicy) => {
    setEditingPolicy(policy);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deposit policy?")) {
      return;
    }

    const response = await depositPolicyService.delete(id);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || "Failed to delete deposit policy");
    }
  };

  const handleToggleActive = async (policy: DepositPolicy) => {
    const updateData = {
      id: policy.id,
      tourScope: policy.tourScope,
      depositType: policy.depositType,
      depositValue: policy.depositValue,
      minDaysBeforeDeparture: policy.minDaysBeforeDeparture,
      isActive: !policy.isActive,
    };

    const response = await depositPolicyService.update(updateData);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || "Failed to update deposit policy");
    }
  };

  const handleFormSuccess = () => {
    setView("list");
    setEditingPolicy(null);
    setRefreshKey((k) => k + 1);
  };

  const handleFormCancel = () => {
    setView("list");
    setEditingPolicy(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deposit Policies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage deposit amount rules for tours
          </p>
        </div>
        {view === "list" && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add Policy
          </button>
        )}
      </div>

      {view === "list" ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <DepositPolicyList
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            refreshKey={refreshKey}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingPolicy ? "Edit Deposit Policy" : "Create Deposit Policy"}
          </h2>
          <DepositPolicyForm
            policy={editingPolicy}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
}


