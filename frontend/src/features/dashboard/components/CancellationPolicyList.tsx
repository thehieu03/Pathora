"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cancellationPolicyService } from "@/api/services/cancellationPolicyService";
import type { CancellationPolicy } from "@/types/cancellationPolicy";
import { TourScopeMap, CancellationPolicyStatusMap } from "@/types/cancellationPolicy";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { Icon } from "@/components/ui/Icon";

interface CancellationPolicyListProps {
  onEdit: (policy: CancellationPolicy) => void;
  onDelete: (id: string) => void;
  refreshKey?: number;
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring" as const, stiffness: 100, damping: 20 },
  }),
};

export function CancellationPolicyList({ onEdit, onDelete, refreshKey: _refreshKey }: CancellationPolicyListProps) {
  const { t } = useTranslation();
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
      if (response.success && response.data) {
        setPolicies(response.data);
      } else {
        setError(response.error?.[0]?.message || t("cancellationPolicy.error.loadFailed", "Failed to load cancellation policies"));
      }
    } catch {
      setError(t("cancellationPolicy.error.loadFailed", "An error occurred while loading cancellation policies"));
    } finally {
      setLoading(false);
    }
  };

  const retryLoading = () => {
    void loadPolicies();
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonTable rows={5} columns={8} />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-white border border-red-200/50 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-6 m-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 border border-red-200 mt-0.5">
              <Icon icon="heroicons:exclamation-circle" className="size-5 text-red-500" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-red-800">
                {t("cancellationPolicy.error.title", "Could not load policies")}
              </h2>
              <p className="text-sm text-red-700 mt-0.5">
                {error}
              </p>
            </div>
          </div>
          <button
            onClick={retryLoading}
            className="px-3.5 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all duration-200"
          >
            {t("common.retry", "Retry")}
          </button>
        </div>
      </motion.div>
    );
  }

  if (policies.length === 0) {
    return (
      <motion.div
        className="bg-white border border-stone-200/50 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-12 m-6 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
      >
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
          <Icon
            icon="heroicons:clipboard-document"
            className="size-7 text-stone-300"
          />
        </span>
        <h2 className="text-lg font-bold text-stone-800 tracking-tight">
          {t("cancellationPolicy.empty.title", "No cancellation policies found")}
        </h2>
        <p className="text-sm text-stone-500 mt-1.5 max-w-[40ch] mx-auto leading-relaxed">
          {t("cancellationPolicy.empty.description", "Create your first policy to start managing refunds.")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-50">
          <tr>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.policyCode", "Policy Code")}
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.tourScope", "Tour Scope")}
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.minDays", "Min Days")}
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.maxDays", "Max Days")}
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.penalty", "Penalty %")}
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.applyOn", "Apply On")}
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.status", "Status")}
            </th>
            <th className="px-5 py-3 text-right text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
              {t("cancellationPolicy.column.actions", "Actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-stone-100">
          {policies.map((policy, i) => (
            <motion.tr
              key={policy.id}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              className="hover:bg-amber-50/30 transition-colors duration-150"
            >
              <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-stone-800 tracking-tight">
                {policy.policyCode}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-stone-600">
                {TourScopeMap[policy.tourScope] || policy.tourScopeName}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-stone-500 data-value">
                {policy.minDaysBeforeDeparture} {t("cancellationPolicy.unit.days", "days")}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-stone-500 data-value">
                {policy.maxDaysBeforeDeparture} {t("cancellationPolicy.unit.days", "days")}
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-700 data-value">
                  {policy.penaltyPercentage}%
                </span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm text-stone-600">
                {t(`cancellationPolicy.applyOn.${policy.applyOn}`, policy.applyOn)}
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    policy.status === 1
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {CancellationPolicyStatusMap[policy.status] || policy.statusName}
                </span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(policy)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 active:scale-[0.98] transition-all duration-150"
                  >
                    <Icon icon="heroicons:pencil-square" className="size-3.5" />
                    {t("cancellationPolicy.action.edit", "Edit")}
                  </button>
                  <button
                    onClick={() => onDelete(policy.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 active:scale-[0.98] transition-all duration-150"
                  >
                    <Icon icon="heroicons:trash" className="size-3.5" />
                    {t("cancellationPolicy.action.delete", "Delete")}
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
