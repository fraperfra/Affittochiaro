import React from 'react';
import { Notification } from '../data';

interface LiveNotificationsProps {
  notifications: Notification[];
  onDismiss: () => void;
}

export const LiveNotifications: React.FC<LiveNotificationsProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-24 left-4 right-4 md:right-auto z-[300] md:w-full md:max-w-[340px]">
      {notifications.map(n => (
        <div key={n.id} className="bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] rounded-[1.8rem] p-4 md:p-5 border border-gray-100 flex items-start gap-4 animate-slide-up relative overflow-hidden group">
          <div className="relative shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-action-green/5 rounded-full flex items-center justify-center text-action-green font-bold text-xl shadow-inner">
              {n.name[0]}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-action-green border-[2.5px] md:border-3 border-white rounded-full"></div>
          </div>
          <div className="flex-grow pt-0.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-error-red animate-pulse"></span>
              <span className="text-[9px] md:text-[10px] font-black text-error-red uppercase tracking-[0.12em]">LIVE</span>
            </div>
            <div className="text-xs md:text-sm text-brand-green leading-tight mb-2">
              <span className="font-bold">{n.name}</span> {n.action}
            </div>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-wider font-bold">
              <span className="text-gray-300 font-medium lowercase italic">{n.time}</span>
              <span className="w-1 h-1 rounded-full bg-gray-200"></span>
              <span className="text-action-green">{n.location}</span>
            </div>
          </div>
          <button onClick={onDismiss} className="absolute top-4 right-4 text-gray-200 hover:text-gray-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
