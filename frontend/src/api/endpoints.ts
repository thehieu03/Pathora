// Centralized API endpoint definitions
// All URLs are relative to API_GATEWAY_BASE_URL (configured in apiGateway.ts)

const BASE = "";

// ── Shared root paths ─────────────────────────────────────────────────────────
const TOUR_ROOT = `${BASE}/api/tours`;
const POLICY_ROOT = `${BASE}/api/policies`;

// ── Tour endpoints ──────────────────────────────────────────────────────────
const TOUR = {
  ROOT: TOUR_ROOT,
  GET_ALL: (params?: {
    searchText?: string;
    page?: number;
    pageSize?: number;
    lang?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params?.searchText) sp.set("searchText", params.searchText);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
    if (params?.lang) sp.set("lang", params.lang);
    const qs = sp.toString();
    return `${TOUR.ROOT}${qs ? `?${qs}` : ""}`;
  },
  GET_DETAIL: (id: string) => `${TOUR.ROOT}/${id}`,
  CREATE: TOUR_ROOT,
  UPDATE: TOUR_ROOT,
  DELETE: (id: string) => `${TOUR.ROOT}/${id}`,
  GET_CLASSIFICATION_PRICING_TIERS: (classificationId: string) =>
    `${TOUR.ROOT}/classifications/${classificationId}/pricing-tiers`,
  UPSERT_CLASSIFICATION_PRICING_TIERS: (classificationId: string) =>
    `${TOUR.ROOT}/classifications/${classificationId}/pricing-tiers`,
};

// ── Public home endpoints ───────────────────────────────────────────────────
const PUBLIC_TOURS_ROOT = `${BASE}/api/public/tours`;

const PUBLIC_HOME = {
  GET_ALL_TOURS: (params: {
    searchText?: string;
    page?: number;
    pageSize?: number;
    lang?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params.searchText) sp.set("searchText", params.searchText);
    if (params.page) sp.set("page", String(params.page));
    if (params.pageSize) sp.set("pageSize", String(params.pageSize));
    if (params.lang) sp.set("lang", params.lang);
    return `${PUBLIC_TOURS_ROOT}?${sp.toString()}`;
  },
  GET_TOUR_DETAIL: (id: string) => `${PUBLIC_TOURS_ROOT}/${id}`,
};

// ── Policy endpoints ─────────────────────────────────────────────────────────
const POLICY = {
  ROOT: POLICY_ROOT,
  GET_ALL: (params?: { type?: string; isActive?: boolean }) => {
    const sp = new URLSearchParams();
    if (params?.type) sp.set("type", params.type);
    if (params?.isActive !== undefined) sp.set("isActive", String(params.isActive));
    const qs = sp.toString();
    return `${POLICY.ROOT}${qs ? `?${qs}` : ""}`;
  },
  GET_DETAIL: (id: string) => `${POLICY.ROOT}/${id}`,
  CREATE: POLICY_ROOT,
  UPDATE: (id: string) => `${POLICY.ROOT}/${id}`,
  DELETE: (id: string) => `${POLICY.ROOT}/${id}`,
};

// ── Export ───────────────────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  TOUR,
  PUBLIC_HOME,
  POLICY,
};
