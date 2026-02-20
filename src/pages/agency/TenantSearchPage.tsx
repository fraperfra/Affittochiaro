import { useState, useEffect, useCallback } from 'react';
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
  Locate,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Archive,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTenantStore, useAuthStore, useAgencyStore } from '../../store';
import { mockTenants } from '../../utils/mockData';
import { formatCurrency, formatInitials, formatRelativeTime } from '../../utils/formatters';
import { calculateTenantScore } from '../../utils/matching';
import { ITALIAN_CITIES, CONTRACT_TYPES, ROUTES } from '../../utils/constants';
import { Tenant, AgencyUser, ContractType } from '../../types';
import { Card, Button, Badge, Modal, ModalFooter, Input, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

export default function TenantSearchPage() {
  const { tenants, setTenants, filters, setFilters } = useTenantStore();
  const { user } = useAuthStore();
  const { unlockedTenants, addUnlockedTenant, savedTenants, addSavedTenant, removeSavedTenant } = useAgencyStore();
  const agencyUser = user as AgencyUser;

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [unlockingTenant, setUnlockingTenant] = useState<Tenant | null>(null);
  const [unlockNote, setUnlockNote] = useState('');

  const unlockedIds = unlockedTenants.map(t => t.tenantId);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocalizzazione non supportata');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=it`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || '';
          if (city) {
            const match = ITALIAN_CITIES.find((c) => c.toLowerCase() === city.toLowerCase());
            if (match) {
              setFilters({ city: match });
              toast.success(`Posizione: ${match}`);
            } else {
              setFilters({ search: city });
              toast.success(`Posizione: ${city}`);
            }
          } else {
            toast.error('Città non trovata');
          }
        } catch {
          toast.error('Errore geolocalizzazione');
        }
        setGeoLoading(false);
      },
      () => {
        toast.error('Permesso posizione negato');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setFilters]);
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'name'>('score');

  useEffect(() => {
    setTenants(mockTenants);
  }, []);

  // Filtro + calcolo score + sort
  const filteredTenants = tenants
    .filter((tenant) => {
      if (filters.city && tenant.currentCity !== filters.city) return false;
      if (filters.contractType && tenant.preferences.preferredContractType !== filters.contractType) return false;
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

  const handleUnlockClick = (tenant: Tenant) => {
    if (unlockedIds.includes(tenant.id)) return;
    setUnlockingTenant(tenant);
    setUnlockNote('');
  };

  const confirmUnlock = () => {
    if (!unlockingTenant) return;

    addUnlockedTenant({
      tenantId: unlockingTenant.id,
      agencyId: agencyUser?.agency?.id || 'agency-1',
      unlockedAt: new Date(),
      creditsCost: 1,
      contactInfo: {
        email: unlockingTenant.email,
        phone: unlockingTenant.phone
      },
      notes: unlockNote
    });

    toast.success(`Profilo di ${unlockingTenant.firstName} sbloccato!`);
    setUnlockingTenant(null);
  };

  const isUnlocked = (tenantId: string) => unlockedIds.includes(tenantId);
  const savedIds = savedTenants.map((t) => t.tenantId);
  const isSaved = (tenantId: string) => savedIds.includes(tenantId);

  const handleToggleSave = (tenant: Tenant) => {
    if (isSaved(tenant.id)) {
      removeSavedTenant(tenant.id);
      toast('Profilo rimosso dai salvati');
    } else {
      addSavedTenant(tenant.id);
      toast.success(`${tenant.firstName} aggiunto ai salvati`);
    }
  };

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
        <Link to={ROUTES.AGENCY_UNLOCKED_PROFILES}>
          <Button variant="secondary" size="sm" leftIcon={<Archive size={16} />}>
            Archivio profili
            {(unlockedTenants.length + savedTenants.length) > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                {unlockedTenants.length + savedTenants.length}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card padding="sm">
        <div className="flex flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Cerca per nome, citta..."
              className="input pl-10"
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>

          <button
            onClick={handleGeolocate}
            disabled={geoLoading}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {geoLoading ? <Loader2 size={18} className="animate-spin" /> : <Locate size={18} />}
            <span>Vicino a me</span>
          </button>

          <Button
            variant="secondary"
            className="md:hidden !p-2.5"
            onClick={handleGeolocate}
            disabled={geoLoading}
          >
            {geoLoading ? <Loader2 size={20} className="animate-spin" /> : <Locate size={20} />}
          </Button>

          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            className="!p-2.5 aspect-square"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={20} />
          </Button>
        </div>

        {/* Filters Modal */}
        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filtri Ricerca"
        >
          <div className="space-y-4">
            <div>
              <label className="label">Città</label>
              <select
                className="input"
                value={filters.city || ''}
                onChange={(e) => setFilters({ city: e.target.value || undefined })}
              >
                <option value="">Tutte le citta</option>
                {ITALIAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tipo di Contratto</label>
              <select
                className="input"
                value={filters.contractType || ''}
                onChange={(e) => setFilters({ contractType: (e.target.value || undefined) as ContractType | undefined })}
              >
                <option value="">Tutti i contratti</option>
                {CONTRACT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-border bg-white cursor-pointer hover:border-primary-500 transition-colors">
                <span className="font-medium">Solo profili verificati</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-primary-500"
                  checked={filters.isVerified || false}
                  onChange={(e) => setFilters({ isVerified: e.target.checked })}
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border bg-white cursor-pointer hover:border-primary-500 transition-colors">
                <span className="font-medium">Solo con video presentazione</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-primary-500"
                  checked={filters.hasVideo || false}
                  onChange={(e) => setFilters({ hasVideo: e.target.checked })}
                />
              </label>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => {
              setFilters({});
              setShowFilters(false);
            }}>
              Resetta
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              Applica Filtri ({[
                filters.city,
                filters.contractType,
                filters.isVerified,
                filters.hasVideo
              ].filter(Boolean).length})
            </Button>
          </ModalFooter>
        </Modal>

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
              <div className="mt-4 flex gap-2">
                {isUnlocked(tenant.id) ? (
                  <Button variant="secondary" className="flex-1" leftIcon={<Eye size={16} />}>
                    Vedi Contatti
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    leftIcon={<Unlock size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlockClick(tenant);
                    }}
                  >
                    Sblocca (1 credito)
                  </Button>
                )}
                <button
                  title={isSaved(tenant.id) ? 'Rimuovi dai salvati' : 'Salva profilo'}
                  onClick={(e) => { e.stopPropagation(); handleToggleSave(tenant); }}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSaved(tenant.id)
                      ? 'bg-primary-50 border-primary-300 text-primary-600'
                      : 'bg-white border-border text-text-muted hover:border-primary-300 hover:text-primary-500'
                  }`}
                >
                  {isSaved(tenant.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
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
                  <span className="text-sm">Tipo Contratto</span>
                </div>
                <p className="font-medium">
                  {CONTRACT_TYPES.find(ct => ct.value === selectedTenant.preferences.preferredContractType)?.label || 'Non specificato'}
                </p>
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
                <Button onClick={() => handleUnlockClick(selectedTenant)} leftIcon={<Unlock size={16} />}>
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

      {/* Unlock Confirmation Modal */}
      <Modal
        isOpen={!!unlockingTenant}
        onClose={() => setUnlockingTenant(null)}
        title="Conferma Sblocco Profilo"
      >
        <div className="space-y-4">
          <div className="bg-primary-50 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <Unlock size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-text-primary">
                Sbloccare {unlockingTenant?.firstName} {unlockingTenant?.lastName}?
              </p>
              <p className="text-sm text-text-secondary">
                Costo operazione: <span className="font-bold text-primary-600">1 credito</span>
              </p>
            </div>
          </div>

          <div>
            <label className="label">Note (Opzionale)</label>
            <p className="text-xs text-text-muted mb-2">
              Aggiungi una nota per facilitare il lavoro dei tuoi collaboratori (visibile solo alla tua agenzia).
            </p>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="Es: Ottimo profilo, da contattare per l'appartamento in Centro..."
              value={unlockNote}
              onChange={(e) => setUnlockNote(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setUnlockingTenant(null)}>Annulla</Button>
          <Button onClick={confirmUnlock}>Conferma Sblocco</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
