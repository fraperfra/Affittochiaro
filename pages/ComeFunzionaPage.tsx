import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  User,
  Home,
  UserPlus,
  FileCheck,
  MessageCircle,
  Key,
  Clock,
  ShieldCheck,
  Wallet,
  Play,
  ChevronDown,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const ComeFunzionaPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'inquilini' | 'proprietari'>('inquilini');

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="pt-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-primary-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10 animate-fade-in-up">
            <div className="flex items-center gap-2 text-sm text-primary-600 font-bold tracking-wide uppercase">
              <span className="bg-primary-100 px-3 py-1 rounded-full">Guida 2025</span>
              <span>•</span>
              <span>Affitto Semplice</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight">
              Come Funziona <br />
              <span className="text-primary-600 relative inline-block">
                AffittoChiaro
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              La piattaforma che rivoluziona l'affitto in Italia. Processi digitali, profili verificati e zero burocrazia per inquilini e proprietari.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => { setActiveTab('inquilini'); document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn btn-primary btn-lg shadow-lg shadow-primary-500/20 group">
                <User className="w-5 h-5 mr-2" />
                Per Inquilini
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => { setActiveTab('proprietari'); document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn btn-outline btn-lg bg-white group">
                <Home className="w-5 h-5 mr-2" />
                Per Proprietari
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2 mr-2">
                  {[1, 2, 3].map((i) => (
                    <img key={i} src={`https://placehold.co/100x100/e2e8f0/64748b?text=${i}`} alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <span className="font-bold text-gray-900">4.9/5 da 12k+ utenti</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-teal-50 rounded-full blur-3xl opacity-30 transform rotate-12"></div>
            <img
              src="https://placehold.co/600x700/ffffff/00C48C?text=App+Preview"
              alt="App Interface"
              className="relative z-10 rounded-2xl shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-transform duration-500 max-w-full h-auto"
            />

            {/* Floating Cards */}
            <div className="absolute top-20 -left-10 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce-slow hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Verificato</p>
                  <p className="text-xs text-gray-500">Documenti approvati</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-40 -right-4 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce-slow delay-700 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Contratto Firmato</p>
                  <p className="text-xs text-gray-500">100% Digitale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TOGGLE SECTION */}
      <section id="steps-section" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-gray-100 p-1.5 rounded-full relative">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[50%] bg-primary-600 rounded-full transition-all duration-300 shadow-sm ${activeTab === 'inquilini' ? 'left-1.5' : 'left-[calc(50%-6px)] translate-x-1.5'}`}
              ></div>
              <button
                onClick={() => setActiveTab('inquilini')}
                className={`relative px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 z-10 ${activeTab === 'inquilini' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <User className="w-4 h-4" /> Per Inquilini
              </button>
              <button
                onClick={() => setActiveTab('proprietari')}
                className={`relative px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 z-10 ${activeTab === 'proprietari' ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Home className="w-4 h-4" /> Per Proprietari
              </button>
            </div>
          </div>

          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-4 text-gray-900">
              {activeTab === 'inquilini' ? 'Trova casa in 4 semplici step' : 'Affitta il tuo immobile senza pensieri'}
            </h2>
            <p className="text-xl text-gray-600">
              {activeTab === 'inquilini'
                ? 'Dimentica le file e le chiamate a vuoto. Con AffittoChiaro sei subito in pole position.'
                : 'Selezioniamo solo inquilini referenziati e garantiamo il pagamento del canone.'}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block -z-10"></div>

            {/* Dynamic Steps */}
            {(activeTab === 'inquilini' ? [
              {
                icon: UserPlus,
                title: "1. Crea Profilo",
                desc: "Compila il tuo CV abitativo digitale in pochi minuti.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: FileCheck,
                title: "2. Carica Documenti",
                desc: "Aggiungi busta paga e referenze per essere verificato.",
                color: "bg-purple-100 text-purple-600"
              },
              {
                icon: MessageCircle,
                title: "3. Candidati",
                desc: "Invia richieste mirate ai proprietari con un click.",
                color: "bg-primary-100 text-primary-600"
              },
              {
                icon: Key,
                title: "4. Firma e Entra",
                desc: "Firma il contratto digitale e ricevi le chiavi.",
                color: "bg-teal-100 text-teal-600"
              }
            ] : [
              {
                icon: Home,
                title: "1. Pubblica Annuncio",
                desc: "Inserisci foto e dettagli. È gratis e veloce.",
                color: "bg-primary-100 text-primary-600"
              },
              {
                icon: ShieldCheck,
                title: "2. Ricevi Candidati",
                desc: "Vedi solo profili verificati con Tenant Score.",
                color: "bg-orange-100 text-orange-600"
              },
              {
                icon: MessageCircle,
                title: "3. Chatta e Scegli",
                desc: "Parla direttamente con i candidati ideali.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Wallet,
                title: "4. Affitto Garantito",
                desc: "Attiva la protezione affitto e dormi sonni tranquilli.",
                color: "bg-green-100 text-green-600"
              }
            ]).map((step, idx) => (
              <div key={idx} className="relative bg-white p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm mx-auto md:mx-0`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="absolute top-6 right-6 text-4xl font-bold text-gray-100 -z-10 font-serif">{idx + 1}</div>
                <h3 className="text-xl font-bold mb-2 font-serif">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to={activeTab === 'inquilini' ? '/annunci' : '/landing-inquilino'}
              className="btn btn-primary btn-lg inline-flex items-center gap-2 shadow-lg shadow-primary-500/20"
            >
              {activeTab === 'inquilini' ? 'Cerca Casa Ora' : 'Pubblica Annuncio Gratis'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* BENTO GRID BENEFITS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Perché è meglio di un'agenzia?</h2>
            <p className="text-xl text-gray-600">Più veloce, più sicuro e costa meno.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {/* Large Card */}
            <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative group">
              <div className="flex-1 relative z-10">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-serif mb-4">Risparmi fino al 100% delle commissioni</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Per gli inquilini è sempre gratis. Per i proprietari costa una frazione rispetto all'agenzia tradizionale, con più servizi inclusi.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Nessun costo d'ingresso
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Nessuna esclusiva vincolante
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10"></div>
                <img src="https://placehold.co/400x300/e2e8f0/64748b?text=Risparmio" alt="Savings" className="rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            {/* Tall Card */}
            <div className="md:row-span-2 bg-gray-900 text-white p-8 rounded-3xl shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center text-primary-400 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-serif mb-4 text-white">Sicurezza Totale</h3>
                <p className="text-gray-300 mb-8">
                  La nostra tecnologia antifrode verifica l'identità e la solvibilità di ogni utente in tempo reale.
                </p>

                <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Identity Check</span>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider bg-green-400/10 px-2 py-1 rounded">Passato</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Credit Score</span>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider bg-green-400/10 px-2 py-1 rounded">Alto</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-2">Contratti Digitali</h3>
              <p className="text-gray-600 text-sm">Crea, firma e registra il contratto direttamente online. Legale e sicuro al 100%.</p>
            </div>

            {/* Small Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-2">Velocità Record</h3>
              <p className="text-gray-600 text-sm">Tempo medio per affittare: 7 giorni contro i 45 giorni del mercato tradizionale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-primary-600 font-bold uppercase tracking-widest text-sm">Video Tour</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-12 mt-2">Guarda AffittoChiaro in azione</h2>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-gray-900 ring-8 ring-gray-100">
            <img
              src="https://placehold.co/1200x675/1A1A1A/FFFFFF?text=Video+Thumbnail"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500 scale-105 group-hover:scale-100"
              alt="Video Thumbnail"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/90 backdrop-blur rounded-full flex items-center justify-center pl-2 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 text-primary-600 fill-current" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-left">
              <p className="text-white font-bold text-lg">Come funziona per gli inquilini</p>
              <p className="text-gray-300 text-sm">2:30 min</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ COMPONENT */}
      <section className="section bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif text-center mb-4">Domande Frequenti</h2>
          <p className="text-center text-gray-500 mb-12">Tutto quello che devi sapere per iniziare.</p>
          <div className="space-y-4">
            {[
              { q: "È davvero gratis per chi cerca casa?", a: "Assolutamente sì. Non chiediamo commissioni agli inquilini. Il servizio è supportato dai servizi premium per i proprietari." },
              { q: "Come vengono verificati gli annunci?", a: "Ogni annuncio viene controllato manualmente dal nostro team qualità per assicurare che le foto siano reali e la descrizione accurata." },
              { q: "I miei dati sono al sicuro?", a: "Utilizziamo crittografia avanzata e rispettiamo rigorosamente il GDPR. I tuoi documenti sono visibili solo ai proprietari che autorizzi." },
              { q: "Posso recedere dal servizio?", a: "Certamente, puoi cancellare il tuo account in qualsiasi momento direttamente dalle impostazioni del profilo." }
            ].map((item, index) => (
              <div key={index} className={`accordion-item bg-white rounded-xl px-6 border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ${openFaq === index ? 'ring-2 ring-primary-100' : ''}`}>
                <button className="accordion-trigger w-full flex justify-between items-center py-5 font-bold text-left text-gray-900" onClick={() => toggleFaq(index)}>
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-primary-500' : ''}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-600 leading-relaxed text-sm pr-8 border-t border-gray-100 pt-4">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - GRADIENT STYLE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-brand rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden isolate">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Pronto a cambiare casa?</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                Unisciti a oltre 12.000 utenti che hanno già trovato o affittato casa con noi questo mese.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/annunci" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg border-0 shadow-xl font-bold px-8">
                  Trova Casa
                </Link>
                <Link to="/landing-inquilino" className="btn bg-primary-700/30 backdrop-blur-sm border border-white/30 text-white hover:bg-white/10 btn-lg font-bold px-8">
                  Pubblica Annuncio
                </Link>
              </div>
            </div>

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 -z-10"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
