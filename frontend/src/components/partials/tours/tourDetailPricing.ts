import type { TourClassificationDto } from "@/types/tour";

function toSafeNumber(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function getClassificationDays(
  classification?: Partial<TourClassificationDto> | null,
): number {
  return toSafeNumber(
    classification?.numberOfDay ?? classification?.durationDays,
  );
}

export function getClassificationNights(
  classification?: Partial<TourClassificationDto> | null,
): number {
  const explicitNights = classification?.numberOfNight;
  if (typeof explicitNights === "number" && Number.isFinite(explicitNights)) {
    return Math.max(0, explicitNights);
  }

  const days = getClassificationDays(classification);
  return days > 0 ? Math.max(0, days - 1) : 0;
}

export function getAdultPrice(
  classification?: Partial<TourClassificationDto> | null,
): number {
  return toSafeNumber(
    classification?.adultPrice ?? classification?.salePrice ?? classification?.price,
  );
}

export function getChildPrice(
  classification?: Partial<TourClassificationDto> | null,
): number {
  const childPrice = classification?.childPrice;
  if (typeof childPrice === "number" && Number.isFinite(childPrice)) {
    return Math.max(0, childPrice);
  }

  return getAdultPrice(classification);
}

export function getInfantPrice(
  classification?: Partial<TourClassificationDto> | null,
): number {
  const infantPrice = classification?.infantPrice;
  if (typeof infantPrice === "number" && Number.isFinite(infantPrice)) {
    return Math.max(0, infantPrice);
  }

  return 0;
}

export function getOriginalPackagePrice(
  classification?: Partial<TourClassificationDto> | null,
): number {
  const oldPrice = toSafeNumber(classification?.price);
  const displayPrice = getAdultPrice(classification);

  return oldPrice > displayPrice ? oldPrice : 0;
}
