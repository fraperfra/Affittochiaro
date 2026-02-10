import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  Search as SearchIcon,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Inbox,
  Users,
  Building2,
  Megaphone,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

interface TabItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  badgeKey?: 'messages' | 'applications';
}

interface BottomTabNavProps {
  userRole: 'tenant' | 'agency' | 'admin';
  badges?: { messages?: number; applications?: number };
}

const tenantTabs: TabItem[] = [
  { icon: Home, label: 'Home', href: ROUTES.TENANT_DASHBOARD },
  { icon: FolderOpen, label: 'Documenti', href: ROUTES.TENANT_DOCUMENTS },
  { icon: Megaphone, label: 'Annunci', href: ROUTES.TENANT_LISTINGS },
  { icon: MessageSquare, label: 'Messaggi', href: ROUTES.TENANT_MESSAGES, badgeKey: 'messages' },
  { icon: Settings, label: 'Impostazioni', href: ROUTES.TENANT_SETTINGS },
];

const agencyTabs: TabItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.AGENCY_DASHBOARD },
  { icon: Inbox, label: 'Candidature', href: ROUTES.AGENCY_APPLICATIONS, badgeKey: 'applications' },
  { icon: SearchIcon, label: 'Cerca', href: ROUTES.AGENCY_TENANTS },
  { icon: Megaphone, label: 'Annunci', href: ROUTES.AGENCY_LISTINGS },
  { icon: MessageSquare, label: 'Messaggi', href: ROUTES.AGENCY_MESSAGES, badgeKey: 'messages' },
  { icon: Settings, label: 'Impostazioni', href: ROUTES.AGENCY_SETTINGS },
];

const adminTabs: TabItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD },
  { icon: Users, label: 'Inquilini', href: ROUTES.ADMIN_TENANTS },
  { icon: Building2, label: 'Agenzie', href: ROUTES.ADMIN_AGENCIES },
  { icon: Megaphone, label: 'Annunci', href: ROUTES.ADMIN_LISTINGS },
  { icon: Settings, label: 'Sistema', href: ROUTES.ADMIN_SYSTEM },
];

const tabConfig: Record<string, TabItem[]> = {
  tenant: tenantTabs,
  agency: agencyTabs,
  admin: adminTabs,
};

const TabItemComponent = React.memo(function TabItemComponent({
  item,
  badge,
  isAgency,
}: {
  item: TabItem;
  badge?: number;
  isAgency: boolean;
}) {
  const location = useLocation();
  const Icon = item.icon;

  const isActive = useMemo(() => {
    const path = location.pathname;
    // Exact match for dashboard roots
    if (item.href === ROUTES.TENANT_DASHBOARD || item.href === ROUTES.AGENCY_DASHBOARD || item.href === ROUTES.ADMIN_DASHBOARD) {
      return path === item.href;
    }
    return path === item.href || path.startsWith(item.href + '/');
  }, [location.pathname, item.href]);

  return (
    <NavLink
      to={item.href}
      role="tab"
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative flex flex-col items-center justify-center
        ${isAgency ? 'px-1' : 'px-2'} py-2 min-w-0
        transition-all duration-150 ease-in-out
        active:scale-[0.92]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
        rounded-lg
      `}
      style={{ flex: 1 }}
    >
      <div className="relative">
        <Icon
          size={24}
          className={`transition-colors duration-150 ${
            isActive ? 'text-teal-500' : 'text-gray-400'
          }`}
        />
        {badge !== undefined && badge > 0 && (
          <span
            className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full"
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <span
        className={`mt-1 text-[11px] leading-tight truncate max-w-full transition-colors duration-150 tracking-[0.01em] ${
          isActive
            ? 'text-teal-500 font-semibold'
            : 'text-gray-500 font-normal'
        }`}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {item.label}
      </span>
    </NavLink>
  );
});

export default function BottomTabNav({ userRole, badges = {} }: BottomTabNavProps) {
  const tabs = tabConfig[userRole] || tenantTabs;
  const isAgency = userRole === 'agency';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 md:hidden"
      style={{
        height: '72px',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="tablist"
      aria-label="Navigazione principale"
    >
      <div className="flex justify-around items-center h-full">
        {tabs.map((tab) => (
          <TabItemComponent
            key={tab.href}
            item={tab}
            badge={tab.badgeKey ? badges[tab.badgeKey] : undefined}
            isAgency={isAgency}
          />
        ))}
      </div>
    </nav>
  );
}
