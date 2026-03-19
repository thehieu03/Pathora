"use client";

import { useState } from "react";
import { visaPolicyService } from "@/api/services/visaPolicyService";
import type { VisaPolicy } from "@/types/visaPolicy";
import { VisaPolicyList } from "./VisaPolicyList";
import { VisaPolicyForm } from "./VisaPolicyForm";

export function VisaPoliciesPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingPolicy, setEditingPolicy] = useState<VisaPolicy | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingPolicy(null);
    setView("form");
  };

  const handleEdit = (policy: VisaPolicy) => {
    setEditingPolicy(policy);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this visa policy?")) {
      return;
    }

    const response = await visaPolicyService.delete(id);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || "Failed to delete visa policy");
    }
  };

  const handleToggleActive = async (policy: VisaPolicy) => {
    const updateData = {
      id: policy.id,
      region: policy.region,
      processingDays: policy.processingDays,
      bufferDays: policy.bufferDays,
      fullPaymentRequired: policy.fullPaymentRequired,
      isActive: !policy.isActive,
    };

    const response = await visaPolicyService.update(updateData as any);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || "Failed to update visa policy");
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
          <h1 className="text-2xl font-bold text-gray-900">Visa Policies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage visa processing time and requirements by region
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
          <VisaPolicyList
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            refreshKey={refreshKey}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingPolicy ? "Edit Visa Policy" : "Create Visa Policy"}
          </h2>
          <VisaPolicyForm
            policy={editingPolicy}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
}


