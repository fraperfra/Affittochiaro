import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Building2 } from 'lucide-react';

export const ChiSiamoPage: React.FC = () => {
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
                src="https://placehold.co/640x480/f4f9f6/004832?text=Angelo+%26+Angela"
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
                src="https://placehold.co/640x480/004832/f4f9f6?text=Affittochiaro"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-start gap-4 hover:border-gray-300 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <UserCheck size={20} className="text-gray-500" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-brand-green mb-2">Sei un inquilino?</h3>
                <p className="text-medium-gray text-base leading-[1.6]">
                  Crea il tuo profilo completo e lascia che siano i proprietari a trovarti. Puoi anche candidarti
                  agli annunci con un click.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-start gap-4 hover:border-gray-300 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-gray-500" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-brand-green mb-2">Sei un proprietario o un'agenzia?</h3>
                <p className="text-medium-gray text-base leading-[1.6]">
                  Sfoglia profili verificati, filtra per città e budget, e contatta direttamente chi ti convince
                  di più.
                </p>
              </div>
            </div>
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
