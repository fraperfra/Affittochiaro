import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Search,
  Map as MapIcon,
  List,
  Heart,
  X,
  SlidersHorizontal,
  Navigation,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { ApplicationModal, ListingsMap } from '../components';
import { ApplicationData } from '../components/ApplicationModal';
import { listings, LISTING_CITIES, LISTING_TYPES, Listing } from '../data';
import { useAuthStore, useListingStore } from '@/store';
import type { CachedListing } from '@/store/listingStore';

// City coordinates for map view
const CITY_COORDINATES: Record<string, [number, number]> = {
  'Milano': [45.4642, 9.1900],
  'Roma': [41.9028, 12.4964],
  'Napoli': [40.8518, 14.2681],
  'Torino': [45.0703, 7.6869],
  'Firenze': [43.7696, 11.2558],
  'Bologna': [44.4949, 11.3426],
  'Italia': [41.8719, 12.5674],
};

interface ActiveFilters {
  city: string;
  types: string[];
  minPrice: number | '';
  maxPrice: number | '';
  features: string[];
}

const EMPTY_FILTERS: ActiveFilters = {
  city: '',
  types: [],
  minPrice: '',
  maxPrice: '',
  features: [],
};

const ALL_FEATURES = ['Arredato', 'Balcone', 'Aria Condizionata', 'Ascensore', 'Animali Ammessi'];

export const AnnunciPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const { savedListings, toggleSavedListing, cachePublicListing } = useListingStore();

  const [searchText, setSearchText] = useState(searchParams.get('city') || '');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    ...EMPTY_FILTERS,
    city: searchParams.get('city') || '',
  });

  // Application modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<{
    id: string; title: string; price: string; type: string; image: string; desc?: string;
  } | null>(null);

  // ── GPS Location ──────────────────────────────────────────────────────────
  const handleGPS = useCallback(async () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      );
      const { latitude, longitude } = pos.coords;
      // Reverse geocode via Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&accept-language=it`
      );
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
      if (city) {
        // Try to match a known city
        const matched = LISTING_CITIES.find(c => c.toLowerCase() === city.toLowerCase());
        setSearchText(matched || city);
        setFilters(f => ({ ...f, city: matched || '' }));
        if (matched) setSearchParams({ city: matched });
      }
    } catch (e) {
      console.warn('GPS error:', e);
    } finally {
      setGpsLoading(false);
    }
  }, [setSearchParams]);

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (searchText) {
        const q = searchText.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.city && item.city !== filters.city) return false;
      if (filters.types.length > 0 && !filters.types.includes(item.type)) return false;
      if (filters.minPrice !== '' && item.priceNumber < filters.minPrice) return false;
      if (filters.maxPrice !== '' && item.priceNumber > filters.maxPrice) return false;
      if (filters.features.length > 0) {
        const listingFeatures = item.features || [];
        if (!filters.features.every(f => listingFeatures.includes(f))) return false;
      }
      return true;
    });
  }, [searchText, filters]);

  const activeFilterCount =
    (filters.city ? 1 : 0) + filters.types.length +
    (filters.minPrice !== '' ? 1 : 0) + (filters.maxPrice !== '' ? 1 : 0) +
    filters.features.length;

  const handleCityChange = useCallback((city: string) => {
    setSearchText(city);
    setFilters(f => ({ ...f, city }));
    setSearchParams(city ? { city } : {});
  }, [setSearchParams]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    const matchedCity = LISTING_CITIES.find(c => c.toLowerCase() === val.toLowerCase());
    setFilters(f => ({ ...f, city: matchedCity || '' }));
  };

  const handleToggleSave = useCallback((item: Listing, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = savedListings.includes(item.id);
    toggleSavedListing(item.id);
    if (!isSaved) {
      const cached: CachedListing = {
        id: item.id, title: item.title, city: item.city, price: item.priceNumber,
        priceDisplay: item.price, rooms: item.rooms, squareMeters: item.squareMeters,
        bathrooms: item.bathrooms, furnished: item.features?.includes('Arredato') ?? false,
        features: item.features ?? [], description: item.desc, agencyName: 'AffittoChiaro',
        applicationsCount: 0, views: 0,
      };
      cachePublicListing(cached);
    }
  }, [savedListings, toggleSavedListing, cachePublicListing]);

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchText('');
    setSearchParams({});
  };

  const toggleType = (type: string) => {
    setFilters(f => ({
      ...f, types: f.types.includes(type) ? f.types.filter(t => t !== type) : [...f.types, type],
    }));
  };

  const toggleFeature = (feat: string) => {
    setFilters(f => ({
      ...f, features: f.features.includes(feat) ? f.features.filter(x => x !== feat) : [...f.features, feat],
    }));
  };

  const activeCityCoordinates = useMemo(() => {
    const key = Object.keys(CITY_COORDINATES).find(c =>
      searchText.toLowerCase().includes(c.toLowerCase())
    ) || 'Italia';
    return CITY_COORDINATES[key];
  }, [searchText]);

  const handleApplyClick = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    const existing = JSON.parse(localStorage.getItem('affittochiaro_applications') || '[]');
    const newApp = {
      ...data, id: Date.now().toString(), submittedAt: new Date().toISOString(),
      status: 'pending', agencyId: 'agency_1', viewed: false,
    };
    localStorage.setItem('affittochiaro_applications', JSON.stringify([...existing, newApp]));
    const existingNotifs = JSON.parse(localStorage.getItem('affittochiaro_agency_notifications') || '[]');
    const notif = {
      id: Date.now().toString(), type: 'new_application', title: 'Nuova Candidatura',
      message: `${data.firstName} ${data.lastName} si è candidato per "${data.listingTitle}"`,
      applicantName: `${data.firstName} ${data.lastName}`, listingTitle: data.listingTitle,
      listingId: data.listingId, applicationId: newApp.id,
      createdAt: new Date().toISOString(), read: false, agencyId: 'agency_1',
    };
    localStorage.setItem('affittochiaro_agency_notifications', JSON.stringify([notif, ...existingNotifs]));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      {/* ── 1. Search Header ─────────────────────────────────────────────── */}
      <div className="bg-brand-green text-white py-6 px-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold font-serif mb-4 text-center">
            Annunci Affitto Verificati in Italia
          </h1>

          {/* Search bar with GPS */}
          <div className="relative max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchText}
                onChange={handleSearchInput}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl text-gray-900 font-medium placeholder-gray-400 outline-none focus:ring-4 focus:ring-action-green/40 shadow-xl text-base"
                placeholder="Cerca per città, zona o tipologia..."
              />
              {searchText && (
                <button
                  onClick={handleClearFilters}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* GPS button */}
            <button
              onClick={handleGPS}
              disabled={gpsLoading}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-3 rounded-2xl text-white font-semibold text-sm transition-all shrink-0 border border-white/20"
              title="Usa la tua posizione"
            >
              {gpsLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Navigation size={18} />
              )}
              <span className="hidden sm:inline">Posizione</span>
            </button>
          </div>

          {/* City pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
            {LISTING_CITIES.map(city => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filters.city === city
                  ? 'bg-action-green text-brand-green shadow'
                  : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Filters Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: count + filter toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 shrink-0">
                <span className="font-bold text-gray-900">{filteredListings.length}</span> annunci
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${showFilters || activeFilterCount > 0
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
              >
                <SlidersHorizontal size={14} />
                Filtri
                {activeFilterCount > 0 && (
                  <span className="bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Center: active filter chips */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 px-4">
              {filters.types.map(t => (
                <span key={t} className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {t}
                  <button onClick={() => toggleType(t)}><X size={12} /></button>
                </span>
              ))}
              {(filters.minPrice !== '' || filters.maxPrice !== '') && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  €{filters.minPrice || '0'} – €{filters.maxPrice || '∞'}
                  <button onClick={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '' }))}><X size={12} /></button>
                </span>
              )}
              {filters.features.map(f => (
                <span key={f} className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {f}
                  <button onClick={() => toggleFeature(f)}><X size={12} /></button>
                </span>
              ))}
              {activeFilterCount > 0 && (
                <button onClick={handleClearFilters} className="shrink-0 text-xs text-gray-500 hover:text-gray-800 underline">
                  Rimuovi tutti
                </button>
              )}
            </div>

            {/* Right: view toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 shrink-0">
              <button
                onClick={() => setShowMap(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${!showMap ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                <List className="w-4 h-4" /> Elenco
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${showMap ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'}`}
              >
                <MapIcon className="w-4 h-4" /> Mappa
              </button>
            </div>
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Città</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                  value={filters.city}
                  onChange={(e) => {
                    setFilters(f => ({ ...f, city: e.target.value }));
                    setSearchText(e.target.value);
                  }}
                >
                  <option value="">Tutte le città</option>
                  {LISTING_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Prezzo (€/mese)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value ? parseInt(e.target.value) : '' }))}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value ? parseInt(e.target.value) : '' }))}
                  />
                </div>
              </div>

              {/* Types */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Tipologia</label>
                <div className="flex flex-wrap gap-1.5">
                  {LISTING_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${filters.types.includes(type)
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Caratteristiche</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_FEATURES.map(feat => (
                    <button
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${filters.features.includes(feat)
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {feat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Main Content (full width) ─────────────────────────────────── */}
      <div className="flex-grow max-w-screen-xl mx-auto w-full px-4 py-8">
        {!showMap && (
          <h2 className="text-xl font-bold font-serif text-gray-900 mb-6">
            {filteredListings.length} {filteredListings.length === 1 ? 'annuncio' : 'annunci'} in affitto
            {filters.city ? ` a ${filters.city}` : ' in Italia'}
          </h2>
        )}

        {showMap ? (
          <div className="flex w-full h-[calc(100vh-260px)] gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="w-1/2 h-full overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin">
              <p className="font-bold text-sm text-gray-500 px-2">{filteredListings.length} annunci</p>
              {filteredListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-3 cursor-pointer group"
                  onClick={() => handleApplyClick(item)}
                >
                  <img src={item.image} className="w-24 h-24 rounded-xl object-cover" alt={item.title} />
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <h4 className="font-bold text-sm font-serif line-clamp-2 leading-tight group-hover:text-primary-600">{item.title}</h4>
                    <div>
                      <p className="font-black text-primary-600 text-lg">{item.price}</p>
                      <button className="text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 px-2 py-1 rounded-md mt-1">
                        Candidati
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/2 h-full bg-gray-100 relative">
              <ListingsMap listings={filteredListings} center={activeCityCoordinates} />
            </div>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-[2rem] overflow-hidden shadow-card hover:shadow-card-hover border border-gray-100 flex flex-col group transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={`${item.title} – affitto ${item.city}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {item.type}
                  </span>
                  <button
                    onClick={(e) => handleToggleSave(item, e)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm ${savedListings.includes(item.id)
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white/50 hover:bg-white text-gray-800'
                      }`}
                    title={savedListings.includes(item.id) ? 'Rimuovi dai salvati' : 'Salva'}
                  >
                    <Heart className="w-5 h-5" fill={savedListings.includes(item.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-base font-bold font-serif text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin size={12} /> {item.city}
                    </p>
                    <p className="text-2xl font-black text-primary-600 tracking-tight">
                      {item.price}
                      <span className="text-xs text-gray-400 font-bold ml-1">/mese</span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">{item.desc}</p>

                  {item.features && item.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.features.slice(0, 3).map(f => (
                        <span key={f} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{f}</span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleApplyClick(item)}
                    className="w-full btn btn-primary py-2.5 rounded-xl justify-center text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary-500/10"
                  >
                    Candidati
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏠</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nessun annuncio trovato</h3>
            <p className="text-gray-500 mb-6">Prova a modificare i filtri di ricerca</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Rimuovi filtri
            </button>
          </div>
        )}

        {/* SEO content block */}
        {!showMap && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold font-serif mb-3">
              Affitti {filters.city ? `a ${filters.city}` : 'in Italia'} — AffittoChiaro
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
              Scopri la più ampia selezione di case in affitto {filters.city ? `a ${filters.city}` : 'nelle principali città italiane'} su AffittoChiaro.
              Aggiorniamo gli annunci ogni giorno per offrirti solo soluzioni verificate e disponibili.
              Usa i filtri per tipologia, prezzo e caratteristiche per trovare la casa perfetta.
              Ogni inquilino può inviare la sua candidatura direttamente dall'annuncio con il Curriculum dell'Inquilino.
            </p>
          </div>
        )}
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};
