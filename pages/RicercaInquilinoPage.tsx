import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Check,
    UserCheck,
    Briefcase,
    ThumbsUp,
    ShieldCheck,
    FileText,
    Umbrella,
    ChevronRight,
    Star,
    ArrowRight,
    MessageCircle,
    Play
} from 'lucide-react';

export const RicercaInquilinoPage: React.FC = () => {

    // Simple state for FAQ or interactive elements if needed
    const [faqOpen, setFaqOpen] = useState<number | null>(0);

    return (
        <div className="bg-white">

            {/* 1. HERO SECTION (Premium Style) */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-br from-primary-50 to-white"></div>

                {/* Decorative circles */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-200/20 to-teal-200/20 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-white border border-primary-100 rounded-full px-4 py-1 shadow-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Nuovo Standard 2025</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold font-serif leading-tight text-gray-900">
                            Affitta casa a persone <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Affidabili & Verificate</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                            Dimentica lo stress de "l'inquilino non paga". AffittoChiaro seleziona per te solo profili con referenze controllate e reddito dimostrabile.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/landing-inquilino" className="group btn bg-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary-600/20 hover:bg-primary-700 hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                                Pubblica Annuncio Gratis
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/come-funziona" className="btn bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                                <Play className="w-5 h-5 fill-current" /> Come Funziona
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-4 border-t border-gray-200/50">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden`}>
                                        <img src={`https://randomuser.me/api/portraits/thumb/men/${i + 20}.jpg`} alt="User" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-600">+5k</div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-500 text-sm">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-sm font-medium text-gray-500">da <span className="font-bold text-gray-900">10.000+ proprietari</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual - Floated Card */}
                    <div className="relative hidden lg:block perspective-1000">
                        <div className="relative z-20 bg-white rounded-[2.5rem] shadow-2xl p-6 border border-gray-100 transform rotate-y-12 rotate-3 hover:rotate-0 transition-all duration-700 ease-out">
                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Check className="w-6 h-6 stroke-[3px]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Stato Affitto</p>
                                    <p className="font-bold text-gray-900">Pagamento Ricevuto</p>
                                </div>
                            </div>

                            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                className="w-full h-80 object-cover rounded-2xl mb-6" alt="Happy Landlord" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold font-serif">Appartamento Centro Storico</h3>
                                    <span className="text-primary-600 font-black text-xl">€1.200<span className="text-sm text-gray-400">/mese</span></span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-xs font-bold">Verificato</span>
                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">Assicurato</span>
                                </div>
                            </div>
                        </div>
                        {/* Blob */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary-400/20 to-teal-400/20 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* 2. BENTO GRID BENEFITS */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold font-serif text-gray-900 mb-6">Tutto quello che serve per <br />un Affitto Sicuro</h2>
                        <p className="text-xl text-gray-500">Abbiamo digitalizzato e semplificato ogni passaggio, per darti il controllo totale senza la burocrazia.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Large Card */}
                        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldCheck className="w-32 h-32 text-primary-600" />
                            </div>
                            <div className="relative z-10 max-w-md">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold font-serif mb-4">Tenant Check Certificato</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Il nostro algoritmo analizza oltre 50 parametri: reddito, tipologia di contratto, storia creditizia e referenze precedenti. Ricevi solo candidature con <strong>Tenant Score</strong> superiore a 80/100.
                                </p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Analisi Busta Paga</li>
                                    <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Controllo Protesti</li>
                                    <li className="flex items-center gap-2 text-sm font-medium text-gray-700"><Check className="w-4 h-4 text-primary-500" /> Verifica Identità</li>
                                </ul>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="bg-primary-600 rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                            <div>
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white mb-6">
                                    <Umbrella className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold font-serif mb-4">Tutela Legale e Morosità</h3>
                                <p className="text-primary-100 text-sm leading-relaxed mb-4">
                                    Dormi sonni tranquilli con la nostra protezione proprietari. Copriamo fino a 12 mensilità in caso di morosità e offriamo assistenza legale gratuita.
                                </p>
                            </div>
                            <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors text-sm">Scopri Garanzie</button>
                        </div>

                        {/* Standard Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold font-serif mb-3">Contratti Digitali</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Genera e firma il contratto direttamente online con Firma Elettronica Avanzata (FEA). Registrazione all'Agenzia delle Entrate inclusa.
                            </p>
                        </div>

                        {/* Standard Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 md:col-span-2">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div>
                                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold font-serif mb-3">Gestione 100% Online</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
                                        Dal caricamento dell'annuncio alla riscossione dell'affitto. Tutto in un'unica dashboard intuitiva.
                                    </p>
                                </div>
                                <div className="flex-grow bg-gray-50 rounded-2xl p-4 w-full">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2"><span>STATO PAGAMENTI</span> <span>TUTTO REGOLARE</span></div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs font-bold text-gray-700">Gennaio</span>
                                            <span className="ml-auto text-xs font-bold text-green-600">Pagato</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs font-bold text-gray-700">Febbraio</span>
                                            <span className="ml-auto text-xs font-bold text-green-600">Pagato</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. SEO SECTION - FAQ & CONTENT */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-serif mb-4">Domande Frequenti dei Proprietari</h2>
                        <p className="text-gray-500">Tutto quello che devi sapere sulla gestione locazioni con AffittoChiaro.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Quanto costa pubblicare un annuncio?", a: "La pubblicazione è 100% gratuita. Non applichiamo costi di inserimento né commissioni sul canone mensile per il servizio base." },
                            { q: "Come verificate l'affidabilità dell'inquilino?", a: "Utilizziamo un sistema integrato che incrocia dati da banche dati pubbliche (Crif, Protesti) e verifica la documentazione reddituale caricata, grazie alla partnership con istituti di credito." },
                            { q: "La firma digitale ha valore legale?", a: "Assolutamente sì. Utilizziamo la Firma Elettronica Avanzata (FEA) conforme al regolamento eIDAS europeo, legalmente vincolante e perfetta per la registrazione telematica." },
                            { q: "Offrite supporto per la registrazione del contratto?", a: "Sì, il nostro sistema si interfaccia direttamente con i servizi dell'Agenzia delle Entrate per la registrazione telematica in regime ordinario o cedolare secca." }
                        ].map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-200 transition-colors">
                                <button
                                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                    className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 font-bold text-gray-800"
                                >
                                    {item.q}
                                    <ChevronRight className={`w-5 h-5 transition-transform text-gray-400 ${faqOpen === idx ? 'rotate-90 text-primary-600' : ''}`} />
                                </button>
                                <div className={`px-6 pb-6 text-gray-600 leading-relaxed ${faqOpen === idx ? 'block' : 'hidden'}`}>
                                    {item.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. FINAL CTA */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-8">Inizia a guadagnare dal tuo immobile oggi stesso</h2>
                        <p className="text-xl text-gray-400 mb-12">Nessuna carta di credito richiesta. Pubblica in 3 minuti.</p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link to="/landing-inquilino" className="btn bg-primary-600 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-lg shadow-primary-600/30 hover:bg-white hover:text-gray-900 transition-all">
                                Pubblica Gratis
                            </Link>
                            <Link to="/contact" className="btn bg-transparent border border-gray-700 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all">
                                Parla con un Esperto
                            </Link>
                        </div>
                        <p className="mt-8 text-sm text-gray-600">Leggi i nostri <a href="#" className="underline hover:text-white">Termini e Condizioni</a> per i proprietari.</p>
                    </div>
                </div>
            </section>

        </div>
    );
};
