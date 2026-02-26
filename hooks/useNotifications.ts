import { useState, useEffect } from 'react';
import { Notification, notificationsData } from '../data';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counter, setCounter] = useState(31295);

  useEffect(() => {
    // Notifiche pop-up temporaneamente disabilitate
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  const dismissNotification = () => setNotifications([]);

  return { notifications, counter, dismissNotification };
}
