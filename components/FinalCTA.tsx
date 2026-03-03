import React, { useState } from 'react';
import { Shield, CheckCircle, Zap } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', tipologia: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section className="py-16 px-4 bg-brand-green border-t-2 border-action-green/20">
      <div className="max-w-4xl mx-auto">
        {!isSubmitted ? (
          <>
            <div className="mb-10">
              <p className="text-xs font-bold text-action-green uppercase tracking-widest mb-3">INIZIA ORA</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                La tua prossima casa <br />
                <span className="text-action-green">ti sta cercando</span>
              </h2>
              <p className="text-white/70 text-lg max-w-2xl">
                Lascia i tuoi dati e ricevi proposte personalizzate direttamente nella tua email.
                Niente spam, solo annunci che fanno per te.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/10 rounded-xl p-6 md:p-8 border border-white/15">
              <div className="grid md:grid-cols-3 gap-4 mb-5">
                <div>
                  <label htmlFor="nome" className="block text-white/80 text-sm font-medium mb-1.5">Il tuo nome</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Mario"
                    className="w-full px-4 py-3 bg-white rounded-lg text-brand-green placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-action-green transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-1.5">La tua email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="mario@email.com"
                    className="w-full px-4 py-3 bg-white rounded-lg text-brand-green placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-action-green transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="tipologia" className="block text-white/80 text-sm font-medium mb-1.5">Cosa cerchi?</label>
                  <select
                    id="tipologia"
                    name="tipologia"
                    value={formData.tipologia}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white rounded-lg text-brand-green focus:outline-none focus:ring-2 focus:ring-action-green transition-all appearance-none cursor-pointer text-sm"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23004832'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                  >
                    <option value="" disabled>Seleziona...</option>
                    <option value="monolocale">Monolocale</option>
                    <option value="bilocale">Bilocale</option>
                    <option value="trilocale">Trilocale</option>
                    <option value="quadrilocale">Quadrilocale+</option>
                    <option value="stanza">Stanza singola</option>
                    <option value="condivisione">Stanza in condivisione</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-action-green text-white py-4 rounded-lg font-bold text-base hover:brightness-110 transition-all flex items-center justify-center gap-3"
              >
                Voglio ricevere proposte
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <p className="text-center text-white/50 text-xs mt-4">
                Unisciti a oltre <span className="text-action-green font-semibold">30.000 inquilini</span> che hanno già trovato casa
              </p>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60">
                <Shield className="w-4 h-4 text-action-green" />
                <span className="text-sm">Dati protetti</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <CheckCircle className="w-4 h-4 text-action-green" />
                <span className="text-sm">Zero spam</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Zap className="w-4 h-4 text-action-green" />
                <span className="text-sm">Risposte in 24h</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-action-green/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-action-green/30">
              <CheckCircle className="w-8 h-8 text-action-green" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Perfetto, {formData.nome}!
            </h3>
            <p className="text-white/70 text-lg max-w-md mx-auto mb-6">
              Inizierai a ricevere proposte personalizzate a <span className="text-action-green font-semibold">{formData.email}</span>
            </p>
            <p className="text-white/50 text-sm">Controlla la tua email per confermare</p>
          </div>
        )}
      </div>
    </section>
  );
};
