import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantRegistrationModal, TenantRegistrationData } from './TenantRegistrationModal';
import { InlineEditor, useCMSText } from '../src/cms';
import toast from 'react-hot-toast';

interface HeroProps {
  counter: number;
  activeCityName: string;
}

export const Hero: React.FC<HeroProps> = ({ counter, activeCityName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const ctaText = useCMSText('home.hero.cta') || 'CREA IL TUO PROFILO GRATIS';
  const cardCtaText = useCMSText('home.hero.cardCta') || 'UNISCITI A LORO →';

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

  return (
    <>
      <section className="bg-white pt-16 pb-20 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Side: Copy */}
          <div className="lg:w-[60%] text-center lg:text-left">
            <InlineEditor id="home.hero.badge" as="p" className="text-xs font-bold text-brand-green uppercase tracking-widest mb-6 border-l-2 border-action-green pl-3 text-left">
              NOVITÀ: VIDEO PRESENTAZIONE INQUILINO
            </InlineEditor>
            <div className="mb-8">
              <InlineEditor id="home.hero.title" as="h1" className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-green leading-[1.1]" multiline>
                Smetti di inviare email a vuoto. Trova casa in meno di 2 Settimane
              </InlineEditor>
            </div>
            <InlineEditor id="home.hero.subtitle" as="p" className="text-xl md:text-2xl text-medium-gray max-w-3xl mx-auto lg:mx-0 mb-12 leading-relaxed" multiline>
              Basta ignorare annunci già scaduti. Crea il tuo Profilo Verificato, presenta te stesso con un CV dedicato e ricevi risposte dai proprietari in meno di 24 ore.
            </InlineEditor>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-brand-green text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-colors uppercase tracking-tight"
              >
                {ctaText}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-11 h-11 rounded-full border-2 border-white" alt="User" />
                ))}
              </div>
              <InlineEditor id="home.hero.socialProof" as="p" className="text-sm font-semibold text-medium-gray">
                Unisciti a 30.000+ inquilini felici
              </InlineEditor>
            </div>
          </div>

          {/* Right Side: Community Card */}
          <div className="lg:w-[40%] w-full max-w-md lg:max-w-none">
            <div className="bg-brand-green rounded-2xl p-6 md:p-8 text-white border border-brand-green">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-error-red animate-pulse"></span>
                <span className="text-[10px] font-bold text-error-red uppercase tracking-[0.15em]">IN TEMPO REALE</span>
              </div>

              <InlineEditor id="home.hero.cardTitle" as="h2" className="text-xl md:text-2xl font-bold leading-tight mb-2">
                La più grande community di inquilini in Italia
              </InlineEditor>
              <InlineEditor id="home.hero.cardSubtitle" as="p" className="text-white/60 text-xs mb-6 leading-relaxed">
                Ogni 5 minuti un nuovo inquilino completa il suo profilo.
              </InlineEditor>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="text-5xl md:text-6xl font-bold mb-2 tabular-nums tracking-tighter">
                  {counter.toLocaleString()}
                </div>
                <InlineEditor id="home.hero.cardLabel" as="div" className="text-xs text-white/50 uppercase tracking-widest font-semibold">
                  Inquilini Registrati e Verificati
                </InlineEditor>
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
      </section>

      <TenantRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleRegistrationComplete}
      />
    </>
  );
};
