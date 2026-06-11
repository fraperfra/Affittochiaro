import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    X,
    SlidersHorizontal,
    ChevronDown,
    Navigation,
    Loader2,
    BadgeCheck,
    Video,
    Briefcase,
    MapPin,
    Lock,
    
} from 'lucide-react';
import { mockTenants } from '../src/utils/mockData';
import { OCCUPATIONS } from '../src/utils/constants';

// ── Constants ──────────────────────────────────────────────────────────────────

const BUDGET_MIN = 200;
const BUDGET_MAX = 3000;
const ETA_MIN = 18;
const ETA_MAX = 60;
const NUCLEO_MIN = 1;
const NUCLEO_MAX = 6;
const RAGGIO_DEFAULT = 10;

const TIPO_IMMOBILE_OPTIONS = [
  { value: '', label: 'Seleziona' },
  { value: 'stanza', label: 'Stanza' },
  { value: 'appartamento', label: 'Appartamento' },
  { value: 'villa', label: 'Villa / Casa indipendente' },
  { value: 'bifamiliare', label: 'Bifamiliare' },
];

const GENERE_OPTIONS: { value: string; label: string }[] = [
  { value: 'uomo', label: 'Uomo' },
  { value: 'donna', label: 'Donna' },
  { value: 'non_binario', label: 'Non binario' },
];

const CONTRATTO_OPTIONS: { value: string; label: string }[] = [
  { value: 'permanent', label: 'Tempo indeterminato' },
  { value: 'fixed_term', label: 'Tempo determinato' },
  { value: 'statale', label: 'Statale' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'freelance', label: 'Autonomo' },
  { value: 'student', label: 'Studente' },
  { value: 'retired', label: 'Pensionato' },
];

// ── Sliders ────────────────────────────────────────────────────────────────────

interface RangeSliderProps {
  min: number; max: number; step: number;
  minVal: number; maxVal: number;
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
        <input type="range" min={min} max={max} step={step} value={minVal}
          onChange={e => onChange(Math.min(Number(e.target.value), maxVal - step), maxVal)}
          className="range-thumb" style={{ zIndex: minPct > 90 ? 5 : 3 }}
        />
        <input type="range" min={min} max={max} step={step} value={maxVal}
          onChange={e => onChange(minVal, Math.max(Number(e.target.value), minVal + step))}
          className="range-thumb" style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

interface SingleSliderProps {
  min: number; max: number; step: number;
  value: number;
  onChange: (v: number) => void;
  formatValue: (v: number) => string;
}

const SingleSlider: React.FC<SingleSliderProps> = ({ min, max, step, value, onChange, formatValue }) => {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  return (
    <div className="px-1">
      <div className="flex justify-between text-xs font-bold text-primary-700 mb-3">
        <span>Entro {formatValue(value)}</span>
        <span className="text-gray-400">{formatValue(max)}</span>
      </div>
      <div className="relative h-5 flex items-center select-none">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full pointer-events-none" />
        <div
          className="absolute h-1.5 bg-primary-500 rounded-full pointer-events-none"
          style={{ left: 0, right: `${100 - pct}%` }}
        />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="range-thumb" style={{ zIndex: 3 }}
        />
      </div>
    </div>
  );
};

// ── FilterDropdown (desktop filter bar) ──────────────────────────────────────────

interface FilterDropdownProps {
  label: string;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  width?: string;
  children: React.ReactNode;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, active, open, onToggle, width = 'w-72', children }) => (
  <div className="relative shrink-0">
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold border transition-all whitespace-nowrap ${
        active
          ? 'bg-primary-50 text-primary-700 border-primary-300'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      {label}
      <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && (
      <div className={`absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[60] ${width}`}>
        {children}
      </div>
    )}
  </div>
);

// ── Types ──────────────────────────────────────────────────────────────────────

interface TenantFilters {
  occupation: string;
  verified: boolean | null;
  hasVideo: boolean | null;
  raggiKm: number;
  budgetMin: number;
  budgetMax: number;
  etaMin: number;
  etaMax: number;
  contratto: string;
  genere: string;
  animali: 'indifferente' | 'con' | 'senza';
  statoImmobile: 'indifferente' | 'arredato' | 'non_arredato';
  nucleoMin: number;
  nucleoMax: number;
  tipoImmobile: string;
}

const EMPTY_FILTERS: TenantFilters = {
  occupation: '',
  verified: null,
  hasVideo: null,
  raggiKm: RAGGIO_DEFAULT,
  budgetMin: BUDGET_MIN,
  budgetMax: BUDGET_MAX,
  etaMin: ETA_MIN,
  etaMax: ETA_MAX,
  contratto: '',
  genere: '',
  animali: 'indifferente',
  statoImmobile: 'indifferente',
  nucleoMin: NUCLEO_MIN,
  nucleoMax: NUCLEO_MAX,
  tipoImmobile: '',
};

// ── Page ───────────────────────────────────────────────────────────────────────

export const RicercaInquilinoPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filters, setFilters] = useState<TenantFilters>(EMPTY_FILTERS);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  // ── GPS ─────────────────────────────────────────────────────────────────────
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
      const city = data.address?.city || data.address?.town || data.address?.village || '';
      if (city) setSearchText(city);
    } catch (e) { console.warn('GPS error:', e); }
    finally { setGpsLoading(false); }
  }, []);

  // ── Filter logic ─────────────────────────────────────────────────────────────
  const filteredTenants = useMemo(() => {
    return mockTenants
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter((t) => {
        if (searchText) {
          const q = searchText.toLowerCase();
          const match =
            t.firstName.toLowerCase().includes(q) ||
            t.lastName.toLowerCase().includes(q) ||
            (t.occupation || '').toLowerCase().includes(q) ||
            (t.currentCity || '').toLowerCase().includes(q);
          if (!match) return false;
        }

        if (filters.occupation && t.occupation !== filters.occupation) return false;
        if (filters.verified === true && !t.isVerified) return false;
        if (filters.hasVideo === true && !t.hasVideo) return false;

        if (searchText && filters.raggiKm <= 15) {
          const q = searchText.toLowerCase();
          const inCity = (t.currentCity || '').toLowerCase().includes(q);
          const wantsCity = (t.preferences?.preferredCities || []).some(c => c.toLowerCase().includes(q));
          if (!inCity && !wantsCity) return false;
        }

        const budget = t.preferences?.maxBudget;
        if (budget != null && (budget < filters.budgetMin || budget > filters.budgetMax)) return false;

        const age = t.age;
        if (age != null && (age < filters.etaMin || age > filters.etaMax)) return false;

        if (filters.contratto && t.employmentType !== filters.contratto) return false;

        if (filters.genere && t.gender !== filters.genere) return false;

        if (filters.animali === 'con' && !t.preferences?.hasPets) return false;
        if (filters.animali === 'senza' && t.preferences?.hasPets) return false;

        if (filters.statoImmobile === 'arredato' && t.preferences?.furnished !== 'yes') return false;
        if (filters.statoImmobile === 'non_arredato' && t.preferences?.furnished !== 'no') return false;

        const people = t.numPeople;
        if (people != null && (people < filters.nucleoMin || people > filters.nucleoMax)) return false;

        if (filters.tipoImmobile) {
          const minR = t.preferences?.minRooms ?? 0;
          const maxR = t.preferences?.maxRooms ?? 5;
          if (filters.tipoImmobile === 'stanza' && minR > 1) return false;
          if (filters.tipoImmobile === 'villa' && maxR < 4) return false;
        }

        return true;
      });
  }, [searchText, filters]);

  const displayedTenants = filteredTenants.slice(0, 24);

  // ── Active filter count ──────────────────────────────────────────────────────
  const budgetChanged = filters.budgetMin !== BUDGET_MIN || filters.budgetMax !== BUDGET_MAX;
  const etaChanged = filters.etaMin !== ETA_MIN || filters.etaMax !== ETA_MAX;
  const nucleoChanged = filters.nucleoMin !== NUCLEO_MIN || filters.nucleoMax !== NUCLEO_MAX;
  const raggiChanged = filters.raggiKm !== RAGGIO_DEFAULT;
  const activeFilterCount =
    (filters.occupation ? 1 : 0) +
    (filters.verified !== null ? 1 : 0) +
    (filters.hasVideo !== null ? 1 : 0) +
    (raggiChanged ? 1 : 0) +
    (budgetChanged ? 1 : 0) +
    (etaChanged ? 1 : 0) +
    (filters.contratto ? 1 : 0) +
    (filters.genere ? 1 : 0) +
    (filters.animali !== 'indifferente' ? 1 : 0) +
    (filters.statoImmobile !== 'indifferente' ? 1 : 0) +
    (nucleoChanged ? 1 : 0) +
    (filters.tipoImmobile ? 1 : 0);

  const handleClearFilters = () => { setFilters(EMPTY_FILTERS); setSearchText(''); };

  // ── Format helpers ───────────────────────────────────────────────────────────
  const fmtBudgetMin = (v: number) => `€${v.toLocaleString('it-IT')}`;
  const fmtBudgetMax = (v: number) => v >= BUDGET_MAX ? `€${v.toLocaleString('it-IT')}+` : `€${v.toLocaleString('it-IT')}`;
  const fmtEta = (v: number) => `${v} anni`;
  const fmtNucleo = (v: number) => v >= NUCLEO_MAX ? `${v}+ persone` : `${v} ${v === 1 ? 'persona' : 'persone'}`;
  const fmtRaggio = (v: number) => `${v} km`;

  const pillCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${active
      ? 'bg-primary-50 text-primary-700 border-primary-200'
      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    }`;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── 1. Search Header (mobile/tablet) ─────────────────────── */}
      <div className="bg-brand-green text-white py-6 px-4 lg:hidden">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-center">
            Cerca Inquilino Verificato
          </h1>
          <p className="text-primary-200 text-sm text-center mb-4">
            Trova inquilini affidabili e con referenze controllate
          </p>
          <div className="relative max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl text-gray-900 font-medium placeholder-gray-400 outline-none focus:ring-4 focus:ring-action-green/40 shadow-xl text-base"
                placeholder="Cerca per città, nome o professione..."
              />
              {searchText && (
                <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
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

      {/* ── 2. Filter Bar (mobile/tablet) ────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm lg:hidden">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{filteredTenants.length}</span> inquilini
              </span>
              <button
                onClick={() => setShowFilters(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeFilterCount > 0
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <SlidersHorizontal size={14} />
                Filtra profili
                {activeFilterCount > 0 && (
                  <span className="bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active chips */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 px-4">
              {filters.verified && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  Solo Verificati <button onClick={() => setFilters(f => ({ ...f, verified: null }))}><X size={12} /></button>
                </span>
              )}
              {filters.hasVideo && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  Con Video <button onClick={() => setFilters(f => ({ ...f, hasVideo: null }))}><X size={12} /></button>
                </span>
              )}
              {budgetChanged && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {fmtBudgetMin(filters.budgetMin)} – {fmtBudgetMax(filters.budgetMax)}
                  <button onClick={() => setFilters(f => ({ ...f, budgetMin: BUDGET_MIN, budgetMax: BUDGET_MAX }))}><X size={12} /></button>
                </span>
              )}
              {filters.contratto && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {CONTRATTO_OPTIONS.find(c => c.value === filters.contratto)?.label ?? filters.contratto}
                  <button onClick={() => setFilters(f => ({ ...f, contratto: '' }))}><X size={12} /></button>
                </span>
              )}
              {filters.genere && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {GENERE_OPTIONS.find(g => g.value === filters.genere)?.label ?? filters.genere}
                  <button onClick={() => setFilters(f => ({ ...f, genere: '' }))}><X size={12} /></button>
                </span>
              )}
              {nucleoChanged && (
                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {fmtNucleo(filters.nucleoMin)} – {fmtNucleo(filters.nucleoMax)}
                  <button onClick={() => setFilters(f => ({ ...f, nucleoMin: NUCLEO_MIN, nucleoMax: NUCLEO_MAX }))}><X size={12} /></button>
                </span>
              )}
              {activeFilterCount > 0 && (
                <button onClick={handleClearFilters} className="shrink-0 text-xs text-gray-500 hover:text-gray-800 underline">
                  Rimuovi tutti
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2b. Filter Bar (desktop, immobiliare style) ──────────── */}
      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div ref={filterBarRef} className="px-6 py-3 flex items-center gap-2">

          {/* Search */}
          <div className="relative w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Città, nome o professione..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Budget */}
          <FilterDropdown
            label="Budget"
            active={budgetChanged}
            open={openDropdown === 'budget'}
            onToggle={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
            width="w-80"
          >
            <label className="block text-xs font-bold text-gray-600 mb-3">Budget (€/mese)</label>
            <RangeSlider
              min={BUDGET_MIN} max={BUDGET_MAX} step={50}
              minVal={filters.budgetMin} maxVal={filters.budgetMax}
              onChange={(min, max) => setFilters(f => ({ ...f, budgetMin: min, budgetMax: max }))}
              formatMin={fmtBudgetMin}
              formatMax={fmtBudgetMax}
            />
          </FilterDropdown>

          {/* Età */}
          <FilterDropdown
            label="Età"
            active={etaChanged}
            open={openDropdown === 'eta'}
            onToggle={() => setOpenDropdown(openDropdown === 'eta' ? null : 'eta')}
            width="w-80"
          >
            <label className="block text-xs font-bold text-gray-600 mb-3">Età</label>
            <RangeSlider
              min={ETA_MIN} max={ETA_MAX} step={1}
              minVal={filters.etaMin} maxVal={filters.etaMax}
              onChange={(min, max) => setFilters(f => ({ ...f, etaMin: min, etaMax: max }))}
              formatMin={fmtEta}
              formatMax={fmtEta}
            />
          </FilterDropdown>

          {/* Contratto */}
          <FilterDropdown
            label="Contratto"
            active={!!filters.contratto}
            open={openDropdown === 'contratto'}
            onToggle={() => setOpenDropdown(openDropdown === 'contratto' ? null : 'contratto')}
            width="w-72"
          >
            <label className="block text-xs font-bold text-gray-600 mb-2">Tipo di contratto</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilters(f => ({ ...f, contratto: '' }))} className={pillCls(!filters.contratto)}>
                Qualsiasi
              </button>
              {CONTRATTO_OPTIONS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setFilters(f => ({ ...f, contratto: f.contratto === c.value ? '' : c.value }))}
                  className={pillCls(filters.contratto === c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </FilterDropdown>

          {/* Genere */}
          <FilterDropdown
            label="Genere"
            active={!!filters.genere}
            open={openDropdown === 'genere'}
            onToggle={() => setOpenDropdown(openDropdown === 'genere' ? null : 'genere')}
            width="w-72"
          >
            <label className="block text-xs font-bold text-gray-600 mb-2">Genere</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilters(f => ({ ...f, genere: '' }))} className={pillCls(!filters.genere)}>
                Qualsiasi
              </button>
              {GENERE_OPTIONS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setFilters(f => ({ ...f, genere: f.genere === g.value ? '' : g.value }))}
                  className={pillCls(filters.genere === g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </FilterDropdown>

          {/* Nucleo familiare */}
          <FilterDropdown
            label="Nucleo familiare"
            active={nucleoChanged}
            open={openDropdown === 'nucleo'}
            onToggle={() => setOpenDropdown(openDropdown === 'nucleo' ? null : 'nucleo')}
            width="w-80"
          >
            <label className="block text-xs font-bold text-gray-600 mb-3">Nucleo familiare</label>
            <RangeSlider
              min={NUCLEO_MIN} max={NUCLEO_MAX} step={1}
              minVal={filters.nucleoMin} maxVal={filters.nucleoMax}
              onChange={(min, max) => setFilters(f => ({ ...f, nucleoMin: min, nucleoMax: max }))}
              formatMin={fmtNucleo}
              formatMax={fmtNucleo}
            />
          </FilterDropdown>

          {/* In cerca di: tipo di immobile */}
          <FilterDropdown
            label="In cerca di"
            active={!!filters.tipoImmobile}
            open={openDropdown === 'tipoImmobile'}
            onToggle={() => setOpenDropdown(openDropdown === 'tipoImmobile' ? null : 'tipoImmobile')}
            width="w-72"
          >
            <label className="block text-xs font-bold text-gray-600 mb-2">In cerca di: tipo di immobile</label>
            <div className="flex flex-wrap gap-2">
              {TIPO_IMMOBILE_OPTIONS.filter(o => o.value).map(o => (
                <button
                  key={o.value}
                  onClick={() => setFilters(f => ({ ...f, tipoImmobile: f.tipoImmobile === o.value ? '' : o.value }))}
                  className={pillCls(filters.tipoImmobile === o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </FilterDropdown>

          {/* Tutti i filtri */}
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition-all shrink-0 whitespace-nowrap"
          >
            <SlidersHorizontal size={15} />
            Tutti i filtri
            {activeFilterCount > 0 && (
              <span className="bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button onClick={handleClearFilters} className="text-xs text-gray-500 hover:text-gray-800 underline shrink-0 whitespace-nowrap">
              Azzera
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Tenant Grid ───────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {displayedTenants.length} inquilini: registrati di recente
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedTenants.map((tenant) => (
            <div key={tenant.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden relative">
              <div className="relative h-44 md:h-48 bg-gradient-to-br from-primary-50 to-teal-50 flex items-center justify-center overflow-hidden">
                {tenant.avatar ? (
                  <img
                    src={tenant.avatar}
                    alt={`${tenant.firstName} ${tenant.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-primary-600">
                    {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {tenant.isVerified && (
                    <span className="bg-white/90 backdrop-blur-sm text-primary-600 p-1.5 rounded-full shadow-sm" title="Verificato">
                      <BadgeCheck className="w-4 h-4" />
                    </span>
                  )}
                  {tenant.hasVideo && (
                    <span className="bg-white/90 backdrop-blur-sm text-orange-500 p-1.5 rounded-full shadow-sm" title="Video presentazione">
                      <Video className="w-4 h-4" />
                    </span>
                  )}
                </div>
                {tenant.tenantPlan !== 'free' && (
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tenant.tenantPlan === 'pro'
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                      : 'bg-gradient-to-r from-primary-500 to-teal-500 text-white'
                    }`}>
                    {tenant.tenantPlan}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 text-base truncate">
                  {tenant.firstName} {tenant.lastName.charAt(0)}.
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{tenant.occupation || 'Non specificato'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{tenant.currentCity || 'Italia'}</span>
                </div>
                {tenant.bio && (
                  <div className="relative mt-2">
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed blur-[3px] select-none">
                      {tenant.bio}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-4 py-3">
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-gray-100 hover:bg-primary-50 text-gray-500 hover:text-primary-600 text-xs font-bold transition-colors"
                >
                  <Lock size={12} />
                  Vedi il profilo completo
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/register" className="inline-flex items-center justify-center bg-brand-green text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 transition-all">
            Vedi i candidati disponibili
          </Link>
        </div>
      </div>

      {/* ── 6. Final CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-brand-green rounded-2xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-[1.2]">Inizia a guadagnare dal tuo immobile oggi stesso</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-action-green px-8 py-4 rounded-xl font-bold hover:brightness-110 transition-all">
              Trova l'inquilino
            </Link>
            <Link to="/contact" className="text-white font-bold hover:underline transition-all">
              Parla con un Esperto
            </Link>
          </div>
        </div>
      </section>

      {/* ── Filter Modal ─────────────────────────────────────────────────── */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[200]"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-gray-900 text-base">Filtra profili</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

              {/* Raggio + Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3">Raggio di ricerca</label>
                  <SingleSlider
                    min={5} max={100} step={5}
                    value={filters.raggiKm}
                    onChange={v => setFilters(f => ({ ...f, raggiKm: v }))}
                    formatValue={fmtRaggio}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3">Budget (€/mese)</label>
                  <RangeSlider
                    min={BUDGET_MIN} max={BUDGET_MAX} step={50}
                    minVal={filters.budgetMin} maxVal={filters.budgetMax}
                    onChange={(min, max) => setFilters(f => ({ ...f, budgetMin: min, budgetMax: max }))}
                    formatMin={fmtBudgetMin}
                    formatMax={fmtBudgetMax}
                  />
                </div>
              </div>

              {/* Tipo di immobile */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">In cerca di: tipo di immobile</label>
                <select
                  className="w-full sm:w-64 px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50 font-semibold text-gray-700"
                  value={filters.tipoImmobile}
                  onChange={(e) => setFilters(f => ({ ...f, tipoImmobile: e.target.value }))}
                >
                  {TIPO_IMMOBILE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Età + Contratto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-3">Età</label>
                  <RangeSlider
                    min={ETA_MIN} max={ETA_MAX} step={1}
                    minVal={filters.etaMin} maxVal={filters.etaMax}
                    onChange={(min, max) => setFilters(f => ({ ...f, etaMin: min, etaMax: max }))}
                    formatMin={fmtEta}
                    formatMax={fmtEta}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Contratto</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setFilters(f => ({ ...f, contratto: '' }))} className={pillCls(!filters.contratto)}>
                      Qualsiasi
                    </button>
                    {CONTRATTO_OPTIONS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setFilters(f => ({ ...f, contratto: f.contratto === c.value ? '' : c.value }))}
                        className={pillCls(filters.contratto === c.value)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Genere */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Genere</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFilters(f => ({ ...f, genere: '' }))} className={pillCls(!filters.genere)}>
                    Qualsiasi
                  </button>
                  {GENERE_OPTIONS.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setFilters(f => ({ ...f, genere: f.genere === g.value ? '' : g.value }))}
                      className={pillCls(filters.genere === g.value)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animali + Stato Immobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Animali domestici</label>
                  <div className="flex flex-wrap gap-2">
                    {(['indifferente', 'con', 'senza'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => setFilters(f => ({ ...f, animali: v }))}
                        className={pillCls(filters.animali === v)}
                      >
                        {v === 'indifferente' ? 'Indifferente' : v === 'con' ? 'Con animali' : 'Senza animali'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Stato Immobile</label>
                  <div className="flex flex-wrap gap-2">
                    {(['indifferente', 'arredato', 'non_arredato'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => setFilters(f => ({ ...f, statoImmobile: v }))}
                        className={pillCls(filters.statoImmobile === v)}
                      >
                        {v === 'indifferente' ? 'Indifferente' : v === 'arredato' ? 'Arredato' : 'Non arredato'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nucleo familiare */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-3">Nucleo familiare</label>
                <RangeSlider
                  min={NUCLEO_MIN} max={NUCLEO_MAX} step={1}
                  minVal={filters.nucleoMin} maxVal={filters.nucleoMax}
                  onChange={(min, max) => setFilters(f => ({ ...f, nucleoMin: min, nucleoMax: max }))}
                  formatMin={fmtNucleo}
                  formatMax={fmtNucleo}
                />
              </div>

              {/* Badge + Professione */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Badge</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters(f => ({ ...f, verified: f.verified ? null : true }))}
                      className={`${pillCls(!!filters.verified)} flex items-center gap-1`}
                    >
                      <BadgeCheck size={13} /> Verificato
                    </button>
                    <button
                      onClick={() => setFilters(f => ({ ...f, hasVideo: f.hasVideo ? null : true }))}
                      className={`${pillCls(!!filters.hasVideo)} flex items-center gap-1`}
                    >
                      <Video size={13} /> Con Video
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Professione</label>
                  <select
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50 font-semibold text-gray-700"
                    value={filters.occupation}
                    onChange={(e) => setFilters(f => ({ ...f, occupation: e.target.value }))}
                  >
                    <option value="">Tutte</option>
                    {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50 rounded-b-2xl">
              {activeFilterCount > 0 ? (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-800 underline"
                >
                  Rimuovi tutti
                </button>
              ) : <div />}
              <button
                onClick={() => setShowFilters(false)}
                className="px-6 py-2.5 bg-brand-green text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all"
              >
                Mostra {filteredTenants.length} profili
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
