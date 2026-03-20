"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { visaPolicyService } from "@/api/services/visaPolicyService";
import type { VisaPolicy, UpdateVisaPolicyRequest } from "@/types/visaPolicy";
import { Icon } from "@/components/ui";
import { VisaPolicyList } from "./VisaPolicyList";
import { VisaPolicyForm } from "./VisaPolicyForm";

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export function VisaPoliciesPage() {
  const { t } = useTranslation();
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
    if (!confirm(t("visaPolicy.confirmDelete"))) {
      return;
    }

    const response = await visaPolicyService.delete(id);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || t("visaPolicy.deleteFailed"));
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

    const response = await visaPolicyService.update(updateData as UpdateVisaPolicyRequest);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || t("visaPolicy.updateFailed"));
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
    <motion.div
      className="px-6 pb-10"
      variants={itemVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page Header — asymmetric layout */}
      <div className="pt-8 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 leading-none">
            {t("visaPolicy.pageTitle")}
          </h1>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed">
            {t("visaPolicy.pageSubtitle")}
          </p>
        </div>
        {view === "list" && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 text-white px-5 py-2.5 text-sm font-semibold hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-amber-500/20 shrink-0"
          >
            <Icon icon="heroicons:plus" className="size-4" />
            {t("visaPolicy.add")}
          </button>
        )}
      </div>

      {view === "list" ? (
        <motion.div
          className="rounded-[2.5rem] bg-white border border-stone-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
        >
          <VisaPolicyList
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            refreshKey={refreshKey}
          />
        </motion.div>
      ) : (
        <motion.div
          className="rounded-[2.5rem] bg-white border border-stone-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-6 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
        >
          {/* Form header */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Icon icon={editingPolicy ? "heroicons:pencil-square" : "heroicons:plus"} className="size-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
              {editingPolicy ? t("visaPolicy.edit") : t("visaPolicy.create")}
            </h2>
          </div>
          <VisaPolicyForm
            policy={editingPolicy}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
