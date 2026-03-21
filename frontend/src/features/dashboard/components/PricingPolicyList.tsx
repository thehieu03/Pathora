"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { pricingPolicyService } from "@/api/services/pricingPolicyService";
import type { PricingPolicy } from "@/types/pricingPolicy";
import { PricingPolicyStatusMap, TourTypeMap } from "@/types/pricingPolicy";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import {
  CurrencyDollar,
  PencilSimple,
  Trash,
  Star,
  Tag,
  UsersThree,
  StarHalf,
} from "@phosphor-icons/react";

function getDisplayName(policy: PricingPolicy, language: string): string {
  if (policy.translations?.[language]?.name) {
    return policy.translations[language].name!;
  }
  return policy.name;
}

interface PricingPolicyListProps {
  onEdit: (policy: PricingPolicy) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  refreshKey?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  }),
};

export function PricingPolicyList({ onEdit, onDelete, onSetDefault, refreshKey }: PricingPolicyListProps) {
  const [policies, setPolicies] = useState<PricingPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n, t } = useTranslation();
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
    } catch {
      setError("An error occurred while loading pricing policies");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <SkeletonTable rows={4} columns={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-red-200/60 bg-red-50/50 p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-2xl bg-red-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 5V8.5M8 11H8.01M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-800">
                  {t("pricingPolicy.error.title", "Could not load pricing policies")}
                </h3>
                <p className="text-sm text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={loadPolicies}
              className="shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            >
              {t("common.retry", "Retry")}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 20, delay: 0.1 }}
            className="w-16 h-16 rounded-[1.75rem] bg-stone-100 flex items-center justify-center mb-5"
          >
            <CurrencyDollar className="w-8 h-8 text-stone-400" weight="duotone" />
          </motion.div>
          <h3 className="text-lg font-bold text-stone-800 tracking-tight">
            {t("pricingPolicy.empty.title", "No pricing policies yet")}
          </h3>
          <p className="text-sm text-stone-500 mt-2 max-w-[32ch]">
            {t("pricingPolicy.empty.description", "Create your first pricing policy to start managing age-based rates.")}
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onEdit(policies[0] || null)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-2xl hover:bg-amber-600 transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.75V12.25M1.75 7H12.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {t("pricingPolicy.addPolicy", "Add Policy")}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 mb-3">
        <div className="col-span-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
          {t("pricingPolicy.column.policyCode", "Code")}
        </div>
        <div className="col-span-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">
          {t("pricingPolicy.column.name", "Name")}
        </div>
        <div className="col-span-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
          {t("pricingPolicy.column.tourType", "Tour Type")}
        </div>
        <div className="col-span-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
          {t("pricingPolicy.column.status", "Status")}
        </div>
        <div className="col-span-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">
          {t("pricingPolicy.column.tiers", "Tiers")}
        </div>
        <div className="col-span-1" />
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {policies.map((policy, i) => (
            <motion.div
              key={policy.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -8 }}
              layout
              className="group relative rounded-3xl border border-stone-200/50 bg-white p-4 md:p-5 hover:border-stone-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Policy Code */}
                <div className="col-span-1 md:col-span-2 flex items-center gap-2.5">
                  <div className="shrink-0 w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <Tag className="w-4.5 h-4.5 text-amber-600" weight="duotone" />
                  </div>
                  <span className="text-sm font-mono font-semibold text-stone-700 tracking-tight">
                    {policy.policyCode}
                  </span>
                </div>

                {/* Name */}
                <div className="md:col-span-3 flex items-center gap-2.5">
                  <div className="shrink-0 w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center">
                    <CurrencyDollar className="w-4.5 h-4.5 text-stone-500" weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 tracking-tight truncate">
                      {getDisplayName(policy, currentLanguage)}
                    </p>
                    {policy.isDefault && (
                      <p className="text-xs text-amber-600 font-medium">Default</p>
                    )}
                  </div>
                </div>

                {/* Tour Type */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <div className="shrink-0 w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center">
                    <UsersThree className="w-4.5 h-4.5 text-stone-500" weight="duotone" />
                  </div>
                  <span className="text-sm text-stone-600 tracking-tight">
                    {TourTypeMap[policy.tourType] || policy.tourTypeName}
                  </span>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold tracking-tight ${
                      policy.status === 1
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        policy.status === 1 ? "bg-emerald-500" : "bg-stone-400"
                      }`}
                    />
                    {PricingPolicyStatusMap[policy.status] || policy.statusName}
                  </span>
                </div>

                {/* Tiers count */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <div className="shrink-0 w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center">
                    <StarHalf className="w-4.5 h-4.5 text-stone-500" weight="duotone" />
                  </div>
                  <span className="text-sm text-stone-600 tracking-tight font-mono">
                    {policy.tiers.length} tier{policy.tiers.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(policy)}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center text-stone-500 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    title={t("pricingPolicy.action.edit", "Edit")}
                  >
                    <PencilSimple className="w-4 h-4" weight="regular" />
                  </motion.button>

                  {!policy.isDefault && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSetDefault(policy.id)}
                      className="w-9 h-9 rounded-2xl flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      title={t("pricingPolicy.action.setDefault", "Set Default")}
                    >
                      <Star className="w-4 h-4" weight="regular" />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(policy.id)}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    title={t("pricingPolicy.action.delete", "Delete")}
                  >
                    <Trash className="w-4 h-4" weight="regular" />
                  </motion.button>
                </div>
              </div>

              {/* Mobile-only info strip */}
              <div className="md:hidden mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold tracking-tight ${
                      policy.status === 1
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${policy.status === 1 ? "bg-emerald-500" : "bg-stone-400"}`} />
                    {PricingPolicyStatusMap[policy.status] || policy.statusName}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {policy.tiers.length} tier{policy.tiers.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
