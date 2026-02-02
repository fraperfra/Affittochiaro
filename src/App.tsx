import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { ROUTES } from './utils/constants';

// Landing Page Components (from root)
import { useNotifications } from '../hooks';
import {
  Header as LandingHeader,
  MobileMenu,
  LiveNotifications,
  Footer,
  StickyBottomBar,
  ChatButton,
  ExitIntentPopup,
} from '../components';
import {
  HomePage,
  AnnunciPage,
  ComeFunzionaPage,
  FAQPage,
  NotFoundPage,
} from '../pages';

// App Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Tenant Pages
import TenantDashboardPage from './pages/tenant/TenantDashboardPage';
import TenantProfilePage from './pages/tenant/TenantProfilePage';
import ListingsPage from './pages/tenant/ListingsPage';
import NotificationsPage from './pages/tenant/NotificationsPage';

// Agency Pages
import AgencyDashboardPage from './pages/agency/AgencyDashboardPage';
import TenantSearchPage from './pages/agency/TenantSearchPage';
import MyListingsPage from './pages/agency/MyListingsPage';
import ApplicationsPage from './pages/agency/ApplicationsPage';
import PlanPage from './pages/agency/PlanPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TenantsManagementPage from './pages/admin/TenantsManagementPage';
import AgenciesManagementPage from './pages/admin/AgenciesManagementPage';
import ListingsManagementPage from './pages/admin/ListingsManagementPage';
import SystemPage from './pages/admin/SystemPage';

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

// Landing Layout Wrapper
function LandingWrapper({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-action-green/30 overflow-x-hidden relative">
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <LandingHeader />
      <LiveNotifications notifications={notifications} onDismiss={dismissNotification} />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
      <StickyBottomBar onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <ChatButton />
      <ExitIntentPopup />
    </div>
  );
}

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
  return (
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
        <Route path="listings" element={<ListingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
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
        <Route path="listings" element={<MyListingsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="plan" element={<PlanPage />} />
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
  );
}

export default App;
