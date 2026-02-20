import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  FolderOpen,
  Sparkles,
  Unlock,
  Ticket,
  MapPin,
  Wrench,
  BookOpen,
  Megaphone,
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../utils/constants';
import { formatInitials } from '../../utils/formatters';
import { mockTenants, mockAgencies, mockListings } from '../../utils/mockData';
import { TenantUser, AgencyUser, AdminUser } from '../../types';
import BottomTabNav from './BottomTabNav';

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
  { icon: <Sparkles size={20} />, label: 'Servizi', path: ROUTES.TENANT_SERVICES },
  { icon: <Bell size={20} />, label: 'Notifiche', path: ROUTES.TENANT_NOTIFICATIONS, badge: 3 },
  { icon: <Settings size={20} />, label: 'Impostazioni', path: ROUTES.TENANT_SETTINGS },
];

const agencyNavItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: ROUTES.AGENCY_DASHBOARD },
  { icon: <Inbox size={20} />, label: 'Candidature', path: ROUTES.AGENCY_APPLICATIONS, badge: 0 },
  { icon: <Users size={20} />, label: 'Cerca Inquilini', path: ROUTES.AGENCY_TENANTS },
  { icon: <Home size={20} />, label: 'I Miei Annunci', path: ROUTES.AGENCY_LISTINGS },
  { icon: <CreditCard size={20} />, label: 'Piano & Crediti', path: ROUTES.AGENCY_PLAN },
  { icon: <FolderOpen size={20} />, label: 'Documenti', path: ROUTES.AGENCY_DOCUMENTS },
  { icon: <Sparkles size={20} />, label: 'Servizi', path: ROUTES.AGENCY_SERVICES },
  { icon: <Settings size={20} />, label: 'Impostazioni', path: ROUTES.AGENCY_SETTINGS },
];

const adminNavItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
  { icon: <Users size={20} />, label: 'Inquilini', path: ROUTES.ADMIN_TENANTS },
  { icon: <Building2 size={20} />, label: 'Agenzie', path: ROUTES.ADMIN_AGENCIES },
  { icon: <Home size={20} />, label: 'Annunci', path: ROUTES.ADMIN_LISTINGS },
  { icon: <Unlock size={20} />, label: 'Profili Sbloccati', path: ROUTES.ADMIN_UNLOCKED_PROFILES },
  { icon: <Inbox size={20} />, label: 'Candidature', path: ROUTES.ADMIN_APPLICATIONS },
  { icon: <Ticket size={20} />, label: 'Ticket', path: ROUTES.ADMIN_TICKETS },
  { icon: <MapPin size={20} />, label: 'Zone', path: ROUTES.ADMIN_ZONES },
  { icon: <Wrench size={20} />, label: 'Servizi', path: ROUTES.ADMIN_SERVICES_ADMIN },
  { icon: <BookOpen size={20} />, label: 'Blog', path: ROUTES.ADMIN_BLOG },
  { icon: <Megaphone size={20} />, label: 'Pubblicità', path: ROUTES.ADMIN_ADS },
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

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
}

function GlobalSearch({ userRole, navigate }: { userRole: string; navigate: (path: string) => void }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback((q: string) => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    const s = q.toLowerCase();
    const found: SearchResult[] = [];

    // Search tenants (agency & admin)
    if (userRole === 'agency' || userRole === 'admin') {
      mockTenants
        .filter(t =>
          t.firstName.toLowerCase().includes(s) ||
          t.lastName.toLowerCase().includes(s) ||
          t.email.toLowerCase().includes(s) ||
          (t.currentCity || '').toLowerCase().includes(s)
        )
        .slice(0, 5)
        .forEach(t => {
          found.push({
            id: `tenant_${t.id}`,
            title: `${t.firstName} ${t.lastName}`,
            subtitle: `${t.email} - ${t.currentCity || 'N/A'}`,
            category: 'Inquilini',
            path: userRole === 'agency' ? ROUTES.AGENCY_TENANTS : ROUTES.ADMIN_TENANTS,
          });
        });
    }

    // Search listings (all roles)
    mockListings
      .filter(l =>
        l.title.toLowerCase().includes(s) ||
        l.address.city.toLowerCase().includes(s) ||
        (l.address.street || '').toLowerCase().includes(s)
      )
      .slice(0, 5)
      .forEach(l => {
        found.push({
          id: `listing_${l.id}`,
          title: l.title,
          subtitle: `${l.address.city} - €${l.price}/mese`,
          category: 'Annunci',
          path: userRole === 'tenant' ? ROUTES.TENANT_LISTINGS :
            userRole === 'agency' ? ROUTES.AGENCY_LISTINGS : ROUTES.ADMIN_LISTINGS,
        });
      });

    // Search agencies (tenant & admin)
    if (userRole === 'tenant' || userRole === 'admin') {
      mockAgencies
        .filter(a =>
          a.name.toLowerCase().includes(s) ||
          a.email.toLowerCase().includes(s) ||
          (a.address?.city || '').toLowerCase().includes(s)
        )
        .slice(0, 5)
        .forEach(a => {
          found.push({
            id: `agency_${a.id}`,
            title: a.name,
            subtitle: `${a.address?.city || 'N/A'} - ${a.activeListingsCount} annunci`,
            category: 'Agenzie',
            path: userRole === 'tenant' ? ROUTES.TENANT_AGENCIES : ROUTES.ADMIN_AGENCIES,
          });
        });
    }

    setResults(found.slice(0, 10));
  }, [userRole]);

  useEffect(() => {
    const timeout = setTimeout(() => performSearch(query), 200);
    return () => clearTimeout(timeout);
  }, [query, performSearch]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach(r => {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    });
    return map;
  }, [results]);

  return (
    <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={containerRef}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cerca inquilini, annunci, agenzie..."
          className="input pl-10"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-border z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {Array.from(grouped.entries()).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-text-muted uppercase px-3 py-1.5">{category}</p>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-start gap-3 px-3 py-2 text-left rounded-lg hover:bg-background-secondary"
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                        setQuery('');
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                        {item.category === 'Inquilini' ? <Users size={14} className="text-primary-500" /> :
                          item.category === 'Annunci' ? <Home size={14} className="text-accent-500" /> :
                            <Building2 size={14} className="text-teal-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-text-muted truncate">{item.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-text-muted text-sm">
              Nessun risultato per "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Page title map for SEO
const PAGE_TITLES: Record<string, string> = {
  '/tenant': 'Dashboard',
  '/tenant/profile': 'Il Mio Profilo',
  '/tenant/cv/preview': 'Anteprima CV',
  '/tenant/listings': 'Cerca Annunci',
  '/tenant/notifications': 'Notifiche',
  '/tenant/agencies': 'Agenzie',
  '/tenant/messages': 'Messaggi',
  '/tenant/settings': 'Impostazioni',
  '/tenant/more': 'Altro',
  '/agency': 'Dashboard',
  '/agency/tenants': 'Cerca Inquilini',
  '/agency/listings': 'I Miei Annunci',
  '/agency/applications': 'Candidature',
  '/agency/plan': 'Piano & Crediti',
  '/agency/messages': 'Messaggi',
  '/agency/settings': 'Impostazioni',
  '/agency/documents': 'Documenti',
  '/agency/services': 'Servizi',
  '/admin': 'Dashboard',
  '/admin/tenants': 'Gestione Inquilini',
  '/admin/agencies': 'Gestione Agenzie',
  '/admin/listings': 'Gestione Annunci',
  '/admin/system': 'Sistema',
  '/admin/unlocked-profiles': 'Profili Sbloccati',
  '/admin/applications': 'Candidature',
  '/admin/tickets': 'Ticket',
  '/admin/zones': 'Zone',
  '/admin/services': 'Gestione Servizi',
  '/admin/blog': 'Gestione Blog',
  '/admin/ads': 'Pubblicità',
};

export default function DashboardLayout({ userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadApplications, setUnreadApplications] = useState(0);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Set page title based on current route
  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || 'Affittochiaro';
    document.title = `${title} | Affittochiaro`;
  }, [location.pathname]);

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
        avatar: tenantUser.profile.avatarUrl,
      };
    }
    if (user.role === 'agency') {
      const agencyUser = user as AgencyUser;
      return {
        name: agencyUser.agency.name,
        email: user.email,
        avatar: agencyUser.agency.logoUrl,
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="dashboard-sidebar fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-border"
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
                className="md:hidden p-2 rounded-lg hover:bg-background-secondary"
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
      <div className="md:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side: notifications on mobile */}
            <div className="flex items-center gap-3 min-w-[40px]">
              <button className="relative p-2 rounded-lg hover:bg-background-secondary md:hidden"
                onClick={() => navigate(ROUTES.TENANT_NOTIFICATIONS)}
              >
                <Bell size={20} className="text-text-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
              </button>
            </div>

            {/* Center: Logo on mobile, Search on desktop */}
            <div className="md:hidden flex items-center justify-center flex-1">
              <img src="/assets/logoaffittochiaro_pic.webp" alt="Affittochiaro" className="h-9" />
            </div>
            <GlobalSearch userRole={userRole} navigate={navigate} />

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Notifications - desktop only */}
              <button className="relative p-2 rounded-lg hover:bg-background-secondary hidden md:block">
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
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate(userRole === 'tenant' ? ROUTES.TENANT_SETTINGS : userRole === 'agency' ? ROUTES.AGENCY_SETTINGS : ROUTES.ADMIN_SYSTEM);
                          }}
                          className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary"
                        >
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
        <main className="p-4 md:p-6 pb-32 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom Tab Navigation - Mobile only */}
      <BottomTabNav
        userRole={userRole}
        badges={{
          applications: unreadApplications,
        }}
      />
    </div>
  );
}
