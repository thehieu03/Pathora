"use client";

import { useState } from "react";
import type { PricingPolicyTier } from "@/types/pricingPolicy";

interface PricingTierInputProps {
  tiers: PricingPolicyTier[];
  onChange: (tiers: PricingPolicyTier[]) => void;
}

export function PricingTierInput({ tiers, onChange }: PricingTierInputProps) {
  const addTier = () => {
    const newTier: PricingPolicyTier = {
      label: "",
      ageFrom: 0,
      ageTo: null,
      pricePercentage: 100,
    };
    onChange([...tiers, newTier]);
  };

  const updateTier = (index: number, field: keyof PricingPolicyTier, value: string | number | null) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeTier = (index: number) => {
    const updated = tiers.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Pricing Tiers</h4>
        <button
          type="button"
          onClick={addTier}
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          + Add Tier
        </button>
      </div>

      {tiers.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No tiers added. Click "Add Tier" to create one.</p>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Label</label>
                  <input
                    type="text"
                    value={tier.label}
                    onChange={(e) => updateTier(index, "label", e.target.value)}
                    placeholder="e.g., Adult, Child"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Age From</label>
                  <input
                    type="number"
                    min="0"
                    value={tier.ageFrom}
                    onChange={(e) => updateTier(index, "ageFrom", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Age To (empty = ∞)</label>
                  <input
                    type="number"
                    min="0"
                    value={tier.ageTo ?? ""}
                    onChange={(e) =>
                      updateTier(index, "ageTo", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="∞"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Price %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tier.pricePercentage}
                    onChange={(e) =>
                      updateTier(index, "pricePercentage", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeTier(index)}
                className="mt-6 text-red-600 hover:text-red-900"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Price % is relative to the adult base price. For example, 75% means the child pays 75% of the adult price.
      </p>
    </div>
  );
}
