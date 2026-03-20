"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { pricingPolicyService } from "@/api/services/pricingPolicyService";
import type { PricingPolicy } from "@/types/pricingPolicy";
import { PricingPolicyList } from "./PricingPolicyList";
import { PricingPolicyForm } from "./PricingPolicyForm";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export function PricingPoliciesPage() {
  const { t } = useTranslation();
  const [view, setView] = useState<"list" | "form">("list");
  const [editingPolicy, setEditingPolicy] = useState<PricingPolicy | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingPolicy(null);
    setView("form");
  };

  const handleEdit = (policy: PricingPolicy) => {
    setEditingPolicy(policy);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("pricingPolicy.confirmDelete", "Are you sure you want to delete this pricing policy?"))) {
      return;
    }

    const response = await pricingPolicyService.delete(id);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || t("pricingPolicy.deleteFailed", "Failed to delete pricing policy"));
    }
  };

  const handleSetDefault = async (id: string) => {
    const response = await pricingPolicyService.setAsDefault(id);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || t("pricingPolicy.setDefaultFailed", "Failed to set as default"));
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8"
    >
      {/* Asymmetric header */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-end justify-between gap-4">
          <div className="-ml-1">
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 leading-none">
              {t("pricingPolicy.pageTitle", "Pricing Policies")}
            </h1>
            <p className="mt-2 text-sm text-stone-500 max-w-[50ch]">
              {t("pricingPolicy.pageSubtitle", "Manage age-based pricing rules for tours")}
            </p>
          </div>
          {view === "list" && (
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-2xl shadow-[0_4px_16px_-4px_rgba(245,158,11,0.4)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t("pricingPolicy.addPolicy", "Add Policy")}
            </motion.button>
          )}
        </div>
      </motion.div>

      {view === "list" ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20, delay: 0.05 }}
          className="rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-200/50 bg-white overflow-hidden"
        >
          <PricingPolicyList
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
            refreshKey={refreshKey}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20, delay: 0.05 }}
          className="rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-200/50 bg-white p-8 lg:p-10"
        >
          <div className="mb-8 -ml-1">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              {editingPolicy
                ? t("pricingPolicy.editPolicy", "Edit Pricing Policy")
                : t("pricingPolicy.createPolicy", "Create Pricing Policy")}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {editingPolicy
                ? t("pricingPolicy.editSubtitle", "Update pricing policy and tier configurations")
                : t("pricingPolicy.createSubtitle", "Set up a new pricing policy with age-based tiers")}
            </p>
          </div>
          <PricingPolicyForm
            policy={editingPolicy}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
