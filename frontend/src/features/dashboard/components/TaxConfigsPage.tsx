"use client";

import { useState } from "react";
import { taxConfigService } from "@/api/services/taxConfigService";
import type { TaxConfig } from "@/types/taxConfig";
import { TaxConfigList } from "./TaxConfigList";
import { TaxConfigForm } from "./TaxConfigForm";

export function TaxConfigsPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [editingConfig, setEditingConfig] = useState<TaxConfig | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingConfig(null);
    setView("form");
  };

  const handleEdit = (config: TaxConfig) => {
    setEditingConfig(config);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tax configuration?")) {
      return;
    }

    const response = await taxConfigService.delete(id);
    if (response.isSuccess) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.errors?.[0]?.message || "Failed to delete tax configuration");
    }
  };

  const handleFormSuccess = () => {
    setView("list");
    setEditingConfig(null);
    setRefreshKey((k) => k + 1);
  };

  const handleFormCancel = () => {
    setView("list");
    setEditingConfig(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Configurations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage tax rates for bookings
          </p>
        </div>
        {view === "list" && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add Tax
          </button>
        )}
      </div>

      {view === "list" ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <TaxConfigList
            onEdit={handleEdit}
            onDelete={handleDelete}
            refreshKey={refreshKey}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingConfig ? "Edit Tax Configuration" : "Create Tax Configuration"}
          </h2>
          <TaxConfigForm
            config={editingConfig}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
}
