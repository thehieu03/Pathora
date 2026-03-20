"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { taxConfigService } from "@/api/services/taxConfigService";
import type { TaxConfig } from "@/types/taxConfig";
import { TaxConfigList } from "./TaxConfigList";
import { TaxConfigForm } from "./TaxConfigForm";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export function TaxConfigsPage() {
  const { t } = useTranslation();
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
    if (!confirm(t("taxConfig.confirmDelete"))) {
      return;
    }

    const response = await taxConfigService.delete(id);
    if (response.success) {
      setRefreshKey((k) => k + 1);
    } else {
      alert(response.error?.[0]?.message || t("taxConfig.deleteFailed"));
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
    <div className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <motion.div variants={itemVariants} className="pr-4">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900">
            {t("taxConfig.pageTitle")}
          </h1>
          <p className="mt-2 text-sm text-stone-500 max-w-[50ch]">
            {t("taxConfig.pageSubtitle")}
          </p>
        </motion.div>
        {view === "list" && (
          <motion.button
            variants={itemVariants}
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent rounded-2xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-amber-500/30 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_-4px_rgba(245,158,11,0.35)]"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("taxConfig.addTax")}
          </motion.button>
        )}
      </motion.div>

      {view === "list" ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
          className="overflow-hidden bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-200/50"
        >
          <TaxConfigList
            onEdit={handleEdit}
            onDelete={handleDelete}
            refreshKey={refreshKey}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
          className="overflow-hidden bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-200/50 p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              {editingConfig ? t("taxConfig.form.editTitle") : t("taxConfig.form.createTitle")}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {editingConfig
                ? t("taxConfig.form.editSubtitle", "Update an existing tax configuration.")
                : t("taxConfig.form.createSubtitle", "Add a new tax configuration for your tours.")}
            </p>
          </div>
          <TaxConfigForm
            config={editingConfig}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </motion.div>
      )}
    </div>
  );
}
