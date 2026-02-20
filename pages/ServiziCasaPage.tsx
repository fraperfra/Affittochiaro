import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    MapPin
} from 'lucide-react';
import { CityMap } from '../components';

export const ServiziCasaPage: React.FC = () => {
    const navigate = useNavigate();

    // Handler for map selection to navigate to listings
    const handleCityChange = (city: string) => {
        navigate(`/annunci?city=${encodeURIComponent(city)}`);
    };

    return (
        <div className="bg-white">

            {/* 1. HERO SECTION (Premium Style) */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-gray-900 text-white rounded-b-[3rem] shadow-2xl mx-4 mt-4">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] h-full w-full"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary-600/30 to-purple-600/30 rounded-full blur-[120px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1 mb-8 shadow-lg">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Concierge Digitale</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight">
                        La tua casa, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-300">Senza Pensieri.</span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Dai traslochi alle utenze, dalle pulizie alle assicurazioni.
                        Gestiamo noi tutta la burocrazia per lasciarti solo il piacere di abitare.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="btn bg-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary-600/30 hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-2">
                            Attiva un Servizio
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. SERVICES GRID (Premium Cards) */}
            <section className="py-24 -mt-12 relative z-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Service Card 1: Contracts */}
                        <div className="card bg-white p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <FileSignature className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif mb-2 text-gray-900">Gestione Contratti</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">Registrazione telematica, rinnovi e risoluzioni. Dimentica le file all'Agenzia delle Entrate.</p>
                            <ul className="space-y-2 mb-8">
                                <li className="flex items-center gap-2 text-sm font-bold text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Registrazione Online</li>
                                <li className="flex items-center gap-2 text-sm font-bold text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Cedolare Secca</li>
                            </ul>
                            <Link to="/servizi/contratti" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                Scopri di più <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {/* Service Card 2: Utilities */}
                        <div className="card bg-white p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif mb-2 text-gray-900">Voltura Luce & Gas</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">Cambio intestatario o attivazione in 5 minuti. Confrontiamo per te le migliori tariffe.</p>
                            <ul className="space-y-2 mb-8">
                                <li className="flex items-center gap-2 text-sm font-bold text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Attivazione Rapida</li>
                                <li className="flex items-center gap-2 text-sm font-bold text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Zero Burocrazia</li>
                            </ul>
                            <Link to="/servizi/utenze" className="inline-flex items-center font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                                Scopri di più <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {/* Service Card 3: Moving */}
                        <div className="card bg-white p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif mb-2 text-gray-900">Traslochi Facili</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">Preventivi immediati dalle migliori ditte della tua zona. Servizio "chiavi in mano" assicurato.</p>
                            <ul className="space-y-2 mb-8">
                                <li className="flex items-center gap-2 text-sm font-bold text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Imballaggio Incluso</li>
                                <li className="flex items-center gap-2 text-sm font-bold text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Assicurazione All-Risk</li>
                            </ul>
                            <Link to="/servizi/traslochi" className="inline-flex items-center font-bold text-purple-600 hover:text-purple-700 transition-colors">
                                Scopri di più <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {/* Service Card 4: Cleaning */}
                        <div className="card bg-white p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif mb-2 text-gray-900">Pulizie Professionali</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">Pulizie di fine locazione per restituire l'immobile perfetto o igienizzazione profonda pre-ingresso.</p>
                            <Link to="/servizi/pulizie" className="inline-flex items-center font-bold text-teal-600 hover:text-teal-700 transition-colors">
                                Scopri di più <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {/* Service Card 5: Insurance */}
                        <div className="card bg-white p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif mb-2 text-gray-900">Assicurazioni Casa</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">Polizze RC Inquilino, protezione affitto e tutela legale. La sicurezza prima di tutto.</p>
                            <Link to="/servizi/assicurazioni" className="inline-flex items-center font-bold text-red-600 hover:text-red-700 transition-colors">
                                Scopri di più <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        {/* Service Card 6: APE */}
                        <div className="card bg-white p-8 rounded-[2rem] shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                <Award className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif mb-2 text-gray-900">Certificazione APE</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">Richiedi l'Attestato di Prestazione Energetica online. Obbligatorio per vendere o affittare.</p>
                            <Link to="/servizi/ape" className="inline-flex items-center font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                Scopri di più <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. INTERACTIVE MAP SECTION */}
            <section className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="text-center mb-12">
                    <span className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-2 block">Dove Siamo</span>
                    <h2 className="text-4xl font-bold font-serif text-gray-900">
                        Case con Servizi Inclusi <br /> in tutta Italia
                    </h2>
                </div>
                {/* Embedded CityMap Component */}
                <div className="max-w-7xl mx-auto px-4">
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 bg-white">
                        <CityMap activeCityName="Milano" onCityChange={handleCityChange} />
                    </div>
                </div>
            </section>

            {/* 4. SEO CONTENT & VALUE PROPOSITION */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 prose prose-lg prose-headings:font-serif prose-headings:font-bold prose-a:text-primary-600">
                    <article className="text-center mb-16">
                        <h2 className="text-3xl mb-6">Perché affidarsi al Concierge di AffittoChiaro?</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Traslocare e cambiare casa è una delle esperienze più stressanti della vita. Tra <strong>volture utenze</strong>, pulizie, ricerca di scatoloni e burocrazia contrattuale, il tempo non basta mai.
                            AffittoChiaro nasce per risolvere esattamente questo problema. Non siamo solo un portale di annunci, ma un partner completo per la tua vita abitativa.
                        </p>
                    </article>

                    <div className="grid md:grid-cols-2 gap-12 not-prose">
                        <div>
                            <h3 className="text-xl font-bold font-serif mb-3">Risparmio di Tempo</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Invece di contattare 10 fornitori diversi, hai un unico interlocutore. Gestiamo noi il coordinamento di tutte le attività.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold font-serif mb-3">Qualità Certificata</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Selezioniamo solo i migliori partner per traslochi, pulizie e assicurazioni. Ogni fornitore è verificato e recensito.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold font-serif mb-3">Assistenza Dedicata</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Un team di esperti è sempre a tua disposizione via chat o telefono per risolvere qualsiasi imprevisto.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold font-serif mb-3">Prezzi Convenzionati</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Grazie ai nostri volumi, accediamo a listini riservati per luce, gas e assicurazioni che giriamo direttamente a te.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FINAL CTA CTA */}
            <section className="py-20 bg-primary-900 text-white rounded-t-[3rem] mt-12 mx-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px]"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
                    <h2 className="text-4xl font-bold font-serif mb-6">Hai bisogno di aiuto ora?</h2>
                    <p className="text-xl text-primary-200 mb-8">
                        Il nostro team di supporto è disponibile 7 giorni su 7 per guidarti nella scelta dei servizi più adatti alle tue esigenze.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="btn bg-white text-primary-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-xl">
                            <Phone className="w-5 h-5" /> Chiamaci 800.123.456
                        </button>
                        <Link to="/contact" className="btn bg-transparent border border-gray-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                            Scrivici un messaggio
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};
