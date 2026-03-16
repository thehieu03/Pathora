/**
 * API Endpoints Configuration
 * All endpoints are relative to NEXT_PUBLIC_API_GATEWAY base URL
 */

// Type for endpoint functions that take an ID parameter
export type EndpointWithId = (id: string) => string;

// Type for endpoint functions that take an order number parameter
export type EndpointWithOrderNo = (orderNo: string) => string;

// Catalog Service Endpoints Interface
export interface CatalogEndpoints {
  GET_PRODUCTS: string;
  GET_ALL_PRODUCTS: string;
  GET_PRODUCT_DETAIL: EndpointWithId;
  CREATE_PRODUCT: string;
  UPDATE_PRODUCT: EndpointWithId;
  DELETE_PRODUCT: EndpointWithId;
  PUBLISH_PRODUCT: EndpointWithId;
  UNPUBLISH_PRODUCT: EndpointWithId;
  GET_CATEGORIES: string;
  GET_CATEGORY_TREE: string;
  GET_CATEGORY_DETAIL: EndpointWithId;
  CREATE_CATEGORY: string;
  UPDATE_CATEGORY: EndpointWithId;
  DELETE_CATEGORY: EndpointWithId;
  GET_BRANDS: string;
  GET_BRAND_DETAIL: EndpointWithId;
  CREATE_BRAND: string;
  UPDATE_BRAND: EndpointWithId;
  DELETE_BRAND: EndpointWithId;
}

// Inventory Service Endpoints Interface
export interface InventoryEndpoints {
  GET_LIST: string;
  GET_ALL: string;
  GET_DETAIL: EndpointWithId;
  CREATE: string;
  UPDATE: EndpointWithId;
  DELETE: EndpointWithId;
  INCREASE_STOCK: EndpointWithId;
  DECREASE_STOCK: EndpointWithId;
  GET_LOCATIONS: string;
  GET_LOCATION: EndpointWithId;
  CREATE_LOCATION: string;
  UPDATE_LOCATION: EndpointWithId;
  DELETE_LOCATION: EndpointWithId;
  GET_HISTORIES: string;
  GET_ALL_RESERVATIONS: string;
}

// Discount Service Endpoints Interface
export interface DiscountEndpoints {
  GET_LIST: string;
  GET_ALL_COUPONS: string;
  GET_DETAIL: EndpointWithId;
  CREATE: string;
  UPDATE: EndpointWithId;
  DELETE: EndpointWithId;
  APPROVE_COUPON: EndpointWithId;
  REJECT_COUPON: EndpointWithId;
  UPDATE_VALIDITY_PERIOD: EndpointWithId;
  VALIDATE: string;
  APPLY: string;
}

// Order Service Endpoints Interface
export interface OrderEndpoints {
  GET_LIST: string;
  GET_ALL: string;
  GET_DETAIL: EndpointWithId;
  CREATE: string;
  UPDATE: EndpointWithId;
  UPDATE_STATUS: EndpointWithId;
  GET_BY_ORDER_NO: EndpointWithOrderNo;
  GET_BY_CURRENT_USER: string;
}

// Report Service Endpoints Interface
export interface ReportEndpoints {
  DASHBOARD_STATISTICS: string;
  ORDER_GROWTH_LINE_CHART: string;
  TOP_PRODUCT_PIE_CHART: string;
}

// Notification Service Endpoints Interface
export interface NotificationEndpoints {
  GET_LIST: string;
  MARK_AS_READ: string;
  GET_ALL: string;
  GET_COUNT_UNREAD: string;
  GET_TOP_10_UNREAD: string;
}

// Payment Service Endpoints Interface
export interface PaymentEndpoints {
  GET_QR: string;
  CREATE_TRANSACTION: string;
  GET_TRANSACTION: (code: string) => string;
  EXPIRE_TRANSACTION: (code: string) => string;
}

// Communication Service Endpoints Interface
export interface CommunicationEndpoints {
  NOTIFICATION_HUB: string;
}

// Auth Endpoints Interface
export interface AuthEndpoints {
  LOGIN: string;
  REGISTER: string;
  REFRESH: string;
  LOGOUT: string;
  GET_ME: string;
  GET_TABS: string;
  GOOGLE_LOGIN: string;
}

// Public Home Endpoints Interface
export interface PublicHomeEndpoints {
  GET_FEATURED_TOURS: (limit?: number) => string;
  GET_LATEST_TOURS: (limit?: number) => string;
  GET_TRENDING_DESTINATIONS: (limit?: number) => string;
  GET_TOP_ATTRACTIONS: (limit?: number) => string;
  GET_HOME_STATS: string;
  GET_TOP_REVIEWS: (limit?: number) => string;
  GET_ALL_TOURS: (params?: { searchText?: string; page?: number; pageSize?: number; lang?: string }) => string;
  SEARCH_TOURS: (params?: SearchToursParams) => string;
  GET_DESTINATIONS: string;
  GET_TOUR_DETAIL: EndpointWithId;
}

export interface SearchToursParams {
  q?: string;
  destination?: string;
  classification?: string;
  date?: string;
  people?: number;
  minPrice?: number;
  maxPrice?: number;
  minDays?: number;
  maxDays?: number;
  page?: number;
  pageSize?: number;
}

// Tour Admin Endpoints Interface
export interface TourEndpoints {
  GET_ALL: string;
  GET_DETAIL: EndpointWithId;
  GET_CLASSIFICATION_PRICING_TIERS: EndpointWithId;
  CREATE: string;
  UPDATE: string;
  DELETE: EndpointWithId;
  UPSERT_CLASSIFICATION_PRICING_TIERS: EndpointWithId;
}

// Tour Instance Endpoints Interface
export interface TourInstanceEndpoints {
  GET_ALL: string;
  GET_DETAIL: EndpointWithId;
  GET_STATS: string;
  GET_PRICING_TIERS: EndpointWithId;
  CREATE: string;
  UPDATE: string;
  DELETE: EndpointWithId;
  CHANGE_STATUS: EndpointWithId;
  UPSERT_PRICING_TIERS: EndpointWithId;
  CLEAR_PRICING_TIERS: EndpointWithId;
  RESOLVE_PRICING: (id: string, participants: number) => string;
}

// Public Tour Instance Endpoints Interface
export interface PublicTourInstanceEndpoints {
  GET_AVAILABLE: string;
  GET_DETAIL: EndpointWithId;
  RESOLVE_PRICING: (id: string, participants: number) => string;
}

// Admin Endpoints Interface
export interface AdminEndpoints {
  GET_OVERVIEW: string;
  GET_DASHBOARD: string;
}

export interface TourRequestEndpoints {
  CREATE: string;
  MY: string;
  DETAIL: EndpointWithId;
  ADMIN_LIST: string;
  ADMIN_DETAIL: EndpointWithId;
  REVIEW: EndpointWithId;
}

// Main API Endpoints Interface
export interface ApiEndpoints {
  CATALOG: CatalogEndpoints;
  INVENTORY: InventoryEndpoints;
  DISCOUNT: DiscountEndpoints;
  ORDER: OrderEndpoints;
  REPORT: ReportEndpoints;
  NOTIFICATION: NotificationEndpoints;
  PAYMENT: PaymentEndpoints;
  COMMUNICATION: CommunicationEndpoints;
  AUTH: AuthEndpoints;
  PUBLIC_HOME: PublicHomeEndpoints;
  TOUR: TourEndpoints;
  TOUR_INSTANCE: TourInstanceEndpoints;
  PUBLIC_TOUR_INSTANCE: PublicTourInstanceEndpoints;
  ADMIN: AdminEndpoints;
  TOUR_REQUESTS: TourRequestEndpoints;
}

export const API_ENDPOINTS: ApiEndpoints = {
  // Catalog Service
  CATALOG: {
    GET_PRODUCTS: "/api/products",
    GET_ALL_PRODUCTS: "/api/products/all",
    GET_PRODUCT_DETAIL: (id: string): string => `/api/products/${id}`,
    CREATE_PRODUCT: "/api/products",
    UPDATE_PRODUCT: (id: string): string => `/api/products/${id}`,
    DELETE_PRODUCT: (id: string): string => `/api/products/${id}`,
    PUBLISH_PRODUCT: (id: string): string => `/api/products/${id}/publish`,
    UNPUBLISH_PRODUCT: (id: string): string => `/api/products/${id}/unpublish`,
    GET_CATEGORIES: "/api/categories",
    GET_CATEGORY_TREE: "/api/categories/tree",
    GET_CATEGORY_DETAIL: (id: string): string => `/api/categories/${id}`,
    CREATE_CATEGORY: "/api/categories",
    UPDATE_CATEGORY: (id: string): string => `/api/categories/${id}`,
    DELETE_CATEGORY: (id: string): string => `/api/categories/${id}`,
    GET_BRANDS: "/api/brands",
    GET_BRAND_DETAIL: (id: string): string => `/api/brands/${id}`,
    CREATE_BRAND: "/api/brands",
    UPDATE_BRAND: (id: string): string => `/api/brands/${id}`,
    DELETE_BRAND: (id: string): string => `/api/brands/${id}`,
  },

  // Inventory Service
  INVENTORY: {
    GET_LIST: "/api/inventory-items",
    GET_ALL: "/api/inventory-items/all",
    GET_DETAIL: (id: string): string => `/api/inventory-items/${id}`,
    CREATE: "/api/inventory-items",
    UPDATE: (id: string): string => `/api/inventory-items/${id}`,
    DELETE: (id: string): string => `/api/inventory-items/${id}`,
    INCREASE_STOCK: (id: string): string =>
      `/api/inventory-items/${id}/stock/increase`,
    DECREASE_STOCK: (id: string): string =>
      `/api/inventory-items/${id}/stock/decrease`,
    GET_LOCATIONS: "/api/locations",
    GET_LOCATION: (id: string): string => `/api/locations/${id}`,
    CREATE_LOCATION: "/api/locations",
    UPDATE_LOCATION: (id: string): string => `/api/locations/${id}`,
    DELETE_LOCATION: (id: string): string => `/api/locations/${id}`,
    GET_HISTORIES: "/api/histories",
    GET_ALL_RESERVATIONS: "/api/reservations/all",
  },

  // Discount Service
  DISCOUNT: {
    GET_LIST: "/api/coupons",
    GET_ALL_COUPONS: "/api/coupons/all",
    GET_DETAIL: (id: string): string => `/api/coupons/${id}`,
    CREATE: "/api/coupons",
    UPDATE: (id: string): string => `/api/coupons/${id}`,
    DELETE: (id: string): string => `/api/coupons/${id}`,
    APPROVE_COUPON: (id: string): string => `/api/coupons/${id}/approve`,
    REJECT_COUPON: (id: string): string => `/api/coupons/${id}/reject`,
    UPDATE_VALIDITY_PERIOD: (id: string): string => `/api/coupons/${id}/validity-period`,
    VALIDATE: "/api/coupons/validate",
    APPLY: "/api/coupons/apply",
  },

  // Order Service
  ORDER: {
    GET_LIST: "/api/orders",
    GET_ALL: "/api/orders/all",
    GET_DETAIL: (id: string): string => `/api/orders/${id}`,
    CREATE: "/api/orders",
    UPDATE: (id: string): string => `/api/orders/${id}`,
    UPDATE_STATUS: (id: string): string => `/api/orders/${id}/status`,
    GET_BY_ORDER_NO: (orderNo: string): string => `/api/orders/order-no/${orderNo}`,
    GET_BY_CURRENT_USER: "/api/orders/me",
  },

  // Report Service
  REPORT: {
    DASHBOARD_STATISTICS: "/api/dashboard/statistics",
    ORDER_GROWTH_LINE_CHART: "/api/dashboard/revenue-chart",
    TOP_PRODUCT_PIE_CHART: "/api/dashboard/top-products",
  },

  // Notification Service
  NOTIFICATION: {
    GET_LIST: "/api/notifications",
    MARK_AS_READ: "/api/notifications/read",
    GET_ALL: "/api/notifications/all",
    GET_COUNT_UNREAD: "/api/notifications/unread/count",
    GET_TOP_10_UNREAD: "/api/notifications/unread/top10",
  },

  // Payment Service
  PAYMENT: {
    GET_QR: "/api/payment/getQR",
    CREATE_TRANSACTION: "/api/payment/create-transaction",
    GET_TRANSACTION: (code: string): string => `/api/payment/transaction/${code}`,
    EXPIRE_TRANSACTION: (code: string): string => `/api/payment/transaction/${code}/expire`,
  },

  // Communication Service
  COMMUNICATION: {
    NOTIFICATION_HUB: "/hubs/notifications",
  },

  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
    GET_ME: "/api/auth/me",
    GET_TABS: "/api/auth/tabs",
    GOOGLE_LOGIN: "/api/auth/google-login",
  },

  // Public Home
  PUBLIC_HOME: {
    GET_FEATURED_TOURS: (limit = 8): string => `/api/public/tours/featured?limit=${limit}`,
    GET_LATEST_TOURS: (limit = 6): string => `/api/public/tours/latest?limit=${limit}`,
    GET_TRENDING_DESTINATIONS: (limit = 6): string => `/api/public/destinations/trending?limit=${limit}`,
    GET_TOP_ATTRACTIONS: (limit = 8): string => `/api/public/attractions/top?limit=${limit}`,
    GET_HOME_STATS: "/api/public/stats",
    GET_TOP_REVIEWS: (limit = 6): string => `/api/public/reviews/top?limit=${limit}`,
    GET_ALL_TOURS: (params?: { searchText?: string; page?: number; pageSize?: number; lang?: string }): string => {
      const url = new URLSearchParams();
      if (params?.searchText) url.append("searchText", params.searchText);
      if (params?.page) url.append("pageNumber", params.page.toString());
      if (params?.pageSize) url.append("pageSize", params.pageSize.toString());
      if (params?.lang) url.append("lang", params.lang);
      return `/api/public/tours?${url.toString()}`;
    },
    SEARCH_TOURS: (params?: SearchToursParams): string => {
      const url = new URLSearchParams();
      if (params?.q) url.append("q", params.q);
      if (params?.destination) url.append("destination", params.destination);
      if (params?.classification) url.append("classification", params.classification);
      if (params?.date) url.append("date", params.date);
      if (params?.people) url.append("people", params.people.toString());
      if (params?.minPrice !== undefined) url.append("minPrice", params.minPrice.toString());
      if (params?.maxPrice !== undefined) url.append("maxPrice", params.maxPrice.toString());
      if (params?.minDays !== undefined) url.append("minDays", params.minDays.toString());
      if (params?.maxDays !== undefined) url.append("maxDays", params.maxDays.toString());
      if (params?.page) url.append("page", params.page.toString());
      if (params?.pageSize) url.append("pageSize", params.pageSize.toString());
      return `/api/public/tours/search?${url.toString()}`;
    },
    GET_DESTINATIONS: "/api/public/destinations",
    GET_TOUR_DETAIL: (id: string): string => `/api/public/tours/${id}`,
  },

  // Tour Admin
  TOUR: {
    GET_ALL: "/api/tour",
    GET_DETAIL: (id: string): string => `/api/tour/${id}`,
    GET_CLASSIFICATION_PRICING_TIERS: (classificationId: string): string =>
      `/api/tour/classifications/${classificationId}/pricing-tiers`,
    CREATE: "/api/tour",
    UPDATE: "/api/tour",
    DELETE: (id: string): string => `/api/tour/${id}`,
    UPSERT_CLASSIFICATION_PRICING_TIERS: (classificationId: string): string =>
      `/api/tour/classifications/${classificationId}/pricing-tiers`,
  },

  // Tour Instance
  TOUR_INSTANCE: {
    GET_ALL: "/api/tour-instance",
    GET_DETAIL: (id: string): string => `/api/tour-instance/${id}`,
    GET_STATS: "/api/tour-instance/stats",
    GET_PRICING_TIERS: (id: string): string =>
      `/api/tour-instance/${id}/pricing-tiers`,
    CREATE: "/api/tour-instance",
    UPDATE: "/api/tour-instance",
    DELETE: (id: string): string => `/api/tour-instance/${id}`,
    CHANGE_STATUS: (id: string): string => `/api/tour-instance/${id}/status`,
    UPSERT_PRICING_TIERS: (id: string): string =>
      `/api/tour-instance/${id}/pricing-tiers`,
    CLEAR_PRICING_TIERS: (id: string): string =>
      `/api/tour-instance/${id}/pricing-tiers/clear`,
    RESOLVE_PRICING: (id: string, participants: number): string =>
      `/api/tour-instance/${id}/pricing/resolve?participants=${participants}`,
  },

  // Public Tour Instance
  PUBLIC_TOUR_INSTANCE: {
    GET_AVAILABLE: "/api/public/tour-instances/available",
    GET_DETAIL: (id: string): string => `/api/public/tour-instances/${id}`,
    RESOLVE_PRICING: (id: string, participants: number): string =>
      `/api/public/tour-instances/${id}/pricing/resolve?participants=${participants}`,
  },

  // Admin
  ADMIN: {
    GET_OVERVIEW: "/api/admin/overview",
    GET_DASHBOARD: "/api/admin/dashboard",
  },

  TOUR_REQUESTS: {
    CREATE: "/api/public/tour-requests",
    MY: "/api/public/tour-requests/my",
    DETAIL: (id: string): string => `/api/public/tour-requests/${id}`,
    ADMIN_LIST: "/api/tour-requests",
    ADMIN_DETAIL: (id: string): string => `/api/tour-requests/${id}`,
    REVIEW: (id: string): string => `/api/tour-requests/${id}/review`,
  },
};

export default API_ENDPOINTS;
