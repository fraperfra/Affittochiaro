import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Home, Star, ArrowRight, ChevronDown, FileCheck } from 'lucide-react';
import { CityMap } from '../components';
import { mockAgencies } from '../src/utils/mockData';

const CITY_OPTIONS = ['Tutte', ...Array.from(new Set(mockAgencies.map(a => a.address?.city).filter(Boolean) as string[])).sort()];

export const AgenziePartnerPage: React.FC = () => {
  const [activeCity, setActiveCity] = useState('Tutte');
  const [showAllCities, setShowAllCities] = useState(false);

  const visibleCities = showAllCities ? CITY_OPTIONS : CITY_OPTIONS.slice(0, 7);

  const filtered = useMemo(() => {
    const base = mockAgencies.filter(a => a.isVerified || a.plan !== 'free');
    if (activeCity === 'Tutte') return base.sort((a, b) => (b.contractsLastYear ?? 0) - (a.contractsLastYear ?? 0));
    return base
      .filter(a => a.address?.city === activeCity)
      .sort((a, b) => (b.contractsLastYear ?? 0) - (a.contractsLastYear ?? 0));
  }, [activeCity]);

  const totalContracts = mockAgencies.reduce((s, a) => s + (a.contractsLastYear ?? 0), 0);
  const avgRating = (mockAgencies.filter(a => a.rating).reduce((s, a) => s + (a.rating ?? 0), 0) / mockAgencies.filter(a => a.rating).length).toFixed(1);

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <div className="space-y-8 relative z-10 animate-fade-in-up">
            <div className="flex items-center gap-2 text-sm text-primary-600 font-bold tracking-wide uppercase">
              <span className="bg-primary-100 px-3 py-1 rounded-full">Rete Partner</span>
              <span>•</span>
              <span>AffittoChiaro</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight">
              Agenzie Partner <br />
              <span className="text-primary-600 relative inline-block">
                Selezionate
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Ogni agenzia supera una verifica documentale rigorosa prima di entrare nella rete. Trovi solo chi gestisce davvero affitti nella tua zona.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-4 text-sm text-gray-500">
              <div className="flex flex-wrap gap-6 md:gap-10">
                <div>
                  <p className="text-3xl font-bold font-serif text-gray-900">{mockAgencies.filter(a => a.isVerified).length}+</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mt-0.5">agenzie attive</p>
                </div>
                <div className="border-l border-gray-200 pl-6 md:pl-10">
                  <p className="text-3xl font-bold font-serif text-gray-900">{avgRating}/5</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mt-0.5">soddisfazione inquilini</p>
                </div>
                <div className="border-l border-gray-200 pl-6 md:pl-10">
                  <p className="text-3xl font-bold font-serif text-gray-900">{totalContracts.toLocaleString()}+</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mt-0.5">contratti gestiti</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: image collage */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-teal-50 rounded-full blur-3xl opacity-30 transform rotate-12"></div>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80&auto=format&fit=crop"
              alt="Agenzia immobiliare partner"
              className="relative z-10 w-full h-auto max-w-md rounded-2xl shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-transform duration-500"
            />

            {/* Floating Card: Agenzia verificata */}
            <div className="absolute top-20 -left-10 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce-slow hidden md:block border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">Agenzia Verificata</p>
                  <p className="text-xs text-gray-500 mt-0.5">Documenti controllati</p>
                </div>
              </div>
            </div>

            {/* Floating Card: Contratti */}
            <div className="absolute bottom-40 -right-4 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce-slow delay-700 hidden md:block border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">{totalContracts.toLocaleString()}+</p>
                  <p className="text-xs text-gray-500 mt-0.5">contratti/anno</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── FILTRO ZONA ───────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap">
          {visibleCities.map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${activeCity === city
                  ? 'bg-brand-green text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {city}
            </button>
          ))}
          {!showAllCities && CITY_OPTIONS.length > 7 && (
            <button
              onClick={() => setShowAllCities(true)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
            >
              +{CITY_OPTIONS.length - 7} città <ChevronDown size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── GRIGLIA CARD ──────────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold text-medium-gray uppercase tracking-widest mb-6">
            {filtered.length} {filtered.length === 1 ? 'agenzia' : 'agenzie'}{activeCity !== 'Tutte' ? ` a ${activeCity}` : ' partner'}
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-medium-gray">
              <p className="text-lg font-semibold mb-2">Nessuna agenzia trovata a {activeCity}.</p>
              <button onClick={() => setActiveCity('Tutte')} className="text-action-green font-bold underline">
                Vedi tutte le agenzie
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((agency, idx) => (
                <React.Fragment key={agency.id}>
                  {/* Social proof break dopo 6 card */}
                  {idx === 6 && (
                    <div className="sm:col-span-2 lg:col-span-3 bg-soft-green border border-action-green/20 rounded-xl px-6 py-4 text-center">
                      <p className="text-sm font-bold text-brand-green">
                        "Le agenzie su Affittochiaro gestiscono in media il <span className="text-action-green">30% di contratti in più</span> rispetto alla media nazionale."
                      </p>
                      <p className="text-xs text-medium-gray mt-1">— Dati interni Affittochiaro, 2024</p>
                    </div>
                  )}

                  <Link
                    to={`/agenzie/${agency.id}`}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden flex flex-col cursor-pointer"
                  >
                    {/* Cover photo */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={agency.coverImage}
                        alt={`${agency.name} - foto`}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/800x450/f4f9f6/004832?text=${encodeURIComponent(agency.name)}`;
                        }}
                      />
                      {agency.isVerified && (
                        <span className="absolute top-2.5 right-2.5 bg-white/95 text-brand-green text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <BadgeCheck size={11} className="text-action-green" /> Verificata
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <div>
                        <h3 className="font-bold text-brand-green text-base leading-tight">{agency.name}</h3>
                        <p className="text-sm text-medium-gray flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="flex-shrink-0" />
                          {agency.address?.city || 'Italia'}
                          {agency.address?.province ? `, ${agency.address.province}` : ''}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-brand-green">
                          <Home size={14} className="text-action-green flex-shrink-0" />
                          <span>{agency.contractsLastYear ?? '—'} locazioni</span>
                          <span className="text-xs font-normal text-medium-gray">/ 12 mesi</span>
                        </div>
                        {agency.rating && (
                          <div className="flex items-center gap-1 text-xs text-medium-gray">
                            <Star size={11} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-brand-green">{agency.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-action-green bg-soft-green px-2 py-1 rounded-full w-fit">
                        <BadgeCheck size={10} /> Agenzia partner Affittochiaro
                      </span>
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MAPPA ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">
            DOVE OPERANO
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-2">
            Trova agenzie partner nella tua zona
          </h2>
          <p className="text-medium-gray text-sm mb-8">
            Seleziona la tua città per filtrare le agenzie attive nella zona.
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <CityMap
              activeCityName={activeCity === 'Tutte' ? 'Roma' : activeCity}
              onCityChange={(city) => { setActiveCity(city); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA B2B ────────────────────────────────────── */}
      <section className="py-14 px-4 bg-brand-green">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-action-green uppercase tracking-widest mb-2">PER LE AGENZIE</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Sei un'agenzia immobiliare?<br />Lavora con noi.
            </h2>
            <p className="text-white/70 mt-2 text-sm max-w-lg">
              Unisciti a {mockAgencies.filter(a => a.isVerified).length} agenzie che gestiscono locazioni con Affittochiaro.
            </p>
          </div>
          <Link
            to="/ricerca-inquilino"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-action-green text-white font-bold px-6 py-3.5 rounded-xl min-h-[44px] hover:brightness-110 transition-all whitespace-nowrap"
          >
            Richiedi informazioni <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
};
