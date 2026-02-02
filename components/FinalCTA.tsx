import React, { useState } from 'react';

export const FinalCTA: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipologia: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  return (
    <section className="relative py-16 px-4 bg-brand-green overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-action-green/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-action-green animate-pulse" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                  Inizia Ora
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-poppins leading-tight">
                La tua prossima casa <br />
                <span className="text-action-green">ti sta cercando</span>
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Lascia i tuoi dati e ricevi proposte personalizzate direttamente nella tua email.
                Niente spam, solo annunci che fanno per te.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-white/80 text-sm font-medium mb-2">
                    Il tuo nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Mario"
                    className="w-full px-5 py-4 bg-white rounded-xl text-brand-green placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-action-green transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
                    La tua email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="mario@email.com"
                    className="w-full px-5 py-4 bg-white rounded-xl text-brand-green placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-action-green transition-all"
                  />
                </div>

                {/* Tipologia */}
                <div>
                  <label htmlFor="tipologia" className="block text-white/80 text-sm font-medium mb-2">
                    Cosa cerchi?
                  </label>
                  <select
                    id="tipologia"
                    name="tipologia"
                    value={formData.tipologia}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white rounded-xl text-brand-green focus:outline-none focus:ring-2 focus:ring-action-green transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23004832'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
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
                className="w-full bg-action-green text-white py-5 rounded-2xl font-bold text-lg hover:brightness-110 transition-all shadow-2xl shadow-action-green/30 flex items-center justify-center gap-3 group"
              >
                Voglio ricevere proposte
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <p className="text-center text-white/50 text-sm mt-6">
                Unisciti a oltre <span className="text-action-green font-semibold">30.000 inquilini</span> che hanno già trovato casa
              </p>
            </form>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              <div className="flex items-center gap-2 text-white/60">
                <svg className="w-5 h-5 text-action-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="text-sm">Dati protetti</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <svg className="w-5 h-5 text-action-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm">Zero spam</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <svg className="w-5 h-5 text-action-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span className="text-sm">Risposte in 24h</span>
              </div>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-action-green/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-action-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 font-poppins">
              Perfetto, {formData.nome}!
            </h3>
            <p className="text-white/70 text-lg max-w-md mx-auto mb-8">
              Inizierai a ricevere proposte personalizzate a <span className="text-action-green font-semibold">{formData.email}</span>
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full">
              <span className="w-2 h-2 rounded-full bg-action-green animate-pulse" />
              <span className="text-white/80 text-sm">Controlla la tua email per confermare</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
