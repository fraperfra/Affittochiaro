import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantRegistrationModal, TenantRegistrationData } from './TenantRegistrationModal';
import toast from 'react-hot-toast';

export const HowItWorks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegistrationComplete = (data: TenantRegistrationData) => {
    toast.success(
      <div>
        <p className="font-bold">CV creato con successo!</p>
        <p className="text-sm">Benvenuto {data.firstName}!</p>
      </div>,
      { duration: 4000 }
    );

    setIsModalOpen(false);

    setTimeout(() => {
      navigate('/tenant');
    }, 500);
  };

  return (
    <>
      <section id="come-funziona" className="py-16 bg-white px-4">
        <div className="max-w-full lg:px-20 mx-auto text-center">
          <div className="inline-block bg-action-green/10 text-action-green px-5 py-2 rounded-full font-bold text-[10px] mb-8 uppercase tracking-[0.2em]">PROCESSO SEMPLIFICATO</div>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-green mb-6 leading-tight font-poppins">Candidati in 3 Semplici Passaggi</h2>
          <p className="text-lg md:text-xl text-medium-gray mb-12 max-w-2xl mx-auto">Dalla registrazione alla tua nuova casa, senza intoppi e con la massima professionalità.</p>

          <div className="flex flex-col lg:flex-row lg:space-y-0 space-y-16 lg:gap-12 gap-8 lg:items-stretch">
            {/* STEP 1 */}
            <div className="text-left flex flex-col items-center lg:flex-1 w-full">
              <div className="flex items-center gap-3 mb-6 w-full lg:min-h-[80px]">
                <div className="w-12 h-12 bg-action-green text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-brand-green leading-tight">Crea il Tuo Curriculum da Inquilino</h3>
              </div>
              <p className="text-lg text-medium-gray mb-12 w-full lg:min-h-[56px]">Registrati gratuitamente e compila il tuo <span className="font-bold text-brand-green">profilo completo</span>.</p>
              <div className="w-full relative mx-auto group flex-1 flex flex-col">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 border border-gray-100 relative z-10 transition-transform group-hover:-translate-y-2 duration-500 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white text-[10px] font-bold">A</div>
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Affittochiaro</span>
                    </div>
                    <div className="flex items-center gap-1 bg-action-green/10 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-action-green animate-pulse"></span>
                      <span className="text-[8px] font-bold text-action-green uppercase tracking-widest">In Corso</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 bg-soft-green rounded-2xl flex items-center justify-center text-action-green font-bold text-2xl text-center shadow-inner">LM</div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-green">Luca Martini</h4>
                      <div className="flex items-center gap-1.5 text-action-green">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                        <span className="text-[10px] font-extrabold uppercase tracking-tight">Profilo verificato</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center p-3.5 bg-soft-green/50 rounded-2xl border border-gray-50">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Budget</span>
                      <span className="text-xs font-bold text-brand-green">€ 1.000 / mese</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 bg-soft-green/50 rounded-2xl border border-gray-50">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Reddito</span>
                      <span className="text-xs font-bold text-brand-green">€ 2.500 / mese</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-brand-green text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-brand-green/10 active:scale-95 transition-transform mt-auto hover:bg-black"
                  >
                    Crea il tuo CV
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="text-left flex flex-col items-center lg:flex-1 w-full">
              <div className="flex items-center gap-3 mb-6 w-full lg:min-h-[80px]">
                <div className="w-12 h-12 bg-action-green text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-brand-green leading-tight">Sfoglia Tutti gli Annunci d'Italia</h3>
              </div>
              <p className="text-lg text-medium-gray mb-12 w-full lg:min-h-[56px]">Aggreghiamo TUTTI gli annunci del web in un unico posto.</p>
              <div className="w-full mx-auto bg-[#F4F7FF] rounded-[3rem] p-12 relative flex flex-col items-center justify-center overflow-hidden flex-1">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                <div className="relative z-10 w-full max-w-[280px] bg-white rounded-[2rem] shadow-2xl p-4 animate-float">
                  <div className="aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Casa"/>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-brand-green">Appartamento Milano</h4>
                    <div className="text-action-green font-bold text-sm">€ 1.200/mese</div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="text-left flex flex-col items-center lg:flex-1 w-full">
              <div className="flex items-center gap-3 mb-6 w-full lg:min-h-[80px]">
                <div className="w-12 h-12 bg-action-green text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-brand-green leading-tight">Candidati con Un Click</h3>
              </div>
              <p className="text-lg text-medium-gray mb-12 w-full lg:min-h-[56px]">Il proprietario riceve subito il tuo profilo d'eccellenza.</p>
              <div className="w-full mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-white flex-1 flex items-center justify-center">
                <img
                  src="https://image2url.com/r2/default/gifs/1769734403153-266d9d2d-1812-40a2-9c69-a4b54e0161f0.gif"
                  alt="Candidati ora GIF"
                  className="w-full h-full object-cover"
                />
              </div>
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
