import React, { useState } from 'react';
import { FAQS } from '../constants';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-action-green/10 text-action-green px-5 py-2 rounded-full font-bold text-[10px] mb-6 uppercase tracking-[0.2em]">
            DOMANDE FREQUENTI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4 font-poppins">
            Hai delle domande?
          </h1>
          <p className="text-lg text-medium-gray">
            Trova le risposte alle domande più comuni
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="text-lg font-bold text-brand-green">
                  {faq.question}
                </span>
                <span
                  className={`w-8 h-8 rounded-full bg-soft-green flex items-center justify-center shrink-0 transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6">
                  <p className="text-medium-gray leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-soft-green/50 rounded-3xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-brand-green mb-4">
            Non hai trovato la risposta?
          </h3>
          <p className="text-medium-gray mb-6">
            Contattaci e ti risponderemo il prima possibile
          </p>
          <button className="bg-brand-green text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
            Contattaci
          </button>
        </div>
      </div>
    </div>
  );
};
