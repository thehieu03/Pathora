import type { SignalRNotification } from "@/types";
import type { RealtimeAction, RealtimeEntity, RealtimeEvent } from "@/types/realtime";

const mapTypeToEntity = (type?: number | string): RealtimeEntity => {
  const normalized = String(type ?? "");
  if (normalized === "1") return "order";
  if (normalized === "2") return "inventory";
  if (normalized === "3") return "coupon";
  if (normalized === "4") return "product";
  return "unknown";
};

const detectEntityFromData = (data: unknown): RealtimeEntity => {
  if (!data || typeof data !== "object") return "unknown";
  const source = data as Record<string, unknown>;
  if ("orderId" in source || "OrderId" in source) return "order";
  if ("couponId" in source || "code" in source) return "coupon";
  if ("inventoryId" in source || "locationId" in source) return "inventory";
  if ("productId" in source || "sku" in source) return "product";
  return "unknown";
};

const detectAction = (title?: string, message?: string): RealtimeAction => {
  const text = `${title ?? ""} ${message ?? ""}`.toLowerCase();
  if (text.includes("create")) return "created";
  if (text.includes("update")) return "updated";
  if (text.includes("delete")) return "deleted";
  if (text.includes("status")) return "status_changed";
  if (text.includes("refresh") || text.includes("reload")) return "refreshed";
  return "unknown";
};

export const normalizeRealtimeEvent = (
  notification: SignalRNotification
): RealtimeEvent => {
  const data =
    notification && typeof notification === "object"
      ? (notification as Record<string, unknown>).data
      : undefined;
  const mapped = mapTypeToEntity(notification.type);
  const inferred = detectEntityFromData(data);
  const entity = mapped !== "unknown" ? mapped : inferred;

  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    timestamp: notification.timestamp,
    entity,
    action: detectAction(notification.title, notification.message),
    data,
  };
};

