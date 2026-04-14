import React, { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Search,
  Map as MapIcon,
  List,
  X,
  SlidersHorizontal,
  Navigation,
  ChevronDown,
  Loader2,
  Maximize2,
  BedDouble,
  Bath,
  Star,
} from 'lucide-react';
import { ListingsMap } from '../components';
import { publicListings } from '../src/lib/mock-data';
import { buildListingUrl, formatPrice } from '../src/lib/utils';

const COMUNI = [...new Set(publicListings.map(l => l.comune))].sort();
const TIPOLOGIE_LIST = ['appartamento', 'bilocale', 'trilocale', 'stanza', 'villa'];
const TIPOLOGIE_LABELS: Record<string, string> = {
  appartamento: 'Appartamento',
  bilocale: 'Bilocale',
  trilocale: 'Trilocale',
  stanza: 'Stanza singola',
  villa: 'Villa',
};

const CITY_COORDINATES: Record<string, [number, number]> = {
  Milano: [45.4642, 9.1900],
  Roma: [41.9028, 12.4964],
  Napoli: [40.8518, 14.2681],
  Torino: [45.0703, 7.6869],
  Firenze: [43.7696, 11.2558],
  Bologna: [44.4949, 11.3426],
  Italia: [41.8719, 12.5674],
};

interface ActiveFilters {
  comune: string;
  tipologie: string[];
  minPrice: number | '';
  maxPrice: number | '';
}

const EMPTY_FILTERS: ActiveFilters = {
  comune: '',
  tipologie: [],
  minPrice: '',
  maxPrice: '',
};

export const AnnunciPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('city') || '');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    ...EMPTY_FILTERS,
    comune: searchParams.get('city') || '',
  });

  // ── GPS Location ──────────────────────────────────────────────────────────
  const handleGPS = useCallback(async () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      );
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&accept-language=it`
      );
      const data = await res.json();
      const city: string = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
      if (city) {
        const matched = COMUNI.find(c => c.toLowerCase() === city.toLowerCase());
        setSearchText(matched || city);
        setFilters(f => ({ ...f, comune: matched || '' }));
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
    return publicListings.filter((item) => {
      if (searchText) {
        const q = searchText.toLowerCase();
        const match =
          item.titolo.toLowerCase().includes(q) ||
          item.comune.toLowerCase().includes(q) ||
          item.descrizione.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.comune && item.comune !== filters.comune) return false;
      if (filters.tipologie.length > 0 && !filters.tipologie.includes(item.tipologiaSlug)) return false;
      if (filters.minPrice !== '' && item.prezzo < filters.minPrice) return false;
      if (filters.maxPrice !== '' && item.prezzo > filters.maxPrice) return false;
      return true;
    });
  }, [searchText, filters]);

  const activeFilterCount =
    (filters.comune ? 1 : 0) + filters.tipologie.length +
    (filters.minPrice !== '' ? 1 : 0) + (filters.maxPrice !== '' ? 1 : 0);

  const handleComuneChange = useCallback((comune: string) => {
    setSearchText(comune);
    setFilters(f => ({ ...f, comune }));
    setSearchParams(comune ? { city: comune } : {});
  }, [setSearchParams]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    const matched = COMUNI.find(c => c.toLowerCase() === val.toLowerCase());
    setFilters(f => ({ ...f, comune: matched || '' }));
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchText('');
    setSearchParams({});
  };

  const toggleTipologia = (tipo: string) => {
    setFilters(f => ({
      ...f,
      tipologie: f.tipologie.includes(tipo)
        ? f.tipologie.filter(t => t !== tipo)
        : [...f.tipologie, tipo],
    }));
  };

  const activeCityCoordinates = useMemo((): [number, number] => {
    const key = Object.keys(CITY_COORDINATES).find(c =>
      searchText.toLowerCase().includes(c.toLowerCase())
    ) || 'Italia';
    return CITY_COORDINATES[key];
  }, [searchText]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col">

      {/* ── 1. Search Header ─────────────────────────────────────────────── */}
      <div className="bg-brand-green text-white py-6 px-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Annunci Affitto Verificati in Italia
          </h1>

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

          <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
            {COMUNI.map(comune => (
              <button
                key={comune}
                onClick={() => handleComuneChange(comune)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  filters.comune === comune
                    ? 'bg-action-green text-brand-green shadow'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {comune}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Filters Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 shrink-0">
                <span className="font-bold text-gray-900">{filteredListings.length}</span> annunci
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  showFilters || activeFilterCount > 0
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

            <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 px-4">
              {filters.tipologie.map(t => (
                <span key={t} className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold capitalize">
                  {TIPOLOGIE_LABELS[t] || t}
                  <button onClick={() => toggleTipologia(t)}><X size={12} /></button>
                </span>
              ))}
              {(filters.minPrice !== '' || filters.maxPrice !== '') && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  €{filters.minPrice || '0'} – €{filters.maxPrice || '∞'}
                  <button onClick={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '' }))}><X size={12} /></button>
                </span>
              )}
              {activeFilterCount > 0 && (
                <button onClick={handleClearFilters} className="shrink-0 text-xs text-gray-500 hover:text-gray-800 underline">
                  Rimuovi tutti
                </button>
              )}
            </div>

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

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Città</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                  value={filters.comune}
                  onChange={(e) => {
                    setFilters(f => ({ ...f, comune: e.target.value }));
                    setSearchText(e.target.value);
                  }}
                >
                  <option value="">Tutte le città</option>
                  {COMUNI.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

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

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Tipologia</label>
                <div className="flex flex-wrap gap-1.5">
                  {TIPOLOGIE_LIST.map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => toggleTipologia(tipo)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        filters.tipologie.includes(tipo)
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {TIPOLOGIE_LABELS[tipo]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Main Content ──────────────────────────────────────────────── */}
      <div className="flex-grow max-w-screen-xl mx-auto w-full px-4 py-8">
        {!showMap && (
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {filteredListings.length} {filteredListings.length === 1 ? 'annuncio' : 'annunci'} in affitto
            {filters.comune ? ` a ${filters.comune}` : ' in Italia'}
          </h2>
        )}

        {showMap ? (
          <div className="flex w-full h-[calc(100vh-260px)] gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="w-1/2 h-full overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin">
              <p className="font-bold text-sm text-gray-500 px-2">{filteredListings.length} annunci</p>
              {filteredListings.map(item => (
                <Link
                  key={item.id}
                  to={buildListingUrl(item.regioneSlug, item.comuneSlug, item.tipologiaSlug, item.slug)}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all flex gap-3 group"
                >
                  <img src={item.immagini[0]} className="w-24 h-24 rounded-xl object-cover" alt={item.titolo} />
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <h4 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary-600">{item.titolo}</h4>
                    <div>
                      <p className="font-black text-primary-600 text-lg">{formatPrice(item.prezzo)}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 px-2 py-1 rounded-md mt-1 inline-block capitalize">
                        {item.tipologia}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="w-1/2 h-full bg-gray-100 relative">
              <ListingsMap listings={filteredListings} center={activeCityCoordinates} />
            </div>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => {
              const url = buildListingUrl(listing.regioneSlug, listing.comuneSlug, listing.tipologiaSlug, listing.slug);
              return (
                <div key={listing.id} className="card group overflow-hidden hover:shadow-card-hover transition-shadow p-0 flex flex-col">
                  <Link to={url} className="relative h-44 overflow-hidden block">
                    <img
                      src={listing.immagini[0]}
                      alt={`${listing.titolo} – affitto ${listing.comune}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {listing.isExclusive && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <Star size={10} className="fill-white" /> Esclusiva
                      </div>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-text-muted text-xs mb-1">
                      <MapPin size={11} /><span>{listing.zona}</span>
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mb-2">{listing.titolo}</h3>
                    <div className="flex items-center gap-3 text-text-secondary text-xs mb-3">
                      <span className="flex items-center gap-1"><Maximize2 size={11} />{listing.mq} m²</span>
                      <span className="flex items-center gap-1"><BedDouble size={11} />{listing.camere} cam.</span>
                      <span className="flex items-center gap-1"><Bath size={11} />{listing.bagni} bagni</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-primary-600">{formatPrice(listing.prezzo)}</span>
                      <span className="text-xs text-text-muted capitalize">{listing.tipologia}</span>
                    </div>
                    <Link to={url} className="btn btn-primary w-full justify-center text-sm mt-auto">
                      Candidati
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin size={40} className="mx-auto mb-4 text-gray-300" />
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

        {!showMap && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-3">
              Affitti {filters.comune ? `a ${filters.comune}` : 'in Italia'} — AffittoChiaro
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
              Scopri la più ampia selezione di case in affitto {filters.comune ? `a ${filters.comune}` : 'nelle principali città italiane'} su AffittoChiaro.
              Aggiorniamo gli annunci ogni giorno per offrirti solo soluzioni verificate e disponibili.
              Usa i filtri per tipologia e prezzo per trovare la casa perfetta.
              Ogni inquilino può inviare la sua candidatura direttamente dall'annuncio con il Profilo Inquilino.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
