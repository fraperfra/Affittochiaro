import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Building2,
  Home,
  Euro,
  TrendingUp,
  ArrowRight,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MapPin,
  BarChart3,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { formatCurrency, formatNumber, formatCompactNumber } from '../../utils/formatters';
import {
  mockTenants,
  mockTenantStats,
  mockAgencyStats,
  mockListingStats,
} from '../../utils/mockData';
import { Card, CardHeader, CardTitle, StatCard, Badge } from '../../components/ui';
import { useTenantStore } from '../../store';

// Chart data
const revenueData = [
  { name: 'Gen', revenue: 12500 },
  { name: 'Feb', revenue: 15200 },
  { name: 'Mar', revenue: 14800 },
  { name: 'Apr', revenue: 18500 },
  { name: 'Mag', revenue: 21000 },
  { name: 'Giu', revenue: 19800 },
  { name: 'Lug', revenue: 23500 },
  { name: 'Ago', revenue: 22100 },
  { name: 'Set', revenue: 25800 },
  { name: 'Ott', revenue: 28900 },
  { name: 'Nov', revenue: 31200 },
  { name: 'Dic', revenue: 35600 },
];

const userGrowthData = [
  { name: 'Gen', tenants: 120, agencies: 8 },
  { name: 'Feb', tenants: 145, agencies: 12 },
  { name: 'Mar', tenants: 168, agencies: 15 },
  { name: 'Apr', tenants: 190, agencies: 18 },
  { name: 'Mag', tenants: 210, agencies: 22 },
  { name: 'Giu', tenants: 245, agencies: 28 },
  { name: 'Lug', tenants: 280, agencies: 30 },
  { name: 'Ago', tenants: 310, agencies: 32 },
  { name: 'Set', tenants: 340, agencies: 34 },
];

export default function AdminDashboardPage() {
  const { tenants, setTenants, setPagination } = useTenantStore();

  // Load real tenant data into store
  useEffect(() => {
    if (tenants.length === 0) {
      setTenants(mockTenants);
      setPagination({ total: mockTenants.length, totalPages: Math.ceil(mockTenants.length / 20) });
    }
  }, []);

  // Compute live stats from store
  const liveStats = useMemo(() => {
    const data = tenants.length > 0 ? tenants : mockTenants;
    const verified = data.filter(t => t.isVerified).length;
    const withVideo = data.filter(t => t.hasVideo).length;
    const suspended = data.filter(t => t.status === 'suspended').length;
    const avgCompleteness = data.length > 0
      ? Math.round(data.reduce((sum, t) => sum + t.profileCompleteness, 0) / data.length)
      : 0;

    // City breakdown
    const cityMap = new Map<string, number>();
    data.forEach(t => {
      if (t.currentCity) {
        cityMap.set(t.currentCity, (cityMap.get(t.currentCity) || 0) + 1);
      }
    });
    const topCities = Array.from(cityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([city, count]) => ({ city, count }));

    // Completeness distribution
    const completenessRanges = [
      { range: '0-25%', count: data.filter(t => t.profileCompleteness <= 25).length, color: '#EF4444' },
      { range: '26-50%', count: data.filter(t => t.profileCompleteness > 25 && t.profileCompleteness <= 50).length, color: '#F59E0B' },
      { range: '51-75%', count: data.filter(t => t.profileCompleteness > 50 && t.profileCompleteness <= 75).length, color: '#3B82F6' },
      { range: '76-100%', count: data.filter(t => t.profileCompleteness > 75).length, color: '#10B981' },
    ];

    return { verified, withVideo, suspended, avgCompleteness, topCities, completenessRanges, total: data.length };
  }, [tenants]);

  // Plan distribution from real agency data
  const planDistribution = [
    { name: 'Free', value: mockAgencyStats.planDistribution.free, color: '#94A3B8' },
    { name: 'Base', value: mockAgencyStats.planDistribution.base, color: '#00C48C' },
    { name: 'Professional', value: mockAgencyStats.planDistribution.professional, color: '#0A5E4D' },
    { name: 'Enterprise', value: mockAgencyStats.planDistribution.enterprise, color: '#FF6B35' },
  ];

  // Applications from localStorage
  const [applicationStats, setApplicationStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  useEffect(() => {
    const stored = localStorage.getItem('affittochiaro_applications');
    if (stored) {
      const apps = JSON.parse(stored);
      setApplicationStats({
        total: apps.length,
        pending: apps.filter((a: any) => a.status === 'pending').length,
        accepted: apps.filter((a: any) => a.status === 'accepted').length,
        rejected: apps.filter((a: any) => a.status === 'rejected').length,
      });
    }
  }, []);

  // Recent activity mock
  const recentActivity = [
    { icon: <Users size={16} />, text: 'Nuovo inquilino registrato: Marco Bianchi', time: '2 min fa', type: 'info' },
    { icon: <CheckCircle size={16} />, text: 'Profilo verificato: Laura Rossi', time: '15 min fa', type: 'success' },
    { icon: <FileText size={16} />, text: 'Nuova candidatura per Via Roma 42, Milano', time: '32 min fa', type: 'info' },
    { icon: <Building2 size={16} />, text: 'Nuova agenzia registrata: Casa&Affitti Srl', time: '1 ora fa', type: 'info' },
    { icon: <AlertTriangle size={16} />, text: 'Segnalazione profilo: utente #1234', time: '2 ore fa', type: 'warning' },
    { icon: <Home size={16} />, text: 'Annuncio pubblicato: Trilocale Zona Navigli', time: '3 ore fa', type: 'info' },
    { icon: <XCircle size={16} />, text: 'Agenzia sospesa: ImmobilFake Srl', time: '5 ore fa', type: 'error' },
    { icon: <CheckCircle size={16} />, text: 'Contratto concluso: Bilocale Via Dante', time: '6 ore fa', type: 'success' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard Admin</h1>
          <p className="text-text-secondary">
            Panoramica completa della piattaforma Affittochiaro
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-text-muted">Sistema operativo</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={24} className="text-primary-500" />}
          label="Inquilini Totali"
          value={formatNumber(liveStats.total)}
          change={12}
          changeLabel="vs mese scorso"
        />
        <StatCard
          icon={<Building2 size={24} className="text-teal-600" />}
          label="Agenzie Totali"
          value={formatNumber(mockAgencyStats.totalAgencies)}
          change={8}
        />
        <StatCard
          icon={<Home size={24} className="text-accent-500" />}
          label="Annunci Attivi"
          value={formatCompactNumber(mockListingStats.activeListings)}
        />
        <StatCard
          icon={<Euro size={24} className="text-success" />}
          label="Revenue Mensile"
          value={formatCurrency(mockAgencyStats.revenueThisMonth)}
          change={15}
        />
      </div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Verificati</p>
              <p className="text-lg font-bold">{liveStats.verified}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity size={18} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Con Video</p>
              <p className="text-lg font-bold">{liveStats.withVideo}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle size={18} className="text-error" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Sospesi</p>
              <p className="text-lg font-bold">{liveStats.suspended}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <BarChart3 size={18} className="text-warning" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Media Profilo</p>
              <p className="text-lg font-bold">{liveStats.avgCompleteness}%</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Candidature</p>
              <p className="text-lg font-bold">{applicationStats.total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Annuale</CardTitle>
              <Badge variant="success">+42% YoY</Badge>
            </div>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00C48C"
                  strokeWidth={2}
                  dot={{ fill: '#00C48C', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuzione Piani Agenzie</CardTitle>
          </CardHeader>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} agenzie`, name]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crescita Utenti</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
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
                <Legend />
                <Bar dataKey="tenants" name="Inquilini" fill="#00C48C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agencies" name="Agenzie" fill="#0A5E4D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Profile Completeness Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Completezza Profili</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {liveStats.completenessRanges.map((range) => {
              const pct = liveStats.total > 0 ? Math.round((range.count / liveStats.total) * 100) : 0;
              return (
                <div key={range.range}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary">{range.range}</span>
                    <span className="font-medium">{range.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: range.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-background-secondary rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">Affittati Questo Mese</p>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-success" />
                <span className="font-bold">{mockListingStats.rentedThisMonth}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-background-secondary rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">Prezzo Medio</p>
              <span className="font-bold">{formatCurrency(mockListingStats.averagePrice)}/mese</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-background-secondary rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">Giorni Medi Affitto</p>
              <span className="font-bold">{mockListingStats.averageDaysToRent}gg</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row: Activity + Top Cities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attivita Recente</CardTitle>
              <span className="text-xs text-text-muted">Ultime 24 ore</span>
            </div>
          </CardHeader>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-background-secondary">
                <div className={`mt-0.5 ${
                  item.type === 'success' ? 'text-success' :
                  item.type === 'error' ? 'text-error' :
                  item.type === 'warning' ? 'text-warning' :
                  'text-text-muted'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary">{item.text}</p>
                  <p className="text-xs text-text-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inquilini per Citta</CardTitle>
              <MapPin size={18} className="text-text-muted" />
            </div>
          </CardHeader>
          <div className="space-y-3">
            {liveStats.topCities.map((city, i) => {
              const pct = liveStats.total > 0 ? Math.round((city.count / liveStats.total) * 100) : 0;
              return (
                <div key={city.city} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-muted w-5 text-right">
                    {i + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{city.city}</span>
                      <span className="text-sm text-text-muted">{city.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Applications summary */}
          {applicationStats.total > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-3">Candidature Recenti</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-amber-50 rounded-lg">
                  <Clock size={14} className="mx-auto text-warning mb-1" />
                  <p className="text-lg font-bold text-warning">{applicationStats.pending}</p>
                  <p className="text-xs text-text-muted">In attesa</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <CheckCircle size={14} className="mx-auto text-success mb-1" />
                  <p className="text-lg font-bold text-success">{applicationStats.accepted}</p>
                  <p className="text-xs text-text-muted">Accettate</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <XCircle size={14} className="mx-auto text-error mb-1" />
                  <p className="text-lg font-bold text-error">{applicationStats.rejected}</p>
                  <p className="text-xs text-text-muted">Rifiutate</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          to={ROUTES.ADMIN_TENANTS}
          className="card flex items-center gap-4 hover:bg-primary-50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <Users size={24} className="text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold group-hover:text-primary-600">Gestisci Inquilini</p>
            <p className="text-sm text-text-muted">{liveStats.total} utenti</p>
          </div>
          <ArrowRight size={20} className="text-text-muted group-hover:text-primary-500" />
        </Link>

        <Link
          to={ROUTES.ADMIN_AGENCIES}
          className="card flex items-center gap-4 hover:bg-primary-50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <Building2 size={24} className="text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold group-hover:text-primary-600">Gestisci Agenzie</p>
            <p className="text-sm text-text-muted">{mockAgencyStats.totalAgencies} agenzie</p>
          </div>
          <ArrowRight size={20} className="text-text-muted group-hover:text-primary-500" />
        </Link>

        <Link
          to={ROUTES.ADMIN_LISTINGS}
          className="card flex items-center gap-4 hover:bg-primary-50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
            <Home size={24} className="text-accent-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold group-hover:text-primary-600">Gestisci Annunci</p>
            <p className="text-sm text-text-muted">{formatCompactNumber(mockListingStats.totalListings)} annunci</p>
          </div>
          <ArrowRight size={20} className="text-text-muted group-hover:text-primary-500" />
        </Link>
      </div>
    </div>
  );
}
