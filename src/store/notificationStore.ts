import { create } from 'zustand';
import { Notification, NotificationPreferences } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isLoading: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  setPreferences: (preferences: NotificationPreferences) => void;
  setLoading: (loading: boolean) => void;
}

const defaultPreferences: NotificationPreferences = {
  email: {
    profileViews: true,
    newMatches: true,
    applications: true,
    documents: true,
    marketing: false,
  },
  push: {
    profileViews: true,
    newMatches: true,
    applications: true,
    documents: true,
  },
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  preferences: defaultPreferences,
  isLoading: false,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    }));
  },

  markAsRead: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === notificationId);
      if (!notification || notification.isRead) return state;

      return {
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date(),
      })),
      unreadCount: 0,
    }));
  },

  deleteNotification: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === notificationId);
      return {
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount: notification && !notification.isRead
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  setPreferences: (preferences) => {
    set({ preferences });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));
