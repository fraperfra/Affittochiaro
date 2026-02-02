export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  metadata?: Record<string, unknown>;
}

export type NotificationType =
  | 'profile_view'
  | 'new_match'
  | 'application_received'
  | 'application_accepted'
  | 'application_rejected'
  | 'document_verified'
  | 'document_rejected'
  | 'new_listing'
  | 'listing_expired'
  | 'credit_low'
  | 'credit_purchased'
  | 'plan_upgrade'
  | 'plan_expiring'
  | 'system_message'
  | 'welcome';

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  profile_view: '👁️',
  new_match: '⭐',
  application_received: '📩',
  application_accepted: '✅',
  application_rejected: '❌',
  document_verified: '✓',
  document_rejected: '⚠️',
  new_listing: '🏠',
  listing_expired: '⏰',
  credit_low: '💳',
  credit_purchased: '💰',
  plan_upgrade: '🚀',
  plan_expiring: '📅',
  system_message: '📢',
  welcome: '👋',
};

export interface NotificationPreferences {
  email: {
    profileViews: boolean;
    newMatches: boolean;
    applications: boolean;
    documents: boolean;
    marketing: boolean;
  };
  push: {
    profileViews: boolean;
    newMatches: boolean;
    applications: boolean;
    documents: boolean;
  };
}
