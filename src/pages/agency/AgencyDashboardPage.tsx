import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Home,
  Eye,
  TrendingUp,
  ArrowRight,
  CreditCard,
  Inbox,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAuthStore } from '../../store';
import { AgencyUser } from '../../types';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, Button, Badge } from '../../components/ui';

// Mock chart data
const viewsData = [
  { name: 'Lun', views: 45 },
  { name: 'Mar', views: 52 },
  { name: 'Mer', views: 38 },
  { name: 'Gio', views: 65 },
  { name: 'Ven', views: 48 },
  { name: 'Sab', views: 72 },
  { name: 'Dom', views: 55 },
];

const applicationsData = [
  { name: 'Gen', applications: 12 },
  { name: 'Feb', applications: 19 },
  { name: 'Mar', applications: 15 },
  { name: 'Apr', applications: 25 },
  { name: 'Mag', applications: 22 },
  { name: 'Giu', applications: 30 },
];

const recentUnlocks = [
  { id: 1, name: 'Marco Rossi', city: 'Milano', date: new Date(Date.now() - 2 * 60 * 60 * 1000), credits: 1 },
  { id: 2, name: 'Laura Bianchi', city: 'Roma', date: new Date(Date.now() - 5 * 60 * 60 * 1000), credits: 1 },
  { id: 3, name: 'Giuseppe Verdi', city: 'Bologna', date: new Date(Date.now() - 24 * 60 * 60 * 1000), credits: 1 },
];

export default function AgencyDashboardPage() {
  const { user } = useAuthStore();
  const agencyUser = user as AgencyUser;
  const [applicationCount, setApplicationCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Load applications count from localStorage
  useEffect(() => {
    const loadApplications = () => {
      const storedApplications = localStorage.getItem('affittochiaro_applications');
      const storedNotifications = localStorage.getItem('affittochiaro_agency_notifications');

      if (storedApplications) {
        const apps = JSON.parse(storedApplications);
        setApplicationCount(apps.length);
      }
      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        setUnreadNotifications(notifications.filter((n: any) => !n.read).length);
      }
    };

    loadApplications();
    // Poll for updates
    const interval = setInterval(loadApplications, 5000);
    return () => clearInterval(interval);
  }, []);

  const credits = agencyUser?.agency?.credits || 0;
  const plan = agencyUser?.agency?.plan || 'free';

  return (
    <div className="space-y-6">
      {/* Welcome & Credits Card */}
      {/* Welcome & Credits Card */}
      <Card className="bg-gradient-to-r from-teal-600 to-primary-500 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Ciao, {agencyUser?.agency?.name || 'Agenzia'}!
            </h1>
            <p className="text-white/80">
              Il tuo piano <span className="font-semibold capitalize">{plan}</span> e attivo
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CreditCard size={18} />
                <span>{credits} crediti disponibili</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={18} />
                <span>{agencyUser?.agency?.activeListingsCount ?? 12} annunci attivi</span>
              </div>
            </div>
          </div>
          <Link to={ROUTES.AGENCY_PLAN}>
            <Button variant="secondary" rightIcon={<ArrowRight size={18} />}>
              Gestisci Piano
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cerca inquilino */}
        <Link to={ROUTES.AGENCY_TENANTS} className="group block">
          <div className="bg-white rounded-2xl p-5 border border-border hover:border-primary-300 hover:shadow-md transition-all duration-200 h-full flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
              <Users size={22} className="text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm leading-tight">Cerca inquilino</p>
              <p className="text-xs text-text-muted mt-1">245 profili disponibili</p>
            </div>
            <ArrowRight size={15} className="text-text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all mt-auto" />
          </div>
        </Link>

        {/* Pubblica annuncio */}
        <Link to={ROUTES.AGENCY_LISTINGS} className="group block">
          <div className="bg-white rounded-2xl p-5 border border-border hover:border-teal-300 hover:shadow-md transition-all duration-200 h-full flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
              <Home size={22} className="text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm leading-tight">Pubblica annuncio</p>
              <p className="text-xs text-text-muted mt-1">Aggiungi un nuovo immobile</p>
            </div>
            <ArrowRight size={15} className="text-text-muted group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all mt-auto" />
          </div>
        </Link>

        {/* Candidature ricevute */}
        <Link to={ROUTES.AGENCY_APPLICATIONS} className="group block">
          <div className="bg-white rounded-2xl p-5 border border-border hover:border-amber-300 hover:shadow-md transition-all duration-200 h-full flex flex-col gap-3 relative">
            {unreadNotifications > 0 && (
              <span className="absolute top-3 right-3 min-w-[20px] h-5 px-1.5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
            <div className="w-11 h-11 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
              <Inbox size={22} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm leading-tight">Candidature ricevute</p>
              <p className="text-xs text-text-muted mt-1">{applicationCount} candidature totali</p>
            </div>
            <ArrowRight size={15} className="text-text-muted group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all mt-auto" />
          </div>
        </Link>

        {/* Annunci attivi */}
        <Link to={ROUTES.AGENCY_LISTINGS} className="group block">
          <div className="bg-white rounded-2xl p-5 border border-border hover:border-violet-300 hover:shadow-md transition-all duration-200 h-full flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center transition-colors">
              <Eye size={22} className="text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm leading-tight">Annunci attivi</p>
              <p className="text-xs text-text-muted mt-1">{agencyUser?.agency?.activeListingsCount ?? 12} pubblicati</p>
            </div>
            <ArrowRight size={15} className="text-text-muted group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all mt-auto" />
          </div>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visualizzazioni Settimanali</CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#00C48C"
                  strokeWidth={2}
                  dot={{ fill: '#00C48C', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Applications Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Candidature Mensili</CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="applications" fill="#0A5E4D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Unlocks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profili Sbloccati di Recente</CardTitle>
              <Link to={ROUTES.AGENCY_TENANTS} className="text-sm text-primary-500 hover:text-primary-600">
                Vedi tutti
              </Link>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {recentUnlocks.map((unlock) => (
              <div
                key={unlock.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-background-secondary"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                  {unlock.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{unlock.name}</p>
                  <p className="text-sm text-text-muted">{unlock.city}</p>
                </div>
                <Badge variant="primary">-{unlock.credits} credito</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Azioni Rapide</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <Link
              to={ROUTES.AGENCY_APPLICATIONS}
              className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group relative"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Inbox size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary-600">Candidature Ricevute</p>
                <p className="text-sm text-text-muted">{applicationCount} candidature totali</p>
              </div>
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-12 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadNotifications}
                </span>
              )}
              <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
            </Link>

            <Link
              to={ROUTES.AGENCY_TENANTS}
              className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Users size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary-600">Cerca Inquilini</p>
                <p className="text-sm text-text-muted">245 profili disponibili</p>
              </div>
              <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
            </Link>

            <Link
              to={ROUTES.AGENCY_LISTINGS}
              className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Home size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary-600">Pubblica Annuncio</p>
                <p className="text-sm text-text-muted">Aggiungi un nuovo immobile</p>
              </div>
              <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
            </Link>

            <Link
              to={ROUTES.AGENCY_PLAN}
              className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary-600">Upgrade Piano</p>
                <p className="text-sm text-text-muted">Sblocca piu funzionalita</p>
              </div>
              <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
