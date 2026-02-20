import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const AffittoNewsPage: React.FC = () => {
    return (
        <div className="pt-8">
            {/* Hero Featured Article */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2 block">Mercato Immobiliare</span>
                            <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight mb-6">
                                Affitti a Milano: prezzi in salita del 5% nel Q1 2025
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                L'analisi trimestrale di AffittoChiaro rivela le nuove tendenze del mercato immobiliare
                                milanese. Cresce la domanda nei quartieri periferici ben collegati.
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 15 Feb 2025</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 5 min lettura</span>
                            </div>
                            <Link to="/guida-affitto/inquilini/come-presentarsi-proprietario" className="btn btn-primary">
                                Leggi l'articolo
                            </Link>
                        </div>
                        <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-xl">
                            <img src="https://placehold.co/800x600/00C48C/ffffff?text=Milano+Skyline" alt="Featured News"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
                {/* Articles Grid */}
                <div className="lg:col-span-2 space-y-12">
                    <h2 className="text-2xl font-bold font-serif border-l-4 border-primary-500 pl-4">Ultime Notizie</h2>

                    {/* Article 1 */}
                    <article className="flex flex-col md:flex-row gap-6 group">
                        <div className="md:w-1/3 rounded-xl overflow-hidden">
                            <img src="https://placehold.co/400x300/e2e8f0/64748b?text=Contratti"
                                alt="Contratti"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="md:w-2/3">
                            <span className="text-primary-600 text-xs font-bold uppercase mb-2 block">Normativa</span>
                            <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary-600 transition-colors">
                                <Link to="#">Cedolare Secca 2025: cosa cambia per i proprietari</Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                Le nuove aliquote fiscali per i contratti a canone concordato e le agevolazioni per gli affitti brevi.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>10 Feb 2025</span>
                                <span>•</span>
                                <span>Marco G.</span>
                            </div>
                        </div>
                    </article>

                    {/* Article 2 */}
                    <article className="flex flex-col md:flex-row gap-6 group">
                        <div className="md:w-1/3 rounded-xl overflow-hidden">
                            <img src="https://placehold.co/400x300/e2e8f0/64748b?text=Design"
                                alt="Design"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="md:w-2/3">
                            <span className="text-accent-500 text-xs font-bold uppercase mb-2 block">Lifestyle</span>
                            <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary-600 transition-colors">
                                <Link to="#">Arredare un monolocale: 5 idee salvaspazio</Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                Come ottimizzare ogni centimetro quadrato con mobili multifunzionali e soluzioni di design intelligenti.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>08 Feb 2025</span>
                                <span>•</span>
                                <span>Giulia B.</span>
                            </div>
                        </div>
                    </article>

                    {/* Article 3 */}
                    <article className="flex flex-col md:flex-row gap-6 group">
                        <div className="md:w-1/3 rounded-xl overflow-hidden">
                            <img src="https://placehold.co/400x300/e2e8f0/64748b?text=Studenti"
                                alt="Studenti"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="md:w-2/3">
                            <span className="text-primary-600 text-xs font-bold uppercase mb-2 block">Guide</span>
                            <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary-600 transition-colors">
                                <Link to="#">Guida allo studente fuori sede: documenti e agevolazioni</Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                Tutto quello che devi sapere se ti trasferisci per studiare: borse di studio, contratto transitorio e detrazioni.
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>05 Feb 2025</span>
                                <span>•</span>
                                <span>Redazione</span>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Sidebar */}
                <aside className="space-y-12">
                    {/* Newsletter */}
                    <div className="bg-gray-900 text-white p-8 rounded-2xl">
                        <h3 className="font-bold font-serif text-xl mb-4">Resta aggiornato</h3>
                        <p className="text-gray-400 text-sm mb-6">Ricevi le ultime notizie sul mercato immobiliare direttamente nella tua email.</p>
                        <form className="space-y-4">
                            <input type="email" placeholder="La tua email"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none" />
                            <button className="btn btn-primary w-full justify-center">Iscriviti</button>
                        </form>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold font-serif text-lg mb-6">Esplora per Categoria</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="#" className="flex justify-between items-center text-gray-600 hover:text-primary-600 transition-colors group">
                                    <span>Mercato Immobiliare</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">12</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="flex justify-between items-center text-gray-600 hover:text-primary-600 transition-colors group">
                                    <span>Normativa e Leggi</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">8</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="flex justify-between items-center text-gray-600 hover:text-primary-600 transition-colors group">
                                    <span>Guide per Inquilini</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">24</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="flex justify-between items-center text-gray-600 hover:text-primary-600 transition-colors group">
                                    <span>Consigli per Proprietari</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600">15</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};
