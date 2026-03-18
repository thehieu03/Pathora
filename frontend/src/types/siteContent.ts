export interface SiteContentAdminListItem {
  id: string;
  pageKey: string;
  contentKey: string;
  isLocalized: boolean;
  hasEnglish: boolean;
  hasVietnamese: boolean;
  lastModifiedOnUtc: string | null;
  lastModifiedBy: string | null;
  createdOnUtc: string;
  createdBy: string | null;
}

export interface SiteContentAdminDetailItem extends SiteContentAdminListItem {
  englishContentValue: string;
  vietnameseContentValue: string;
}

export interface UpdateAdminSiteContentRequest {
  englishContentValue: string;
  vietnameseContentValue: string;
}
