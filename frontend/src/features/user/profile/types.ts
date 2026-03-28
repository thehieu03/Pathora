export type ProfileTabType = "profile" | "password" | "settings";

export interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  address: string;
  avatar: string;
}

export interface AvatarState {
  isLoading: boolean;
  isValid: boolean;
  error: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  newsletter: true,
};

export const VIETNAM_PHONE_REGEX = /^(\+84|84|0)[1-9]\d{8}$/;
