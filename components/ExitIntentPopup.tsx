import React, { useState, useEffect, useCallback } from 'react';

export const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [hasShown, setHasShown] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Rileva se il mouse sta andando verso l'alto (uscita)
    if (e.clientY <= 5 && !hasShown) {
      setIsVisible(true);
      setHasShown(true);
    }
  }, [hasShown]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (!hasShown) {
      setIsVisible(true);
      setHasShown(true);
      e.preventDefault();
      e.returnValue = '';
    }
  }, [hasShown]);

  useEffect(() => {
    // Controlla se il popup è già stato mostrato in questa sessione
    const alreadyShown = sessionStorage.getItem('exitPopupShown');
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Aggiungi listener per exit intent (mouse verso l'alto)
    document.addEventListener('mouseout', handleExitIntent);

    // Aggiungi listener per chiusura tab/finestra
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mouseout', handleExitIntent);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleExitIntent, handleBeforeUnload]);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('exitPopupShown', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Qui puoi aggiungere la logica per salvare l'email
      console.log('Email submitted:', email);
      setIsSubmitted(true);
      setTimeout(() => {
        closePopup();
      }, 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay scuro */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closePopup}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up">
        {/* Header decorativo */}
        <div className="bg-gradient-to-r from-brand-green to-action-green p-6 text-white text-center">
          <span className="text-5xl mb-2 block">🎁</span>
          <h2 className="text-2xl md:text-3xl font-bold font-poppins">
            Aspetta!
          </h2>
        </div>

        {/* Contenuto */}
        <div className="p-8">
          {!isSubmitted ? (
            <>
              <h3 className="text-xl md:text-2xl font-bold text-brand-green text-center mb-4">
                Ricevi la checklist gratuita
              </h3>
              <p className="text-center text-medium-gray mb-2">
                <span className="font-semibold text-brand-green">"Come valutare un annuncio in 60 secondi"</span>
              </p>
              <p className="text-center text-sm text-medium-gray mb-6">
                Evita truffe e annunci falsi con la nostra guida esclusiva. Gratis, direttamente nella tua email.
              </p>

              {/* FOMO Elements */}
              <div className="bg-soft-green/50 rounded-2xl p-4 mb-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <p className="text-sm text-brand-green font-medium">
                    <span className="font-bold">15 proprietari attivi</span> questa settimana a Reggio Emilia
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <p className="text-sm text-brand-green font-medium">
                    Ultimi 3 profili creati hanno ricevuto proposte in <span className="font-bold">&lt;48h</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="La tua email migliore..."
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-action-green focus:outline-none transition-colors text-brand-green"
                  />
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <button
                  type="submit"
                  className="w-full bg-action-green text-white py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-action-green/30 flex items-center justify-center gap-2"
                >
                  Inviami la guida
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>

              <button
                onClick={closePopup}
                className="w-full mt-4 py-3 text-medium-gray hover:text-brand-green transition-colors font-medium"
              >
                Non ora, grazie
              </button>

              <p className="text-xs text-center text-gray-400 mt-6">
                Zero spam. Cancellati quando vuoi.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">✅</span>
              <h3 className="text-2xl font-bold text-brand-green mb-2">Perfetto!</h3>
              <p className="text-medium-gray">
                Controlla la tua email per ricevere la guida.
              </p>
            </div>
          )}
        </div>

        {/* Pulsante chiusura */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
