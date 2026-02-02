import { useEffect, useState } from 'react';
import { Check, Trash2, Bell, BellOff, Settings } from 'lucide-react';
import { useNotificationStore } from '../../store';
import { generateMockNotifications } from '../../utils/mockData';
import { formatRelativeTime } from '../../utils/formatters';
import { NOTIFICATION_ICONS } from '../../types';
import { Card, CardHeader, CardTitle, Button, EmptyState, Badge } from '../../components/ui';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Load mock notifications
    const mockNotifs = generateMockNotifications('tenant-1', 20);
    setNotifications(mockNotifs);
  }, []);

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifiche</h1>
          <p className="text-text-secondary">
            {unreadCount > 0 ? `${unreadCount} non lette` : 'Tutte lette'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllAsRead} leftIcon={<Check size={16} />}>
              Segna tutte come lette
            </Button>
          )}
          <Button variant="ghost" size="sm" leftIcon={<Settings size={16} />}>
            Impostazioni
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-background-secondary rounded-xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary'
          }`}
        >
          Tutte
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === 'unread' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary'
          }`}
        >
          Non lette
          {unreadCount > 0 && (
            <Badge variant="primary" size="sm">{unreadCount}</Badge>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <Card padding="none" className="divide-y divide-border">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 hover:bg-background-secondary transition-colors ${
                !notification.isRead ? 'bg-primary-50/50' : ''
              }`}
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  !notification.isRead ? 'bg-primary-100' : 'bg-background-secondary'
                }`}
              >
                {NOTIFICATION_ICONS[notification.type] || '📢'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`${!notification.isRead ? 'font-medium' : ''} text-text-primary`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-text-muted mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex gap-1">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 rounded-lg hover:bg-white text-text-muted hover:text-primary-500"
                    title="Segna come letta"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 rounded-lg hover:bg-white text-text-muted hover:text-error"
                  title="Elimina"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState
          icon={filter === 'unread' ? '✅' : '🔔'}
          title={filter === 'unread' ? 'Nessuna notifica non letta' : 'Nessuna notifica'}
          description={
            filter === 'unread'
              ? 'Hai letto tutte le notifiche!'
              : 'Le notifiche appariranno qui'
          }
        />
      )}
    </div>
  );
}
