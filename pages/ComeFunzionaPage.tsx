import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Home, CheckCircle } from 'lucide-react';

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
    image: '/assets/photo_2026-06-11_14-18-56.jpg',
  },
  {
    number: '02',
    title: 'Vieni trovato',
    description: "Il tuo profilo è visibile a proprietari e agenzie verificate: sono loro a contattarti con proposte in linea con la tua ricerca.",
    image: '/assets/photo_2026-06-11_14-12-09.jpg',
  },
  {
    number: '03',
    title: 'Candidati con un click',
    description: "Sfoglia gli annunci e invia la candidatura istantaneamente. Il proprietario riceve subito il tuo profilo completo.",
    image: '/assets/photo_2026-06-11_14-20-34.jpg',
  },
];

const PROPRIETARIO_STEPS: Step[] = [
  {
    number: '01',
    title: 'Cerca tra i profili verificati',
    description: "Filtra per città, budget e tipologia. Visualizza solo gli inquilini che corrispondono alle tue esigenze.",
    image: '/assets/photo_2026-06-11_14-12-09.jpg',
  },
  {
    number: '02',
    title: 'Valuta tutto in una schermata',
    description: "Ogni profilo include occupazione, reddito mensile, referenze e video presentazione. Nessuna telefonata per raccogliere documenti.",
    image: '/assets/photo_2026-06-11_14-29-52.jpg',
  },
  {
    number: '03',
    title: 'Contatta e organizza la visita',
    description: "Scrivi direttamente all'inquilino per fissare un appuntamento e organizzare una visita.",
    image: '/assets/photo_2026-06-11_14-35-30.jpg',
  },
];

const INQUILINO_PERCHE = [
  'Un profilo vale per tutti gli annunci',
  'Agenzie e proprietari verificati',
  'Zero visite a vuoto',
];

const PROPRIETARIO_PERCHE = [
  'Database di 30.000+ inquilini con profilo completo',
  'Candidature strutturate in una sola schermata',
  'Tempo medio di locazione ridotto da 45 a 18 giorni',
];

type Tab = 'inquilino' | 'proprietario';

export const ComeFunzionaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inquilino');

  const steps = activeTab === 'inquilino' ? INQUILINO_STEPS : PROPRIETARIO_STEPS;
  const perche = activeTab === 'inquilino' ? INQUILINO_PERCHE : PROPRIETARIO_PERCHE;
  const ctaHref = activeTab === 'inquilino' ? '/case-e-stanze-in-affitto' : '/register';

  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-soft-green/40 border-b border-gray-100 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[28px] md:text-4xl lg:text-5xl font-bold text-brand-green mb-4 leading-[1.15]">
            Come funziona <span className="text-action-green">Affittochiaro</span>
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
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[24px] md:text-3xl font-bold text-brand-green mb-12 leading-[1.2]">
            {activeTab === 'inquilino' ? 'Trovare casa in 3 passi' : "Trovare l'inquilino giusto in 3 passi"}
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
        <div className="max-w-7xl mx-auto">
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-brand-green rounded-2xl p-10 md:p-16 text-center">
          <h2 className="text-[24px] md:text-3xl font-bold text-white mb-3 leading-[1.2]">
            {activeTab === 'inquilino' ? 'Pronto a trovare la tua casa?' : "Pronto a trovare l'inquilino giusto?"}
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-xl mx-auto leading-[1.5]">
            {activeTab === 'inquilino'
              ? 'Crea il profilo una volta sola. Vale per tutti gli annunci.'
              : 'Inizia quando vuoi, senza abbonamenti né commissioni.'}
          </p>
          <Link
            to={ctaHref}
            className="inline-flex items-center justify-center bg-action-green text-white px-8 py-4 min-h-[44px] rounded-xl font-bold text-base hover:brightness-110 transition-all"
          >
            {activeTab === 'inquilino' ? 'Inizia a cercare casa' : "Trova l'inquilino"}
          </Link>

        </div>
      </section>

    </div>
  );
};
