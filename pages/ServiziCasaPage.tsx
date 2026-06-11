import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Phone,
} from 'lucide-react';

const SERVICES = [
    {
        image: 'https://placehold.co/600x400/F4F9F6/004832?text=Gestione+Contratti',
        title: 'Gestione Contratti',
        description: 'Registrazione telematica, rinnovi e risoluzioni. Dimentica le file all\'Agenzia delle Entrate.',
        link: '/servizi/contratti',
    },
    {
        image: 'https://placehold.co/600x400/F4F9F6/004832?text=Voltura+Luce+%26+Gas',
        title: 'Voltura Luce & Gas',
        description: 'Cambio intestatario o attivazione in 5 minuti. Confrontiamo per te le migliori tariffe.',
        link: '/servizi/utenze',
    },
    {
        image: 'https://placehold.co/600x400/F4F9F6/004832?text=Traslochi',
        title: 'Traslochi Facili',
        description: 'Preventivi immediati dalle migliori ditte della tua zona. Servizio chiavi in mano assicurato.',
        link: '/servizi/traslochi',
    },
    {
        image: 'https://placehold.co/600x400/F4F9F6/004832?text=Pulizie',
        title: 'Pulizie Professionali',
        description: 'Pulizie di fine locazione per restituire l\'immobile perfetto o igienizzazione profonda pre-ingresso.',
        link: '/servizi/pulizie',
    },
    {
        image: 'https://placehold.co/600x400/F4F9F6/004832?text=Assicurazioni',
        title: 'Assicurazioni Casa',
        description: 'Polizze RC Inquilino, protezione affitto e tutela legale. La sicurezza prima di tutto.',
        link: '/servizi/assicurazioni',
    },
    {
        image: 'https://placehold.co/600x400/F4F9F6/004832?text=Certificazione+APE',
        title: 'Certificazione APE',
        description: 'Richiedi l\'Attestato di Prestazione Energetica online. Obbligatorio per vendere o affittare.',
        link: '/servizi/ape',
    },
];

const WHY = [
    { title: 'Risparmio di Tempo', text: 'Invece di contattare 10 fornitori diversi, hai un unico interlocutore. Gestiamo noi il coordinamento di tutte le attività.' },
    { title: 'Qualità Certificata', text: 'Selezioniamo solo i migliori partner per traslochi, pulizie e assicurazioni. Ogni fornitore è verificato e recensito.' },
    { title: 'Assistenza Dedicata', text: 'Un team di esperti è sempre a tua disposizione via chat o telefono per risolvere qualsiasi imprevisto.' },
    { title: 'Prezzi Convenzionati', text: 'Grazie ai nostri volumi, accediamo a listini riservati per luce, gas e assicurazioni che giriamo direttamente a te.' },
];

export const ServiziCasaPage: React.FC = () => {
    return (
        <div>

            {/* Hero */}
            <section className="py-16 bg-white px-4 border-b border-gray-100">
                <div className="max-w-full lg:px-20 mx-auto">
                    <h1 className="mt-4 text-3xl md:text-5xl font-bold text-brand-green leading-[1.1]">
                        La tua casa, senza pensieri.
                    </h1>
                    <p className="mt-4 text-sm md:text-base text-medium-gray leading-[1.5] w-full lg:-mr-20">
                        Affittochiaro non è solo una piattaforma che permette l'incontro tra proprietari e inquilini, ma anche un fornitore di servizi esclusivi per la casa e per l'affitto. Scopri subito tutti i nostri servizi in collaborazione con partner rinomati e affidabili:
                    </p>
                </div>
            </section>

            {/* Services grid */}
            <section className="py-16 bg-gray-50 px-4 border-b border-gray-100">
                <div className="max-w-full lg:px-20 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SERVICES.map((s, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors flex flex-col">
                                <img
                                    src={s.image}
                                    alt={s.title}
                                    className="w-full h-44 object-cover bg-gray-100"
                                />
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-base font-bold text-brand-green mb-2">{s.title}</h3>
                                    <p className="text-medium-gray text-sm leading-[1.6] mb-4 flex-1">{s.description}</p>
                                    <Link to={s.link} className="inline-flex items-center gap-1 text-sm font-bold text-brand-green hover:text-action-green transition-colors">
                                        Scopri il servizio <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perché sceglierci */}
            <section className="py-16 bg-white px-4 border-b border-gray-100">
                <div className="max-w-full lg:px-20 mx-auto">
                    <h2 className="text-[24px] font-bold text-brand-green mb-4 leading-[1.2]">
                        Perché affidarsi al Concierge di Affittochiaro?
                    </h2>
                    <p className="text-lg text-medium-gray mb-10 leading-[1.5]">
                        Non siamo solo un portale di annunci, ma un partner completo per la tua vita abitativa.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {WHY.map((w, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-base font-bold text-brand-green mb-2">{w.title}</h3>
                                <p className="text-medium-gray text-sm leading-[1.6]">{w.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA finale */}
            <section className="py-16 bg-gray-50 px-4">
                <div className="max-w-full lg:px-20 mx-auto">
                    <h2 className="text-[24px] font-bold text-brand-green mb-3 leading-[1.2]">
                        Hai bisogno di aiuto ora?
                    </h2>
                    <p className="text-lg text-medium-gray mb-8 leading-[1.5]">
                        Il nostro team è disponibile 7 giorni su 7 per guidarti nella scelta dei servizi più adatti.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="tel:800123456"
                            className="inline-flex items-center justify-center gap-2 bg-brand-green text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all"
                        >
                            <Phone size={16} />
                            Chiamaci 800.123.456
                        </a>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-2 border border-brand-green/30 text-brand-green px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white transition-all"
                        >
                            Scrivici un messaggio
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};
