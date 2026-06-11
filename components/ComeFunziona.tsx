import React, { useState } from 'react';
import { User, Home } from 'lucide-react';

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

export const ComeFunziona: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquilino' | 'proprietario'>('inquilino');

  const steps = activeTab === 'inquilino' ? INQUILINO_STEPS : PROPRIETARIO_STEPS;

  return (
    <section className="py-16 bg-white px-4 border-b border-gray-100">
      <div className="max-w-full lg:px-20 mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-[24px] md:text-3xl font-bold text-brand-green mb-3 leading-[1.2]">
            Come funziona Affittochiaro
          </h2>
          <p className="text-lg md:text-xl text-medium-gray mb-6 leading-[1.5]">
            Una guida per capire come cercare casa o come trovare l'inquilino giusto.
          </p>

          <div className="flex flex-wrap items-center gap-4">
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
        </div>

        {/* Steps — alternating layout */}
        <div className="space-y-14">
          {steps.map((step, idx) => {
            const flip = idx % 2 === 1;
            return (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${flip ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Text */}
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

                {/* Image */}
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
  );
};
