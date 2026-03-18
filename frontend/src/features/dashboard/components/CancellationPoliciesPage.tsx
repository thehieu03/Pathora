"use client";

import { useState } from "react";
import { cancellationPolicyService } from "@/api/services/cancellationPolicyService";
import type { CancellationPolicy } from "@/types/cancellationPolicy";
import { CancellationPolicyList } from "./CancellationPolicyList";
import { CancellationPolicyForm } from "./CancellationPolicyForm";

export function CancellationPoliciesPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingPolicy, setEditingPolicy] = useState<CancellationPolicy | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingPolicy(null);
    setView("form");
  };

  const handleEdit = (policy: CancellationPolicy) => {
    setEditingPolicy(policy);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cancellation policy?")) {
      return;
    }

    const response = await cancellationPolicyService.delete(id);
    if (response.isSuccess) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.errors?.[0]?.message || "Failed to delete cancellation policy");
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
          <h1 className="text-2xl font-bold text-gray-900">Cancellation Policies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage cancellation refund rules for tours
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
          <CancellationPolicyList
            onEdit={handleEdit}
            onDelete={handleDelete}
            refreshKey={refreshKey}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingPolicy ? "Edit Cancellation Policy" : "Create Cancellation Policy"}
          </h2>
          <CancellationPolicyForm
            policy={editingPolicy}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
}
