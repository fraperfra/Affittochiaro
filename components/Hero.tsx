import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BedSingle, Building2, Building, TreePine } from 'lucide-react';
import { TenantRegistrationModal, TenantRegistrationData } from './TenantRegistrationModal';
import { QuickSearchBox } from './search/QuickSearchBox';
import toast from 'react-hot-toast';

const TIPOLOGIE = [
  { label: 'Appartamento', slug: 'appartamento', icon: Home,      annunci: 87  },
  { label: 'Stanza',       slug: 'stanza',       icon: BedSingle, annunci: 52  },
  { label: 'Bilocale',     slug: 'bilocale',     icon: Building2, annunci: 44  },
  { label: 'Trilocale',    slug: 'trilocale',    icon: Building,  annunci: 31  },
  { label: 'Villa',        slug: 'villa',        icon: TreePine,  annunci: 18  },
];

interface HeroProps {
  counter: number;
  activeCityName: string;
}

export const Hero: React.FC<HeroProps> = ({ counter, activeCityName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTipologia, setSelectedTipologia] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const cardCtaText = 'UNISCITI A LORO →';

  const handleRegistrationComplete = (data: TenantRegistrationData) => {
    toast.success(
      <div>
        <p className="font-bold">Account creato con successo!</p>
        <p className="text-sm">Benvenuto {data.firstName}!</p>
      </div>,
      { duration: 4000 }
    );
    setIsModalOpen(false);
    setTimeout(() => { navigate('/tenant'); }, 500);
  };

  const handleTypeSelect = (slug: string) => {
    setSelectedTipologia(slug);
    setTimeout(() => {
      searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <>
      <section className="bg-white pt-16 pb-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Side: Copy */}
          <div className="lg:w-[60%] text-center lg:text-left">
            <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-6 border-l-2 border-action-green pl-3 text-left">
              NOVITÀ: VIDEO PRESENTAZIONE INQUILINO
            </p>
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-green leading-[1.1]">
                Trova casa in <span className="underline-green text-action-green">2 Settimane</span>. <br />
                Smetti di inviare <br />
                <span className="text-error-red">email a vuoto</span>.
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-medium-gray max-w-3xl mx-auto lg:mx-0 mb-3 leading-relaxed">
              Crea il tuo <span className="font-bold text-brand-green">Profilo Verificato</span> con <span className="font-bold text-brand-green">CV dedicato</span>. Ricevi risposte dai proprietari in <span className="font-bold text-brand-green">meno di 24 ore</span>.
            </p>
            <p className="text-base text-medium-gray max-w-3xl mx-auto lg:mx-0 mb-7">
              Basta annunci già scaduti e silenzi radio. Con Affittochiaro sei visibile, verificato e preferito.
            </p>

            {/* Tipologie — sostituisce CTA primario */}
            <div className="mb-8">
              <p className="text-xs font-bold text-medium-gray uppercase tracking-wider mb-3 text-left">
                Cosa stai cercando?
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {TIPOLOGIE.map(({ label, slug, icon: Icon, annunci }) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => handleTypeSelect(slug)}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:border-action-green hover:bg-soft-green px-3.5 py-2 rounded-xl text-sm font-semibold text-brand-green transition-all active:scale-95"
                  >
                    <Icon size={15} className="flex-shrink-0" />
                    <span>{label}</span>
                    <span className="text-xs text-medium-gray font-normal">{annunci}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-11 h-11 rounded-full border-2 border-white" alt="User" />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-medium-gray">
                  Unisciti a 30.000+ inquilini felici
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-3.5 h-3.5 text-[#00b67a] fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  ))}
                  <span className="text-xs text-medium-gray ml-1">4.9/5 su <span className="font-semibold text-brand-green">Trustpilot</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Community Card */}
          <div className="lg:w-[40%] w-full max-w-md lg:max-w-none">
            <div className="bg-brand-green rounded-2xl p-6 md:p-8 text-white border border-brand-green">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-error-red animate-pulse"></span>
                <span className="text-[10px] font-bold text-error-red uppercase tracking-[0.15em]">IN TEMPO REALE</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold leading-tight mb-2">
                La più grande community di inquilini in Italia
              </h2>
              <p className="text-white/60 text-xs mb-6 leading-relaxed">
                Ogni 5 minuti un nuovo inquilino completa il suo profilo.
              </p>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="text-5xl md:text-6xl font-bold mb-2 tabular-nums tracking-tighter">
                  {counter.toLocaleString()}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-widest font-semibold">
                  Inquilini Registrati e Verificati
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white text-brand-green py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                {cardCtaText}
              </button>
            </div>

            <div className="mt-3 border border-gray-200 rounded-xl p-3 flex items-center gap-2 bg-white">
              <div className="w-1.5 h-1.5 rounded-full bg-action-green flex-shrink-0"></div>
              <p className="text-[10px] font-bold text-brand-green">
                Questa settimana, <span className="text-action-green">42 inquilini</span> hanno trovato casa a {activeCityName}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search — full width below two-column layout */}
        <div ref={searchRef} className="max-w-7xl mx-auto mt-10 pt-10 border-t border-gray-100">
          <QuickSearchBox
            size="large"
            prefilledTipologia={selectedTipologia}
            onTipologiaFilled={() => setSelectedTipologia(null)}
          />
          <p className="mt-3 text-center text-xs text-medium-gray">
            Oltre 40 città disponibili · Agenzie verificate · Candidatura senza costi
          </p>
        </div>
      </section>

      <TenantRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleRegistrationComplete}
      />
    </>
  );
};
