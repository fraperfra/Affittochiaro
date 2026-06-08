import React from 'react';
import { Link } from 'react-router-dom';
import {
    FileSignature,
    Shield,
    Truck,
    Sparkles,
    Zap,
    Award,
    ArrowRight,
    CheckCircle2,
    Phone,
} from 'lucide-react';

const SERVICES = [
    {
        icon: FileSignature,
        title: 'Gestione Contratti',
        description: 'Registrazione telematica, rinnovi e risoluzioni. Dimentica le file all\'Agenzia delle Entrate.',
        bullets: ['Registrazione Online', 'Cedolare Secca'],
        link: '/servizi/contratti',
    },
    {
        icon: Zap,
        title: 'Voltura Luce & Gas',
        description: 'Cambio intestatario o attivazione in 5 minuti. Confrontiamo per te le migliori tariffe.',
        bullets: ['Attivazione Rapida', 'Zero Burocrazia'],
        link: '/servizi/utenze',
    },
    {
        icon: Truck,
        title: 'Traslochi Facili',
        description: 'Preventivi immediati dalle migliori ditte della tua zona. Servizio chiavi in mano assicurato.',
        bullets: ['Imballaggio Incluso', 'Assicurazione All-Risk'],
        link: '/servizi/traslochi',
    },
    {
        icon: Sparkles,
        title: 'Pulizie Professionali',
        description: 'Pulizie di fine locazione per restituire l\'immobile perfetto o igienizzazione profonda pre-ingresso.',
        bullets: ['Fine Locazione', 'Pre-ingresso'],
        link: '/servizi/pulizie',
    },
    {
        icon: Shield,
        title: 'Assicurazioni Casa',
        description: 'Polizze RC Inquilino, protezione affitto e tutela legale. La sicurezza prima di tutto.',
        bullets: ['RC Inquilino', 'Tutela Legale'],
        link: '/servizi/assicurazioni',
    },
    {
        icon: Award,
        title: 'Certificazione APE',
        description: 'Richiedi l\'Attestato di Prestazione Energetica online. Obbligatorio per vendere o affittare.',
        bullets: ['Richiesta Online', 'Consegna Rapida'],
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
                    <h1 className="mt-4 text-[24px] font-bold text-brand-green leading-[1.2]">
                        La tua casa, senza pensieri.
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-medium-gray leading-[1.5] max-w-2xl">
                        Affittochiaro non è solo una piattaforma che permette l'incontro tra proprietari e inquilini, ma anche un fornitore di servizi esclusivi per la casa e per l'affitto. Che tu abbia bisogno di supporto per le utenze domestiche, per la gestione burocratica della locazione o per proteggere la tua rendita mensile, Affittochiaro è il partner ideale per soddisfare ogni tua necessità! Scopri subito tutti i nostri servizi in collaborazione con partner rinomati e affidabili:
                    </p>
                </div>
            </section>

            {/* Services grid */}
            <section className="py-16 bg-gray-50 px-4 border-b border-gray-100">
                <div className="max-w-full lg:px-20 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SERVICES.map((s, idx) => {
                            const Icon = s.icon;
                            return (
                                <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors flex flex-col">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mb-4">
                                        <Icon size={20} className="text-brand-green" />
                                    </div>
                                    <h3 className="text-base font-bold text-brand-green mb-2">{s.title}</h3>
                                    <p className="text-medium-gray text-sm leading-[1.6] mb-4 flex-1">{s.description}</p>
                                    <ul className="space-y-1.5 mb-5">
                                        {s.bullets.map((b, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                                <CheckCircle2 size={14} className="text-action-green shrink-0" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to={s.link} className="inline-flex items-center gap-1 text-sm font-bold text-brand-green hover:text-action-green transition-colors">
                                        Scopri il servizio <ArrowRight size={14} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Perché sceglierci */}
            <section className="py-16 bg-white px-4 border-b border-gray-100">
                <div className="max-w-full lg:px-20 mx-auto">
                    <h2 className="text-[24px] font-bold text-brand-green mb-4 leading-[1.2]">
                        Perché affidarsi al Concierge di AffittoChiaro?
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
