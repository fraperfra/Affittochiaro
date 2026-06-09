import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Come funziona AffittoChiaro?",
    answer: "Crei un profilo inquilino verificato con documenti, referenze e una video presentazione. Quando ti candidi per un annuncio, il proprietario riceve il tuo profilo completo e può risponderti in meno di 24 ore: senza attese infinite."
  },
  {
    question: "Quanto costa creare un profilo?",
    answer: "Creare il profilo è completamente gratuito. Puoi aggiungere documenti, caricare la video presentazione e candidarti a tutti gli annunci che vuoi senza alcun costo. Sono disponibili piani premium per chi vuole maggiore visibilità."
  },
  {
    question: "Come viene verificato il mio profilo?",
    answer: "Verifichiamo identità, reddito e referenze dai precedenti proprietari. Un profilo verificato aumenta le possibilità di essere contattato del 300% rispetto a un profilo incompleto."
  },
  {
    question: "Quanto tempo ci vuole per trovare casa?",
    answer: "In media meno di 2 settimane. Grazie al profilo completo e verificato, i proprietari rispondono più velocemente. Il 78% degli utenti riceve almeno una risposta entro 48 ore dalla candidatura."
  },
  {
    question: "Cos'è la video presentazione?",
    answer: "Un breve video di 30-60 secondi in cui ti presenti direttamente al proprietario. È il modo più efficace per distinguerti: i profili con video ricevono il 78% in più di risposte rispetto a quelli senza."
  },
  {
    question: "I miei dati sono al sicuro?",
    answer: "Sì. Utilizziamo crittografia di livello bancario e le informazioni sensibili vengono condivise solo con i proprietari degli annunci a cui ti candidi, sempre dopo il tuo consenso esplicito."
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 px-4 bg-gray-50 border-b border-gray-100">
      <div className="max-w-full lg:px-20 mx-auto">

        <div className="mb-10 text-left lg:text-center">
          <h2 className="text-[24px] font-bold text-brand-green mb-4 leading-[1.2]">
            Hai qualche dubbio?
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-brand-green pr-4">{faq.question}</span>
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-action-green text-white rotate-180' : 'bg-gray-100 text-brand-green'}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <p className="px-6 pb-5 text-base text-medium-gray leading-[1.6]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
