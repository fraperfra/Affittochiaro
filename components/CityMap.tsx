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

            {/* DYNAMIC TOOLTIP */}
            {!compact && (
              <div
                className="absolute transition-all duration-700 ease-in-out z-20"
                style={{ top: activeCityInfo.pos.top, left: activeCityInfo.pos.left }}
              >
                <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 border border-gray-100 min-w-[180px] animate-slide-up transform-gpu">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">LIVE @ {activeCityName.toUpperCase()}</p>
                  <div className="flex flex-col gap-1 mb-3">
                    <p className="text-xl font-black text-brand-green leading-none">{activeCityInfo.ads} <span className="text-[10px] text-medium-gray font-normal">Annunci</span></p>
                    <p className="text-xs font-bold text-action-green">{activeCityInfo.newToday} nuovi oggi</p>
                  </div>
                  <div className="pt-3 border-t border-gray-50">
                    <p className="text-[10px] font-medium text-gray-400">Inquilini verificati: <span className="text-brand-green font-bold">{activeCityInfo.tenants}</span></p>
                  </div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-brand-green/20 to-transparent mx-auto mt-2 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Content Column - Hidden in compact mode */}
        {!compact && (
          <div className="lg:w-1/2">
            <div className="inline-block bg-action-green/10 text-action-green px-5 py-2 rounded-full font-bold text-[10px] mb-6 uppercase tracking-[0.2em]">PRESENZA CAPILLARE</div>
            <h2 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green mb-8 leading-[1.2]">
              Affittochiaro è <br /><span className="text-action-green">Vicino a Te</span>
            </h2>
            <p className="text-lg text-medium-gray mb-12 leading-[1.5] max-w-[65ch]">
              Siamo attivi in tutte le principali città italiane — da Milano a Palermo. Ogni giorno aggiungiamo nuovi annunci verificati, così trovi sempre l'opportunità giusta nella tua zona.
            </p>

            {/* Agency Quote Block */}
            <div className="mb-12 relative overflow-hidden p-8 rounded-3xl bg-soft-green/50 border border-gray-100">
              <div className="relative z-10">
                <p className="text-lg italic text-brand-green font-medium leading-[1.6] mb-4">
                  "Grazie alla capillarità di Affittochiaro, abbiamo trovato l'inquilino ideale per il nostro immobile a {activeCityName} in soli {activeCityName === 'Milano' ? '2' : '4'} giorni."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white text-[10px] font-bold">AR</div>
                  <p className="text-sm font-bold text-brand-green uppercase tracking-[0.15em]">
                    — AGENZIA REALE, {activeCityName.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/tenant/listings?city=${encodeURIComponent(activeCityName)}&view=map`)}
              className="w-full md:w-auto bg-brand-green text-white px-12 py-6 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-2xl shadow-brand-green/20 hover:bg-black transition-all active:scale-95"
            >
              CERCA LA TUA CASA
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
