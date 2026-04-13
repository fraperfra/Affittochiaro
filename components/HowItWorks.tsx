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
        <p className="font-bold">Profilo creato con successo!</p>
        <p className="text-sm">Benvenuto {data.firstName}!</p>
      </div>,
      { duration: 4000 }
    );
    setIsModalOpen(false);
    setTimeout(() => { navigate('/tenant'); }, 500);
  };

  return (
    <>
      <section id="come-funziona" className="py-16 bg-gray-50 px-4 border-b border-gray-100">
        <div className="max-w-full lg:px-20 mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3 border-l-2 border-action-green pl-3">PROCESSO SEMPLIFICATO</p>
            <h2 className="text-2xl md:text-[28px] xl:text-[32px] font-bold text-brand-green mb-4 leading-[1.2]">Candidati in 3 Semplici Passaggi</h2>
            <p className="text-lg md:text-xl text-medium-gray max-w-[65ch] leading-[1.5]">Dalla registrazione alla tua nuova casa, senza intoppi e con la massima professionalità.</p>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-y-0 space-y-16 lg:gap-12 gap-8 lg:items-stretch">

            {/* STEP 1 */}
            <div className="text-left flex flex-col items-center lg:flex-1 w-full">
              <div className="flex items-center gap-3 mb-5 w-full lg:min-h-[80px]">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-base shrink-0">1</div>
                <h3 className="text-xl md:text-[22px] xl:text-2xl font-bold text-brand-green leading-[1.3]">Crea il Tuo Profilo da Inquilino</h3>
              </div>
              <p className="text-base text-medium-gray mb-8 w-full lg:min-h-[56px] leading-[1.6]">Registrati gratuitamente e compila il tuo <span className="font-bold text-brand-green">profilo completo</span>.</p>
              <div className="w-full relative mx-auto flex-1 flex flex-col">
                <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white text-[10px] font-bold">A</div>
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Affittochiaro</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-action-green/10 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-action-green"></span>
                      <span className="text-[8px] font-bold text-action-green uppercase tracking-widest">In Corso</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-brand-green font-bold text-xl shrink-0">LM</div>
                    <div>
                      <h4 className="text-base font-bold text-brand-green">Luca Martini</h4>
                      <div className="flex items-center gap-1 text-action-green mt-0.5">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-tight">Profilo verificato</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Budget</span>
                      <span className="text-xs font-bold text-brand-green">€ 1.000 / mese</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Reddito</span>
                      <span className="text-xs font-bold text-brand-green">€ 2.500 / mese</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3.5 bg-brand-green text-white rounded-xl font-bold uppercase tracking-widest text-[10px] mt-auto hover:bg-black transition-colors"
                  >
                    Crea il tuo Profilo
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="text-left flex flex-col items-center lg:flex-1 w-full">
              <div className="flex items-center gap-3 mb-5 w-full lg:min-h-[80px]">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-base shrink-0">2</div>
                <h3 className="text-xl md:text-[22px] xl:text-2xl font-bold text-brand-green leading-[1.3]">Sfoglia Tutti gli Annunci d'Italia</h3>
              </div>
              <p className="text-base text-medium-gray mb-8 w-full lg:min-h-[56px] leading-[1.6]">Aggreghiamo TUTTI gli annunci del web in un unico posto.</p>
              <div className="w-full mx-auto bg-gray-50 rounded-xl p-10 border border-gray-200 relative flex flex-col items-center justify-center flex-1">
                <div className="w-full max-w-[280px] bg-white rounded-xl shadow-card p-4 border border-gray-100">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Casa" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-brand-green text-sm">Appartamento Milano</h4>
                    <div className="text-action-green font-bold text-xs mt-0.5">€ 1.200/mese</div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="text-left flex flex-col items-center lg:flex-1 w-full">
              <div className="flex items-center gap-3 mb-5 w-full lg:min-h-[80px]">
                <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-base shrink-0">3</div>
                <h3 className="text-xl md:text-[22px] xl:text-2xl font-bold text-brand-green leading-[1.3]">Candidati con Un Click</h3>
              </div>
              <p className="text-base text-medium-gray mb-8 w-full lg:min-h-[56px] leading-[1.6]">Il proprietario riceve subito il tuo profilo d'eccellenza.</p>
              <div className="w-full mx-auto rounded-xl overflow-hidden border border-gray-200 bg-white flex-1 flex items-center justify-center">
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

      <TenantRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleRegistrationComplete}
      />
    </>
  );
};
