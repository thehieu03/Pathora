export interface AdminDashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeTours: number;
  totalCustomers: number;
  cancellationRate: number;
  visaApprovalRate: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  totalBookings: number;
  totalSpent: number;
  status: string;
  lastBooking: string;
}

export interface AdminPayment {
  id: string;
  booking: string;
  customer: string;
  method: string;
  amount: number;
  status: string;
  date: string;
}

export interface AdminInsurance {
  id: string;
  booking: string;
  customer: string;
  type: string;
  coverage: string;
  premium: number;
  status: string;
  startDate: string;
  endDate: string;
}

export interface AdminVisaApplication {
  id: string;
  booking: string;
  applicant: string;
  passport: string;
  country: string;
  type: string;
  status: string;
  submittedDate: string;
  decisionDate: string;
}

export interface AdminOverview {
  stats: AdminDashboardStats;
  customers: AdminCustomer[];
  payments: AdminPayment[];
  insurances: AdminInsurance[];
  visaApplications: AdminVisaApplication[];
}

export interface AdminDashboardMetricPoint {
  label: string;
  value: number;
}

export interface AdminDashboardCategoryMetric {
  label: string;
  value: number;
}

export interface AdminDashboardTopTour {
  name: string;
  bookings: number;
  revenue: number;
}

export interface AdminDashboardVisaStatus {
  label: string;
  count: number;
}

export interface AdminDashboardVisaDeadline {
  tour: string;
  date: string;
}

export interface AdminDashboardVisaSummary {
  totalApplications: number;
  approved: number;
  rejected: number;
  approvalRate: number;
}

export interface AdminDashboardAlert {
  text: string;
  severity: string;
}

export interface AdminDashboard {
  stats: AdminDashboardStats;
  revenueOverTime: AdminDashboardMetricPoint[];
  revenueByTourType: AdminDashboardCategoryMetric[];
  revenueByRegion: AdminDashboardCategoryMetric[];
  bookingStatusDistribution: AdminDashboardCategoryMetric[];
  bookingTrend: AdminDashboardMetricPoint[];
  topTours: AdminDashboardTopTour[];
  topDestinations: AdminDashboardCategoryMetric[];
  customerGrowth: AdminDashboardMetricPoint[];
  customerNationalities: AdminDashboardCategoryMetric[];
  visaStatuses: AdminDashboardVisaStatus[];
  upcomingVisaDeadlines: AdminDashboardVisaDeadline[];
  visaSummary: AdminDashboardVisaSummary;
  alerts: AdminDashboardAlert[];
}
