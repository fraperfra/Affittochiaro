import {
  Users,
  Building2,
  Home,
  Euro,
  TrendingUp,
  TrendingDown,
  ArrowRight,
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
import { mockTenantStats, mockAgencyStats, mockListingStats } from '../../utils/mockData';
import { Card, CardHeader, CardTitle, StatCard, Badge } from '../../components/ui';

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

const planDistribution = [
  { name: 'Free', value: 12, color: '#94A3B8' },
  { name: 'Base', value: 10, color: '#00C48C' },
  { name: 'Professional', value: 8, color: '#0A5E4D' },
  { name: 'Enterprise', value: 4, color: '#FF6B35' },
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard Admin</h1>
        <p className="text-text-secondary">
          Panoramica completa della piattaforma Affittochiaro
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={24} className="text-primary-500" />}
          label="Inquilini Totali"
          value={formatNumber(mockTenantStats.totalTenants)}
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

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiche Rapide</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
              <div>
                <p className="text-sm text-text-muted">Inquilini Verificati</p>
                <p className="text-xl font-bold">{mockTenantStats.verifiedTenants}</p>
              </div>
              <Badge variant="success">
                {Math.round((mockTenantStats.verifiedTenants / mockTenantStats.totalTenants) * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
              <div>
                <p className="text-sm text-text-muted">Con Video</p>
                <p className="text-xl font-bold">{mockTenantStats.tenantsWithVideo}</p>
              </div>
              <Badge variant="info">
                {Math.round((mockTenantStats.tenantsWithVideo / mockTenantStats.totalTenants) * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
              <div>
                <p className="text-sm text-text-muted">Agenzie Attive</p>
                <p className="text-xl font-bold">{mockAgencyStats.activeThisMonth}</p>
              </div>
              <Badge variant="primary">
                {Math.round((mockAgencyStats.activeThisMonth / mockAgencyStats.totalAgencies) * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
              <div>
                <p className="text-sm text-text-muted">Affittati Questo Mese</p>
                <p className="text-xl font-bold">{mockListingStats.rentedThisMonth}</p>
              </div>
              <TrendingUp size={20} className="text-success" />
            </div>
          </div>
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
            <p className="text-sm text-text-muted">{mockTenantStats.totalTenants} utenti</p>
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
