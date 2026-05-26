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

// ── Constants ──────────────────────────────────────────────────────────────────

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

const PRICE_MIN = 200;
const PRICE_MAX = 3000;
const MQ_MIN = 25;
const MQ_MAX = 300;

const CAMERE_OPTIONS = [1, 2, 3, 4] as const;
const BAGNI_OPTIONS = [1, 2, 3] as const;

const CARATTERISTICHE_LIST = ['arredato', 'balcone', 'cantina', 'giardino', 'garage', 'parcheggio', 'ascensore'] as const;

const CARATTERISTICHE_LABELS: Record<string, string> = {
  arredato: 'Arredato',
  balcone: 'Balcone',
  cantina: 'Cantina',
  giardino: 'Giardino',
  garage: 'Garage',
  parcheggio: 'Parcheggio',
  ascensore: 'Ascensore',
};

const CARATTERISTICHE_KEYWORDS: Record<string, string[]> = {
  arredato: ['arredato', 'arredata', 'ammobiliato', 'ammobiliata', 'cucina attrezzata'],
  balcone: ['balcone', 'terrazzo'],
  cantina: ['cantina'],
  giardino: ['giardino'],
  garage: ['garage', 'box'],
  parcheggio: ['posto auto', 'parcheggio'],
  ascensore: ['ascensore'],
};

// ── RangeSlider ────────────────────────────────────────────────────────────────

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  minVal: number;
  maxVal: number;
  onChange: (min: number, max: number) => void;
  formatMin: (v: number) => string;
  formatMax: (v: number) => string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step, minVal, maxVal, onChange, formatMin, formatMax }) => {
  const pct = (v: number) => Math.round(((v - min) / (max - min)) * 100);
  const minPct = pct(minVal);
  const maxPct = pct(maxVal);

  return (
    <div className="px-1">
      <div className="flex justify-between text-xs font-bold text-primary-700 mb-3">
        <span>{formatMin(minVal)}</span>
        <span>{formatMax(maxVal)}</span>
      </div>
      <div className="relative h-5 flex items-center select-none">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full pointer-events-none" />
        <div
          className="absolute h-1.5 bg-primary-500 rounded-full pointer-events-none"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          min={min} max={max} step={step}
          value={minVal}
          onChange={e => onChange(Math.min(Number(e.target.value), maxVal - step), maxVal)}
          className="range-thumb"
          style={{ zIndex: minPct > 90 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min} max={max} step={step}
          value={maxVal}
          onChange={e => onChange(minVal, Math.max(Number(e.target.value), minVal + step))}
          className="range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface ActiveFilters {
  tipologie: string[];
  priceMin: number;
  priceMax: number;
  mqMin: number;
  mqMax: number;
  camere: number | null;
  bagni: number | null;
  caratteristiche: string[];
}

const EMPTY_FILTERS: ActiveFilters = {
  tipologie: [],
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  mqMin: MQ_MIN,
  mqMax: MQ_MAX,
  camere: null,
  bagni: null,
  caratteristiche: [],
};

// ── Page ───────────────────────────────────────────────────────────────────────

export const AnnunciPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('city') || '');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>(EMPTY_FILTERS);

  // ── GPS ──────────────────────────────────────────────────────────────────────
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
      if (city) setSearchText(city);
    } catch (e) {
      console.warn('GPS error:', e);
    } finally {
      setGpsLoading(false);
    }
  }, []);

  // ── Filter logic ─────────────────────────────────────────────────────────────
  const filteredListings = useMemo(() => {
    return publicListings.filter((item) => {
      if (searchText) {
        const q = searchText.toLowerCase();
        if (
          !item.titolo.toLowerCase().includes(q) &&
          !item.zona.toLowerCase().includes(q) &&
          !item.descrizione.toLowerCase().includes(q)
        ) return false;
      }
      if (filters.tipologie.length > 0 && !filters.tipologie.includes(item.tipologiaSlug)) return false;
      if (item.prezzo < filters.priceMin || item.prezzo > filters.priceMax) return false;
      if (item.mq < filters.mqMin || item.mq > filters.mqMax) return false;
      if (filters.camere !== null) {
        if (filters.camere === 4 ? item.camere < 4 : item.camere !== filters.camere) return false;
      }
      if (filters.bagni !== null) {
        if (filters.bagni === 3 ? item.bagni < 3 : item.bagni !== filters.bagni) return false;
      }
      if (filters.caratteristiche.length > 0) {
        const desc = item.descrizione.toLowerCase();
        if (!filters.caratteristiche.every(c =>
          (CARATTERISTICHE_KEYWORDS[c] || []).some(kw => desc.includes(kw))
        )) return false;
      }
      return true;
    });
  }, [searchText, filters]);

  // ── Active filter count ──────────────────────────────────────────────────────
  const priceChanged = filters.priceMin !== PRICE_MIN || filters.priceMax !== PRICE_MAX;
  const mqChanged = filters.mqMin !== MQ_MIN || filters.mqMax !== MQ_MAX;
  const activeFilterCount =
    filters.tipologie.length +
    (priceChanged ? 1 : 0) +
    (mqChanged ? 1 : 0) +
    (filters.camere !== null ? 1 : 0) +
    (filters.bagni !== null ? 1 : 0) +
    filters.caratteristiche.length;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

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

  const toggleCaratteristica = (c: string) => {
    setFilters(f => ({
      ...f,
      caratteristiche: f.caratteristiche.includes(c)
        ? f.caratteristiche.filter(x => x !== c)
        : [...f.caratteristiche, c],
    }));
  };

  const activeCityCoordinates = useMemo((): [number, number] => {
    const key = Object.keys(CITY_COORDINATES).find(c =>
      searchText.toLowerCase().includes(c.toLowerCase())
    ) || 'Italia';
    return CITY_COORDINATES[key];
  }, [searchText]);

  // ── Format helpers ────────────────────────────────────────────────────────────
  const fmtPriceMin = (v: number) => `€${v.toLocaleString('it-IT')}`;
  const fmtPriceMax = (v: number) => v >= PRICE_MAX ? `€${v.toLocaleString('it-IT')}+` : `€${v.toLocaleString('it-IT')}`;
  const fmtMqMin = (v: number) => `${v} mq`;
  const fmtMqMax = (v: number) => v >= MQ_MAX ? `${v} mq+` : `${v} mq`;

  // ── Render ────────────────────────────────────────────────────────────────────
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
                placeholder="Cerca per zona o tipologia..."
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
              {gpsLoading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
              <span className="hidden sm:inline">Posizione</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Filters Bar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3">

          {/* Bar row */}
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
                Filtri avanzati
                {activeFilterCount > 0 && (
                  <span className="bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Active filter chips */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 px-4">
              {filters.tipologie.map(t => (
                <span key={t} className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold capitalize">
                  {TIPOLOGIE_LABELS[t] || t}
                  <button onClick={() => toggleTipologia(t)}><X size={12} /></button>
                </span>
              ))}
              {priceChanged && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {fmtPriceMin(filters.priceMin)} – {fmtPriceMax(filters.priceMax)}
                  <button onClick={() => setFilters(f => ({ ...f, priceMin: PRICE_MIN, priceMax: PRICE_MAX }))}><X size={12} /></button>
                </span>
              )}
              {mqChanged && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {fmtMqMin(filters.mqMin)} – {fmtMqMax(filters.mqMax)}
                  <button onClick={() => setFilters(f => ({ ...f, mqMin: MQ_MIN, mqMax: MQ_MAX }))}><X size={12} /></button>
                </span>
              )}
              {filters.camere !== null && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {filters.camere === 4 ? '4+ camere' : `${filters.camere} ${filters.camere === 1 ? 'camera' : 'camere'}`}
                  <button onClick={() => setFilters(f => ({ ...f, camere: null }))}><X size={12} /></button>
                </span>
              )}
              {filters.bagni !== null && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {filters.bagni === 3 ? '3+ bagni' : `${filters.bagni} ${filters.bagni === 1 ? 'bagno' : 'bagni'}`}
                  <button onClick={() => setFilters(f => ({ ...f, bagni: null }))}><X size={12} /></button>
                </span>
              )}
              {filters.caratteristiche.map(c => (
                <span key={c} className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {CARATTERISTICHE_LABELS[c]}
                  <button onClick={() => toggleCaratteristica(c)}><X size={12} /></button>
                </span>
              ))}
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

          {/* ── Filter panel ─────────────────────────────────────────────── */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-5">

              {/* Row 1: Price + MQ sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3">Fascia di prezzo (€/mese)</label>
                  <RangeSlider
                    min={PRICE_MIN} max={PRICE_MAX} step={50}
                    minVal={filters.priceMin} maxVal={filters.priceMax}
                    onChange={(min, max) => setFilters(f => ({ ...f, priceMin: min, priceMax: max }))}
                    formatMin={fmtPriceMin}
                    formatMax={fmtPriceMax}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3">Metratura (mq)</label>
                  <RangeSlider
                    min={MQ_MIN} max={MQ_MAX} step={5}
                    minVal={filters.mqMin} maxVal={filters.mqMax}
                    onChange={(min, max) => setFilters(f => ({ ...f, mqMin: min, mqMax: max }))}
                    formatMin={fmtMqMin}
                    formatMax={fmtMqMax}
                  />
                </div>
              </div>

              {/* Row 2: Tipologia */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Tipologia</label>
                <div className="flex flex-wrap gap-2">
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

              {/* Row 3: Camere + Bagni */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Numero di camere</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters(f => ({ ...f, camere: null }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        filters.camere === null
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Qualsiasi
                    </button>
                    {CAMERE_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setFilters(f => ({ ...f, camere: f.camere === n ? null : n }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          filters.camere === n
                            ? 'bg-primary-50 text-primary-700 border-primary-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {n === 4 ? '4+' : n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Numero di bagni</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters(f => ({ ...f, bagni: null }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        filters.bagni === null
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Qualsiasi
                    </button>
                    {BAGNI_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setFilters(f => ({ ...f, bagni: f.bagni === n ? null : n }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          filters.bagni === n
                            ? 'bg-primary-50 text-primary-700 border-primary-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {n === 3 ? '3+' : n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Caratteristiche */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Caratteristiche</label>
                <div className="flex flex-wrap gap-2">
                  {CARATTERISTICHE_LIST.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleCaratteristica(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        filters.caratteristiche.includes(c)
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {CARATTERISTICHE_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <div className="pt-1">
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-gray-500 hover:text-gray-800 underline"
                  >
                    Rimuovi tutti i filtri
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Main Content ──────────────────────────────────────────────── */}
      <div className="flex-grow max-w-screen-xl mx-auto w-full px-4 py-8">
        {!showMap && (
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {filteredListings.length} {filteredListings.length === 1 ? 'annuncio' : 'annunci'} in affitto in Italia
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
              Affitti in Italia — AffittoChiaro
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-4xl">
              Scopri la più ampia selezione di case in affitto in Italia su AffittoChiaro.
              Aggiorniamo gli annunci ogni giorno per offrirti solo soluzioni verificate e disponibili.
              Usa i filtri per tipologia, prezzo, metratura e caratteristiche per trovare la casa perfetta.
              Ogni inquilino può inviare la sua candidatura direttamente dall'annuncio con il Profilo Inquilino.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
