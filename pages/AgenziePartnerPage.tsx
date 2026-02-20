import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    Building2,
    Users,
    TrendingUp,
    ShieldCheck,
    BarChart3,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    X,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    UserX,
    Briefcase
} from 'lucide-react';
import { CityMap } from '../components';

export const AgenziePartnerPage: React.FC = () => {
    const navigate = useNavigate();
    const [faqOpen, setFaqOpen] = useState<number | null>(0);

    // Handler for map selection to navigate to listings
    const handleCityChange = (city: string) => {
        navigate(`/annunci?city=${encodeURIComponent(city)}`);
    };

    return (
        <div className="bg-white">

            {/* 1. HERO SECTION (High Impact B2B) */}
            <section className="bg-gray-900 text-white pt-32 pb-24 rounded-b-[3rem] shadow-2xl mx-4 mt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/40 rounded-full blur-[120px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-primary-900/50 backdrop-blur-md border border-primary-500/30 rounded-full px-4 py-1">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Partner Program 2025</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold font-serif leading-tight">
                            L'inquilino perfetto esiste. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-300">E noi te lo troviamo.</span>
                        </h1>

                        <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                            Smetti di perdere tempo con visite a vuoto e documenti mancanti.
                            AffittoChiaro ti porta solo candidati con <strong>Tenant Score &gt; 80</strong> e busta paga verificata.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href="#contact-form" className="btn bg-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary-600/30 hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-2">
                                Richiedi Demo Gratuita
                            </a>
                            <Link to="/chi-siamo" className="btn bg-transparent border border-gray-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                Scarica Case Study
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-8 border-t border-gray-800 flex flex-wrap gap-6 opacity-70 grayscale hover:grayscale-0 transition-all">
                            <img src="https://placehold.co/100x40/333/888?text=FIAIP" alt="FIAIP" className="h-8" />
                            <img src="https://placehold.co/100x40/333/888?text=FIMAA" alt="FIMAA" className="h-8" />
                            <img src="https://placehold.co/100x40/333/888?text=RE/MAX" alt="REMAX" className="h-8" />
                            <img src="https://placehold.co/100x40/333/888?text=SoloAffitti" alt="SoloAffitti" className="h-8" />
                        </div>
                    </div>

                    {/* Hero Visual - Dashboard Preview */}
                    <div className="relative perspective-1000 hidden lg:block">
                        <div className="relative z-20 bg-gray-800 rounded-2xl p-2 shadow-2xl border border-gray-700 transform rotate-y-12 rotate-2 hover:rotate-0 transition-all duration-700 ease-out">
                            <img src="https://placehold.co/800x600/1e293b/00C48C?text=AffittoChiaro+Agency+Dashboard" alt="Agency Dashboard" className="rounded-xl w-full shadow-lg" />

                            {/* Floating Stats Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-gray-900 animate-bounce-slow max-w-xs">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Chiusure Mese</p>
                                        <p className="font-bold text-xl">+15 Contratti</p>
                                    </div>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>)}
                                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">+12</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. PAIN POINTS (Agitation) */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2 block">I Problemi di Sempre</span>
                        <h2 className="text-4xl font-bold font-serif text-gray-900 mb-6">Stanco di perdere tempo con "Turisti Immobiliari"?</h2>
                        <p className="text-xl text-gray-500">
                            Il metodo tradizionale è rotto. Passi più tempo a rincorrere documenti che a chiudere contratti.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pain 1 */}
                        <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-6">
                                <UserX className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold font-serif text-red-900 mb-3">Visite a Vuoto</h3>
                            <p className="text-red-700/80 leading-relaxed">
                                8 appuntamenti su 10 sono inutili perché il candidato non ha i requisiti economici o le referenze giuste scoperte solo alla fine.
                            </p>
                        </div>
                        {/* Pain 2 */}
                        <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-6">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold font-serif text-red-900 mb-3">Burocrazia Lenta</h3>
                            <p className="text-red-700/80 leading-relaxed">
                                Rincorrere buste paga via email, documenti illegibili su WhatsApp e firme mancanti rallenta ogni pratica di settimane.
                            </p>
                        </div>
                        {/* Pain 3 */}
                        <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold font-serif text-red-900 mb-3">Rischio Morosità</h3>
                            <p className="text-red-700/80 leading-relaxed">
                                Senza controlli approfonditi (Crif, Protesti), il rischio di mettere in casa un inquilino problematico è sempre dietro l'angolo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SOLUTION STEPS (How It Works) */}
            <section className="py-24 bg-gray-50 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-2 block">La Soluzione AffittoChiaro</span>
                        <h2 className="text-4xl font-bold font-serif text-gray-900">Come rivoluzioniamo il tuo lavoro</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Step 1 */}
                        <div className="relative z-10 text-center group">
                            <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600 shadow-lg mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">1</div>
                            <h3 className="text-2xl font-bold font-serif mb-3">Pubblica o Sincronizza</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Carica i tuoi immobili o sincronizzali automaticamente dal tuo gestionale (XML feed). Visibilità premium garantita.
                            </p>
                        </div>
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gray-200 -z-0"></div>

                        {/* Step 2 */}
                        <div className="relative z-10 text-center group">
                            <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600 shadow-lg mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">2</div>
                            <h3 className="text-2xl font-bold font-serif mb-3">Ricevi Candidature TOP</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Il nostro algoritmo filtra le richieste: ricevi solo profili con <strong>Tenant Score</strong> verificato e documenti già caricati.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 text-center group">
                            <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600 shadow-lg mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">3</div>
                            <h3 className="text-2xl font-bold font-serif mb-3">Chiudi in Digitale</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Genera il contratto, invialo per la firma elettronica e registralo all'Agenzia delle Entrate. Tutto in 1 click.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. COMPARISON TABLE */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-4xl font-bold font-serif text-center mb-16">Perché i Top Performer ci scelgono</h2>

                    <div className="overflow-hidden bg-white border border-gray-200 rounded-[2rem] shadow-xl">
                        <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-500 py-6 px-8 text-sm uppercase tracking-wider">
                            <div>Caratteristica</div>
                            <div className="text-center text-red-400">Agenzia Tradizionale</div>
                            <div className="text-center text-primary-600 bg-primary-50 -my-6 py-6 border-b border-primary-200">AffittoChiaro Partner</div>
                        </div>

                        {[
                            { label: "Qualifica Lead", old: "Manuale (Telefonate)", new: "Automatica (AI + Dati)" },
                            { label: "Verifica Reddito", old: "Buste paga via email", new: "Open Banking Istantaneo" },
                            { label: "Tempo Gestione", old: "10+ ore per contratto", new: "2 ore per contratto" },
                            { label: "Rischio Frode", old: "Alto (Documenti falsi)", new: "Zero (Identità Digitale)" },
                            { label: "Firma Contratto", old: "In presenza (Carta)", new: "Online (Valore Legale)" },
                            { label: "Costi Fissi", old: "Pubblicità sui portali", new: "Zero (Paghi a successo)" }
                        ].map((row, idx) => (
                            <div key={idx} className={`grid grid-cols-3 items-center py-6 px-8 border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                <div className="font-bold font-serif text-gray-800">{row.label}</div>
                                <div className="text-center text-gray-500 flex justify-center items-center gap-2">
                                    <X className="w-5 h-5 text-red-300" /> {row.old}
                                </div>
                                <div className="text-center text-primary-700 font-bold bg-primary-50 -my-6 py-6 flex justify-center items-center gap-2 relative">
                                    <div className="absolute inset-0 border-r border-l border-primary-100 pointer-events-none"></div>
                                    <CheckCircle className="w-5 h-5 text-primary-500 relative z-10" /> <span className="relative z-10">{row.new}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIALS (Social Proof) */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-[100px]"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <h2 className="text-3xl font-bold font-serif text-center mb-16">Cosa dicono di noi</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Marco V.", role: "CEO, Milano Estates", quote: "Abbiamo dimezzato i tempi di gestione. I lead sono incredibilmente qualificati, mai visto nulla del genere." },
                            { name: "Laura B.", role: "Founder, Domus Roma", quote: "Finalmente un partner che porta valore reale e non solo contatti a caso. La firma digitale è una svolta." },
                            { name: "Giuseppe R.", role: "Agenzia Immobiliare Rossi", quote: "Il supporto è fantastico e l'integrazione con il nostro gestionale è stata immediata." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="flex gap-1 text-yellow-500 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Users key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-300 italic mb-6">"{item.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-serif mb-4">Domande Frequenti</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "AffittoChiaro sostituisce la mia agenzia?", a: "Assolutamente no. Noi siamo un acceleratore tecnologico. Tu mantieni la relazione con il proprietario e la gestione dell'immobile, noi ti forniamo gli strumenti per farlo meglio e più velocemente." },
                            { q: "Quanto costa il servizio?", a: "Per le agenzie partner offriamo un modello a performance (paghi solo a contratto chiuso) o un canone flat mensile per annunci illimitati. Contattaci per un'offerta personalizzata." },
                            { q: "Come funziona l'integrazione?", a: "Supportiamo i principali gestionali italiani tramite feed XML. I tuoi annunci vengono pubblicati e aggiornati automaticamente sulla nostra piattaforma." },
                            { q: "I dati dei clienti sono al sicuro?", a: "Sì, utilizziamo crittografia avanzata e siamo pienamente conformi al GDPR. I dati dei tuoi clienti restano tuoi." }
                        ].map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-200 transition-colors">
                                <button
                                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                    className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 font-bold text-gray-800"
                                >
                                    <span className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-primary-500" /> {item.q}</span>
                                    {faqOpen === idx ? <ChevronUp className="text-primary-600" /> : <ChevronDown className="text-gray-400" />}
                                </button>
                                <div className={`px-6 pb-6 text-gray-600 leading-relaxed pl-14 ${faqOpen === idx ? 'block' : 'hidden'}`}>
                                    {item.a}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. INTERACTIVE MAP SECTION */}
            <section className="py-20 bg-gray-50">
                <div className="text-center mb-12">
                    <span className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-2 block">Network Nazionale</span>
                    <h2 className="text-4xl font-bold font-serif text-gray-900">
                        Dove operano i nostri Partner
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Unisciti alle oltre 2.500 agenzie che ci hanno scelto.
                    </p>
                </div>
                {/* Embedded CityMap Component */}
                <div className="max-w-7xl mx-auto px-4">
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 bg-white">
                        <CityMap activeCityName="Milano" onCityChange={handleCityChange} />
                    </div>
                </div>
            </section>

            {/* 8. CONTACT FORM - Sticky/Bottom */}
            <section id="contact-form" className="py-24 bg-white mx-4 mb-20">
                <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">

                    {/* Left: Content */}
                    <div className="p-12 lg:p-20 lg:w-1/2 relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 text-white space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight">Pronto a scalare la tua Agenzia?</h2>
                            <p className="text-gray-300 text-lg">
                                Non lasciare altri soldi sul tavolo. Unisciti al network di agenzie più innovativo d'Italia.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-white" /></div>
                                    <span className="font-bold text-xl">Demo Gratuita di 30 minuti</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-white" /></div>
                                    <span className="font-bold text-xl">Setup in 24 ore</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-white" /></div>
                                    <span className="font-bold text-xl">Nessun vincolo di durata</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:w-1/2 bg-white p-12 lg:p-20 flex items-center">
                        <form className="space-y-6 w-full">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Agenzia</label>
                                <input type="text" className="input bg-gray-50 border-gray-200" placeholder="Nome Agenzia" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
                                    <input type="text" className="input bg-gray-50 border-gray-200" placeholder="Il tuo nome" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefono</label>
                                    <input type="tel" className="input bg-gray-50 border-gray-200" placeholder="+39 ..." />
                                </div>
                            </div>
                            <button className="btn bg-primary-600 text-white text-lg font-bold w-full py-4 rounded-xl shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all hover:-translate-y-1">
                                Richiedi Accesso Partner
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-4">
                                100% Privacy garantita. Niente spam.
                            </p>
                        </form>
                    </div>

                </div>
            </section>
        </div>
    );
};
