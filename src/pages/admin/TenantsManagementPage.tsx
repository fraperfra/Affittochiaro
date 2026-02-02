import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Check,
  X,
  Eye,
  Ban,
  Trash2,
  Video,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTenantStore } from '../../store';
import { mockTenants } from '../../utils/mockData';
import { formatDate, formatInitials, formatCurrency } from '../../utils/formatters';
import { ITALIAN_CITIES } from '../../utils/constants';
import { Tenant } from '../../types';
import { Card, Button, Badge, Modal, ModalFooter, Input, EmptyState } from '../../components/ui';

export default function TenantsManagementPage() {
  const { tenants, setTenants, filters, setFilters, pagination, setPagination } = useTenantStore();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    setTenants(mockTenants);
    setPagination({ total: mockTenants.length, totalPages: Math.ceil(mockTenants.length / 20) });
  }, []);

  const filteredTenants = tenants.filter((tenant) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (
        !tenant.firstName.toLowerCase().includes(search) &&
        !tenant.lastName.toLowerCase().includes(search) &&
        !tenant.email.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    if (filters.city && tenant.currentCity !== filters.city) return false;
    if (filters.isVerified !== undefined && tenant.isVerified !== filters.isVerified) return false;
    return true;
  });

  const paginatedTenants = filteredTenants.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const handleVerify = (tenant: Tenant) => {
    // Mock verify action
    console.log('Verifying tenant:', tenant.id);
    setShowActions(null);
  };

  const handleSuspend = (tenant: Tenant) => {
    console.log('Suspending tenant:', tenant.id);
    setShowActions(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestione Inquilini</h1>
          <p className="text-text-secondary">
            {filteredTenants.length} inquilini totali
          </p>
        </div>
        <Button variant="secondary" leftIcon={<Download size={16} />}>
          Esporta CSV
        </Button>
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
              value={filters.isVerified === undefined ? '' : filters.isVerified ? 'true' : 'false'}
              onChange={(e) => {
                const val = e.target.value;
                setFilters({ isVerified: val === '' ? undefined : val === 'true' });
              }}
            >
              <option value="">Tutti gli stati</option>
              <option value="true">Verificati</option>
              <option value="false">Non verificati</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      {paginatedTenants.length > 0 ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Utente</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Citta</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Stato</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Profilo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-text-secondary">Registrato</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-text-secondary">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-background-secondary/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tenant.avatar ? (
                          <img
                            src={tenant.avatar}
                            alt={tenant.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                            {formatInitials(tenant.firstName, tenant.lastName)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-text-primary">
                            {tenant.firstName} {tenant.lastName}
                          </p>
                          <p className="text-sm text-text-muted">{tenant.occupation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{tenant.email}</td>
                    <td className="px-6 py-4 text-text-secondary">{tenant.currentCity || '-'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={tenant.status === 'active' ? 'success' : 'warning'}>
                        {tenant.status === 'active' ? 'Attivo' : 'Inattivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tenant.isVerified && (
                          <span className="text-success" title="Verificato">
                            <Check size={16} />
                          </span>
                        )}
                        {tenant.hasVideo && (
                          <span className="text-info" title="Ha video">
                            <Video size={16} />
                          </span>
                        )}
                        <span className="text-xs text-text-muted">
                          {tenant.profileCompleteness}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {formatDate(tenant.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="btn-icon"
                          onClick={() => setSelectedTenant(tenant)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="btn-icon"
                          onClick={() => setShowActions(showActions === tenant.id ? null : tenant.id)}
                        >
                          <MoreVertical size={16} />
                        </Button>

                        {/* Actions Dropdown */}
                        {showActions === tenant.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-border z-10">
                            <div className="p-1">
                              {!tenant.isVerified && (
                                <button
                                  onClick={() => handleVerify(tenant)}
                                  className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2"
                                >
                                  <Check size={14} className="text-success" />
                                  Verifica Profilo
                                </button>
                              )}
                              <button
                                onClick={() => handleSuspend(tenant)}
                                className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-background-secondary flex items-center gap-2"
                              >
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
              {Math.min(pagination.page * pagination.limit, filteredTenants.length)} di {filteredTenants.length}
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
                Pagina {pagination.page} di {Math.ceil(filteredTenants.length / pagination.limit)}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= Math.ceil(filteredTenants.length / pagination.limit)}
                onClick={() => setPagination({ page: pagination.page + 1 })}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon="👥"
          title="Nessun inquilino trovato"
          description="Prova a modificare i filtri"
        />
      )}

      {/* Tenant Detail Modal */}
      <Modal
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        title="Dettaglio Inquilino"
        size="lg"
      >
        {selectedTenant && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              {selectedTenant.avatar ? (
                <img
                  src={selectedTenant.avatar}
                  alt={selectedTenant.firstName}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                  {formatInitials(selectedTenant.firstName, selectedTenant.lastName)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {selectedTenant.firstName} {selectedTenant.lastName}
                </h3>
                <p className="text-text-secondary">{selectedTenant.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={selectedTenant.isVerified ? 'success' : 'warning'}>
                    {selectedTenant.isVerified ? '✓ Verificato' : 'Non verificato'}
                  </Badge>
                  <Badge variant={selectedTenant.status === 'active' ? 'success' : 'error'}>
                    {selectedTenant.status === 'active' ? 'Attivo' : 'Inattivo'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Eta</p>
                <p className="font-medium">{selectedTenant.age || '-'} anni</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Citta</p>
                <p className="font-medium">{selectedTenant.currentCity || '-'}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Occupazione</p>
                <p className="font-medium">{selectedTenant.occupation || '-'}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Reddito</p>
                <p className="font-medium">
                  {selectedTenant.annualIncome
                    ? formatCurrency(selectedTenant.annualIncome) + '/anno'
                    : '-'}
                </p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Completezza Profilo</p>
                <p className="font-medium">{selectedTenant.profileCompleteness}%</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-muted">Visualizzazioni</p>
                <p className="font-medium">{selectedTenant.profileViews}</p>
              </div>
            </div>

            {selectedTenant.bio && (
              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-text-secondary">{selectedTenant.bio}</p>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedTenant(null)}>
            Chiudi
          </Button>
          {selectedTenant && !selectedTenant.isVerified && (
            <Button onClick={() => {
              handleVerify(selectedTenant);
              setSelectedTenant(null);
            }}>
              Verifica Profilo
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
