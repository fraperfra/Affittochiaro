import { useState, useMemo } from 'react';
import { Search, Unlock, Building2, User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTenants, mockAgencies } from '../../utils/mockData';
import { formatDate, formatInitials } from '../../utils/formatters';
import { Card, Badge } from '../../components/ui';

interface UnlockedProfile {
  id: string;
  agencyId: string;
  agencyName: string;
  tenantId: string;
  tenantName: string;
  tenantCity: string;
  tenantOccupation: string;
  unlockedAt: string;
  creditsUsed: number;
}

// Generate mock unlocked profiles data
const MOCK_UNLOCKED: UnlockedProfile[] = mockTenants.slice(0, 40).map((t, i) => {
  const agency = mockAgencies[i % mockAgencies.length];
  const daysAgo = Math.floor(Math.random() * 60);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id: `unlock_${i + 1}`,
    agencyId: agency.id,
    agencyName: agency.name,
    tenantId: t.id,
    tenantName: `${t.firstName} ${t.lastName}`,
    tenantCity: t.currentCity || 'N/A',
    tenantOccupation: t.occupation || 'N/A',
    unlockedAt: date.toISOString(),
    creditsUsed: 1,
  };
});

const PAGE_SIZE = 15;

export default function AdminUnlockedProfilesPage() {
  const [search, setSearch] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_UNLOCKED.filter(u => {
      if (search) {
        const s = search.toLowerCase();
        if (!u.tenantName.toLowerCase().includes(s) && !u.agencyName.toLowerCase().includes(s)) return false;
      }
      if (agencyFilter && u.agencyId !== agencyFilter) return false;
      return true;
    });
  }, [search, agencyFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalCredits = MOCK_UNLOCKED.reduce((sum, u) => sum + u.creditsUsed, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profili Sbloccati</h1>
        <p className="text-text-secondary">Tutti i profili inquilini sbloccati dalle agenzie</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sblocchi Totali', value: MOCK_UNLOCKED.length, color: 'text-primary-600' },
          { label: 'Questo Mese', value: MOCK_UNLOCKED.filter(u => new Date(u.unlockedAt) > new Date(Date.now() - 30 * 86400000)).length, color: 'text-teal-600' },
          { label: 'Agenzie Attive', value: new Set(MOCK_UNLOCKED.map(u => u.agencyId)).size, color: 'text-accent-600' },
          { label: 'Crediti Consumati', value: totalCredits, color: 'text-purple-600' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Cerca per inquilino o agenzia..."
              className="input pl-9"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="input sm:w-56"
            value={agencyFilter}
            onChange={e => { setAgencyFilter(e.target.value); setPage(1); }}
          >
            <option value="">Tutte le agenzie</option>
            {mockAgencies.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Inquilino</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary hidden sm:table-cell">Città</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Agenzia</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary hidden md:table-cell">Data Sblocco</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-text-secondary hidden md:table-cell">Crediti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map(u => (
                <tr key={u.id} className="hover:bg-background-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-sm bg-gradient-to-br from-primary-400 to-teal-500 text-white text-xs flex-shrink-0">
                        {formatInitials(u.tenantName.split(' ')[0], u.tenantName.split(' ')[1])}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{u.tenantName}</p>
                        <p className="text-xs text-text-muted">{u.tenantOccupation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-text-secondary">{u.tenantCity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-teal-500 flex-shrink-0" />
                      <span className="text-sm text-text-primary">{u.agencyName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <Calendar size={13} />
                      {formatDate(u.unlockedAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-center">
                    <Badge variant="info">{u.creditsUsed} cr.</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-text-secondary">
              {filtered.length} risultati · Pagina {page} di {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-lg border border-border hover:bg-background-secondary disabled:opacity-40"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="p-2 rounded-lg border border-border hover:bg-background-secondary disabled:opacity-40"
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
