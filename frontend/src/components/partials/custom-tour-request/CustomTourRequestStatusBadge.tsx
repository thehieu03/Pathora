import { useTranslation } from "react-i18next";

import { STATUS_STYLE_MAP } from "./constants";
import type { CustomTourRequestStatus } from "@/types/customTourRequest";

interface CustomTourRequestStatusBadgeProps {
  status: CustomTourRequestStatus;
}

export function CustomTourRequestStatusBadge({
  status,
}: CustomTourRequestStatusBadgeProps) {
  const { t } = useTranslation();
  const config = STATUS_STYLE_MAP[status] ?? STATUS_STYLE_MAP.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.badge}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} aria-hidden="true" />
      {t(config.labelKey, config.defaultLabel)}
    </span>
  );
}
