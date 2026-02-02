import React, { useMemo } from 'react';
import { cityDetails, nearbyCities } from '../data';

interface CityMapProps {
  activeCityName: string;
  onCityChange: (city: string) => void;
}

export const CityMap: React.FC<CityMapProps> = ({ activeCityName, onCityChange }) => {
  const activeCityInfo = useMemo(() => cityDetails[activeCityName], [activeCityName]);

  return (
    <section className="py-24 bg-white px-4 overflow-hidden border-y border-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Map Column (Interactive Visual) */}
        <div className="lg:w-1/2 relative min-h-[400px] flex items-center justify-center">
          <div className="relative w-full aspect-[3/4] flex items-center justify-center">
            {/* Italy Map from SVG file */}
            <div className="relative w-full h-full">
              <img
                src="/assets/mappa italia.svg"
                alt="Mappa Italia"
                className="w-full h-full object-contain opacity-90"
              />

              {/* City Markers Overlay */}
              <svg viewBox="0 0 1200 1500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
                {Object.entries(cityDetails).map(([name, data]) => {
                  const isMainCity = nearbyCities.some(c => c.name === name);
                  const isActive = activeCityName === name;

                  return (
                    <g
                      key={name}
                      className={isMainCity ? "cursor-pointer" : ""}
                      onClick={() => isMainCity && onCityChange(name)}
                    >
                      {/* Pulse effect for active city */}
                      {isActive && (
                        <>
                          <circle
                            cx={data.marker.cx}
                            cy={data.marker.cy}
                            r="45"
                            className="fill-action-green/30 animate-ping"
                          />
                          <circle
                            cx={data.marker.cx}
                            cy={data.marker.cy}
                            r="35"
                            className="fill-action-green/20"
                          />
                        </>
                      )}
                      {/* City dot */}
                      <circle
                        cx={data.marker.cx}
                        cy={data.marker.cy}
                        r={isActive ? "20" : isMainCity ? "12" : "8"}
                        className={`transition-all duration-300 ${
                          isActive
                            ? 'fill-action-green drop-shadow-lg'
                            : isMainCity
                              ? 'fill-brand-green/80 hover:fill-action-green'
                              : 'fill-brand-green/40'
                        }`}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* DYNAMIC TOOLTIP */}
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
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:w-1/2">
          <div className="inline-block bg-action-green/10 text-action-green px-5 py-2 rounded-full font-bold text-[10px] mb-6 uppercase tracking-[0.2em]">PRESENZA CAPILLARE</div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-green mb-8 leading-tight font-poppins">
            Affittochiaro è <br /><span className="text-action-green">Vicino a Te</span>
          </h2>
          <p className="text-lg text-medium-gray mb-12 leading-relaxed max-w-xl">
            Siamo presenti in tutte le principali città italiane. <span className="font-bold text-brand-green">Seleziona la tua città</span> per scoprire le opportunità in tempo reale.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {nearbyCities.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onCityChange(city.name)}
                className={`p-5 rounded-[1.8rem] border text-left transition-all duration-300 group ${activeCityName === city.name ? 'border-action-green bg-action-green/5 shadow-xl shadow-action-green/5 -translate-y-1' : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <p className={`font-bold text-base mb-1 transition-colors ${activeCityName === city.name ? 'text-brand-green' : 'text-gray-400'}`}>{city.name}</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${activeCityName === city.name ? 'text-action-green' : 'text-gray-300'}`}>
                  {cityDetails[city.name].ads} ANNUNCI
                </p>
              </button>
            ))}
          </div>

          {/* Agency Quote Block */}
          <div className="mb-12 relative overflow-hidden p-8 rounded-3xl bg-soft-green/50 border border-gray-100">
            <div className="relative z-10">
              <p className="text-lg italic text-brand-green font-medium leading-relaxed mb-4">
                "Grazie alla capillarità di Affittochiaro, abbiamo trovato l'inquilino ideale per il nostro immobile a {activeCityName} in soli {activeCityName === 'Milano' ? '2' : '4'} giorni."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white text-[10px] font-bold">AR</div>
                <p className="text-[10px] font-bold text-brand-green uppercase tracking-[0.15em]">
                  — AGENZIA REALE, {activeCityName.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <button className="w-full md:w-auto bg-brand-green text-white px-12 py-6 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-2xl shadow-brand-green/20 hover:bg-black transition-all active:scale-95">
            CERCA A {activeCityName.toUpperCase()} ORA
          </button>
        </div>
      </div>
    </section>
  );
};
