export type TourDiscoveryView = "tours" | "instances";

export interface TourDiscoveryFilters {
  destination: string;
  classification: string;
  date: string;
  people: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  minDays: number | null;
  maxDays: number | null;
  page: number;
  view: TourDiscoveryView;
}

export const DEFAULT_TOUR_DISCOVERY_FILTERS: TourDiscoveryFilters = {
  destination: "",
  classification: "",
  date: "",
  people: null,
  minPrice: null,
  maxPrice: null,
  minDays: null,
  maxDays: null,
  page: 1,
  view: "tours",
};

type SearchParamReader = {
  get: (name: string) => string | null;
};

const parseIntParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const toPositivePage = (page: number | null): number => {
  if (!page || page < 1) {
    return 1;
  }

  return page;
};

const toView = (value: string | null): TourDiscoveryView => {
  if (value === "instances") {
    return "instances";
  }

  return "tours";
};

export const parseTourDiscoveryFilters = (
  params: SearchParamReader,
): TourDiscoveryFilters => {
  const destination =
    params.get("destination")?.trim() ?? params.get("q")?.trim() ?? "";
  const classification = params.get("classification")?.trim() ?? "";
  const date = params.get("date")?.trim() ?? "";

  const tab = params.get("tab")?.trim();
  const explicitView = params.get("view")?.trim();
  const view =
    tab === "scheduled" && !explicitView
      ? "instances"
      : toView(explicitView);

  return {
    destination,
    classification,
    date,
    people: parseIntParam(params.get("people")),
    minPrice: parseIntParam(params.get("minPrice")),
    maxPrice: parseIntParam(params.get("maxPrice")),
    minDays: parseIntParam(params.get("minDays")),
    maxDays: parseIntParam(params.get("maxDays")),
    page: toPositivePage(parseIntParam(params.get("page"))),
    view,
  };
};

const setNumberParam = (params: URLSearchParams, key: string, value: number | null) => {
  if (value !== null) {
    params.set(key, value.toString());
  }
};

export const buildTourDiscoverySearchParams = (
  filters: TourDiscoveryFilters,
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.destination.trim()) {
    params.set("destination", filters.destination.trim());
  }
  if (filters.classification.trim()) {
    params.set("classification", filters.classification.trim());
  }
  if (filters.date.trim()) {
    params.set("date", filters.date.trim());
  }

  setNumberParam(params, "people", filters.people);
  setNumberParam(params, "minPrice", filters.minPrice);
  setNumberParam(params, "maxPrice", filters.maxPrice);
  setNumberParam(params, "minDays", filters.minDays);
  setNumberParam(params, "maxDays", filters.maxDays);

  if (filters.page > 1) {
    params.set("page", filters.page.toString());
  }
  if (filters.view !== "tours") {
    params.set("view", filters.view);
  }

  return params;
};

export const areTourDiscoveryFiltersEqual = (
  a: TourDiscoveryFilters,
  b: TourDiscoveryFilters,
): boolean => {
  return (
    a.destination === b.destination &&
    a.classification === b.classification &&
    a.date === b.date &&
    a.people === b.people &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice &&
    a.minDays === b.minDays &&
    a.maxDays === b.maxDays &&
    a.page === b.page &&
    a.view === b.view
  );
};
