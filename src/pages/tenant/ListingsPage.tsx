import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Euro,
  Home,
  SlidersHorizontal,
  Grid,
  List,
  Map,
  Heart,
  Eye,
  Users,
  X,
  Send,
  CheckCircle,
  Calendar,
  PawPrint,
  Cigarette,
  Locate,
  Loader2,
} from 'lucide-react';
import { useListingStore, useAuthStore } from '../../store';
import { mockListings } from '../../utils/mockData';

const ListingMapView = lazy(() => import('../../components/map/ListingMapView'));
import { formatCurrency, formatNumber, formatSquareMeters } from '../../utils/formatters';
import { ITALIAN_CITIES } from '../../utils/constants';
import { Listing, ListingFilters, TenantUser } from '../../types';
import { EMPLOYMENT_TYPE_LABELS } from '../../types/cv';
import { Card, Button, Badge, Modal, ModalFooter, Input, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation: string;
  employmentType: string;
  monthlyIncome: string;
  moveInDate: string;
  stayDuration: string;
  hasPets: boolean;
  petDetails: string;
  isSmoker: boolean;
  message: string;
}

const INITIAL_FORM: ApplicationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  occupation: '',
  employmentType: '',
  monthlyIncome: '',
  moveInDate: '',
  stayDuration: '12 mesi',
  hasPets: false,
  petDetails: '',
  isSmoker: false,
  message: '',
};

export default function ListingsPage() {
  const { listings, setListings, filters, setFilters, viewMode, setViewMode, savedListings, toggleSavedListing } = useListingStore();
  const { user } = useAuthStore();
  const tenantUser = user as TenantUser;
  const [searchParams] = useSearchParams();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ListingFilters>({});
  const [applyingTo, setApplyingTo] = useState<Listing | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    // Read URL params (from landing page navigation)
    const cityParam = searchParams.get('city');
    const viewParam = searchParams.get('view');

    if (cityParam) {
      setFilters({ city: cityParam });
    }
    if (viewParam === 'map') {
      setViewMode('map');
      setListings(mockListings.slice(0, 500));
    } else {
      setListings(mockListings.slice(0, 50));
    }

    // Load previously applied listing IDs
    const stored = localStorage.getItem('affittochiaro_applied_ids');
    if (stored) setAppliedIds(JSON.parse(stored));
  }, []);

  // Load more listings when switching to map view
  useEffect(() => {
    if (viewMode === 'map' && listings.length <= 50) {
      setListings(mockListings.slice(0, 500));
    }
  }, [viewMode]);

  // Pre-fill form from user profile when opening application modal
  useEffect(() => {
    if (applyingTo && tenantUser?.profile) {
      const p = tenantUser.profile;
      setFormData({
        ...INITIAL_FORM,
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: tenantUser.email || '',
        phone: p.phone || '',
        occupation: p.occupation || '',
        employmentType: p.employmentType || '',
        monthlyIncome: p.annualIncome ? `${Math.round(p.annualIncome / 12).toLocaleString('it-IT')} €/mese` : '',
      });
    }
  }, [applyingTo]);

  const filteredListings = listings.filter((listing) => {
    if (filters.city && listing.address.city !== filters.city) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.minRooms && listing.rooms < filters.minRooms) return false;
    if (listing.status !== 'active') return false;
    return true;
  });

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setFilters({});
  };

  const openApplicationForm = (listing: Listing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (appliedIds.includes(listing.id)) {
      toast('Hai gia inviato la candidatura per questo annuncio', { icon: '📝' });
      return;
    }
    setApplyingTo(listing);
  };

  const handleSubmitApplication = async () => {
    if (!applyingTo) return;

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Scrivi un messaggio di presentazione');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    const application = {
      id: `app_${Date.now()}`,
      ...formData,
      listingId: applyingTo.id as unknown as number,
      listingTitle: applyingTo.title,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    // Save to localStorage (compatible with ApplicationsPage)
    const existing = JSON.parse(localStorage.getItem('affittochiaro_applications') || '[]');
    existing.push(application);
    localStorage.setItem('affittochiaro_applications', JSON.stringify(existing));

    // Create notification for agency
    const notification = {
      id: `notif_${Date.now()}`,
      type: 'new_application',
      title: 'Nuova candidatura ricevuta',
      message: `${formData.firstName} ${formData.lastName} si e candidato per "${applyingTo.title}"`,
      applicantName: `${formData.firstName} ${formData.lastName}`,
      listingTitle: applyingTo.title,
      listingId: applyingTo.id,
      applicationId: application.id,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const existingNotifs = JSON.parse(localStorage.getItem('affittochiaro_agency_notifications') || '[]');
    existingNotifs.unshift(notification);
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify(existingNotifs));

    // Track applied listings
    const newAppliedIds = [...appliedIds, applyingTo.id];
    setAppliedIds(newAppliedIds);
    localStorage.setItem('affittochiaro_applied_ids', JSON.stringify(newAppliedIds));

    setIsSubmitting(false);
    setApplyingTo(null);
    setFormData(INITIAL_FORM);
    toast.success('Candidatura inviata con successo!');
  };

  const isApplied = (listingId: string) => appliedIds.includes(listingId);

  return (
    <div className="space-y-6">
      {/* Search & Filters Bar */}
      <Card padding="sm" className="sticky top-0 z-20">
        {/* Mobile: compact single row with search + filter button */}
        <div className="flex gap-2 md:hidden">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Cerca annunci..."
              className="input pl-9 py-2 text-sm"
              value={filters.search || ''}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
          <button
            onClick={handleGeolocate}
            disabled={geoLoading}
            className="shrink-0 p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50"
            title="Vicino a me"
          >
            {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Locate size={16} />}
          </button>
          <Button
            variant="secondary"
            leftIcon={<SlidersHorizontal size={16} />}
            onClick={() => setShowFilters(true)}
            className="shrink-0"
          >
            Filtri
          </Button>
          <div className="flex gap-0.5 p-0.5 bg-background-secondary rounded-lg shrink-0">
            <button
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              onClick={() => setViewMode('map')}
            >
              <Map size={16} />
            </button>
          </div>
        </div>

        {/* Mobile: results count inline */}
        <div className="flex items-center justify-between mt-2 md:hidden">
          <p className="text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">{formatNumber(filteredListings.length)}</span> annunci
          </p>
          {(filters.city || filters.maxPrice || filters.minRooms) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              <X size={12} />
              Reset
            </button>
          )}
        </div>

        {/* Desktop: full layout */}
        <div className="hidden md:block">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="Cerca per citta, via, zona..."
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
                {ITALIAN_CITIES.slice(0, 10).map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <button
                onClick={handleGeolocate}
                disabled={geoLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Locate size={16} />}
                Vicino a me
              </button>

              <select
                className="input w-auto"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
              >
                <option value="">Prezzo max</option>
                <option value="500">Max €500</option>
                <option value="800">Max €800</option>
                <option value="1000">Max €1.000</option>
                <option value="1500">Max €1.500</option>
                <option value="2000">Max €2.000</option>
              </select>

              <select
                className="input w-auto"
                value={filters.minRooms || ''}
                onChange={(e) => setFilters({ minRooms: e.target.value ? parseInt(e.target.value) : undefined })}
              >
                <option value="">Locali</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>

              <Button
                variant="secondary"
                leftIcon={<SlidersHorizontal size={16} />}
                onClick={() => setShowFilters(true)}
              >
                Filtri
              </Button>
            </div>

            <div className="flex gap-1 p-1 bg-background-secondary rounded-lg">
              <button
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                onClick={() => setViewMode('grid')}
                title="Vista griglia"
              >
                <Grid size={18} />
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                onClick={() => setViewMode('list')}
                title="Vista lista"
              >
                <List size={18} />
              </button>
              <button
                className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                onClick={() => setViewMode('map')}
                title="Vista mappa"
              >
                <Map size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-text-secondary">
              <span className="font-semibold text-text-primary">{formatNumber(filteredListings.length)}</span> annunci trovati
            </p>
            {(filters.city || filters.maxPrice || filters.minRooms) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
              >
                <X size={14} />
                Rimuovi filtri
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Map View */}
      {viewMode === 'map' ? (
        <Suspense fallback={
          <div className="h-[calc(100vh-280px)] bg-background-secondary rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-3"></div>
              <span className="text-text-secondary">Caricamento mappa...</span>
            </div>
          </div>
        }>
          <div className="h-[calc(100vh-280px)] rounded-xl overflow-hidden border border-border">
            <ListingMapView
              listings={filteredListings}
              activeCity={filters.city}
              onListingClick={(listing) => setSelectedListing(listing)}
              onApply={(listing) => openApplicationForm(listing)}
              isApplied={isApplied}
            />
          </div>
        </Suspense>
      ) : filteredListings.length > 0 ? (
        <div className={`grid ${viewMode === 'grid' ? 'gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'gap-2 grid-cols-1'}`}>
          {filteredListings.map((listing) => {
            const isNew = listing.createdAt && new Date().getTime() - new Date(listing.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
            const isSaved = savedListings.includes(listing.id);

            return (
              <Card
                key={listing.id}
                hover
                padding="none"
                className="overflow-hidden"
                onClick={() => setSelectedListing(listing)}
              >
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="relative w-28 md:w-36 min-h-[100px] shrink-0 bg-gradient-to-br from-primary-100 to-teal-100">
                    {isNew && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-primary-500 text-white rounded">NUOVO</span>
                    )}
                    <button
                      className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSaved ? 'bg-error text-white' : 'bg-white/90 text-text-secondary hover:text-error'
                      }`}
                      onClick={(e) => { e.stopPropagation(); toggleSavedListing(listing.id); }}
                    >
                      <Heart size={12} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-text-primary line-clamp-1">{listing.title}</h3>
                      <div className="flex items-center gap-1 text-text-secondary text-xs mt-0.5">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate">{listing.address.city}{listing.zone ? ` • ${listing.zone}` : ''}</span>
                      </div>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 bg-background-secondary rounded text-text-secondary">{listing.rooms} locali</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-background-secondary rounded text-text-secondary">{listing.squareMeters}m²</span>
                        {listing.furnished === 'yes' && <span className="text-[10px] px-1.5 py-0.5 bg-background-secondary rounded text-text-secondary">Arredato</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-base font-bold text-primary-600">
                        {formatCurrency(listing.price)}<span className="text-[10px] font-normal text-text-muted">/mese</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="hidden md:flex items-center gap-1 text-[10px] text-text-muted"><Users size={11} />{listing.applicationsCount}</span>
                        <span className="hidden md:flex items-center gap-1 text-[10px] text-text-muted"><Eye size={11} />{listing.views}</span>
                        {isApplied(listing.id) ? (
                          <span className="text-[10px] text-text-muted flex items-center gap-0.5"><CheckCircle size={11} /> Inviata</span>
                        ) : (
                          <button
                            className="text-[11px] font-semibold text-primary-500 flex items-center gap-0.5"
                            onClick={(e) => openApplicationForm(listing, e)}
                          >
                            <Send size={11} /> Candidati
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="🏠"
          title="Nessun annuncio trovato"
          description="Prova a modificare i filtri di ricerca"
          action={{
            label: 'Rimuovi filtri',
            onClick: handleClearFilters,
          }}
        />
      )}

      {/* Listing Detail Modal */}
      <Modal
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title={selectedListing?.title}
        size="lg"
      >
        {selectedListing && (
          <div className="space-y-6">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-teal-100 rounded-xl" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-3xl font-bold text-primary-600">
                  {formatCurrency(selectedListing.price)}
                </span>
                <span className="text-text-muted">/mese</span>
                {selectedListing.expenses && (
                  <p className="text-sm text-text-muted">
                    + {formatCurrency(selectedListing.expenses)} spese
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">{selectedListing.address.city}</p>
                <p className="text-sm text-text-muted">{selectedListing.zone}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 p-4 bg-background-secondary rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedListing.rooms}</p>
                <p className="text-xs text-text-muted">Locali</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedListing.squareMeters}</p>
                <p className="text-xs text-text-muted">m²</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{selectedListing.bathrooms}</p>
                <p className="text-xs text-text-muted">Bagni</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">
                  {selectedListing.floor !== undefined ? selectedListing.floor : '-'}
                </p>
                <p className="text-xs text-text-muted">Piano</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Descrizione</h4>
              <p className="text-text-secondary">{selectedListing.description}</p>
            </div>

            {selectedListing.features.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Caratteristiche</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.features.map((feature) => (
                    <Badge key={feature} variant="success">✓ {feature}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 bg-background-secondary rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                🏢
              </div>
              <div className="flex-1">
                <p className="font-medium">{selectedListing.agencyName}</p>
                <p className="text-sm text-text-muted">Agenzia verificata</p>
              </div>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedListing(null)}>
            Chiudi
          </Button>
          {selectedListing && (
            <>
              <Button
                leftIcon={<Heart size={16} />}
                variant="outline"
                onClick={() => {
                  toggleSavedListing(selectedListing.id);
                  toast.success(savedListings.includes(selectedListing.id) ? 'Rimosso dai salvati' : 'Salvato!');
                }}
              >
                {savedListings.includes(selectedListing.id) ? 'Salvato' : 'Salva'}
              </Button>
              {isApplied(selectedListing.id) ? (
                <Button disabled variant="secondary" leftIcon={<CheckCircle size={16} />}>
                  Gia candidato
                </Button>
              ) : (
                <Button
                  leftIcon={<Send size={16} />}
                  onClick={() => {
                    setSelectedListing(null);
                    openApplicationForm(selectedListing);
                  }}
                >
                  Candidati
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </Modal>

      {/* Application Form Modal */}
      <Modal
        isOpen={!!applyingTo}
        onClose={() => { setApplyingTo(null); setFormData(INITIAL_FORM); }}
        title="Candidatura"
        size="lg"
      >
        {applyingTo && (
          <div className="space-y-6">
            {/* Listing summary */}
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <p className="text-sm text-primary-600 font-medium">Ti stai candidando per:</p>
              <p className="font-bold text-text-primary mt-1">{applyingTo.title}</p>
              <p className="text-sm text-text-secondary">
                {applyingTo.address.city} - {formatCurrency(applyingTo.price)}/mese
              </p>
            </div>

            {/* Personal Info */}
            <div>
              <h4 className="font-semibold mb-3">Dati Personali</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nome *"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <Input
                  label="Cognome *"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label="Telefono *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Employment */}
            <div>
              <h4 className="font-semibold mb-3">Situazione Lavorativa</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Occupazione"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                />
                <div>
                  <label className="label">Tipo Contratto</label>
                  <select
                    className="input"
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  >
                    <option value="">Seleziona...</option>
                    {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Reddito mensile"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="es. 1.500 €/mese"
                />
              </div>
            </div>

            {/* Housing Preferences */}
            <div>
              <h4 className="font-semibold mb-3">Preferenze Abitative</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Data ingresso desiderata"
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                />
                <div>
                  <label className="label">Durata permanenza</label>
                  <select
                    className="input"
                    value={formData.stayDuration}
                    onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
                  >
                    <option value="6 mesi">6 mesi</option>
                    <option value="12 mesi">12 mesi</option>
                    <option value="24 mesi">24 mesi</option>
                    <option value="36+ mesi">36+ mesi</option>
                    <option value="Indeterminata">Indeterminata</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasPets}
                    onChange={(e) => setFormData({ ...formData, hasPets: e.target.checked })}
                    className="rounded border-border"
                  />
                  <PawPrint size={16} className="text-text-muted" />
                  <span className="text-sm">Ho animali domestici</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSmoker}
                    onChange={(e) => setFormData({ ...formData, isSmoker: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Cigarette size={16} className="text-text-muted" />
                  <span className="text-sm">Fumatore</span>
                </label>
              </div>

              {formData.hasPets && (
                <Input
                  label="Descrivi i tuoi animali"
                  className="mt-3"
                  value={formData.petDetails}
                  onChange={(e) => setFormData({ ...formData, petDetails: e.target.value })}
                  placeholder="es. Un gatto di 3 anni"
                />
              )}
            </div>

            {/* Message */}
            <div>
              <label className="label">Messaggio di presentazione *</label>
              <textarea
                className="input min-h-[100px] resize-y"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Presentati brevemente: chi sei, perche cerchi questa casa, quando vorresti trasferirti..."
                rows={4}
              />
              <p className="text-xs text-text-muted mt-1">
                Un buon messaggio aumenta le possibilita di essere selezionato
              </p>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setApplyingTo(null); setFormData(INITIAL_FORM); }}>
            Annulla
          </Button>
          <Button
            leftIcon={<Send size={16} />}
            onClick={handleSubmitApplication}
            isLoading={isSubmitting}
          >
            Invia Candidatura
          </Button>
        </ModalFooter>
      </Modal>

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtri Avanzati"
      >
        <div className="space-y-5">
          <div>
            <label className="label">Citta</label>
            <select
              className="input"
              value={localFilters.city || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value || undefined })}
            >
              <option value="">Tutte le citta</option>
              {ITALIAN_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prezzo minimo"
              type="number"
              placeholder="€"
              value={localFilters.minPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value ? parseInt(e.target.value) : undefined })}
            />
            <Input
              label="Prezzo massimo"
              type="number"
              placeholder="€"
              value={localFilters.maxPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>

          <div>
            <label className="label">Numero locali minimo</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`flex-1 py-2 rounded-lg border ${
                    localFilters.minRooms === num
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-border hover:border-primary-300'
                  }`}
                  onClick={() => setLocalFilters({ ...localFilters, minRooms: num })}
                >
                  {num}+
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Arredamento</label>
            <div className="flex gap-2">
              {[
                { value: undefined, label: 'Tutti' },
                { value: 'yes', label: 'Arredato' },
                { value: 'no', label: 'Non arredato' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  className={`flex-1 py-2 rounded-lg border ${
                    localFilters.furnished === opt.value
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-border hover:border-primary-300'
                  }`}
                  onClick={() => setLocalFilters({ ...localFilters, furnished: opt.value as any })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={handleClearFilters}>
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>
            Applica Filtri
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
