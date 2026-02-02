import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Come funziona Affittochiaro?",
    answer: "Affittochiaro ti permette di creare un profilo inquilino verificato con tutte le informazioni che i proprietari cercano: documenti, referenze, video presentazione e storico affitti. Quando ti candidi per un annuncio, il proprietario riceve il tuo profilo completo e può risponderti in meno di 24 ore."
  },
  {
    question: "Quanto costa creare un profilo?",
    answer: "Creare il tuo profilo inquilino è completamente gratuito. Puoi aggiungere tutte le informazioni, caricare documenti e candidarti agli annunci senza alcun costo. Offriamo anche piani premium per chi vuole maggiore visibilità e funzionalità avanzate."
  },
  {
    question: "Come viene verificato il mio profilo?",
    answer: "Verifichiamo la tua identità tramite documento, il tuo reddito attraverso documentazione ufficiale (busta paga, CUD, dichiarazione dei redditi) e le referenze dai precedenti proprietari. Un profilo verificato aumenta le tue possibilità di essere contattato del 300%."
  },
  {
    question: "Posso candidarmi a più annunci contemporaneamente?",
    answer: "Certamente! Con Affittochiaro puoi candidarti a tutti gli annunci che desideri. Il tuo profilo viene inviato automaticamente ai proprietari, risparmiandoti ore di email e telefonate."
  },
  {
    question: "Quanto tempo ci vuole per trovare casa?",
    answer: "In media, i nostri utenti trovano casa in meno di 2 settimane. Grazie al profilo verificato e completo, i proprietari rispondono più velocemente e con maggiore fiducia. Il 78% degli utenti riceve almeno una risposta entro 48 ore."
  },
  {
    question: "Cos'è la video presentazione?",
    answer: "La video presentazione è un breve video (30-60 secondi) in cui ti presenti ai proprietari. È un modo efficace per distinguerti dagli altri candidati e mostrare la tua affidabilità. I profili con video ricevono il 40% di risposte in più."
  },
  {
    question: "I miei dati sono al sicuro?",
    answer: "Assolutamente sì. Utilizziamo crittografia di livello bancario per proteggere tutti i tuoi dati. Le informazioni sensibili vengono condivise solo con i proprietari degli annunci a cui ti candidi e solo dopo il tuo consenso esplicito."
  },
  {
    question: "Posso usare Affittochiaro in tutta Italia?",
    answer: "Sì! Affittochiaro è attivo in tutte le principali città italiane: Milano, Roma, Torino, Bologna, Firenze, Napoli e molte altre. La nostra community cresce ogni giorno con nuovi annunci e inquilini verificati."
  },
  {
    question: "Come posso contattare l'assistenza?",
    answer: "Il nostro team di supporto è disponibile 7 giorni su 7. Puoi contattarci tramite la chat in basso a destra, via email a supporto@affittochiaro.it o chiamando il numero verde. Rispondiamo sempre entro 2 ore lavorative."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-soft-green/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-action-green/10 text-action-green text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Domande Frequenti
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">
            Hai qualche dubbio?
          </h2>
          <p className="text-medium-gray text-lg max-w-2xl mx-auto">
            Trova le risposte alle domande più comuni sul nostro servizio
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-brand-green pr-4">{faq.question}</span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-action-green text-white rotate-180' : 'bg-gray-100 text-brand-green'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <p className="px-6 pb-5 text-medium-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-medium-gray mb-4">Non hai trovato la risposta che cercavi?</p>
          <button className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg">
            Contattaci
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
