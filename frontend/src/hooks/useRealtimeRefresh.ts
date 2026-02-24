"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import signalRService from "@/services/signalRService";
import type { RealtimeRefreshOptions } from "@/types/realtime";
import { normalizeRealtimeEvent } from "@/utils/realtime";

export const useRealtimeRefresh = ({
  key,
  entity,
  onRefresh,
  showToast = true,
}: RealtimeRefreshOptions): void => {
  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      try {
        await signalRService.connect();
        if (!isMounted) return;

        signalRService.onNotificationByKey(key, async (notification) => {
          const event = normalizeRealtimeEvent(notification);
          if (event.entity !== entity) return;

          if (showToast) {
            toast.info(event.title || `${entity} updated`, {
              position: "top-right",
              autoClose: 2500,
            });
          }

          await onRefresh();
        });
      } catch (error) {
        console.warn(`Realtime setup failed for ${key}:`, error);
      }
    };

    setup();

    return () => {
      isMounted = false;
      signalRService.offNotificationByKey(key);
    };
  }, [entity, key, onRefresh, showToast]);
};

export default useRealtimeRefresh;

