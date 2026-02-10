import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  MoreVertical,
  Check,
  Eye,
  Ban,
  Trash2,
  Home,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAgencyStore } from '../../store';
import { mockAgencies } from '../../utils/mockData';
import { formatDate, formatCurrency, formatNumber } from '../../utils/formatters';
import { ITALIAN_CITIES } from '../../utils/constants';
import { Agency, AgencyPlan } from '../../types';
import { Card, Button, Badge, Modal, ModalFooter, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

const planColors: Record<AgencyPlan, 'neutral' | 'success' | 'primary' | 'warning'> = {
  free: 'neutral',
  base: 'success',
  professional: 'primary',
  enterprise: 'warning',
};

export default function AgenciesManagementPage() {
  const { agencies, setAgencies, filters, setFilters, pagination, setPagination } = useAgencyStore();
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    setAgencies(mockAgencies);
    setPagination({ total: mockAgencies.length, totalPages: Math.ceil(mockAgencies.length / 20) });
  }, []);

  const filteredAgencies = agencies.filter((agency) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (
        !agency.name.toLowerCase().includes(search) &&
        !agency.email.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    if (filters.city && agency.address?.city !== filters.city) return false;
    if (filters.plan && agency.plan !== filters.plan) return false;
    return true;
  });

  const paginatedAgencies = filteredAgencies.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestione Agenzie</h1>
          <p className="text-text-secondary">
            {filteredAgencies.length} agenzie totali
          </p>
        </div>
        <Button variant="secondary" leftIcon={<Download size={16} />}>
          Esporta CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-text-primary">{agencies.length}</p>
          <p className="text-text-muted">Totale Agenzie</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-success">
            {agencies.filter((a) => a.isVerified).length}
          </p>
          <p className="text-text-muted">Verificate</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">
            {agencies.filter((a) => a.plan !== 'free').length}
          </p>
          <p className="text-text-muted">Piani a Pagamento</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-text-primary">
            {formatNumber(agencies.reduce((sum, a) => sum + a.listingsCount, 0))}
          </p>
          <p className="text-text-muted">Annunci Totali</p>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Cerca per nome, email..."
              className="input pl-10"
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              className="input w-auto"
              value={filters.city || ''}
              onChange={(e) => setFilters({ city: e.target.value || undefined })}
            >
              <option value="">Tutte le citta</option>
              {ITALIAN_CITIES.slice(0, 15).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              className="input w-auto"
              value={filters.plan || ''}
              onChange={(e) => setFilters({ plan: (e.target.value || undefined) as AgencyPlan | undefined })}
            >
              <option value="">Tutti i piani</option>
              <option value="free">Free</option>
              <option value="base">Base</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      {paginatedAgencies.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {paginatedAgencies.map((agency) => (
              <Card key={agency.id} padding="md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                      {agency.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {agency.name}
                      </h3>
                      <div className="flex gap-1 mt-0.5">
                        <Badge variant={planColors[agency.plan]} className="capitalize" size="sm">
                          {agency.plan}
                        </Badge>
                        {agency.isVerified && <Badge variant="success" size="sm">✓</Badge>}
                      </div>
                    </div>
                  </div>
                  <Badge variant={agency.status === 'active' ? 'success' : 'warning'}>
                    {agency.status === 'active' ? 'Attiva' : 'Inattiva'}
                  </Badge>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <span className="text-text-muted">Email:</span> {agency.email}
                  </p>
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <span className="text-text-muted">Citta:</span> {agency.address?.city || '-'}
                  </p>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-border mb-4">
                  <div className="text-center bg-background-secondary p-2 rounded-lg flex-1 mr-2">
                    <p className="text-xs text-text-muted mb-1 flex items-center justify-center gap-1"><CreditCard size={12} /> Crediti</p>
                    <span className="font-bold text-primary-600">{agency.credits}</span>
                  </div>
                  <div className="text-center bg-background-secondary p-2 rounded-lg flex-1 ml-2">
                    <p className="text-xs text-text-muted mb-1 flex items-center justify-center gap-1"><Home size={12} /> Annunci</p>
                    <span className="font-bold text-text-primary">{agency.activeListingsCount}/{agency.listingsCount}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedAgency(agency)}
                    leftIcon={<Eye size={14} />}
                  >
                    Dettagli
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2"
                      onClick={() => setShowActions(showActions === agency.id ? null : agency.id)}
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>

                {/* Mobile Dropdown Actions */}
                {showActions === agency.id && (
                  <div className="mt-2 p-2 bg-background-secondary rounded-lg animate-slideDown">
                    <div className="flex flex-col gap-2">
                      {!agency.isVerified && (
                        <button
                          className="w-full px-3 py-2 text-left text-sm rounded-lg bg-white shadow-sm flex items-center gap-2"
                          onClick={() => {
                            // Simulate verify
                            toast.success('Agenzia verificata');
                            setShowActions(null);
                          }}
                        >
                          <Check size={14} className="text-success" />
                          Verifica
                        </button>
                      )}
                      <button
                        className="w-full px-3 py-2 text-left text-sm rounded-lg bg-white shadow-sm flex items-center gap-2"
                        onClick={() => {
                          toast.success('Crediti aggiunti');
                          setShowActions(null);
                        }}
                      >
                        <CreditCard size={14} className="text-primary-500" />
                        Aggiungi Crediti
                      </button>
                      <button
                        className="w-full px-3 py-2 text-left text-sm rounded-lg bg-white shadow-sm flex items-center gap-2"
                        onClick={() => {
                          toast.success('Agenzia sospesa');
                          setShowActions(null);
                        }}
                      >
                        <Ban size={14} className="text-warning" />
                        Sospendi
                      </button>
                      <button
                        className="w-full px-3 py-2 text-left text-sm rounded-lg bg-white shadow-sm flex items-center gap-2 text-error"
                        onClick={() => {
                          const updated = agencies.filter(a => a.id !== agency.id);
                          setAgencies(updated);
                          setShowActions(null);
                          toast.success('Agenzia eliminata');
                        }}
                      >
                        <Trash2 size={14} />
                        Elimina
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <Card padding="none" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Agenzia</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Piano</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Crediti</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Annunci</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Stato</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Registrata</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-text-secondary">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedAgencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-background-secondary/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                            {agency.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{agency.name}</p>
                            <p className="text-sm text-text-muted">{agency.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={planColors[agency.plan]} className="capitalize">
                          {agency.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <CreditCard size={14} className="text-text-muted" />
                          <span>{agency.credits}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Home size={14} className="text-text-muted" />
                          <span>{agency.activeListingsCount}/{agency.listingsCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {agency.isVerified && (
                            <Badge variant="success" size="sm">✓ Verificata</Badge>
                          )}
                          <Badge
                            variant={agency.status === 'active' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {agency.status === 'active' ? 'Attiva' : 'Inattiva'}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {formatDate(agency.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="btn-icon"
                            onClick={() => setSelectedAgency(agency)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="btn-icon"
                            onClick={() => setShowActions(showActions === agency.id ? null : agency.id)}
                          >
                            <MoreVertical size={16} />
                          </Button>

                          {showActions === agency.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-border z-10">
                              <div className="p-1">
                                {!agency.isVerified && (
                                  <button className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2">
                                    <Check size={14} className="text-success" />
                                    Verifica
                                  </button>
                                )}
                                <button className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2">
                                  <CreditCard size={14} className="text-primary-500" />
                                  Aggiungi Crediti
                                </button>
                                <button className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2">
                                  <Ban size={14} className="text-warning" />
                                  Sospendi
                                </button>
                                <button className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-red-50 text-error flex items-center gap-2">
                                  <Trash2 size={14} />
                                  Elimina
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-text-muted">
                Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, filteredAgencies.length)} di {filteredAgencies.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ page: pagination.page - 1 })}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm text-text-secondary px-2">
                  Pagina {pagination.page}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= Math.ceil(filteredAgencies.length / pagination.limit)}
                  onClick={() => setPagination({ page: pagination.page + 1 })}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          icon="🏢"
          title="Nessuna agenzia trovata"
          description="Prova a modificare i filtri"
        />
      )}

      {/* Agency Detail Modal */}
      <Modal
        isOpen={!!selectedAgency}
        onClose={() => setSelectedAgency(null)}
        title="Dettaglio Agenzia"
        size="lg"
      >
        {selectedAgency && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 text-2xl font-bold">
                {selectedAgency.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedAgency.name}</h3>
                <p className="text-text-secondary">{selectedAgency.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={planColors[selectedAgency.plan]} className="capitalize">
                    Piano {selectedAgency.plan}
                  </Badge>
                  {selectedAgency.isVerified && (
                    <Badge variant="success">✓ Verificata</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">P.IVA</p>
                <p className="font-medium">{selectedAgency.vatNumber}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Telefono</p>
                <p className="font-medium">{selectedAgency.phone}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Crediti</p>
                <p className="font-medium">{selectedAgency.credits}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Annunci</p>
                <p className="font-medium">
                  {selectedAgency.activeListingsCount} attivi / {selectedAgency.listingsCount} totali
                </p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Profili Sbloccati</p>
                <p className="font-medium">{selectedAgency.tenantsUnlocked}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Match</p>
                <p className="font-medium">{selectedAgency.matchesCount}</p>
              </div>
            </div>

            {selectedAgency.website && (
              <div>
                <p className="text-sm text-text-muted">Website</p>
                <a
                  href={selectedAgency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:underline"
                >
                  {selectedAgency.website}
                </a>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedAgency(null)}>
            Chiudi
          </Button>
          <Button>
            Modifica
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
