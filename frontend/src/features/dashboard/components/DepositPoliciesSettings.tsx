"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { depositPolicyService } from "@/api/services/depositPolicyService";
import type { DepositPolicy } from "@/types/depositPolicy";
import { DepositPolicyList } from "./DepositPolicyList";
import { DepositPolicyForm } from "./DepositPolicyForm";
import { Icon } from "@/components/ui";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export function DepositPoliciesSettings() {
  const { t } = useTranslation();
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
    if (!confirm(t("depositPolicy.confirmDelete", "Are you sure you want to delete this deposit policy?"))) {
      return;
    }

    const response = await depositPolicyService.delete(id);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || t("depositPolicy.deleteFailed", "Failed to delete deposit policy"));
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
      alert(response.error?.[0]?.message || t("depositPolicy.updateFailed", "Failed to update deposit policy"));
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
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8"
      >
        <motion.div variants={itemVariants} className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Icon icon="heroicons:banknotes" className="w-5 h-5 text-amber-500" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
              {t("depositPolicy.pageTitle", "Deposit Policies")}
            </h1>
          </div>
          <p className="text-sm text-stone-500 max-w-xl pl-[3.5rem]">
            {t("depositPolicy.pageSubtitle", "Manage deposit requirements for tours — percentage or fixed amount")}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.button
              key="add-btn"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-amber-500/30 active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
            >
              <Icon icon="heroicons:plus" className="w-4 h-4" />
              {t("depositPolicy.addPolicy", "Add Policy")}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-200/50 overflow-hidden"
          >
            <DepositPolicyList
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              refreshKey={refreshKey}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-200/50 p-6 lg:p-8"
          >
            <DepositPolicyForm
              policy={editingPolicy}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
