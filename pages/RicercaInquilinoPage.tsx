import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    X,
    SlidersHorizontal,
    ChevronDown,
    ChevronRight,
    Navigation,
    Loader2,
    BadgeCheck,
    Video,
    Briefcase,
    MapPin,
    Lock,
    Star,
    ArrowRight,
    Check,
    UserCheck,
    ShieldCheck,
    FileText,
    Umbrella,
    Play,
} from 'lucide-react';
import { mockTenants } from '../src/utils/mockData';
import { ITALIAN_CITIES, OCCUPATIONS } from '../src/utils/constants';

// ── Types ───────────────────────────────────────────────────────────────────

interface TenantFilters {
    city: string;
    occupation: string;
    verified: boolean | null;
    hasVideo: boolean | null;
    budgetMin: number | '';
    budgetMax: number | '';
}

const EMPTY_FILTERS: TenantFilters = {
    city: '',
    occupation: '',
    verified: null,
    hasVideo: null,
    budgetMin: '',
    budgetMax: '',
};

const TOP_CITIES = ITALIAN_CITIES.slice(0, 10);

export const RicercaInquilinoPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [filters, setFilters] = useState<TenantFilters>(EMPTY_FILTERS);
    const [faqOpen, setFaqOpen] = useState<number | null>(0);

    // ── GPS ─────────────────────────────────────────────────────────────────
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
            if (city) {
                const matched = ITALIAN_CITIES.find(c => c.toLowerCase() === city.toLowerCase());
                setSearchText(matched || city);
                setFilters(f => ({ ...f, city: matched || '' }));
            }
        } catch (e) { console.warn('GPS error:', e); }
        finally { setGpsLoading(false); }
    }, []);

    // ── Filter logic ────────────────────────────────────────────────────────
    const filteredTenants = useMemo(() => {
        return mockTenants
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .filter((t) => {
                if (searchText) {
                    const q = searchText.toLowerCase();
                    const match =
                        t.firstName.toLowerCase().includes(q) ||
                        t.lastName.toLowerCase().includes(q) ||
                        (t.currentCity || '').toLowerCase().includes(q) ||
                        (t.occupation || '').toLowerCase().includes(q);
                    if (!match) return false;
                }
                if (filters.city && t.currentCity !== filters.city) return false;
                if (filters.occupation && t.occupation !== filters.occupation) return false;
                if (filters.verified === true && !t.isVerified) return false;
                if (filters.hasVideo === true && !t.hasVideo) return false;
                if (filters.budgetMin !== '' && (t.preferences?.maxBudget || 0) < filters.budgetMin) return false;
                if (filters.budgetMax !== '' && (t.preferences?.maxBudget || 9999) > filters.budgetMax) return false;
                return true;
            });
    }, [searchText, filters]);

    const displayedTenants = filteredTenants.slice(0, 24);

    const activeFilterCount =
        (filters.city ? 1 : 0) +
        (filters.occupation ? 1 : 0) +
        (filters.verified !== null ? 1 : 0) +
        (filters.hasVideo !== null ? 1 : 0) +
        (filters.budgetMin !== '' ? 1 : 0) +
        (filters.budgetMax !== '' ? 1 : 0);

    const handleClearFilters = () => { setFilters(EMPTY_FILTERS); setSearchText(''); };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="bg-gray-50 min-h-screen">

            {/* ── 1. Search Header ─────────────────────────────────────── */}
            <div className="bg-brand-green text-white py-6 px-4">
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold font-serif mb-1 text-center">
                        Cerca Inquilino Verificato
                    </h1>
                    <p className="text-primary-200 text-sm text-center mb-4">
                        Trova inquilini affidabili e con referenze controllate
                    </p>

                    {/* Search bar + GPS */}
                    <div className="relative max-w-2xl mx-auto flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-12 pr-10 py-3.5 rounded-2xl text-gray-900 font-medium placeholder-gray-400 outline-none focus:ring-4 focus:ring-action-green/40 shadow-xl text-base"
                                placeholder="Cerca per nome, città o professione..."
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

                    {/* City pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-3 max-w-2xl mx-auto">
                        {TOP_CITIES.map(city => (
                            <button
                                key={city}
                                onClick={() => { setSearchText(city); setFilters(f => ({ ...f, city })); }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${filters.city === city
                                    ? 'bg-action-green text-brand-green shadow' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 2. Filter Bar ────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40 shadow-sm">
                <div className="max-w-screen-xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                                <span className="font-bold text-gray-900">{filteredTenants.length}</span> inquilini
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

                        {/* Active chips */}
                        <div className="hidden md:flex items-center gap-2 overflow-x-auto flex-1 px-4">
                            {filters.city && (
                                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                                    {filters.city}
                                    <button onClick={() => setFilters(f => ({ ...f, city: '' }))}><X size={12} /></button>
                                </span>
                            )}
                            {filters.verified && (
                                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                                    Solo Verificati
                                    <button onClick={() => setFilters(f => ({ ...f, verified: null }))}><X size={12} /></button>
                                </span>
                            )}
                            {filters.hasVideo && (
                                <span className="flex items-center gap-1 shrink-0 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                                    Con Video
                                    <button onClick={() => setFilters(f => ({ ...f, hasVideo: null }))}><X size={12} /></button>
                                </span>
                            )}
                            {activeFilterCount > 0 && (
                                <button onClick={handleClearFilters} className="shrink-0 text-xs text-gray-500 hover:text-gray-800 underline">
                                    Rimuovi tutti
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Città</label>
                                <select
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                                    value={filters.city}
                                    onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                                >
                                    <option value="">Tutte le città</option>
                                    {ITALIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Professione</label>
                                <select
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                                    value={filters.occupation}
                                    onChange={(e) => setFilters(f => ({ ...f, occupation: e.target.value }))}
                                >
                                    <option value="">Tutte</option>
                                    {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Budget (€/mese)</label>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Min" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                                        value={filters.budgetMin} onChange={(e) => setFilters(f => ({ ...f, budgetMin: e.target.value ? parseInt(e.target.value) : '' }))} />
                                    <input type="number" placeholder="Max" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50"
                                        value={filters.budgetMax} onChange={(e) => setFilters(f => ({ ...f, budgetMax: e.target.value ? parseInt(e.target.value) : '' }))} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">Badge</label>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => setFilters(f => ({ ...f, verified: f.verified ? null : true }))}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${filters.verified ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <BadgeCheck size={14} /> Verificato
                                    </button>
                                    <button
                                        onClick={() => setFilters(f => ({ ...f, hasVideo: f.hasVideo ? null : true }))}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${filters.hasVideo ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <Video size={14} /> Con Video
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── 3. Tenant Grid ───────────────────────────────────────── */}
            <div className="max-w-screen-xl mx-auto px-4 py-8">
                <h2 className="text-lg font-bold font-serif text-gray-900 mb-6">
                    {displayedTenants.length} inquilini{filters.city ? ` a ${filters.city}` : ''} — registrati di recente
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {displayedTenants.map((tenant) => (
                        <div key={tenant.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden relative">
                            {/* Avatar */}
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
                                {/* Badges overlay */}
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
                                {/* Plan badge */}
                                {tenant.tenantPlan !== 'free' && (
                                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tenant.tenantPlan === 'pro'
                                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                                            : 'bg-gradient-to-r from-primary-500 to-teal-500 text-white'
                                        }`}>
                                        {tenant.tenantPlan}
                                    </span>
                                )}
                            </div>

                            {/* Info */}
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

                                {/* Blurred bio (locked) */}
                                {tenant.bio && (
                                    <div className="relative mt-2">
                                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed blur-[3px] select-none">
                                            {tenant.bio}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Lock overlay — click to register */}
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

                {/* Load more CTA */}
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
                        <h2 className="text-4xl font-bold font-serif text-gray-900 mb-6">Tutto quello che serve per <br />un Affitto Sicuro</h2>
                        <p className="text-xl text-gray-500">Abbiamo digitalizzato e semplificato ogni passaggio, per darti il controllo totale senza la burocrazia.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldCheck className="w-32 h-32 text-primary-600" />
                            </div>
                            <div className="relative z-10 max-w-md">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6"><UserCheck className="w-6 h-6" /></div>
                                <h3 className="text-2xl font-bold font-serif mb-4">Tenant Check Certificato</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">Il nostro algoritmo analizza oltre 50 parametri: reddito, tipologia di contratto, storia creditizia e referenze precedenti. Ricevi solo candidature con <strong>Tenant Score</strong> superiore a 80/100.</p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Analisi Busta Paga</li>
                                    <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Controllo Protesti</li>
                                    <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Verifica Identità</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-primary-600 rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                            <div>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white mb-6"><Umbrella className="w-6 h-6" /></div>
                                <h3 className="text-2xl font-bold font-serif mb-4">Tutela Legale e Morosità</h3>
                                <p className="text-primary-100 text-sm leading-relaxed mb-4">Dormi sonni tranquilli con la nostra protezione proprietari. Copriamo fino a 12 mensilità in caso di morosità e offriamo assistenza legale gratuita.</p>
                            </div>
                            <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors text-sm">Scopri Garanzie</button>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6"><FileText className="w-6 h-6" /></div>
                            <h3 className="text-xl font-bold font-serif mb-3">Contratti Digitali</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Genera e firma il contratto direttamente online con Firma Elettronica Avanzata (FEA). Registrazione all'Agenzia delle Entrate inclusa.</p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 md:col-span-2">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div>
                                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6"><Briefcase className="w-6 h-6" /></div>
                                    <h3 className="text-xl font-bold font-serif mb-3">Gestione 100% Online</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed max-w-lg">Dal caricamento dell'annuncio alla riscossione dell'affitto. Tutto in un'unica dashboard intuitiva.</p>
                                </div>
                                <div className="flex-grow bg-gray-50 rounded-2xl p-4 w-full">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2"><span>STATO PAGAMENTI</span> <span>TUTTO REGOLARE</span></div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs font-bold text-gray-700">Gennaio</span>
                                            <span className="ml-auto text-xs font-bold text-green-600">Pagato</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
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
                        <h2 className="text-3xl font-bold font-serif mb-4">Domande Frequenti dei Proprietari</h2>
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
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-8">Inizia a guadagnare dal tuo immobile oggi stesso</h2>
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
        </div>
    );
};
