import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, BadgeCheck, Home, Star,
  Clock, ShieldCheck,
  Users, Check, Shield, Zap, Crown, ClipboardList,
} from 'lucide-react';
import { mockAgencies } from '../src/utils/mockData';

const GUARANTEES = [
  {
    icon: Clock,
    title: 'Risposta entro 24 ore',
    description: 'Le agenzie partner si impegnano a rispondere a ogni candidatura entro un giorno lavorativo.',
  },
  {
    icon: ShieldCheck,
    title: 'Identità e licenza verificate',
    description: 'Controlliamo CCIAA, iscrizione al registro mediatori e documenti di esercizio.',
  },
  {
    icon: BadgeCheck,
    title: 'Solo profili inquilini verificati',
    description: 'Le agenzie ricevono candidature con profilo completo, occupazione dichiarata e referenze.',
  },
];

const WHY_JOIN = [
  {
    icon: Users,
    title: '30.000+ inquilini verificati',
    description: 'Accedi a una base qualificata con identità verificata, reddito dichiarato e referenze controllate. Nessun profilo anonimo.',
  },
  {
    icon: Clock,
    title: 'Riduci i tempi di locazione',
    description: 'I candidati arrivano già pre-selezionati. Meno telefonate a freddo, più visite qualificate e contratti firmati in meno tempo.',
  },
  {
    icon: ClipboardList,
    title: 'CV locativo completo, zero sorprese',
    description: 'Ogni inquilino ha uno storico affitti, garanti, documenti e uno score di affidabilità. Sai già con chi hai a che fare prima della visita.',
  },
];

const PLANS = [
  {
    name: 'Bronze',
    icon: Shield,
    price: 29.90,
    credits: 2,
    popular: false,
  },
  {
    name: 'Silver',
    icon: Zap,
    price: 49.90,
    credits: 5,
    popular: false,
  },
  {
    name: 'Gold',
    icon: Star,
    price: 99.90,
    credits: 15,
    popular: true,
  },
  {
    name: 'Platinum',
    icon: Crown,
    price: 149.90,
    credits: 30,
    popular: false,
  },
];

const PLAN_FEATURES = [
  'I crediti non hanno scadenza',
  'Guida alla locazione inclusa',
  'Accesso ai profili inquilini verificati',
];

export const AgenziePartnerPage: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const filtered = [...mockAgencies]
    .filter(a => a.isVerified || a.plan !== 'free')
    .sort((a, b) => (b.contractsLastYear ?? 0) - (a.contractsLastYear ?? 0));

  const visibleAgencies = showAll ? filtered : filtered.slice(0, 10);


  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-soft-green/40 to-white">
        <div className="max-w-7xl mx-auto px-4">

          <div className="space-y-8 relative z-10 max-w-2xl">
            <h1 className="text-[28px] md:text-4xl lg:text-5xl font-bold text-brand-green leading-[1.15]">
              Agenzie Partner{' '}
              <span className="text-action-green">Selezionate</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Ogni agenzia supera una verifica documentale prima di entrare nella rete. Trovi solo chi gestisce davvero affitti nella tua zona.
            </p>
          </div>


        </div>
      </section>

      {/* ── GARANZIE AGENZIA VERIFICATA ───────────────────────── */}
      <section className="py-14 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-[28px] font-bold text-brand-green mb-8 leading-[1.2]">
            Cosa garantisce un'agenzia partner Affittochiaro
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GUARANTEES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-row sm:flex-col items-start gap-3">
                <div className="w-10 h-10 bg-soft-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-brand-green" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-green text-sm leading-tight">{title}</h3>
                  <p className="text-sm text-medium-gray leading-[1.6] mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRIGLIA AGENZIE ───────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs font-bold text-medium-gray uppercase tracking-widest mb-6">
            {filtered.length} {filtered.length === 1 ? 'agenzia' : 'agenzie'} partner
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleAgencies.map((agency, idx) => (
              <React.Fragment key={agency.id}>
                {idx === 6 && (
                  <div className="sm:col-span-2 lg:col-span-3 bg-soft-green border border-action-green/20 rounded-xl px-6 py-5">
                    <p className="text-sm font-bold text-brand-green mb-1">
                      Perché scegliere un'agenzia partner?
                    </p>
                    <p className="text-sm text-medium-gray leading-[1.6]">
                      Le agenzie verificate su Affittochiaro ricevono solo candidature con profilo completo: meno tempo perso in telefonate, più visite qualificate.
                    </p>
                  </div>
                )}

                <Link
                  to={`/agenzie/${agency.id}`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden flex flex-col cursor-pointer"
                >
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

          {!showAll && filtered.length > 10 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="text-action-green font-bold text-sm underline underline-offset-2 hover:text-brand-green transition-colors"
              >
                Vedi tutte le {filtered.length} agenzie
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── PERCHÉ LE AGENZIE SCELGONO AFFITTOCHIARO (B2B) ───── */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-3 leading-[1.2]">
            Perché le agenzie scelgono Affittochiaro
          </h2>
          <p className="text-medium-gray text-sm mb-10 max-w-xl">
            Smetti di perdere tempo con candidature incomplete. Con Affittochiaro ricevi solo profili verificati, pronti a firmare.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {WHY_JOIN.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-soft-green rounded-xl flex items-center justify-center mb-4">
                  <Icon size={24} className="text-brand-green" />
                </div>
                <h3 className="font-bold text-brand-green text-base mb-2">{title}</h3>
                <p className="text-sm text-medium-gray leading-[1.6]">{description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-3 leading-[1.2]">
            Scegli il pacchetto più adatto alla tua agenzia
          </h2>
          <p className="text-medium-gray text-sm mb-10">
            Acquisto unico, crediti senza scadenza. Inizia quando vuoi, senza abbonamenti.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(({ name, icon: Icon, price, credits, popular }) => (
              <div
                key={name}
                className={`relative flex flex-col rounded-xl border p-6 ${
                  popular
                    ? 'border-action-green ring-2 ring-action-green/30 bg-soft-green/30'
                    : 'border-gray-100 bg-white shadow-sm'
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-action-green text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Il più scelto
                    </span>
                  </div>
                )}

                <div className="w-10 h-10 bg-soft-green rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-brand-green" />
                </div>

                <h3 className="font-bold text-brand-green text-lg mb-1">{name}</h3>

                <div className="mb-1">
                  <span className="text-3xl font-bold text-brand-green">
                    {price.toLocaleString('it-IT', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
                <p className="text-xs text-medium-gray mb-4">IVA inclusa</p>

                <p className="text-sm font-semibold text-brand-green mb-5">
                  {credits} {credits === 1 ? 'credito' : 'crediti'} per sbloccare schede inquilino
                </p>

                <div className="space-y-2.5 mb-6 flex-1">
                  {PLAN_FEATURES.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check size={14} className="text-action-green flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-medium-gray leading-[1.5]">{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/register"
                  className={`flex items-center justify-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl transition-all min-h-[40px] ${
                    popular
                      ? 'bg-action-green text-white hover:brightness-110'
                      : 'bg-soft-green text-brand-green hover:bg-action-green/20'
                  }`}
                >
                  Inizia ora
                </Link>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-medium-gray mt-8">
            Hai bisogno di un piano su misura?{' '}
            <a href="mailto:info@affittochiaro.it" className="text-action-green font-semibold hover:underline">
              Contattaci
            </a>
          </p>
        </div>
      </section>

      {/* ── FOOTER CTA B2B ────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-brand-green rounded-2xl p-10 md:p-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            Sei un'agenzia immobiliare?<br />Lavora con noi.
          </h2>
          <p className="text-white/70 mb-8 text-base max-w-lg mx-auto leading-[1.5]">
            Unisciti alle 20+ agenzie che gestiscono locazioni con Affittochiaro. Verifica gratuita, nessun vincolo.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-action-green text-white font-bold px-8 py-4 min-h-[44px] rounded-xl hover:brightness-110 transition-all"
          >
            Registra la tua agenzia
          </Link>
        </div>
      </section>

    </div>
  );
};
