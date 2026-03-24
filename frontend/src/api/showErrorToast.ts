import { toast } from "react-toastify";
import { toastConfig } from "./axiosInstance";
import i18n from "../i18n/config";

export const showErrorToast = (errorKey: string, details?: string): void => {
  // If errorKey contains spaces or sentences (not a translation key like "BAD_REQUEST"),
  // show it directly instead of trying to translate it.
  const isTranslationKey = /^[A-Z_]+$/.test(errorKey);

  if (isTranslationKey) {
    const translationKey = `error_response.${errorKey}`;
    const defaultKey = "error_response.DEFAULT_ERROR";

    const translatedMessage = i18n.exists(translationKey)
      ? i18n.t(translationKey)
      : i18n.t(defaultKey);

    const message = details
      ? `${translatedMessage}: ${details}`
      : translatedMessage;
    toast.error(message, toastConfig);
  } else {
    // Show raw message directly (e.g., "Unauthorized — please log in again")
    const message = details ? `${errorKey}: ${details}` : errorKey;
    toast.error(message, toastConfig);
  }
};
