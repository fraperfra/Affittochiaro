import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  Building2,
  Home,
  ExternalLink,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  Users,
  Lock,
} from 'lucide-react';
import { mockAgencies } from '../../utils/mockData';
import { ITALIAN_CITIES } from '../../utils/constants';
import { Agency } from '../../types';
import { Card, Button, Badge, Modal, ModalFooter, EmptyState } from '../../components/ui';

const PLAN_LABELS: Record<string, { label: string; variant: 'primary' | 'success' | 'warning' | 'info' }> = {
  free: { label: 'Free', variant: 'info' },
  base: { label: 'Base', variant: 'primary' },
  professional: { label: 'Professional', variant: 'success' },
  enterprise: { label: 'Enterprise', variant: 'warning' },
};

export default function TenantAgenciesPage() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filteredAgencies = useMemo(() => {
    return mockAgencies.filter((agency) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !agency.name.toLowerCase().includes(s) &&
          !(agency.description || '').toLowerCase().includes(s) &&
          !(agency.address?.city || '').toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      if (cityFilter && agency.address?.city !== cityFilter) return false;
      if (verifiedOnly && !agency.isVerified) return false;
      if (agency.status !== 'active') return false;
      return true;
    });
  }, [search, cityFilter, verifiedOnly]);

  const totalPages = Math.ceil(filteredAgencies.length / perPage);
  const paginatedAgencies = filteredAgencies.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Agenzie Partner</h1>
        <p className="text-text-secondary">
          Scopri le agenzie immobiliari attive sulla piattaforma
        </p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Cerca agenzie per nome, citta..."
              className="input pl-10"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="input w-auto"
              value={cityFilter}
              onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
            >
              <option value="">Tutte le citta</option>
              {ITALIAN_CITIES.slice(0, 15).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <Button
              variant={verifiedOnly ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
              leftIcon={<CheckCircle size={14} />}
            >
              Verificate
            </Button>
          </div>
        </div>
      </Card>

      {/* Results count */}
      <p className="text-sm text-text-muted">
        {filteredAgencies.length} {filteredAgencies.length === 1 ? 'agenzia trovata' : 'agenzie trovate'}
      </p>

      {/* Agencies Grid */}
      {paginatedAgencies.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedAgencies.map((agency) => {
              const hasSubscription = agency.plan !== 'free';

              return (
                <Card
                  key={agency.id}
                  className={`transition-shadow relative overflow-hidden ${hasSubscription ? 'hover:shadow-md cursor-pointer' : ''}`}
                  onClick={() => hasSubscription && setSelectedAgency(agency)}
                >
                  <div className={`space-y-4 ${!hasSubscription ? 'blur-[6px] select-none pointer-events-none' : ''}`}>
                    {/* Agency header */}
                    <div className="flex items-start gap-3">
                      {agency.logo ? (
                        <img
                          src={agency.logo}
                          alt={agency.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <Building2 size={24} className="text-teal-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary truncate">{agency.name}</h3>
                          {agency.isVerified && (
                            <CheckCircle size={16} className="text-success flex-shrink-0" />
                          )}
                        </div>
                        {agency.address?.city && (
                          <p className="text-sm text-text-muted flex items-center gap-1 mt-0.5">
                            <MapPin size={12} />
                            {agency.address.city}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {agency.description && (
                      <p className="text-sm text-text-secondary line-clamp-2">{agency.description}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-text-muted">
                        <Home size={14} />
                        <span>{agency.activeListingsCount} annunci</span>
                      </div>
                      {agency.rating && (
                        <div className="flex items-center gap-1 text-text-muted">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span>{agency.rating.toFixed(1)}</span>
                          <span className="text-text-muted">({agency.reviewsCount})</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <Badge variant={PLAN_LABELS[agency.plan]?.variant || 'info'}>
                        {PLAN_LABELS[agency.plan]?.label || agency.plan}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Vedi profilo
                      </Button>
                    </div>
                  </div>

                  {/* Lock overlay for free agencies */}
                  {!hasSubscription && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 z-10">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <Lock size={22} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-600">Abbonamento richiesto</p>
                      <p className="text-xs text-gray-400 mt-1">Questa agenzia non ha un piano attivo</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">
                Pagina {page} di {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="🏢"
          title="Nessuna agenzia trovata"
          description="Prova a modificare i filtri di ricerca"
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
            {/* Header */}
            <div className="flex items-start gap-4">
              {selectedAgency.logo ? (
                <img
                  src={selectedAgency.logo}
                  alt={selectedAgency.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-teal-100 flex items-center justify-center">
                  <Building2 size={32} className="text-teal-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{selectedAgency.name}</h3>
                  {selectedAgency.isVerified && (
                    <CheckCircle size={20} className="text-success" />
                  )}
                </div>
                {selectedAgency.address?.city && (
                  <p className="text-text-secondary flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {selectedAgency.address.city}
                    {selectedAgency.address.province && `, ${selectedAgency.address.province}`}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <Badge variant={PLAN_LABELS[selectedAgency.plan]?.variant || 'info'}>
                    Piano {PLAN_LABELS[selectedAgency.plan]?.label || selectedAgency.plan}
                  </Badge>
                  {selectedAgency.isVerified && (
                    <Badge variant="success">Verificata</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedAgency.description && (
              <div>
                <h4 className="font-semibold mb-2">Chi siamo</h4>
                <p className="text-text-secondary text-sm">{selectedAgency.description}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-background-secondary rounded-xl text-center">
                <Home size={18} className="mx-auto text-primary-500 mb-1" />
                <p className="text-lg font-bold">{selectedAgency.activeListingsCount}</p>
                <p className="text-xs text-text-muted">Annunci attivi</p>
              </div>
              <div className="p-3 bg-background-secondary rounded-xl text-center">
                <Building2 size={18} className="mx-auto text-teal-500 mb-1" />
                <p className="text-lg font-bold">{selectedAgency.listingsCount}</p>
                <p className="text-xs text-text-muted">Annunci totali</p>
              </div>
              <div className="p-3 bg-background-secondary rounded-xl text-center">
                <Users size={18} className="mx-auto text-accent-500 mb-1" />
                <p className="text-lg font-bold">{selectedAgency.tenantsUnlocked}</p>
                <p className="text-xs text-text-muted">Inquilini contattati</p>
              </div>
              {selectedAgency.rating && (
                <div className="p-3 bg-background-secondary rounded-xl text-center">
                  <Star size={18} className="mx-auto text-amber-400 fill-amber-400 mb-1" />
                  <p className="text-lg font-bold">{selectedAgency.rating.toFixed(1)}</p>
                  <p className="text-xs text-text-muted">{selectedAgency.reviewsCount} recensioni</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-3">Contatti</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                  <Mail size={16} className="text-text-muted" />
                  <span className="text-sm">{selectedAgency.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                  <Phone size={16} className="text-text-muted" />
                  <span className="text-sm">{selectedAgency.phone}</span>
                </div>
                {selectedAgency.website && (
                  <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                    <Globe size={16} className="text-text-muted" />
                    <span className="text-sm text-primary-500">{selectedAgency.website}</span>
                    <ExternalLink size={12} className="text-text-muted" />
                  </div>
                )}
                {selectedAgency.address && (
                  <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                    <MapPin size={16} className="text-text-muted" />
                    <span className="text-sm">
                      {selectedAgency.address.street && `${selectedAgency.address.street}, `}
                      {selectedAgency.address.city}
                      {selectedAgency.address.postalCode && ` ${selectedAgency.address.postalCode}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedAgency(null)}>
            Chiudi
          </Button>
          <Button onClick={() => setSelectedAgency(null)}>
            <Mail size={16} className="mr-2" />
            Contatta
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
