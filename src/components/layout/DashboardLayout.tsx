import { useState, useEffect, useMemo } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Search,
  Bell,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  LayoutDashboard,
  CreditCard,
  ChevronDown,
  Inbox,
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../utils/constants';
import { formatInitials } from '../../utils/formatters';
import { TenantUser, AgencyUser, AdminUser } from '../../types';

interface DashboardLayoutProps {
  userRole: 'tenant' | 'agency' | 'admin';
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const tenantNavItems: NavItem[] = [
  { icon: <Home size={20} />, label: 'Dashboard', path: ROUTES.TENANT_DASHBOARD },
  { icon: <User size={20} />, label: 'Il Mio Profilo', path: ROUTES.TENANT_PROFILE },
  { icon: <Search size={20} />, label: 'Cerca Annunci', path: ROUTES.TENANT_LISTINGS },
  { icon: <Bell size={20} />, label: 'Notifiche', path: ROUTES.TENANT_NOTIFICATIONS, badge: 3 },
  { icon: <Building2 size={20} />, label: 'Agenzie Partner', path: ROUTES.TENANT_AGENCIES },
];

const agencyNavItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: ROUTES.AGENCY_DASHBOARD },
  { icon: <Inbox size={20} />, label: 'Candidature', path: ROUTES.AGENCY_APPLICATIONS, badge: 0 },
  { icon: <Users size={20} />, label: 'Cerca Inquilini', path: ROUTES.AGENCY_TENANTS },
  { icon: <Home size={20} />, label: 'I Miei Annunci', path: ROUTES.AGENCY_LISTINGS },
  { icon: <CreditCard size={20} />, label: 'Piano & Crediti', path: ROUTES.AGENCY_PLAN },
];

const adminNavItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
  { icon: <Users size={20} />, label: 'Inquilini', path: ROUTES.ADMIN_TENANTS },
  { icon: <Building2 size={20} />, label: 'Agenzie', path: ROUTES.ADMIN_AGENCIES },
  { icon: <Home size={20} />, label: 'Annunci', path: ROUTES.ADMIN_LISTINGS },
  { icon: <Settings size={20} />, label: 'Sistema', path: ROUTES.ADMIN_SYSTEM },
];

const roleConfig = {
  tenant: {
    navItems: tenantNavItems,
    label: 'Area Inquilino',
    emoji: '🏠',
    color: 'primary',
  },
  agency: {
    navItems: agencyNavItems,
    label: 'Area Agenzia',
    emoji: '🏢',
    color: 'teal',
  },
  admin: {
    navItems: adminNavItems,
    label: 'Admin Panel',
    emoji: '⚙️',
    color: 'accent',
  },
};

export default function DashboardLayout({ userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadApplications, setUnreadApplications] = useState(0);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Load unread applications count from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      if (userRole === 'agency') {
        const storedNotifications = localStorage.getItem('affittochiaro_agency_notifications');
        if (storedNotifications) {
          const notifications = JSON.parse(storedNotifications);
          setUnreadApplications(notifications.filter((n: any) => !n.read).length);
        }
      }
    };

    loadNotifications();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [userRole]);

  // Dynamic nav items with badge
  const navItems = useMemo(() => {
    if (userRole === 'agency') {
      return agencyNavItems.map(item =>
        item.path === ROUTES.AGENCY_APPLICATIONS
          ? { ...item, badge: unreadApplications }
          : item
      );
    }
    return roleConfig[userRole].navItems;
  }, [userRole, unreadApplications]);

  const config = { ...roleConfig[userRole], navItems };

  // Get user display info based on role
  const getUserInfo = () => {
    if (!user) return { name: 'Utente', email: '' };

    if (user.role === 'tenant') {
      const tenantUser = user as TenantUser;
      return {
        name: `${tenantUser.profile.firstName} ${tenantUser.profile.lastName}`,
        email: user.email,
        avatar: tenantUser.profile.avatar,
      };
    }
    if (user.role === 'agency') {
      const agencyUser = user as AgencyUser;
      return {
        name: agencyUser.agency.name,
        email: user.email,
        avatar: agencyUser.agency.logo,
      };
    }
    return { name: 'Admin', email: user.email };
  };

  const userInfo = getUserInfo();

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-border
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Role Badge */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/logoaffittochiaro_pic.webp"
                  alt="Affittochiaro"
                  className="h-10 w-auto"
                />
              </div>
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-background-secondary"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-background-secondary rounded-full text-sm font-medium">
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </span>
            </div>
          </div>

          {/* User Card */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              {userInfo.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="avatar avatar-lg"
                />
              ) : (
                <div className="avatar avatar-lg bg-gradient-to-br from-primary-400 to-teal-500 text-white">
                  {formatInitials(userInfo.name.split(' ')[0], userInfo.name.split(' ')[1])}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">{userInfo.name}</p>
                <p className="text-sm text-text-secondary truncate">{userInfo.email}</p>
              </div>
            </div>

            {/* Badges for tenant */}
            {userRole === 'tenant' && user?.role === 'tenant' && (
              <div className="flex gap-2 mt-3">
                {(user as TenantUser).profile.isVerified && (
                  <span className="badge badge-success">✓ Verificato</span>
                )}
                {(user as TenantUser).profile.hasVideo && (
                  <span className="badge badge-info">🎥 Video</span>
                )}
              </div>
            )}

            {/* Credits for agency */}
            {userRole === 'agency' && user?.role === 'agency' && (
              <div className="mt-3 p-2 bg-background-secondary rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Crediti disponibili</span>
                  <span className="font-semibold text-primary-600">
                    {(user as AgencyUser).agency.credits}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {config.navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === ROUTES.TENANT_DASHBOARD || item.path === ROUTES.AGENCY_DASHBOARD || item.path === ROUTES.ADMIN_DASHBOARD}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 text-xs font-medium bg-accent-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-error hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Esci</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-background-secondary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Search (placeholder) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Cerca..."
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-background-secondary">
                <Bell size={20} className="text-text-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-background-secondary"
                >
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      className="avatar avatar-sm"
                    />
                  ) : (
                    <div className="avatar avatar-sm bg-gradient-to-br from-primary-400 to-teal-500 text-white text-xs">
                      {formatInitials(userInfo.name.split(' ')[0], userInfo.name.split(' ')[1])}
                    </div>
                  )}
                  <ChevronDown size={16} className="text-text-muted" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-medium border border-border z-50">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate(userRole === 'tenant' ? ROUTES.TENANT_PROFILE : '#');
                          }}
                          className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary"
                        >
                          <User size={16} className="inline mr-2" />
                          Profilo
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary">
                          <Settings size={16} className="inline mr-2" />
                          Impostazioni
                        </button>
                        <hr className="my-2 border-border" />
                        <button
                          onClick={handleLogout}
                          className="w-full px-3 py-2 text-left text-sm rounded-lg text-error hover:bg-red-50"
                        >
                          <LogOut size={16} className="inline mr-2" />
                          Esci
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
