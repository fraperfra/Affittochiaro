import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus, Search, FileCheck, MessageCircle, Key,
  BadgeCheck, Users, FileText, TrendingUp, ArrowRight,
  PlayCircle, CheckCircle,
} from 'lucide-react';

const TENANT_STEPS = [
  {
    n: '01',
    icon: UserPlus,
    titolo: 'Crea il tuo profilo',
    desc: 'Compila le informazioni su di te: lavoro, reddito, referenze. Carica i documenti una volta sola — valgono per tutti gli annunci.',
  },
  {
    n: '02',
    icon: Search,
    titolo: 'Cerca tra gli annunci',
    desc: 'Sfoglia migliaia di annunci verificati. Filtra per città, prezzo, tipologia e trova quello che fa per te.',
  },
  {
    n: '03',
    icon: FileCheck,
    titolo: 'Candidati con un click',
    desc: 'Il tuo profilo completo arriva all\'agenzia in modo ordinato. Nessuna email con allegati, nessun modulo da ricompilare.',
  },
  {
    n: '04',
    icon: MessageCircle,
    titolo: 'Vieni contattato',
    desc: 'L\'agenzia valuta il profilo e ti contatta per fissare la visita. Solo visite qualificate, risposta garantita entro 24 ore.',
  },
  {
    n: '05',
    icon: Key,
    titolo: 'Firma il contratto',
    desc: 'Una volta approvato, l\'agenzia prepara il contratto. Puoi richiedere assistenza alla revisione legale prima della firma.',
  },
];

const AGENCY_STEPS = [
  {
    n: '01',
    icon: BadgeCheck,
    titolo: 'Registra la tua agenzia',
    desc: 'Crea il profilo agenzia in pochi minuti. Compila i dati della tua attività e scegli il pacchetto più adatto.',
  },
  {
    n: '02',
    icon: FileText,
    titolo: 'Verifica identità e licenza',
    desc: 'Carichiamo CCIAA, iscrizione al registro mediatori e documenti di esercizio. La verifica è gratuita e avviene in 24 ore.',
  },
  {
    n: '03',
    icon: TrendingUp,
    titolo: 'Pubblica i tuoi immobili',
    desc: 'Inserisci gli annunci e raggiunge gli inquilini più qualificati della piattaforma. Zero cartaceo, tutto digitale.',
  },
  {
    n: '04',
    icon: Users,
    titolo: 'Sblocca i profili inquilini',
    desc: 'Usa i crediti per accedere alle schede complete degli inquilini: reddito, documenti, storico affitti e score di affidabilità.',
  },
  {
    n: '05',
    icon: Key,
    titolo: 'Chiudi i contratti più in fretta',
    desc: 'Meno telefonate a freddo, più visite qualificate. I candidati arrivano già pronti — tu scegli il migliore.',
  },
];

const TENANT_PERCHE = [
  'Un profilo vale per tutti gli annunci',
  'Agenzie verificate, nessun intermediario improvvisato',
  'Zero visite a vuoto — le agenzie vedono il profilo prima di contattarti',
  'Documenti al sicuro e sempre accessibili',
];

const AGENCY_PERCHE = [
  'Database di 30.000+ inquilini con profilo completo',
  'Candidature strutturate: dati, reddito, documenti in una schermata',
  'Tempo medio di locazione ridotto da 45 a 18 giorni',
  'Crediti senza scadenza — usi quando vuoi',
];

type Tab = 'tenant' | 'agency';

const VideoPlaceholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative w-full aspect-video bg-brand-green rounded-2xl overflow-hidden flex items-center justify-center shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-brand-green to-action-green/40" />
    <div className="relative z-10 flex flex-col items-center gap-4">
      <button
        className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center border-2 border-white/50 backdrop-blur-sm"
        aria-label="Riproduci video"
      >
        <PlayCircle size={48} className="text-white" />
      </button>
      <p className="text-white/80 text-sm font-semibold">{label}</p>
    </div>
  </div>
);

export const ComeFunzionaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tenant');

  const steps = activeTab === 'tenant' ? TENANT_STEPS : AGENCY_STEPS;
  const perche = activeTab === 'tenant' ? TENANT_PERCHE : AGENCY_PERCHE;
  const videoLabel = activeTab === 'tenant'
    ? 'Come trovare casa con AffittoChiaro'
    : 'Come trovare l\'inquilino giusto con AffittoChiaro';
  const ctaHref = activeTab === 'tenant' ? '/case-e-stanze-in-affitto' : '/agenzie';
  const ctaLabel = activeTab === 'tenant' ? 'Inizia a cercare casa' : 'Diventa agenzia partner';

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 lg:pt-20 lg:pb-20 bg-gradient-to-b from-soft-green/40 to-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-4 border-l-2 border-action-green pl-3 inline-block">
            Guida alla piattaforma
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-green leading-tight mb-5">
            Come funziona{' '}
            <span className="text-action-green">AffittoChiaro</span>
          </h1>
          <p className="text-xl text-medium-gray leading-relaxed max-w-xl mx-auto mb-10">
            Una guida completa per capire come cercare casa o come trovare l'inquilino giusto. Scegli da dove partire.
          </p>

          {/* Tab selector */}
          <div className="inline-flex rounded-2xl bg-gray-100 p-1.5 gap-1">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'tenant'
                  ? 'bg-white text-brand-green shadow-sm'
                  : 'text-medium-gray hover:text-brand-green'
              }`}
            >
              Cerco casa
            </button>
            <button
              onClick={() => setActiveTab('agency')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'agency'
                  ? 'bg-white text-brand-green shadow-sm'
                  : 'text-medium-gray hover:text-brand-green'
              }`}
            >
              Gestisco affitti
            </button>
          </div>
        </div>
      </section>

      {/* ── VIDEO ─────────────────────────────────────────────── */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <VideoPlaceholder label={videoLabel} />
          <p className="text-center text-xs text-medium-gray mt-4">
            {activeTab === 'tenant'
              ? 'Guarda come funziona il processo in meno di 2 minuti'
              : 'Scopri in 2 minuti come trovare l\'inquilino ideale'}
          </p>
        </div>
      </section>

      {/* ── STEPS ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">
            {activeTab === 'tenant' ? 'IL PROCESSO PER CHI CERCA CASA' : 'IL PROCESSO PER LE AGENZIE'}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-10 leading-[1.2]">
            {activeTab === 'tenant'
              ? 'Trovare casa in 5 passi'
              : 'Trovare l\'inquilino giusto in 5 passi'}
          </h2>

          <div className="space-y-5">
            {steps.map(({ n, icon: Icon, titolo, desc }, i) => (
              <div key={n} className="flex gap-5">
                {/* Left: number + connector */}
                <div className="flex flex-col items-center gap-0 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center shadow-sm">
                    <Icon size={22} className="text-white" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[24px] bg-gray-200 my-1" />
                  )}
                </div>

                {/* Right: content */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex-1 shadow-sm mb-1">
                  <span className="text-[10px] font-bold text-action-green uppercase tracking-widest">
                    Step {n}
                  </span>
                  <h3 className="text-base font-bold text-brand-green mt-1 mb-2">{titolo}</h3>
                  <p className="text-sm text-medium-gray leading-[1.6]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERCHÉ AFFITTOCHIARO ──────────────────────────────── */}
      <section className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">
            PERCHÉ AFFITTOCHIARO
          </p>
          <h2 className="text-2xl font-bold text-brand-green mb-8 leading-[1.2]">
            {activeTab === 'tenant'
              ? 'I vantaggi per chi cerca casa'
              : 'I vantaggi per le agenzie partner'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {perche.map((testo, i) => (
              <div key={i} className="flex items-start gap-3 bg-soft-green/60 border border-action-green/10 rounded-xl p-4">
                <CheckCircle size={18} className="text-action-green shrink-0 mt-0.5" />
                <p className="text-sm text-brand-green font-medium leading-[1.5]">{testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA DOPPIO ────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-brand-green">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            {activeTab === 'tenant'
              ? 'Pronto a trovare la tua casa?'
              : 'Pronto a trovare l\'inquilino giusto?'}
          </h2>
          <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
            {activeTab === 'tenant'
              ? 'Crea il profilo una volta sola. Vale per tutti gli annunci.'
              : 'Crediti senza scadenza. Inizia quando vuoi, senza abbonamenti.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-action-green text-white font-bold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all"
            >
              {activeTab === 'tenant' ? 'Registrati gratis' : 'Registra la tua agenzia'}
              <ArrowRight size={16} />
            </Link>
            <Link
              to={ctaHref}
              className="text-white/80 text-sm font-semibold hover:text-white transition-colors"
            >
              {ctaLabel} →
            </Link>
          </div>

          {/* Switch tab */}
          <p className="mt-8 text-white/50 text-xs">
            {activeTab === 'tenant' ? (
              <>
                Sei un\'agenzia?{' '}
                <button
                  onClick={() => setActiveTab('agency')}
                  className="text-action-green font-bold hover:underline"
                >
                  Guarda come funziona per le agenzie
                </button>
              </>
            ) : (
              <>
                Stai cercando casa?{' '}
                <button
                  onClick={() => setActiveTab('tenant')}
                  className="text-action-green font-bold hover:underline"
                >
                  Guarda come funziona per gli inquilini
                </button>
              </>
            )}
          </p>
        </div>
      </section>

    </div>
  );
};
