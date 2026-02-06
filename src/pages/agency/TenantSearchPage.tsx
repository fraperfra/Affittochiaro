import { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Unlock,
  Eye,
  Video,
  Check,
  MapPin,
  Briefcase,
  Euro,
  Download,
  X,
} from 'lucide-react';
import { useTenantStore, useAuthStore } from '../../store';
import { mockTenants } from '../../utils/mockData';
import { formatCurrency, formatInitials, formatRelativeTime } from '../../utils/formatters';
import { calculateTenantScore } from '../../utils/matching';
import { ITALIAN_CITIES, OCCUPATIONS } from '../../utils/constants';
import { Tenant, AgencyUser } from '../../types';
import { Card, Button, Badge, Modal, ModalFooter, Input, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

export default function TenantSearchPage() {
  const { tenants, setTenants, filters, setFilters } = useTenantStore();
  const { user } = useAuthStore();
  const agencyUser = user as AgencyUser;
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'name'>('score');

  useEffect(() => {
    setTenants(mockTenants);
  }, []);

  // Filtro + calcolo score + sort
  const filteredTenants = tenants
    .filter((tenant) => {
      if (filters.city && tenant.currentCity !== filters.city) return false;
      if (filters.occupation && tenant.occupation !== filters.occupation) return false;
      if (filters.isVerified && !tenant.isVerified) return false;
      if (filters.hasVideo && !tenant.hasVideo) return false;
      if (tenant.status !== 'active') return false;
      return true;
    })
    .map((tenant) => ({
      ...tenant,
      matchScore: calculateTenantScore(tenant),
    }))
    .sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.firstName.localeCompare(b.firstName);
    });

  const handleUnlock = (tenant: Tenant) => {
    if (unlockedIds.includes(tenant.id)) return;

    // Simulate unlock
    setUnlockedIds([...unlockedIds, tenant.id]);
    toast.success(`Profilo di ${tenant.firstName} sbloccato!`);
  };

  const isUnlocked = (tenantId: string) => unlockedIds.includes(tenantId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Cerca Inquilini</h1>
          <p className="text-text-secondary">
            {agencyUser?.agency?.credits || 0} crediti disponibili per sbloccare profili
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card padding="sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Cerca per nome, citta, professione..."
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
              value={filters.occupation || ''}
              onChange={(e) => setFilters({ occupation: e.target.value || undefined })}
            >
              <option value="">Tutte le occupazioni</option>
              {OCCUPATIONS.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>

            <Button
              variant={filters.isVerified ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilters({ isVerified: !filters.isVerified })}
            >
              ✓ Verificati
            </Button>

            <Button
              variant={filters.hasVideo ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilters({ hasVideo: !filters.hasVideo })}
            >
              🎥 Con Video
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-text-secondary">
            <span className="font-semibold text-text-primary">{filteredTenants.length}</span> inquilini trovati
          </p>
          <select
            className="input w-auto text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'recent' | 'name')}
          >
            <option value="score">Punteggio</option>
            <option value="recent">Piu recenti</option>
            <option value="name">Nome A-Z</option>
          </select>
        </div>
      </Card>

      {/* Tenants Grid */}
      {filteredTenants.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTenants.slice(0, 20).map((tenant) => (
            <Card key={tenant.id} hover onClick={() => setSelectedTenant(tenant)}>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  {tenant.avatar ? (
                    <img
                      src={tenant.avatar}
                      alt={tenant.firstName}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                      {formatInitials(tenant.firstName, tenant.lastName)}
                    </div>
                  )}
                  {tenant.hasVideo && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-info flex items-center justify-center">
                      <Video size={12} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary truncate">
                      {tenant.firstName} {tenant.lastName.charAt(0)}.
                    </h3>
                    {tenant.isVerified && (
                      <Check size={16} className="text-success flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-text-muted">
                    {tenant.age} anni • {tenant.occupation}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-text-muted mt-1">
                    <MapPin size={12} />
                    <span>{tenant.currentCity}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant={tenant.matchScore >= 70 ? 'success' : tenant.matchScore >= 50 ? 'warning' : 'error'}
                  size="sm"
                >
                  {tenant.matchScore}% match
                </Badge>
                {tenant.isVerified && <Badge variant="success" size="sm">✓ Verificato</Badge>}
                {tenant.hasVideo && <Badge variant="info" size="sm">🎥 Video</Badge>}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border text-sm">
                <div>
                  <p className="text-text-muted">Budget</p>
                  <p className="font-medium">
                    {tenant.preferences.maxBudget
                      ? formatCurrency(tenant.preferences.maxBudget) + '/mese'
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Disponibile da</p>
                  <p className="font-medium">
                    {tenant.availableFrom
                      ? formatRelativeTime(tenant.availableFrom)
                      : 'Subito'}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4">
                {isUnlocked(tenant.id) ? (
                  <Button variant="secondary" className="w-full" leftIcon={<Eye size={16} />}>
                    Vedi Contatti
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    leftIcon={<Unlock size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlock(tenant);
                    }}
                  >
                    Sblocca (1 credito)
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="👥"
          title="Nessun inquilino trovato"
          description="Prova a modificare i filtri di ricerca"
        />
      )}

      {/* Tenant Detail Modal */}
      <Modal
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        title="Profilo Inquilino"
        size="lg"
      >
        {selectedTenant && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              {selectedTenant.avatar ? (
                <img
                  src={selectedTenant.avatar}
                  alt={selectedTenant.firstName}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                  {formatInitials(selectedTenant.firstName, selectedTenant.lastName)}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {selectedTenant.firstName} {selectedTenant.lastName}
                </h2>
                <p className="text-text-secondary">
                  {selectedTenant.age} anni • {selectedTenant.occupation}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTenant.isVerified && <Badge variant="success">✓ Verificato</Badge>}
                  {selectedTenant.hasVideo && <Badge variant="info">🎥 Video</Badge>}
                </div>
              </div>
            </div>

            {/* Bio */}
            {selectedTenant.bio && (
              <div>
                <h4 className="font-semibold mb-2">Presentazione</h4>
                <p className="text-text-secondary">{selectedTenant.bio}</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Briefcase size={14} />
                  <span className="text-sm">Occupazione</span>
                </div>
                <p className="font-medium">{selectedTenant.occupation}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <MapPin size={14} />
                  <span className="text-sm">Citta</span>
                </div>
                <p className="font-medium">{selectedTenant.currentCity}</p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Euro size={14} />
                  <span className="text-sm">Budget Massimo</span>
                </div>
                <p className="font-medium">
                  {selectedTenant.preferences.maxBudget
                    ? formatCurrency(selectedTenant.preferences.maxBudget) + '/mese'
                    : 'Non specificato'}
                </p>
              </div>
              <div className="p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Eye size={14} />
                  <span className="text-sm">Visualizzazioni</span>
                </div>
                <p className="font-medium">{selectedTenant.profileViews}</p>
              </div>
            </div>

            {/* Contact Info (if unlocked) */}
            {isUnlocked(selectedTenant.id) ? (
              <div className="p-4 bg-success/10 rounded-xl border border-success/20">
                <h4 className="font-semibold text-success mb-2">Contatti Sbloccati</h4>
                <div className="space-y-2">
                  <p>
                    <span className="text-text-muted">Email:</span>{' '}
                    <span className="font-medium">{selectedTenant.email}</span>
                  </p>
                  {selectedTenant.phone && (
                    <p>
                      <span className="text-text-muted">Telefono:</span>{' '}
                      <span className="font-medium">{selectedTenant.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-background-secondary rounded-xl text-center">
                <p className="text-text-muted mb-3">
                  Sblocca il profilo per vedere i contatti
                </p>
                <Button onClick={() => handleUnlock(selectedTenant)} leftIcon={<Unlock size={16} />}>
                  Sblocca (1 credito)
                </Button>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedTenant(null)}>
            Chiudi
          </Button>
          {isUnlocked(selectedTenant?.id || '') && (
            <Button leftIcon={<Download size={16} />}>
              Scarica CV
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
