import { useState, useEffect } from 'react';
import { Notification, notificationsData } from '../data';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counter, setCounter] = useState(31295);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setNotifications([notificationsData[currentIndex]]);
      setTimeout(() => setNotifications([]), 6000);
      currentIndex = (currentIndex + 1) % notificationsData.length;
      setCounter(c => c + (Math.random() > 0.7 ? 1 : 0));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const dismissNotification = () => setNotifications([]);

  return { notifications, counter, dismissNotification };
}
