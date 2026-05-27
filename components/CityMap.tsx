import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cityDetails, nearbyCities } from '../data';

interface CityMapProps {
  activeCityName: string;
  onCityChange: (city: string) => void;
}

export const CityMap: React.FC<CityMapProps & { compact?: boolean }> = ({ activeCityName, onCityChange, compact = false }) => {
  const navigate = useNavigate();
  const activeCityInfo = useMemo(() => cityDetails[activeCityName], [activeCityName]);

  return (
    <section className={`${compact ? 'h-full flex flex-col' : 'py-24 bg-white px-4 border-y border-gray-50'}`}>
      <div className={`max-w-7xl mx-auto flex flex-col ${compact ? '' : 'lg:flex-row'} items-center gap-12 lg:gap-20 h-full`}>
        {/* Map Column (Visual only) */}
        <div className={`${compact ? 'w-full h-full' : 'lg:w-[42%]'} relative flex items-center justify-center`}>
          <div className="relative w-[75%] lg:w-[85%] aspect-[3/4] flex items-center justify-center">
            {/* Italy Map from SVG file */}
            <div className="relative w-full h-full">
              <img
                src="/assets/mappa italia.svg"
                alt="Mappa Italia"
                className="w-full h-full object-contain opacity-90"
              />
            </div>

          </div>
        </div>

        {/* Content Column - Hidden in compact mode */}
        {!compact && (
          <div className="lg:w-1/2">
            <h2 className="text-[24px] font-bold text-brand-green mb-4 leading-[1.2]">
              AffittoChiaro è <span className="text-action-green">vicino a te</span>
            </h2>
            <p className="text-lg text-medium-gray mb-12 leading-[1.5]">
              Siamo attivi in tutte le principali città italiane: da Milano a Palermo. Ogni giorno aggiungiamo nuovi annunci verificati, così trovi sempre l'opportunità giusta nella tua zona.
            </p>

            {/* Agency Quote Block */}
            <div className="mb-8 relative overflow-hidden p-5 rounded-2xl bg-soft-green/50 border border-gray-100">
              <div className="relative z-10">
                <p className="text-xs italic text-brand-green font-medium leading-[1.6] mb-3">
                  "Grazie ad AffittoChiaro abbiamo trovato l'inquilino ideale per il nostro immobile in soli 3 giorni."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center text-white text-[9px] font-bold shrink-0">AR</div>
                  <p className="text-[10px] font-bold text-brand-green uppercase tracking-[0.15em]">
                    AGENZIA PARTNER VERIFICATA
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/tenant/listings?city=${encodeURIComponent(activeCityName)}&view=map`)}
              className="w-full md:w-auto bg-brand-green text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl shadow-brand-green/20 hover:bg-black transition-all active:scale-95"
            >
              CERCA LA TUA CASA
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
