import { useState, useEffect, useCallback } from 'react';
import {
  SlidersHorizontal,
  Unlock,
  Eye,
  Video,
  Check,
  MapPin,
  Briefcase,
  Euro,
  Mail,
  Phone,
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
      if (filters.search && !`${tenant.firstName} ${tenant.lastName} ${tenant.currentCity} ${tenant.occupation || ''}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.city && tenant.currentCity !== filters.city) return false;
      if (filters.contractType && tenant.preferences.preferredContractType !== filters.contractType) return false;
      if (filters.isVerified && !tenant.isVerified) return false;
      if (filters.hasVideo && !tenant.hasVideo) return false;
      if (filters.hasPets !== undefined && tenant.preferences.hasPets !== filters.hasPets) return false;
      if (filters.minAge !== undefined && (tenant.age === undefined || tenant.age < filters.minAge)) return false;
      if (filters.maxAge !== undefined && (tenant.age === undefined || tenant.age > filters.maxAge)) return false;
      if (filters.maxBudget !== undefined && tenant.preferences.maxBudget !== undefined && tenant.preferences.maxBudget > filters.maxBudget) return false;
      if (filters.minBudget !== undefined && tenant.preferences.maxBudget !== undefined && tenant.preferences.maxBudget < filters.minBudget) return false;
      if (filters.familyUnit && tenant.familyUnit !== filters.familyUnit) return false;
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
          <button
            onClick={handleGeolocate}
            disabled={geoLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {geoLoading ? <Loader2 size={18} className="animate-spin" /> : <Locate size={18} />}
            <span className="hidden sm:inline">Vicino a me</span>
          </button>

          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            className="flex-1 sm:flex-none"
            onClick={() => setShowFilters(true)}
            leftIcon={<SlidersHorizontal size={18} />}
          >
            Filtri
          </Button>
        </div>

        {/* Filters Modal */}
        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filtri Ricerca"
        >
          <div className="space-y-5">
            {/* Raggio di ricerca */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Raggio di ricerca</label>
                <span className="text-sm font-semibold text-primary-600">{filters.radius ?? 10} km</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                className="w-full accent-primary-500"
                value={filters.radius ?? 10}
                onChange={(e) => setFilters({ radius: Number(e.target.value) })}
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>1 km</span><span>50 km</span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="label">Budget mensile (€)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="input"
                  placeholder="Min (es. 400)"
                  value={filters.minBudget ?? ''}
                  onChange={(e) => setFilters({ minBudget: e.target.value ? Number(e.target.value) : undefined })}
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Max (es. 1200)"
                  value={filters.maxBudget ?? ''}
                  onChange={(e) => setFilters({ maxBudget: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            {/* Età */}
            <div>
              <label className="label">Età</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  className="input"
                  placeholder="Da (es. 18)"
                  value={filters.minAge ?? ''}
                  onChange={(e) => setFilters({ minAge: e.target.value ? Number(e.target.value) : undefined })}
                />
                <input
                  type="number"
                  className="input"
                  placeholder="A (es. 65)"
                  value={filters.maxAge ?? ''}
                  onChange={(e) => setFilters({ maxAge: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            {/* Contratto */}
            <div>
              <label className="label">Tipo di Contratto</label>
              <select
                className="input"
                value={filters.contractType || ''}
                onChange={(e) => setFilters({ contractType: (e.target.value || undefined) as ContractType | undefined })}
              >
                <option value="">Qualsiasi</option>
                {CONTRACT_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>

            {/* Animali domestici */}
            <div>
              <label className="label">Animali domestici</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: '', lbl: 'Indifferente' },
                  { val: 'yes', lbl: 'Sì' },
                  { val: 'no', lbl: 'No' },
                ].map(({ val, lbl }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFilters({ hasPets: val === '' ? undefined : val === 'yes' })}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                      (val === '' && filters.hasPets === undefined) ||
                      (val === 'yes' && filters.hasPets === true) ||
                      (val === 'no' && filters.hasPets === false)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-text-secondary border-border hover:border-primary-300'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Stato Immobile */}
            <div>
              <label className="label">Stato Immobile</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: '', lbl: 'Indifferente' },
                  { val: 'nuovo', lbl: 'Nuovo' },
                  { val: 'buono', lbl: 'Buono stato' },
                  { val: 'da_ristrutturare', lbl: 'Da ristrutturare' },
                ].map(({ val, lbl }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFilters({ propertyCondition: val || undefined })}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                      (filters.propertyCondition ?? '') === val
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-text-secondary border-border hover:border-primary-300'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Nucleo familiare */}
            <div>
              <label className="label">Nucleo familiare</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: '', lbl: 'Tutti' },
                  { val: 'solo', lbl: 'Solo' },
                  { val: 'coppia', lbl: 'Coppia' },
                  { val: 'famiglia', lbl: 'Famiglia' },
                  { val: 'coinquilini', lbl: 'Coinquilini' },
                ].map(({ val, lbl }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFilters({ familyUnit: val || undefined })}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                      (filters.familyUnit ?? '') === val
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-text-secondary border-border hover:border-primary-300'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* In cerca di */}
            <div>
              <label className="label">In cerca di</label>
              <select
                className="input"
                value={filters.lookingFor || ''}
                onChange={(e) => setFilters({ lookingFor: e.target.value || undefined })}
              >
                <option value="">Qualsiasi</option>
                <option value="intero">Intera proprietà</option>
                <option value="stanza_singola">Stanza singola</option>
                <option value="stanza_doppia">Stanza doppia</option>
              </select>
            </div>

            {/* Tipo di immobile */}
            <div>
              <label className="label">Tipo di immobile</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { val: '', lbl: 'Tutti' },
                  { val: 'appartamento', lbl: 'Appartamento' },
                  { val: 'villa', lbl: 'Villa' },
                  { val: 'studio', lbl: 'Studio' },
                  { val: 'stanza', lbl: 'Stanza' },
                  { val: 'altro', lbl: 'Altro' },
                ].map(({ val, lbl }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFilters({ propertyType: val || undefined })}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                      (filters.propertyType ?? '') === val
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-text-secondary border-border hover:border-primary-300'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
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
              Applica ({[
                filters.contractType,
                filters.hasPets !== undefined && String(filters.hasPets),
                filters.minAge,
                filters.maxAge,
                filters.minBudget,
                filters.maxBudget,
                filters.familyUnit,
                filters.propertyCondition,
                filters.lookingFor,
                filters.propertyType,
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
        {selectedTenant && (() => {
          const t = selectedTenant;
          const unlocked = isUnlocked(t.id);
          const empLabels: Record<string, string> = {
            permanent: 'Indeterminato', fixed_term: 'Determinato', freelance: 'Autonomo / Libero professionista',
            internship: 'Stage', student: 'Studente', retired: 'Pensionato', unemployed: 'Disoccupato',
          };
          const furnishedLabels: Record<string, string> = { yes: 'Sì', no: 'No', indifferent: 'Indifferente' };
          const familyLabels: Record<string, string> = {
            solo: 'Solo', coppia: 'Coppia', famiglia: 'Famiglia', coinquilini: 'Coinquilini',
          };

          return (
            <div className="space-y-5">

              {/* ── Header ─────────────────────────────── */}
              <div className="flex items-start gap-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.firstName} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {formatInitials(t.firstName, t.lastName)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-text-primary">
                    {t.firstName} {t.lastName}
                  </h2>
                  <p className="text-text-secondary text-sm mt-0.5">
                    {t.ageRange ? `${t.ageRange} anni` : t.age ? `${t.age} anni` : ''}{t.currentCity ? ` · ${t.currentCity}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {t.isVerified && <Badge variant="success" size="sm">✓ Verificato</Badge>}
                    {t.hasVideo && <Badge variant="info" size="sm">🎥 Video</Badge>}
                    {(() => { const score = filteredTenants.find(f => f.id === t.id)?.matchScore ?? calculateTenantScore(t); return (
                      <Badge variant={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'} size="sm">
                        {score}% match
                      </Badge>
                    ); })()}
                    <span className="text-xs text-text-muted bg-background-secondary px-2 py-0.5 rounded-full">
                      {t.profileViews} visualizzazioni
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Presentazione ──────────────────────── */}
              {t.bio && (
                <div className="p-4 bg-background-secondary rounded-xl">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5">Presentazione</p>
                  <p className="text-sm text-text-primary leading-relaxed">{t.bio}</p>
                </div>
              )}

              {/* ── Cosa sta cercando ──────────────────── */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Cosa sta cercando</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <InfoCell label="Città cercata" value={t.preferences.preferredCities?.join(', ') || t.currentCity} />
                  <InfoCell label="Budget max" value={t.preferences.maxBudget ? `€ ${t.preferences.maxBudget}/mese` : undefined} />
                  <InfoCell label="Camere" value={t.preferences.minRooms || t.preferences.maxRooms
                    ? `${t.preferences.minRooms ?? '?'} – ${t.preferences.maxRooms ?? '?'}`
                    : undefined} />
                  <InfoCell label="Arredato" value={t.preferences.furnished ? furnishedLabels[t.preferences.furnished] : undefined} />
                  <InfoCell label="Contratto preferito" value={CONTRACT_TYPES.find(c => c.value === t.preferences.preferredContractType)?.label} />
                  <InfoCell label="Disponibile da" value={t.availableFrom ? new Date(t.availableFrom).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }) : undefined} />
                  {t.preferences.parkingRequired && <InfoCell label="Parcheggio" value="Richiesto" />}
                </div>
              </div>

              {/* ── Lavoro & Reddito ───────────────────── */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Lavoro & Reddito</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <InfoCell label="Occupazione" value={t.occupation} />
                  <InfoCell label="Tipo contratto lavoro" value={t.employmentType ? empLabels[t.employmentType] : undefined} />
                  <InfoCell label="Datore di lavoro" value={t.employer} />
                  {t.incomeVisible && t.annualIncome && (
                    <InfoCell label="Reddito annuo lordo" value={`€ ${t.annualIncome.toLocaleString('it-IT')}`} />
                  )}
                </div>
              </div>

              {/* ── Situazione personale + Hobby ───────── */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Situazione personale</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  <InfoCell label="Nucleo familiare" value={t.familyUnit ? familyLabels[t.familyUnit] : undefined} />
                  {t.numPeople && <InfoCell label="Persone totali" value={String(t.numPeople)} />}
                  {t.hasChildren !== undefined && (
                    <InfoCell label="Figli" value={t.hasChildren ? `Sì${t.numChildren ? ` (${t.numChildren})` : ''}` : 'No'} />
                  )}
                  <InfoCell label="Animali domestici" value={t.preferences.hasPets ? `Sì${t.preferences.petType ? ` — ${t.preferences.petType}` : ''}` : 'No'} />
                  {t.preferences.smokingAllowed !== undefined && (
                    <InfoCell label="Fumatore" value={t.preferences.smokingAllowed ? 'Sì' : 'No'} />
                  )}
                  {t.nationality && <InfoCell label="Nazionalità" value={t.nationality} />}
                </div>
                {t.hobbies && t.hobbies.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-2">Hobby & Interessi</p>
                    <div className="flex flex-wrap gap-1.5">
                      {t.hobbies.map((h) => (
                        <span key={h} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Contatti / Sblocco ─────────────────── */}
              {unlocked ? (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Contatti sbloccati</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <a href={`mailto:${t.email}`} className="flex items-center gap-1.5 text-green-800 font-medium hover:underline">
                      <Mail size={13} />{t.email}
                    </a>
                    {t.phone && (
                      <a href={`tel:${t.phone}`} className="flex items-center gap-1.5 text-green-800 font-medium hover:underline">
                        <Phone size={13} />{t.phone}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-background-secondary rounded-xl text-center">
                  <p className="text-sm text-text-muted mb-3">Sblocca il profilo per vedere i contatti</p>
                  <Button onClick={() => { setSelectedTenant(null); handleUnlockClick(t); }} leftIcon={<Unlock size={16} />}>
                    Sblocca (1 credito)
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedTenant(null)}>Chiudi</Button>
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

function InfoCell({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="p-3 bg-background-secondary rounded-xl">
      <p className="text-xs text-text-muted mb-0.5">{label}</p>
      <p className="text-sm font-medium text-text-primary leading-snug">{value}</p>
    </div>
  );
}
