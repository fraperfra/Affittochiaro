import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { ROUTES } from './utils/constants';
import { Analytics } from '@vercel/analytics/react';

// Landing Page Components (from root) - eagerly loaded (entry point)
import { useNotifications } from '../hooks';
import {
  Header as LandingHeader,
  LiveNotifications,
  Footer,
  StickyBottomBar,
  ExitIntentPopup,
} from '../components';
import { AddToHomeScreenModal } from './components/ui';
import {
  HomePage,
  AnnunciPage,
  ComeFunzionaPage,
  FAQPage,
  NotFoundPage,
  RicercaInquilinoPage,
  ServiziCasaPage,
  AgenziePartnerPage,
  AffittoNewsPage,
  ChiSiamoPage,
  ArticlePresentarsiProprietario,
  ComponentLibraryPage,
} from '../pages';

// App Layouts - eagerly loaded (shared shell)
import DashboardLayout from './components/layout/DashboardLayout';

// Suspense fallback
import { FullPageSpinner } from './components/ui/Spinner';

// Maintenance - eagerly loaded (simple, small)
import MaintenancePage from './pages/MaintenancePage';

// Auth Pages - lazy loaded
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ConfirmEmailPage = lazy(() => import('./pages/ConfirmEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

// Tenant Pages - lazy loaded
const TenantDashboardPage = lazy(() => import('./pages/tenant/TenantDashboardPage'));
const TenantProfilePage = lazy(() => import('./pages/tenant/TenantProfilePage'));
const TenantCVPreviewPage = lazy(() => import('./pages/tenant/TenantCVPreviewPage'));
const ListingsPage = lazy(() => import('./pages/tenant/ListingsPage'));
const NotificationsPage = lazy(() => import('./pages/tenant/NotificationsPage'));
const TenantAgenciesPage = lazy(() => import('./pages/tenant/TenantAgenciesPage'));
const TenantMorePage = lazy(() => import('./pages/tenant/TenantMorePage'));

// Agency Pages - lazy loaded
const AgencyDashboardPage = lazy(() => import('./pages/agency/AgencyDashboardPage'));
const TenantSearchPage = lazy(() => import('./pages/agency/TenantSearchPage'));
const AgencyUnlockedProfilesPage = lazy(() => import('./pages/agency/AgencyUnlockedProfilesPage'));
const MyListingsPage = lazy(() => import('./pages/agency/MyListingsPage'));
const ApplicationsPage = lazy(() => import('./pages/agency/ApplicationsPage'));
const PlanPage = lazy(() => import('./pages/agency/PlanPage'));
const AgencyMorePage = lazy(() => import('./pages/agency/AgencyMorePage'));

// Admin Pages - lazy loaded
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const TenantsManagementPage = lazy(() => import('./pages/admin/TenantsManagementPage'));
const AgenciesManagementPage = lazy(() => import('./pages/admin/AgenciesManagementPage'));
const ListingsManagementPage = lazy(() => import('./pages/admin/ListingsManagementPage'));
const SystemPage = lazy(() => import('./pages/admin/SystemPage'));
const AdminUnlockedProfilesPage = lazy(() => import('./pages/admin/AdminUnlockedProfilesPage'));
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage'));
const AdminTicketsPage = lazy(() => import('./pages/admin/AdminTicketsPage'));
const AdminZonesPage = lazy(() => import('./pages/admin/AdminZonesPage'));
const AdminServicesManagementPage = lazy(() => import('./pages/admin/AdminServicesManagementPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminAdsPage = lazy(() => import('./pages/admin/AdminAdsPage'));

// Shared Pages - lazy loaded
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));

// Additional Pages - lazy loaded
const TenantTemplatesPage = lazy(() => import('./pages/tenant/TenantTemplatesPage'));
const TenantServicesPage = lazy(() => import('./pages/tenant/TenantServicesPage'));
const AgencyDocumentsPage = lazy(() => import('./pages/agency/AgencyDocumentsPage'));
const AgencyServicesPage = lazy(() => import('./pages/agency/AgencyServicesPage'));


// Auth Guard Component
function AuthGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'tenant') return <Navigate to={ROUTES.TENANT_DASHBOARD} replace />;
    if (user.role === 'agency') return <Navigate to={ROUTES.AGENCY_DASHBOARD} replace />;
    if (user.role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <>{children}</>;
}

// Public Route Guard (redirect if authenticated)
function PublicGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    if (user.role === 'tenant') return <Navigate to={ROUTES.TENANT_DASHBOARD} replace />;
    if (user.role === 'agency') return <Navigate to={ROUTES.AGENCY_DASHBOARD} replace />;
    if (user.role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <>{children}</>;
}

// ─── Authenticated mobile menu ────────────────────────────────────────────────
import { Menu, X as XIcon, LayoutDashboard as DashIcon, User, Heart, MessageSquare, Settings, LogOut } from 'lucide-react';
import { useNavigate as useNav } from 'react-router-dom';

function AuthMobileMenu({ role }: { role: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNav();
  const { logout } = useAuthStore();

  const tenantLinks = [
    { label: 'Dashboard',       icon: <DashIcon size={18} />,      to: '/tenant' },
    { label: 'Il mio profilo',  icon: <User size={18} />,          to: '/tenant/profile' },
    { label: 'Annunci salvati', icon: <Heart size={18} />,         to: '/tenant/listings' },
    { label: 'Messaggi',        icon: <MessageSquare size={18} />, to: '/tenant/messages' },
    { label: 'Impostazioni',    icon: <Settings size={18} />,      to: '/tenant/settings' },
  ];
  const agencyLinks = [
    { label: 'Dashboard',   icon: <DashIcon size={18} />,      to: '/agency' },
    { label: 'Annunci',     icon: <Heart size={18} />,          to: '/agency/listings' },
    { label: 'Messaggi',    icon: <MessageSquare size={18} />,  to: '/agency/messages' },
    { label: 'Impostazioni',icon: <Settings size={18} />,       to: '/agency/settings' },
  ];
  const links = role === 'agency' ? agencyLinks : tenantLinks;

  const go = (to: string) => { setOpen(false); navigate(to); };
  const handleLogout = () => { setOpen(false); logout(); navigate('/'); };

  return (
    <>
      {/* Hamburger button — top-right, mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 right-4 z-[60] p-2.5 bg-white rounded-xl shadow-md border border-gray-100"
        aria-label="Menu"
      >
        <Menu size={22} className="text-gray-700" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-72 z-[80] bg-white shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-bold text-gray-900 text-base">Menu</span>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <XIcon size={20} className="text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map(link => (
            <button
              key={link.to}
              onClick={() => go(link.to)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors text-sm font-medium text-left"
            >
              <span className="text-primary-500">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Esci
          </button>
        </div>
      </div>
    </>
  );
}

// Landing Layout Wrapper
function LandingWrapper({ children }: { children: React.ReactNode }) {
  const { notifications, dismissNotification } = useNotifications();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-action-green/30 overflow-x-hidden relative">
      {!isAuthenticated && <LandingHeader />}
      {!isAuthenticated && <LiveNotifications notifications={notifications} onDismiss={dismissNotification} />}
      {isAuthenticated && user && <AuthMobileMenu role={user.role} />}
      <main className={isAuthenticated ? '' : 'pt-20'}>
        {children}
      </main>
      {!isAuthenticated && <Footer />}
      {!isAuthenticated && <StickyBottomBar onMenuToggle={() => { }} />}
      {!isAuthenticated && <ExitIntentPopup />}
      <AddToHomeScreenModal />
    </div>
  );
}



const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

// Home Page with state
function HomePageWithState() {
  const [activeFilter, setActiveFilter] = useState('Tutti');
  const [activeCityName, setActiveCityName] = useState('Roma');
  const { counter } = useNotifications();

  return (
    <HomePage
      counter={counter}
      activeCityName={activeCityName}
      onCityChange={setActiveCityName}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />
  );
}

function App() {
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <>
      <Suspense fallback={<FullPageSpinner />}>
        <Routes>
          {/* Landing Pages (public with landing layout) */}
          <Route
            path="/"
            element={
              <LandingWrapper>
                <HomePageWithState />
              </LandingWrapper>
            }
          />
          <Route
            path="/annunci"
            element={
              <LandingWrapper>
                <AnnunciPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/come-funziona"
            element={
              <LandingWrapper>
                <ComeFunzionaPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/faq"
            element={
              <LandingWrapper>
                <FAQPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/ricerca-inquilino"
            element={
              <LandingWrapper>
                <RicercaInquilinoPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/servizi"
            element={
              <LandingWrapper>
                <ServiziCasaPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/agenzie"
            element={
              <LandingWrapper>
                <AgenziePartnerPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/affittonews"
            element={
              <LandingWrapper>
                <AffittoNewsPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/chi-siamo"
            element={
              <LandingWrapper>
                <ChiSiamoPage />
              </LandingWrapper>
            }
          />

          <Route
            path="/design-system"
            element={
              <LandingWrapper>
                <ComponentLibraryPage />
              </LandingWrapper>
            }
          />
          <Route
            path="/guida-affitto/inquilini/come-presentarsi-proprietario"
            element={
              <LandingWrapper>
                <ArticlePresentarsiProprietario />
              </LandingWrapper>
            }
          />

          {/* Auth Pages (no layout) */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicGuard>
                <LoginPage />
              </PublicGuard>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicGuard>
                <RegisterPage />
              </PublicGuard>
            }
          />
          <Route
            path={ROUTES.CONFIRM_EMAIL}
            element={<ConfirmEmailPage />}
          />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <PublicGuard>
                <ForgotPasswordPage />
              </PublicGuard>
            }
          />

          {/* Tenant Routes */}
          <Route
            path="/tenant"
            element={
              <AuthGuard allowedRoles={['tenant']}>
                <DashboardLayout userRole="tenant" />
              </AuthGuard>
            }
          >
            <Route index element={<TenantDashboardPage />} />
            <Route path="profile" element={<TenantProfilePage />} />
            <Route path="cv/preview" element={<TenantCVPreviewPage />} />
            <Route path="listings" element={<ListingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="agencies" element={<TenantAgenciesPage />} />
            <Route path="services" element={<TenantServicesPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="templates" element={<TenantTemplatesPage />} />
            <Route path="more" element={<TenantMorePage />} />
            <Route path="*" element={<Navigate to={ROUTES.TENANT_DASHBOARD} replace />} />
          </Route>

          {/* Agency Routes */}
          <Route
            path="/agency"
            element={
              <AuthGuard allowedRoles={['agency']}>
                <DashboardLayout userRole="agency" />
              </AuthGuard>
            }
          >
            <Route index element={<AgencyDashboardPage />} />
            <Route path="tenants" element={<TenantSearchPage />} />
            <Route path="unlocked-profiles" element={<AgencyUnlockedProfilesPage />} />
            <Route path="listings" element={<MyListingsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="documents" element={<AgencyDocumentsPage />} />
            <Route path="services" element={<AgencyServicesPage />} />
            <Route path="more" element={<AgencyMorePage />} />
            <Route path="*" element={<Navigate to={ROUTES.AGENCY_DASHBOARD} replace />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AuthGuard allowedRoles={['admin']}>
                <DashboardLayout userRole="admin" />
              </AuthGuard>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="tenants" element={<TenantsManagementPage />} />
            <Route path="agencies" element={<AgenciesManagementPage />} />
            <Route path="listings" element={<ListingsManagementPage />} />
            <Route path="system" element={<SystemPage />} />
            <Route path="unlocked-profiles" element={<AdminUnlockedProfilesPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="tickets" element={<AdminTicketsPage />} />
            <Route path="zones" element={<AdminZonesPage />} />
            <Route path="services" element={<AdminServicesManagementPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="ads" element={<AdminAdsPage />} />
            <Route path="*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <LandingWrapper>
                <NotFoundPage />
              </LandingWrapper>
            }
          />
        </Routes>
      </Suspense>
      <Analytics />
    </>
  );
}

export default App;
