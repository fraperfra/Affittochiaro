import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Home, ChevronDown, Play, ArrowRight } from 'lucide-react';

interface StepData {
  number: string;
  title: string;
  description: string;
  time?: string;
  image: string;
  faq?: { question: string; answer: string };
}

const INQUILINO_STEPS: StepData[] = [
  {
    number: '01',
    title: 'Crea il tuo account',
    description: "Registrati in 2 minuti con email o Google. Basta nome, email e città di ricerca — nessuna carta di credito.",
    time: '2 min',
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Registrazione',
  },
  {
    number: '02',
    title: 'Descrivi cosa cerchi',
    description: 'Indica città, budget, tipologia e data di ingresso. Queste preferenze guidano proprietari e agenzie verso di te.',
    time: '3 min',
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Preferenze',
  },
  {
    number: '03',
    title: 'Costruisci il tuo profilo',
    description: 'Aggiungi occupazione, reddito e una breve presentazione. Un profilo completo riceve tre volte più risposte.',
    time: '5 min',
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Profilo',
  },
  {
    number: '04',
    title: 'Aggiungi la video presentazione',
    description: '60 secondi in cui ti mostri al proprietario prima ancora di candidarti. I profili con video ricevono il 78% in più di risposte.',
    time: '1 min',
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Video',
    faq: {
      question: 'Devo per forza fare il video?',
      answer: "No, non è obbligatorio. Ma i profili con video ricevono molte più risposte — bastano 60 secondi con il telefono.",
    },
  },
  {
    number: '05',
    title: 'Ricevi proposte e candidati',
    description: 'Il tuo profilo è visibile a proprietari e agenzie: ti contattano direttamente. Puoi anche sfogliare gli annunci e candidarti con un click.',
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Annunci',
    faq: {
      question: 'Il proprietario vede tutti i miei dati subito?',
      answer: "No. Prima avvia una conversazione. Solo dopo che accetti, il profilo completo diventa visibile.",
    },
  },
];

const PROPRIETARIO_STEPS: StepData[] = [
  {
    number: '01',
    title: 'Registrazione e verifica',
    description: "Crei l'account e verifichi la tua identità in pochi minuti. Un passaggio che garantisce la sicurezza su tutta la piattaforma.",
    time: '5 min',
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Registrazione',
  },
  {
    number: '02',
    title: 'Cerca tra i profili',
    description: 'Filtra per città, budget e tipologia di casa. Vedi solo gli inquilini verificati che corrispondono alle tue esigenze.',
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Ricerca+profili',
  },
  {
    number: '03',
    title: 'Valuta i profili verificati',
    description: "Ogni profilo include occupazione, reddito, referenze e video presentazione. Tutto in una schermata, senza dover chiedere nulla.",
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Valuta+profili',
    faq: {
      question: "Cosa include il profilo dell'inquilino?",
      answer: "Nome, foto, occupazione, tipo di contratto lavorativo, reddito mensile, referenze da precedenti proprietari e la video presentazione.",
    },
  },
  {
    number: '04',
    title: 'Contatta e organizza la visita',
    description: "Scrivi direttamente all'inquilino. Organizzi la visita e proseguite come preferite — la piattaforma resta un punto di riferimento.",
    image: 'https://placehold.co/800x500/f4f9f6/004832?text=Contatta',
  },
];

const BrowserFrame: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
    <div className="bg-gray-100 px-3 py-2 flex items-center gap-1.5 border-b border-gray-200 shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-red-300 inline-block" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 inline-block" />
      <span className="w-2.5 h-2.5 rounded-full bg-green-300 inline-block" />
    </div>
    <img src={src} alt={alt} className="w-full block" />
  </div>
);

export const ComeFunzionaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquilino' | 'proprietario'>('inquilino');
  const [openFaqStep, setOpenFaqStep] = useState<string | null>(null);

  const steps = activeTab === 'inquilino' ? INQUILINO_STEPS : PROPRIETARIO_STEPS;

  const handleTabChange = (tab: 'inquilino' | 'proprietario') => {
    setActiveTab(tab);
    setOpenFaqStep(null);
  };

  const toggleFaq = (stepNumber: string) => {
    setOpenFaqStep(openFaqStep === stepNumber ? null : stepNumber);
  };

  return (
    <div className="pt-16">

      {/* INTRO */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-full lg:px-20 mx-auto">
          <h1 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green mb-2 leading-[1.2]">
            Come funziona AffittoChiaro
          </h1>
          <p className="text-base text-medium-gray mb-7 leading-[1.5]">
            Una guida per capire come cercare casa o come trovare l'inquilino giusto.
          </p>

          <div className="inline-flex bg-gray-100 rounded-full p-1 mb-5">
            <button
              onClick={() => handleTabChange('inquilino')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'inquilino' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500 hover:text-brand-green'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Sono un inquilino
            </button>
            <button
              onClick={() => handleTabChange('proprietario')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'proprietario' ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500 hover:text-brand-green'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Sono un proprietario
            </button>
          </div>

          <div>
            <a
              href="#video-section"
              className="inline-flex items-center gap-1.5 text-sm text-medium-gray hover:text-brand-green transition-colors"
            >
              <Play className="w-3 h-3 text-action-green fill-action-green" />
              Preferisci guardare? Guarda il video in 2:30
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-full lg:px-20 mx-auto divide-y divide-gray-200">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12 py-10">

              {/* Text */}
              <div className="lg:w-[58%] w-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[2.25rem] font-bold text-gray-100 leading-none tabular-nums select-none">
                    {step.number}
                  </span>
                  {step.time && (
                    <span className="text-[11px] font-semibold text-action-green border border-action-green/30 bg-action-green/5 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {step.time}
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-brand-green mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-medium-gray leading-[1.7]">{step.description}</p>

                {step.faq && (
                  <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => toggleFaq(step.number)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-brand-green pr-3">{step.faq.question}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                          openFaqStep === step.number ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaqStep === step.number ? 'max-h-40' : 'max-h-0'}`}>
                      <p className="px-4 pb-4 pt-2 text-xs text-medium-gray leading-[1.7] border-t border-gray-100">
                        {step.faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Screenshot */}
              <div className="lg:w-[42%] w-full">
                <BrowserFrame src={step.image} alt={step.title} />
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section id="video-section" className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-full lg:px-20 mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-brand-green mb-1.5 leading-[1.2]">
            Guarda come creare il profilo e candidarti in meno di 3 minuti
          </h2>
          <p className="text-sm text-medium-gray mb-6 leading-[1.5]">
            Tutto quello che trovi in questa pagina, mostrato in tempo reale.
          </p>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm cursor-pointer group max-w-2xl">
            <img
              src="https://placehold.co/1200x675/1a1a1a/ffffff?text=Video+Thumbnail"
              alt="Video come funziona AffittoChiaro"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Play className="w-5 h-5 text-brand-green fill-brand-green" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded">2:30 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* HAI DUBBI? */}
      <section className="py-10 px-4 bg-gray-50 border-b border-gray-100">
        <div className="max-w-full lg:px-20 mx-auto">
          <p className="text-sm text-medium-gray mb-4 leading-[1.6]">
            Hai ancora domande? Consulta le FAQ complete o scrivici — rispondiamo entro poche ore.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-action-green transition-colors"
            >
              Vai alle FAQ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-action-green transition-colors"
            >
              Contattaci <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-full lg:px-20 mx-auto">
          <p className="text-base text-medium-gray mb-5 leading-[1.5]">
            Ora che sai come funziona, puoi iniziare quando vuoi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-action-green text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 transition-all min-h-[44px]"
            >
              Crea il tuo profilo gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/case-e-stanze-in-affitto"
              className="inline-flex items-center gap-2 border border-gray-200 text-brand-green px-5 py-2.5 rounded-lg font-bold text-sm hover:border-brand-green transition-all min-h-[44px]"
            >
              Esplora gli annunci
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
