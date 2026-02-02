import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantRegistrationModal, TenantRegistrationData } from './TenantRegistrationModal';
import toast from 'react-hot-toast';

interface HeroProps {
  counter: number;
  activeCityName: string;
}

export const Hero: React.FC<HeroProps> = ({ counter, activeCityName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegistrationComplete = (data: TenantRegistrationData) => {
    // Show success toast
    toast.success(
      <div>
        <p className="font-bold">Account creato con successo!</p>
        <p className="text-sm">Benvenuto {data.firstName}!</p>
      </div>,
      { duration: 4000 }
    );

    // Close modal
    setIsModalOpen(false);

    // Navigate to tenant dashboard after a short delay
    setTimeout(() => {
      navigate('/tenant');
    }, 500);
  };

  return (
    <>
      <section className="bg-soft-green/50 pt-16 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side: Copy - 60% */}
          <div className="lg:w-[60%] text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-action-green/10 px-5 py-2.5 rounded-full mb-10 border border-action-green/10">
              <span className="text-xs md:text-sm font-bold text-brand-green uppercase tracking-widest">
                NOVITÀ: VIDEO PRESENTAZIONE INQUILINO
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-green leading-[1.1] mb-10 font-poppins">
              Smetti di inviare <br />
              <span className="text-error-red">email a vuoto</span>. <br />
              Trova casa in meno di <span className="underline-green text-action-green">2 Settimane</span>
            </h1>
            <p className="text-xl md:text-2xl text-medium-gray max-w-3xl mx-auto lg:mx-0 mb-14 leading-relaxed">
              Basta ignorare annunci già scaduti. Crea il tuo <span className="font-bold text-brand-green">Profilo Verificato</span>, presenta te stesso con un <span className="font-bold text-brand-green">CV dedicato</span> e ricevi risposte dai proprietari in <span className="font-bold text-brand-green">meno di 24 ore.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-brand-green text-white px-12 py-7 rounded-3xl font-bold text-xl flex items-center justify-center gap-4 hover:brightness-110 transition-all shadow-2xl shadow-brand-green/20 group uppercase tracking-tight"
              >
                CREA IL TUO PROFILO GRATIS
                <span className="text-3xl group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-5">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="User" />)}
              </div>
              <p className="text-base font-semibold text-medium-gray italic">Unisciti a <span className="text-brand-green font-bold">30.000+</span> inquilini felici</p>
            </div>
          </div>

          {/* Right Side: Community Card - 40% */}
          <div className="lg:w-[40%] w-full max-w-md lg:max-w-none">
            <div className="bg-brand-green rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-error-red animate-pulse"></span>
                  <span className="text-[10px] font-bold text-error-red uppercase tracking-[0.15em]">IN TEMPO REALE</span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold leading-tight mb-3">La più grande community di inquilini in Italia</h2>
                <p className="text-white/60 text-xs mb-8 leading-relaxed">Ogni 5 minuti un nuovo inquilino completa il suo profilo.</p>

                <div className="mb-6">
                  <div className="text-5xl md:text-6xl font-bold mb-2 tabular-nums tracking-tighter">
                    {counter.toLocaleString()}
                  </div>
                  <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10">
                    Inquilini Registrati e Verificati
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-white text-brand-green py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg hover:bg-gray-100 transition-colors active:scale-95 transition-transform"
                >
                  UNISCITI A LORO <span className="text-lg">→</span>
                </button>
              </div>

              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-action-green/10 rounded-full blur-[60px] -mr-24 -mt-24"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full blur-[50px]"></div>
            </div>

            <div className="mt-4 bg-action-green/5 border border-action-green/10 rounded-xl p-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-action-green"></div>
              <p className="text-[10px] font-bold text-brand-green">
                Questa settimana, <span className="text-action-green">42 inquilini</span> hanno trovato casa a {activeCityName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <TenantRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleRegistrationComplete}
      />
    </>
  );
};
