// Tour detail types matching backend DTOs

export interface ImageDto {
  fileId: string | null;
  originalFileName: string | null;
  fileName: string | null;
  publicURL: string | null;
}

export interface TourPlanLocationDto {
  id: string;
  locationName: string;
  locationDescription: string | null;
  locationType: number;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  entranceFee: number | null;
  openingHours: string | null;
  closingHours: string | null;
  estimatedDurationMinutes: number | null;
  note: string | null;
}

export interface TourPlanRouteDto {
  id: string;
  order: number;
  transportationType: number;
  transportationName: string | null;
  transportationNote: string | null;
  fromLocation: TourPlanLocationDto | null;
  toLocation: TourPlanLocationDto | null;
  estimatedDepartureTime: string | null;
  estimatedArrivalTime: string | null;
  durationMinutes: number | null;
  distanceKm: number | null;
  price: number | null;
  bookingReference: string | null;
  note: string | null;
}

export interface TourPlanAccommodationDto {
  id: string;
  accommodationName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  roomType: number;
  roomCapacity: number;
  roomPrice: number | null;
  numberOfRooms: number | null;
  numberOfNights: number | null;
  totalPrice: number | null;
  mealsIncluded: number;
  specialRequest: string | null;
  address: string | null;
  city: string | null;
  contactPhone: string | null;
  website: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  note: string | null;
}

export interface TourDayActivityDto {
  id: string;
  tourDayId: string;
  order: number;
  activityType: number;
  title: string;
  description: string | null;
  note: string | null;
  estimatedCost: number | null;
  isOptional: boolean;
  startTime: string | null;
  endTime: string | null;
  routes: TourPlanRouteDto[];
  accommodation: TourPlanAccommodationDto | null;
}

export interface TourDayDto {
  id: string;
  classificationId: string;
  dayNumber: number;
  title: string;
  description: string | null;
  activities: TourDayActivityDto[];
}

export interface TourInsuranceDto {
  id: string;
  insuranceName: string;
  insuranceType: number;
  insuranceProvider: string;
  coverageDescription: string;
  coverageAmount: number;
  coverageFee: number;
  isOptional: boolean;
  note: string | null;
}

export interface TourClassificationDto {
  id: string;
  tourId: string;
  name: string;
  price: number;
  salePrice: number;
  description: string;
  durationDays: number;
  plans: TourDayDto[];
  insurances: TourInsuranceDto[];
}

export interface TourDto {
  id: string;
  tourCode: string;
  tourName: string;
  shortDescription: string;
  longDescription: string;
  status: number;
  seoTitle: string | null;
  seoDescription: string | null;
  isDeleted: boolean;
  thumbnail: ImageDto;
  images: ImageDto[];
  classifications: TourClassificationDto[];
  translations?: Record<string, TourTranslationData>;
  createdBy: string | null;
  createdOnUtc: string;
  lastModifiedBy: string | null;
  lastModifiedOnUtc: string | null;
}

export interface TourTranslationData {
  tourName: string;
  shortDescription: string;
  longDescription: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

// Tour admin list view model
export interface TourVm {
  id: string;
  tourCode: string;
  tourName: string;
  shortDescription: string;
  status: string;
  createdOnUtc: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  total: number;
  data: T[];
}

// Enum maps for display
export const TourStatusMap: Record<number, string> = {
  1: "Active",
  2: "Inactive",
  3: "Pending",
  4: "Rejected",
};

export const ActivityTypeMap: Record<number, string> = {
  0: "Sightseeing",
  1: "Dining",
  2: "Shopping",
  3: "Adventure",
  4: "Relaxation",
  5: "Cultural",
  6: "Entertainment",
  7: "Transportation",
  8: "Accommodation",
  9: "Free Time",
  99: "Other",
};

export const TransportationTypeMap: Record<number, string> = {
  0: "Walking",
  1: "Bus",
  2: "Train",
  3: "Flight",
  4: "Boat",
  5: "Car",
  6: "Bicycle",
  7: "Motorbike",
  8: "Taxi",
  99: "Other",
};

export const RoomTypeMap: Record<number, string> = {
  0: "Single",
  1: "Double",
  2: "Twin",
  3: "Suite",
  4: "Family",
  5: "Dormitory",
  99: "Other",
};

export const MealTypeMap: Record<number, string> = {
  0: "None",
  1: "Breakfast",
  2: "Lunch",
  3: "Dinner",
  4: "All Inclusive",
};

export const InsuranceTypeMap: Record<number, string> = {
  0: "None",
  1: "Travel",
  2: "Health",
  3: "Trip Cancellation",
  4: "Baggage Loss",
  5: "Personal Liability",
  6: "Adventure Sports",
};

export const LocationTypeMap: Record<number, string> = {
  0: "City",
  1: "Historical Site",
  2: "Natural Wonder",
  3: "Temple/University",
  4: "Beach",
  5: "Museum",
  6: "Market",
  7: "Restaurant",
  8: "Hotel",
  9: "Airport",
  10: "Train Station",
  11: "Bus Station",
  12: "Port",
  99: "Other",
};

// ── Tour Instance Types ────────────────────────────────────────

export interface TourInstanceVm {
  id: string;
  tourId: string;
  tourName: string;
  tourCode: string;
  classificationName: string;
  location: string;
  thumbnail: ImageDto | null;
  startDate: string;
  endDate: string;
  durationDays: number;
  registeredParticipants: number;
  maxParticipants: number;
  minParticipants: number;
  price: number;
  status: string;
  instanceType: string;
}

export interface TourInstanceGuideDto {
  name: string;
  avatarUrl: string | null;
  languages: string[];
  experience: string;
}

export interface DynamicPricingDto {
  minParticipants: number;
  maxParticipants: number;
  pricePerPerson: number;
}

export interface TourInstanceDto {
  id: string;
  tourId: string;
  tourName: string;
  tourCode: string;
  classificationId: string;
  classificationName: string;
  location: string;
  thumbnail: ImageDto | null;
  startDate: string;
  endDate: string;
  durationDays: number;
  registeredParticipants: number;
  maxParticipants: number;
  minParticipants: number;
  price: number;
  salePrice: number;
  status: string;
  instanceType: string;
  category: string;
  rating: number;
  totalBookings: number;
  revenue: number;
  confirmationDeadline: string | null;
  guide: TourInstanceGuideDto | null;
  includedServices: string[];
  dynamicPricing: DynamicPricingDto[];
}

export interface TourInstanceStats {
  totalInstances: number;
  available: number;
  confirmed: number;
  soldOut: number;
}

export const TourInstanceStatusMap: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  available: { label: "Available", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  confirmed: { label: "Confirmed", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  sold_out: { label: "Sold Out", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  cancelled: { label: "Cancelled", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  completed: { label: "Completed", bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
};
