import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Home, CheckCircle, ArrowRight } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
}

const INQUILINO_STEPS: Step[] = [
  {
    number: '01',
    title: 'Crea il tuo profilo',
    description: "Registrati in 2 minuti. Aggiungi città di ricerca, budget e una breve presentazione. I profili con video ricevono il 78% in più di risposte.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Crea+il+profilo',
  },
  {
    number: '02',
    title: 'Vieni trovato',
    description: "Il tuo profilo è visibile a proprietari e agenzie verificate: sono loro a contattarti con proposte in linea con la tua ricerca.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Vieni+trovato',
  },
  {
    number: '03',
    title: 'Candidati con un click',
    description: "Sfoglia gli annunci e invia la candidatura istantaneamente. Il proprietario riceve subito il tuo profilo completo.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Candidati',
  },
  {
    number: '04',
    title: 'Organizza la visita',
    description: "Concorda data e orario direttamente dalla piattaforma. Solo visite qualificate, senza email e moduli da ricompilare.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Visita',
  },
  {
    number: '05',
    title: 'Firma il contratto',
    description: "Una volta approvato, ricevi il contratto pronto alla firma. Puoi richiedere la revisione legale prima di concludere.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Firma',
  },
];

const PROPRIETARIO_STEPS: Step[] = [
  {
    number: '01',
    title: 'Cerca tra i profili verificati',
    description: "Filtra per città, budget e tipologia. Visualizza solo gli inquilini che corrispondono alle tue esigenze.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Cerca+profili',
  },
  {
    number: '02',
    title: 'Valuta tutto in una schermata',
    description: "Ogni profilo include occupazione, reddito mensile, referenze e video presentazione. Nessuna telefonata per raccogliere documenti.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Valuta+profili',
  },
  {
    number: '03',
    title: 'Contatta e organizza la visita',
    description: "Scrivi direttamente all'inquilino dalla piattaforma. Niente intermediari, niente commissioni.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Contatta',
  },
  {
    number: '04',
    title: 'Seleziona il candidato giusto',
    description: "Confronta i profili affiancati e scegli l'inquilino più affidabile grazie allo score di affidabilità.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Seleziona',
  },
  {
    number: '05',
    title: 'Chiudi il contratto',
    description: "Formalizza l'accordo in tempi rapidi. Tempo medio di locazione ridotto da 45 a 18 giorni.",
    image: 'https://placehold.co/600x400/f4f9f6/004832?text=Contratto',
  },
];

const INQUILINO_PERCHE = [
  'Un profilo vale per tutti gli annunci',
  'Agenzie e proprietari verificati',
  'Zero visite a vuoto',
  'Documenti al sicuro e sempre accessibili',
];

const PROPRIETARIO_PERCHE = [
  'Database di 30.000+ inquilini con profilo completo',
  'Candidature strutturate in una sola schermata',
  'Tempo medio di locazione ridotto da 45 a 18 giorni',
  'Niente intermediari, niente commissioni',
];

type Tab = 'inquilino' | 'proprietario';

export const ComeFunzionaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inquilino');

  const steps = activeTab === 'inquilino' ? INQUILINO_STEPS : PROPRIETARIO_STEPS;
  const perche = activeTab === 'inquilino' ? INQUILINO_PERCHE : PROPRIETARIO_PERCHE;
  const ctaHref = activeTab === 'inquilino' ? '/case-e-stanze-in-affitto' : '/register';
  const ctaLabel = activeTab === 'inquilino' ? 'Inizia a cercare casa' : 'Registra la tua agenzia';

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-soft-green/40 border-b border-gray-100 px-4">
        <div className="max-w-full lg:px-20 mx-auto">
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-4 border-l-2 border-action-green pl-3">
            Guida alla piattaforma
          </p>
          <h1 className="text-[28px] md:text-4xl lg:text-5xl font-bold text-brand-green mb-4 leading-[1.15]">
            Come funziona <span className="text-action-green">AffittoChiaro</span>
          </h1>
          <p className="text-lg md:text-xl text-medium-gray mb-8 leading-[1.5] max-w-2xl">
            Una guida per capire come cercare casa o come trovare l'inquilino giusto.
          </p>

          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('inquilino')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'inquilino' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500 hover:text-brand-green'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Sono un inquilino
            </button>
            <button
              onClick={() => setActiveTab('proprietario')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'proprietario' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500 hover:text-brand-green'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Sono un proprietario
            </button>
          </div>
        </div>
      </section>

      {/* ── STEPS — alternating layout ────────────────────────── */}
      <section className="py-16 bg-white border-b border-gray-100 px-4">
        <div className="max-w-full lg:px-20 mx-auto">
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">
            {activeTab === 'inquilino' ? 'Il percorso per chi cerca casa' : 'Il percorso per chi cerca inquilini'}
          </p>
          <h2 className="text-[24px] md:text-3xl font-bold text-brand-green mb-12 leading-[1.2]">
            {activeTab === 'inquilino' ? 'Trovare casa in 5 passi' : "Trovare l'inquilino giusto in 5 passi"}
          </h2>

          <div className="space-y-14">
            {steps.map((step, idx) => {
              const flip = idx % 2 === 1;
              return (
                <div
                  key={step.number}
                  className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${flip ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="lg:w-1/2 w-full">
                    <span className="text-[3rem] font-bold text-gray-100 leading-none tabular-nums select-none block mb-2">
                      {step.number}
                    </span>
                    <h3 className="text-xl md:text-[22px] xl:text-2xl font-bold text-brand-green mb-3 leading-[1.3]">
                      {step.title}
                    </h3>
                    <p className="text-base text-medium-gray leading-[1.6]">
                      {step.description}
                    </p>
                  </div>

                  <div className="lg:w-1/2 w-full">
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-soft-green">
                      <img src={step.image} alt={step.title} className="w-full block" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PERCHÉ AFFITTOCHIARO ──────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-b border-gray-100 px-4">
        <div className="max-w-full lg:px-20 mx-auto">
          <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">
            Perché AffittoChiaro
          </p>
          <h2 className="text-[24px] md:text-3xl font-bold text-brand-green mb-8 leading-[1.2]">
            {activeTab === 'inquilino' ? 'I vantaggi per chi cerca casa' : 'I vantaggi per i proprietari'}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {perche.map((testo, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4">
                <CheckCircle size={18} className="text-action-green shrink-0 mt-0.5" />
                <p className="text-base text-brand-green font-medium leading-[1.5]">{testo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-green px-4">
        <div className="max-w-full lg:px-20 mx-auto">
          <h2 className="text-[24px] md:text-3xl font-bold text-white mb-3 leading-[1.2]">
            {activeTab === 'inquilino' ? 'Pronto a trovare la tua casa?' : "Pronto a trovare l'inquilino giusto?"}
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-xl leading-[1.5]">
            {activeTab === 'inquilino'
              ? 'Crea il profilo una volta sola. Vale per tutti gli annunci.'
              : 'Inizia quando vuoi, senza abbonamenti né commissioni.'}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-action-green text-white font-bold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all"
            >
              Registrati gratis
              <ArrowRight size={16} />
            </Link>
            <Link
              to={ctaHref}
              className="text-white/80 text-sm font-semibold hover:text-white transition-colors"
            >
              {ctaLabel} →
            </Link>
          </div>

          <p className="mt-8 text-white/50 text-xs">
            {activeTab === 'inquilino' ? (
              <>
                Sei un proprietario?{' '}
                <button onClick={() => setActiveTab('proprietario')} className="text-action-green font-bold hover:underline">
                  Guarda come funziona per i proprietari
                </button>
              </>
            ) : (
              <>
                Stai cercando casa?{' '}
                <button onClick={() => setActiveTab('inquilino')} className="text-action-green font-bold hover:underline">
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
