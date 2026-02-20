import React from 'react';
import { Eye, ShieldCheck, Zap } from 'lucide-react';

export const ChiSiamoPage: React.FC = () => {
    return (
        <div className="pt-8">
            {/* Vision Hero */}
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
                        Rendiamo l'affitto <br /> <span className="text-primary-500">Semplice e Trasparente</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                        Siamo nati con una missione: eliminare stress, costi nascosti e complicazioni burocratiche dal
                        mercato immobiliare italiano, grazie alla tecnologia.
                    </p>
                    <img src="https://placehold.co/1200x500/1e293b/00C48C?text=Team+AffittoChiaro" alt="Team Photo"
                        className="rounded-2xl shadow-2xl mx-auto border border-gray-700" />
                </div>
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </section>

            {/* Values Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl mx-auto md:mx-0">
                                <Eye className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif">Trasparenza</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Niente costi occulti. Inquilini e proprietari hanno accesso a tutte le informazioni, sempre.
                                Le recensioni sono reali e verificate.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto md:mx-0">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif">Sicurezza</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Ogni annuncio, ogni profilo e ogni contratto passa attraverso rigorosi controlli di qualità
                                per proteggere la tua esperienza.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-500 text-2xl mx-auto md:mx-0">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif">Velocità</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Dimentica le perdite di tempo. Dal tour virtuale alla firma digitale del contratto, tutto
                                avviene in clic, non in settimane.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-5xl font-bold mb-2">35k</div>
                        <p className="text-primary-100 uppercase tracking-widest text-sm font-semibold">Utenti Attivi</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold mb-2">12k</div>
                        <p className="text-primary-100 uppercase tracking-widest text-sm font-semibold">Annunci Pubblicati</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold mb-2">98%</div>
                        <p className="text-primary-100 uppercase tracking-widest text-sm font-semibold">Clienti Soddisfatti</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold mb-2">15</div>
                        <p className="text-primary-100 uppercase tracking-widest text-sm font-semibold">Città Coperte</p>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold font-serif text-center mb-16">Il Nostro Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Member 1 */}
                        <div className="text-center group">
                            <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg">
                                <img src="https://placehold.co/400x400/333/fff?text=CEO" alt="Member"
                                    className="w-full transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <h3 className="font-bold text-xl">Marco Rossi</h3>
                            <p className="text-primary-600 font-medium">CEO & Founder</p>
                        </div>
                        {/* Member 2 */}
                        <div className="text-center group">
                            <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg">
                                <img src="https://placehold.co/400x400/333/fff?text=CTO" alt="Member"
                                    className="w-full transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <h3 className="font-bold text-xl">Laura Bianchi</h3>
                            <p className="text-primary-600 font-medium">CTO</p>
                        </div>
                        {/* Member 3 */}
                        <div className="text-center group">
                            <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg">
                                <img src="https://placehold.co/400x400/333/fff?text=Product" alt="Member"
                                    className="w-full transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <h3 className="font-bold text-xl">Luca Verdi</h3>
                            <p className="text-primary-600 font-medium">Head of Product</p>
                        </div>
                        {/* Member 4 */}
                        <div className="text-center group">
                            <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg">
                                <img src="https://placehold.co/400x400/333/fff?text=Marketing" alt="Member"
                                    className="w-full transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <h3 className="font-bold text-xl">Giulia Neri</h3>
                            <p className="text-primary-600 font-medium">Marketing Manager</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
