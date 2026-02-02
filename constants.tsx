
import React from 'react';
import { Testimonial, FAQItem, Step } from './types';

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Luigi',
    location: 'Reggio Emilia',
    quote: 'Grazie ad Affittochiaro ho trovato casa in 2 settimane. Semplice: ho inserito i miei dati e sono stato contattato direttamente dal proprietario. Lo consiglio!',
    stars: 5,
    image: 'https://picsum.photos/seed/luigi/200/200'
  },
  {
    name: 'Massimo',
    location: 'Milano',
    quote: 'Ottima opportunità! Ho trovato l’inquilino ideale con facilità e autonomia, senza perdere tempo.',
    stars: 5,
    image: 'https://picsum.photos/seed/massimo/200/200'
  },
  {
    name: 'Sara',
    location: 'Bologna',
    quote: 'Cercavo casa da mesi su Facebook. Con Affittochiaro è cambiato tutto: profilo completo, video, e in pochi giorni avevo 3 proprietari interessati!',
    stars: 5,
    image: 'https://picsum.photos/seed/sara/200/200'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'È davvero gratis?',
    answer: 'Sì, la registrazione e la creazione del profilo sono completamente gratuite. Puoi candidarti a tutti gli appartamenti che vuoi senza costi.'
  },
  {
    question: 'Come vengono verificati i miei dati?',
    answer: 'Utilizziamo un sistema di verifica sicuro conforme GDPR. I tuoi documenti vengono controllati e certificati, dando ai proprietari la certezza della tua identità.'
  },
  {
    question: 'Devo per forza fare il video?',
    answer: 'Il video non è obbligatorio, ma fortemente consigliato. I profili con video ricevono il 78% in più di risposte dai proprietari.'
  },
  {
    question: 'Quanti annunci posso vedere?',
    answer: 'Tutti! Aggreghiamo oltre 15.000 annunci da tutta Italia, aggiornati ogni 30 minuti. Nessun limite.'
  },
  {
    question: 'In quanto tempo trovo casa?',
    answer: 'La media dei nostri utenti è di 2 settimane. Dipende dalla città e dalle tue esigenze, ma grazie al profilo completo i tempi si riducono drasticamente.'
  }
];

export const STEPS: Step[] = [
  {
    number: 1,
    title: 'Crea il Tuo Curriculum da Inquilino',
    description: 'Registrati gratuitamente, compila il tuo profilo completo, carica documenti e una video presentazione di 60 secondi.',
    image: 'https://picsum.photos/seed/step1/800/600'
  },
  {
    number: 2,
    title: 'Sfoglia Tutti gli Annunci d’Italia',
    description: 'Aggreghiamo tutti gli annunci del web in un unico posto. Filtra per città, prezzo e tipologia per trovare quello perfetto.',
    image: 'https://picsum.photos/seed/step2/800/600'
  },
  {
    number: 3,
    title: 'Candidati con Un Click',
    description: 'I proprietari vedono il tuo profilo completo e verificato. Ti contattano direttamente se sei il candidato ideale.',
    image: 'https://picsum.photos/seed/step3/800/600'
  }
];
