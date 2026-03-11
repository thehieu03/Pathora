import { useTranslation } from "react-i18next";

import { TRAVEL_INTEREST_OPTIONS } from "./constants";
import type { CustomTourInterest } from "@/types/customTourRequest";

interface TravelInterestsSelectorProps {
  selectedInterests: CustomTourInterest[];
  onToggle: (interest: CustomTourInterest) => void;
  disabled?: boolean;
}

export function TravelInterestsSelector({
  selectedInterests,
  onToggle,
  disabled = false,
}: TravelInterestsSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {TRAVEL_INTEREST_OPTIONS.map((option) => {
        const selected = selectedInterests.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            aria-pressed={selected}
            disabled={disabled}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 ${
              selected
                ? "bg-orange-500 border-orange-500 text-white"
                : "bg-white border-slate-300 text-slate-700 hover:border-orange-300 hover:text-orange-600"
            } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {t(option.labelKey, option.defaultLabel)}
          </button>
        );
      })}
    </div>
  );
}
