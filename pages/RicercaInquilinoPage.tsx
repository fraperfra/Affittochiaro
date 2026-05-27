import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    X,
    SlidersHorizontal,
    ChevronRight,
    Navigation,
    Loader2,
    BadgeCheck,
    Video,
    Briefcase,
    MapPin,
    Lock,
    ArrowRight,
    Check,
    UserCheck,
    ShieldCheck,
    FileText,
    Umbrella,
} from 'lucide-react';
import { mockTenants } from '../src/utils/mockData';
import { OCCUPATIONS, CONTRACT_TYPES } from '../src/utils/constants';

// ── Constants ──────────────────────────────────────────────────────────────────

const BUDGET_MIN = 200;
const BUDGET_MAX = 3000;
const ETA_MIN = 18;
const ETA_MAX = 60;
const RAGGIO_DEFAULT = 10;

const NUCLEO_OPTIONS: { value: string; label: string }[] = [
  { value: 'solo', label: 'Single' },
  { value: 'coppia', label: 'Coppia' },
  { value: 'famiglia', label: 'Famiglia' },
  { value: 'coinquilini', label: 'Coinquilini' },
];

const TIPO_IMMOBILE_OPTIONS = [
  { value: '', label: 'Seleziona' },
  { value: 'stanza', label: 'Stanza singola' },
  { value: 'bilocale', label: 'Bilocale' },
  { value: 'trilocale', label: 'Trilocale o più' },
  { value: 'villa', label: 'Villa / Casa indipendente' },
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
  animali: 'indifferente' | 'con' | 'senza';
  statoImmobile: 'indifferente' | 'arredato' | 'non_arredato';
  nucleoFamiliare: string[];
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
  animali: 'indifferente',
  statoImmobile: 'indifferente',
  nucleoFamiliare: [],
  tipoImmobile: '',
};

// ── Page ───────────────────────────────────────────────────────────────────────

export const RicercaInquilinoPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [filters, setFilters] = useState<TenantFilters>(EMPTY_FILTERS);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

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

        if (filters.contratto && t.preferences?.preferredContractType !== filters.contratto) return false;

        if (filters.animali === 'con' && !t.preferences?.hasPets) return false;
        if (filters.animali === 'senza' && t.preferences?.hasPets) return false;

        if (filters.statoImmobile === 'arredato' && t.preferences?.furnished !== 'yes') return false;
        if (filters.statoImmobile === 'non_arredato' && t.preferences?.furnished !== 'no') return false;

        if (filters.nucleoFamiliare.length > 0 && (!t.familyUnit || !filters.nucleoFamiliare.includes(t.familyUnit))) return false;

        if (filters.tipoImmobile) {
          const minR = t.preferences?.minRooms ?? 0;
          const maxR = t.preferences?.maxRooms ?? 5;
          if (filters.tipoImmobile === 'stanza' && minR > 1) return false;
          if (filters.tipoImmobile === 'bilocale' && minR !== 2) return false;
          if (filters.tipoImmobile === 'trilocale' && maxR < 3) return false;
          if (filters.tipoImmobile === 'villa' && maxR < 4) return false;
        }

        return true;
      });
  }, [searchText, filters]);

  const displayedTenants = filteredTenants.slice(0, 24);

  // ── Active filter count ──────────────────────────────────────────────────────
  const budgetChanged = filters.budgetMin !== BUDGET_MIN || filters.budgetMax !== BUDGET_MAX;
  const etaChanged = filters.etaMin !== ETA_MIN || filters.etaMax !== ETA_MAX;
  const raggiChanged = filters.raggiKm !== RAGGIO_DEFAULT;
  const activeFilterCount =
    (filters.occupation ? 1 : 0) +
    (filters.verified !== null ? 1 : 0) +
    (filters.hasVideo !== null ? 1 : 0) +
    (raggiChanged ? 1 : 0) +
    (budgetChanged ? 1 : 0) +
    (etaChanged ? 1 : 0) +
    (filters.contratto ? 1 : 0) +
    (filters.animali !== 'indifferente' ? 1 : 0) +
    (filters.statoImmobile !== 'indifferente' ? 1 : 0) +
    filters.nucleoFamiliare.length +
    (filters.tipoImmobile ? 1 : 0);

  const handleClearFilters = () => { setFilters(EMPTY_FILTERS); setSearchText(''); };

  const toggleNucleo = (v: string) => {
    setFilters(f => ({
      ...f,
      nucleoFamiliare: f.nucleoFamiliare.includes(v)
        ? f.nucleoFamiliare.filter(x => x !== v)
        : [...f.nucleoFamiliare, v],
    }));
  };

  // ── Format helpers ───────────────────────────────────────────────────────────
  const fmtBudgetMin = (v: number) => `€${v.toLocaleString('it-IT')}`;
  const fmtBudgetMax = (v: number) => v >= BUDGET_MAX ? `€${v.toLocaleString('it-IT')}+` : `€${v.toLocaleString('it-IT')}`;
  const fmtEta = (v: number) => `${v} anni`;
  const fmtRaggio = (v: number) => `${v} km`;

  const pillCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${active
      ? 'bg-primary-50 text-primary-700 border-primary-200'
      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    }`;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── 1. Search Header ─────────────────────────────────────── */}
      <div className="bg-brand-green text-white py-6 px-4">
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

      {/* ── 2. Filter Bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
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
                  {CONTRACT_TYPES.find(c => c.value === filters.contratto)?.label ?? filters.contratto}
                  <button onClick={() => setFilters(f => ({ ...f, contratto: '' }))}><X size={12} /></button>
                </span>
              )}
              {filters.nucleoFamiliare.map(v => (
                <span key={v} className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold capitalize">
                  {NUCLEO_OPTIONS.find(o => o.value === v)?.label ?? v}
                  <button onClick={() => toggleNucleo(v)}><X size={12} /></button>
                </span>
              ))}
              {activeFilterCount > 0 && (
                <button onClick={handleClearFilters} className="shrink-0 text-xs text-gray-500 hover:text-gray-800 underline">
                  Rimuovi tutti
                </button>
              )}
            </div>
          </div>
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
          <Link to="/register" className="btn bg-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all inline-flex items-center gap-2">
            Vedi i candidati disponibili
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-3">Crea un account per accedere ai profili completi</p>
        </div>
      </div>

      {/* ── 4. Benefits Bento Grid ──────────────────────────────── */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Tutto quello che serve per <br />un Affitto Sicuro</h2>
            <p className="text-xl text-gray-500">Abbiamo digitalizzato e semplificato ogni passaggio, per darti il controllo totale senza la burocrazia.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-32 h-32 text-primary-600" />
              </div>
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6"><UserCheck className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold mb-4">Tenant Check Certificato</h3>
                <p className="text-gray-600 leading-relaxed mb-6">Il nostro algoritmo analizza oltre 50 parametri: reddito, tipologia di contratto, storia creditizia e referenze precedenti. Ricevi solo candidature con <strong>Tenant Score</strong> superiore a 80/100.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Analisi Busta Paga</li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Controllo Protesti</li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Verifica Identità</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary-600 rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white mb-6"><Umbrella className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold mb-4">Tutela Legale e Morosità</h3>
                <p className="text-primary-100 text-sm leading-relaxed mb-4">Dormi sonni tranquilli con la nostra protezione proprietari. Copriamo fino a 12 mensilità in caso di morosità e offriamo assistenza legale gratuita.</p>
              </div>
              <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors text-sm">Scopri Garanzie</button>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6"><FileText className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold mb-3">Contratti Digitali</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Genera e firma il contratto direttamente online con Firma Elettronica Avanzata (FEA). Registrazione all'Agenzia delle Entrate inclusa.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 md:col-span-2">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div>
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6"><Briefcase className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold mb-3">Gestione 100% Online</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-lg">Dal caricamento dell'annuncio alla riscossione dell'affitto. Tutto in un'unica dashboard intuitiva.</p>
                </div>
                <div className="flex-grow bg-gray-50 rounded-2xl p-4 w-full">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2"><span>STATO PAGAMENTI</span> <span>TUTTO REGOLARE</span></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-bold text-gray-700">Gennaio</span>
                      <span className="ml-auto text-xs font-bold text-green-600">Pagato</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-bold text-gray-700">Febbraio</span>
                      <span className="ml-auto text-xs font-bold text-green-600">Pagato</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Domande Frequenti dei Proprietari</h2>
            <p className="text-gray-500">Tutto quello che devi sapere sulla gestione locazioni con AffittoChiaro.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Quanto costa pubblicare un annuncio?", a: "La pubblicazione è 100% gratuita. Non applichiamo costi di inserimento né commissioni sul canone mensile per il servizio base." },
              { q: "Come verificate l'affidabilità dell'inquilino?", a: "Utilizziamo un sistema integrato che incrocia dati da banche dati pubbliche (Crif, Protesti) e verifica la documentazione reddituale caricata, grazie alla partnership con istituti di credito." },
              { q: "La firma digitale ha valore legale?", a: "Assolutamente sì. Utilizziamo la Firma Elettronica Avanzata (FEA) conforme al regolamento eIDAS europeo, legalmente vincolante e perfetta per la registrazione telematica." },
              { q: "Offrite supporto per la registrazione del contratto?", a: "Sì, il nostro sistema si interfaccia direttamente con i servizi dell'Agenzia delle Entrate per la registrazione telematica in regime ordinario o cedolare secca." }
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-200 transition-colors">
                <button onClick={() => setFaqOpen(faqOpen === idx ? null : idx)} className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 font-bold text-gray-800">
                  {item.q}
                  <ChevronRight className={`w-5 h-5 transition-transform text-gray-400 ${faqOpen === idx ? 'rotate-90 text-primary-600' : ''}`} />
                </button>
                <div className={`px-6 pb-6 text-gray-600 leading-relaxed ${faqOpen === idx ? 'block' : 'hidden'}`}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Final CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Inizia a guadagnare dal tuo immobile oggi stesso</h2>
            <p className="text-xl text-gray-400 mb-12">Nessuna carta di credito richiesta. Pubblica in 3 minuti.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/landing-inquilino" className="btn bg-primary-600 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-lg shadow-primary-600/30 hover:bg-white hover:text-gray-900 transition-all">
                Pubblica Gratis
              </Link>
              <Link to="/contact" className="btn bg-transparent border border-gray-700 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all">
                Parla con un Esperto
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-600">Leggi i nostri <a href="#" className="underline hover:text-white">Termini e Condizioni</a> per i proprietari.</p>
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
                    {CONTRACT_TYPES.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setFilters(f => ({ ...f, contratto: f.contratto === c.value ? '' : c.value }))}
                        className={pillCls(filters.contratto === c.value)}
                      >
                        {c.value}
                      </button>
                    ))}
                  </div>
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
                <label className="block text-xs font-bold text-gray-600 mb-2">Nucleo familiare</label>
                <div className="flex flex-wrap gap-2">
                  {NUCLEO_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => toggleNucleo(o.value)}
                      className={pillCls(filters.nucleoFamiliare.includes(o.value))}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
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
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors"
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
