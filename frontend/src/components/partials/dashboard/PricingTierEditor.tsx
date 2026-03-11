"use client";

import React, { useMemo } from "react";
import { Icon } from "@/components/ui";
import { DynamicPricingDto } from "@/types/tour";

interface PricingTierEditorProps {
  title: string;
  subtitle?: string;
  tiers: DynamicPricingDto[];
  saving?: boolean;
  saveLabel?: string;
  infoMessage?: string;
  allowClear?: boolean;
  clearing?: boolean;
  clearLabel?: string;
  onChange: (tiers: DynamicPricingDto[]) => void;
  onSave: () => void;
  onClear?: () => void;
}

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const validateTiers = (tiers: DynamicPricingDto[]): string | null => {
  for (const tier of tiers) {
    if (tier.minParticipants <= 0) {
      return "Min participants must be greater than 0.";
    }

    if (tier.maxParticipants < tier.minParticipants) {
      return "Max participants must be greater than or equal to min participants.";
    }

    if (tier.pricePerPerson < 0) {
      return "Price per person must not be negative.";
    }
  }

  const ordered = [...tiers]
    .sort((left, right) => {
      if (left.minParticipants !== right.minParticipants) {
        return left.minParticipants - right.minParticipants;
      }

      return left.maxParticipants - right.maxParticipants;
    });

  for (let index = 1; index < ordered.length; index++) {
    if (ordered[index].minParticipants <= ordered[index - 1].maxParticipants) {
      return "Participant ranges must not overlap.";
    }
  }

  return null;
};

export function PricingTierEditor({
  title,
  subtitle,
  tiers,
  saving = false,
  saveLabel = "Save pricing tiers",
  infoMessage,
  allowClear = false,
  clearing = false,
  clearLabel = "Clear overrides",
  onChange,
  onSave,
  onClear,
}: PricingTierEditorProps) {
  const validationError = useMemo(() => validateTiers(tiers), [tiers]);

  const updateTier = (
    index: number,
    key: keyof DynamicPricingDto,
    value: number,
  ) => {
    const next = [...tiers];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const addTier = () => {
    const sorted = [...tiers].sort(
      (left, right) => left.maxParticipants - right.maxParticipants,
    );

    const nextStart = sorted.length > 0 ? sorted[sorted.length - 1].maxParticipants + 1 : 1;

    onChange([
      ...tiers,
      {
        minParticipants: nextStart,
        maxParticipants: nextStart,
        pricePerPerson: 0,
      },
    ]);
  };

  const removeTier = (index: number) => {
    onChange(tiers.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={addTier}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
          <Icon icon="heroicons:plus" className="size-4" />
          Add tier
        </button>
      </div>

      {infoMessage && (
        <div className="mb-4 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-700">
          {infoMessage}
        </div>
      )}

      {tiers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500 text-center">
          No pricing tiers configured.
        </div>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier, index) => (
            <div
              key={`${tier.minParticipants}-${tier.maxParticipants}-${index}`}
              className="grid grid-cols-12 gap-3 items-end rounded-lg border border-slate-200 p-3">
              <label className="col-span-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Min</span>
                <input
                  type="number"
                  min={1}
                  value={tier.minParticipants}
                  onChange={(event) =>
                    updateTier(index, "minParticipants", Number(event.target.value || 0))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="col-span-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Max</span>
                <input
                  type="number"
                  min={1}
                  value={tier.maxParticipants}
                  onChange={(event) =>
                    updateTier(index, "maxParticipants", Number(event.target.value || 0))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>

              <label className="col-span-5">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Price per person (VND)
                </span>
                <input
                  type="number"
                  min={0}
                  value={tier.pricePerPerson}
                  onChange={(event) =>
                    updateTier(index, "pricePerPerson", Number(event.target.value || 0))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Preview: {currencyFormatter.format(tier.pricePerPerson)} VND
                </p>
              </label>

              <button
                type="button"
                onClick={() => removeTier(index)}
                className="col-span-1 mb-2 inline-flex justify-center text-red-500 hover:text-red-600"
                aria-label="Remove pricing tier">
                <Icon icon="heroicons:trash" className="size-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {validationError && (
        <p className="text-sm text-red-600 mt-4">{validationError}</p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || Boolean(validationError)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors">
          {saving && <Icon icon="heroicons:arrow-path" className="size-4 animate-spin" />}
          {saveLabel}
        </button>

        {allowClear && onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={clearing}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold rounded-lg transition-colors">
            {clearing && <Icon icon="heroicons:arrow-path" className="size-4 animate-spin" />}
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
