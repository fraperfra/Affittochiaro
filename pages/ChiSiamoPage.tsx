import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Building2 } from 'lucide-react';

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

export const ChiSiamoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquilino' | 'proprietario'>('inquilino');
  const steps = activeTab === 'inquilino' ? INQUILINO_STEPS : PROPRIETARIO_STEPS;

  return (
    <div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

            <div>
              <h1 className="text-[24px] font-bold text-brand-green leading-[1.2]">
                Siamo Angelo e Angela
              </h1>
              <p className="mt-4 text-lg md:text-xl text-medium-gray leading-[1.5]">
                Facciamo gli agenti immobiliari da oltre 16 anni, e in tutto questo tempo ne abbiamo viste di ogni tipo.
              </p>
              <div className="mt-6 space-y-4 text-base text-gray-600 leading-[1.7]">
                <p>
                  Proprietari che aspettavano mesi senza trovare qualcuno di fiducia. Inquilini ottimi che venivano
                  scartati perché non sapevano come presentarsi. Trattative che si incagliavano per mancanza di
                  informazioni semplici.
                </p>
                <p>
                  Dopo anni passati ad ascoltare queste storie, ci siamo resi conto che il vero problema non era mai
                  la casa. Era la fiducia tra persone che non si conoscono, e la difficoltà di costruirla in fretta.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <img
                src="/assets/chi-siamo-angelo-angela.webp"
                alt="Angelo e Angela"
                className="w-full rounded-2xl border border-gray-100"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── Origine ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

            <div className="order-2 lg:order-1 mt-10 lg:mt-0">
              <img
                src="/assets/photo_2026-06-11_14-12-09.jpg"
                alt="La piattaforma Affittochiaro"
                className="w-full rounded-2xl"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-[24px] font-bold text-brand-green leading-[1.2]">
                Così è nato Affittochiaro
              </h2>
              <div className="mt-6 space-y-4 text-base text-gray-600 leading-[1.7]">
                <p>
                  Volevamo dare a ogni persona la possibilità di presentarsi come merita. Un posto dove chi cerca
                  casa non è solo un nome su un documento, ma una persona reale con la sua storia, il suo lavoro,
                  la sua vita.
                </p>
                <p>
                  E dove chi affitta può scegliere con più serenità, sapendo già con chi ha a che fare prima ancora
                  di aprire la porta.
                </p>
                <p>
                  Gli inquilini creano un profilo completo. Proprietari e agenzie lo consultano e contattano chi li
                  convince di più. Semplice, chiaro, umano.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Due lati ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-[24px] font-bold text-brand-green mb-4 leading-[1.2]">
            Una piattaforma, due lati
          </h2>
          <p className="text-lg md:text-xl text-medium-gray mb-10 leading-[1.5]">
            Affittochiaro connette chi cerca casa con chi la offre, in modo diretto e trasparente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            <button
              type="button"
              onClick={() => setActiveTab('inquilino')}
              aria-pressed={activeTab === 'inquilino'}
              className={`text-left bg-white rounded-xl p-6 border flex items-start gap-4 transition-colors ${
                activeTab === 'inquilino' ? 'border-action-green ring-1 ring-action-green/30 bg-soft-green/40' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'inquilino' ? 'bg-action-green text-white' : 'bg-gray-100 text-gray-500'}`}>
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-brand-green mb-2">Sei un inquilino?</h3>
                <p className="text-medium-gray text-base leading-[1.6]">
                  Crea il tuo profilo completo e lascia che siano i proprietari a trovarti. Puoi anche candidarti
                  agli annunci con un click.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('proprietario')}
              aria-pressed={activeTab === 'proprietario'}
              className={`text-left bg-white rounded-xl p-6 border flex items-start gap-4 transition-colors ${
                activeTab === 'proprietario' ? 'border-action-green ring-1 ring-action-green/30 bg-soft-green/40' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'proprietario' ? 'bg-action-green text-white' : 'bg-gray-100 text-gray-500'}`}>
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-brand-green mb-2">Sei un proprietario o un'agenzia?</h3>
                <p className="text-medium-gray text-base leading-[1.6]">
                  Sfoglia profili verificati, filtra per città e budget, e contatta direttamente chi ti convince
                  di più.
                </p>
              </div>
            </button>
          </div>

          {/* Steps — same alternating layout as "Come funziona", filtered by selected tab */}
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

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[24px] font-bold text-brand-green mb-3 leading-[1.2]">
            Pronto a iniziare?
          </h2>
          <p className="text-lg text-medium-gray mb-8 leading-[1.5]">
            Unisciti a migliaia di persone che hanno già trovato la soluzione giusta su Affittochiaro.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all"
            >
              Crea il tuo profilo gratis
            </Link>
            <Link
              to="/case-e-stanze-in-affitto"
              className="inline-flex items-center justify-center gap-2 border border-brand-green/30 text-brand-green px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white transition-all"
            >
              Esplora gli annunci
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
