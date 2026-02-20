import { useState, useMemo } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Building2, Home, User, Calendar } from 'lucide-react';
import { mockTenants, mockAgencies, mockListings } from '../../utils/mockData';
import { formatDate, formatInitials } from '../../utils/formatters';
import { Card, Badge, Modal } from '../../components/ui';

type AppStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

interface AdminApplication {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantCity: string;
  agencyId: string;
  agencyName: string;
  listingTitle: string;
  listingCity: string;
  status: AppStatus;
  appliedAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<AppStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  pending: { label: 'In attesa', variant: 'warning' },
  approved: { label: 'Approvata', variant: 'success' },
  rejected: { label: 'Rifiutata', variant: 'error' },
  withdrawn: { label: 'Ritirata', variant: 'neutral' },
};

const STATUSES: AppStatus[] = ['pending', 'approved', 'rejected', 'withdrawn'];

const MOCK_APPS: AdminApplication[] = mockTenants.slice(0, 50).map((t, i) => {
  const agency = mockAgencies[i % mockAgencies.length];
  const listing = mockListings[i % mockListings.length];
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const statuses: AppStatus[] = ['pending', 'pending', 'approved', 'rejected', 'withdrawn'];
  return {
    id: `app_${i + 1}`,
    tenantId: t.id,
    tenantName: `${t.firstName} ${t.lastName}`,
    tenantCity: t.currentCity || 'N/A',
    agencyId: agency.id,
    agencyName: agency.name,
    listingTitle: listing.title,
    listingCity: listing.address.city,
    status: statuses[i % statuses.length],
    appliedAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
});

const PAGE_SIZE = 15;

export default function AdminApplicationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppStatus | ''>('');
  const [selected, setSelected] = useState<AdminApplication | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_APPS.filter(a => {
      if (search) {
        const s = search.toLowerCase();
        if (!a.tenantName.toLowerCase().includes(s) && !a.agencyName.toLowerCase().includes(s) && !a.listingTitle.toLowerCase().includes(s)) return false;
      }
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => {
    const c: Record<string, number> = { total: MOCK_APPS.length };
    STATUSES.forEach(s => { c[s] = MOCK_APPS.filter(a => a.status === s).length; });
    return c;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Candidature</h1>
        <p className="text-text-secondary">Tutte le candidature degli inquilini agli annunci</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Totali', value: counts.total, color: 'text-text-primary' },
          { label: 'In Attesa', value: counts.pending, color: 'text-yellow-600' },
          { label: 'Approvate', value: counts.approved, color: 'text-green-600' },
          { label: 'Rifiutate', value: counts.rejected, color: 'text-red-500' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
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
              placeholder="Cerca per inquilino, agenzia o annuncio..."
              className="input pl-9"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="input sm:w-44"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as AppStatus | ''); setPage(1); }}
          >
            <option value="">Tutti gli stati</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
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
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary hidden md:table-cell">Annuncio</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary hidden sm:table-cell">Agenzia</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary hidden lg:table-cell">Data</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-text-secondary">Stato</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map(a => (
                <tr key={a.id} className="hover:bg-background-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm bg-gradient-to-br from-primary-400 to-teal-500 text-white text-xs flex-shrink-0">
                        {formatInitials(a.tenantName.split(' ')[0], a.tenantName.split(' ')[1])}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{a.tenantName}</p>
                        <p className="text-xs text-text-muted">{a.tenantCity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Home size={13} className="text-accent-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm truncate max-w-[180px]">{a.listingTitle}</p>
                        <p className="text-xs text-text-muted">{a.listingCity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={13} className="text-teal-500 flex-shrink-0" />
                      <span className="text-sm truncate max-w-[120px]">{a.agencyName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <Calendar size={13} />
                      {formatDate(a.appliedAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={STATUS_CONFIG[a.status].variant}>
                      {STATUS_CONFIG[a.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="p-1.5 rounded-lg hover:bg-background-secondary"
                      onClick={() => setSelected(a)}
                    >
                      <Eye size={15} className="text-text-muted" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-text-secondary">{filtered.length} risultati · Pagina {page} di {totalPages}</p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-border hover:bg-background-secondary disabled:opacity-40" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={16} /></button>
              <button className="p-2 rounded-lg border border-border hover:bg-background-secondary disabled:opacity-40" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selected && (
        <Modal isOpen onClose={() => setSelected(null)} title="Dettaglio Candidatura" size="md">
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-xl">
              <div className="avatar avatar-md bg-gradient-to-br from-primary-400 to-teal-500 text-white">
                {formatInitials(selected.tenantName.split(' ')[0], selected.tenantName.split(' ')[1])}
              </div>
              <div>
                <p className="font-semibold">{selected.tenantName}</p>
                <p className="text-sm text-text-secondary">{selected.tenantCity}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-muted">Annuncio</p>
                <p className="font-medium mt-0.5">{selected.listingTitle}</p>
              </div>
              <div>
                <p className="text-text-muted">Città annuncio</p>
                <p className="font-medium mt-0.5">{selected.listingCity}</p>
              </div>
              <div>
                <p className="text-text-muted">Agenzia</p>
                <p className="font-medium mt-0.5">{selected.agencyName}</p>
              </div>
              <div>
                <p className="text-text-muted">Data candidatura</p>
                <p className="font-medium mt-0.5">{formatDate(selected.appliedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Stato:</span>
              <Badge variant={STATUS_CONFIG[selected.status].variant}>{STATUS_CONFIG[selected.status].label}</Badge>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
