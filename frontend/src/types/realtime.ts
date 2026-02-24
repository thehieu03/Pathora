export type RealtimeEntity =
  | "order"
  | "product"
  | "inventory"
  | "coupon"
  | "dashboard"
  | "unknown";

export type RealtimeAction =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "refreshed"
  | "unknown";

export interface RealtimeEvent<T = unknown> {
  id?: string;
  title?: string;
  message?: string;
  type?: number | string;
  timestamp?: string;
  entity: RealtimeEntity;
  action: RealtimeAction;
  data?: T;
}

export interface RealtimeRefreshOptions {
  key: string;
  entity: RealtimeEntity;
  onRefresh: () => Promise<void> | void;
  showToast?: boolean;
}

