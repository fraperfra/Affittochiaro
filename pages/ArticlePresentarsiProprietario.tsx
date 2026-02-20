import React from 'react';
import { ArticleLayout } from '../components/ArticleLayout';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileText, UserCheck, AlertCircle } from 'lucide-react';

export const ArticlePresentarsiProprietario: React.FC = () => {
    const toc = [
        { id: 'prima-impressione', title: "L'importanza della Prima Impressione" },
        { id: 'documenti', title: "I Documenti da Preparare" },
        { id: 'lettera', title: "Come Scrivere una Lettera di Presentazione" },
        { id: 'visita', title: "Comportamento durante la Visita" },
        { id: 'errori', title: "Errori Comuni da Evitare" }
    ];

    return (
        <ArticleLayout
            title="Come Presentarsi al Proprietario: La Guida Definitiva per Ottenere la Casa dei Tuoi Sogni"
            description="In un mercato competitivo, fare una buona prima impressione è fondamentale. Scopri i segreti per distinguerti dagli altri candidati."
            publishDate="15 Feb 2025"
            readTime="7 min lettura"
            author="Giulia Bianchi"
            category="Guide Inquilini"
            image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            toc={toc}
        >
            <p className="lead text-xl text-gray-600 mb-8 border-l-4 border-primary-500 pl-6 italic">
                Hai trovato l'appartamento perfetto. La zona è ideale, il prezzo è giusto, e le foto sono bellissime.
                Ma c'è un problema: non sei l'unico a volerlo. A Milano, Roma e nelle grandi città, per ogni annuncio di qualità ci sono decine di candidati.
                Come fare per essere scelti?
            </p>

            <h2 id="prima-impressione" className="scroll-mt-32">L'importanza della Prima Impressione</h2>
            <p>
                Molti inquilini pensano che affittare casa sia solo una questione di soldi: "Se posso permettermelo, la casa è mia".
                Sbagliato. Per un proprietario, l'inquilino ideale non è solo chi paga, ma chi <strong>cura la casa</strong> e non crea problemi.
            </p>
            <p>
                La tua presentazione inizia molto prima della visita: inizia dal primo messaggio o dalla prima telefonata.
                Sii professionale, cortese e conciso. Evita messaggi sgrammaticati o troppo informali come "È libera??".
            </p>

            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 my-8 not-prose">
                <h4 className="font-bold text-primary-800 flex items-center gap-2 mb-2">
                    <UserCheck className="w-5 h-5" /> Consiglio dell'Esperto
                </h4>
                <p className="text-primary-700 text-sm">
                    Utilizza il tuo profilo AffittoChiaro come un CV immobiliare. Un profilo completato al 100% con foto e bio aumenta le probabilità di risposta del 40%.
                </p>
            </div>

            <h2 id="documenti" className="scroll-mt-32">I Documenti da Preparare (Prima della Visita)</h2>
            <p>
                Arrivare alla visita con i documenti già pronti dimostra serietà e organizzazione. Se la casa ti piace, potrai fare una proposta immediata, battendo sul tempo gli altri candidati indecisi.
            </p>
            <ul className="not-prose space-y-3 my-6">
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1"><CheckCircle2 className="w-4 h-4" /></div>
                    <div>
                        <strong className="block text-gray-900">Documento d'Identità e Codice Fiscale</strong>
                        <span className="text-sm text-gray-500">In corso di validità, fronte e retro.</span>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1"><CheckCircle2 className="w-4 h-4" /></div>
                    <div>
                        <strong className="block text-gray-900">Ultime 3 Buste Paga</strong>
                        <span className="text-sm text-gray-500">O Modello Unico per i liberi professionisti.</span>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1"><CheckCircle2 className="w-4 h-4" /></div>
                    <div>
                        <strong className="block text-gray-900">Contratto di Lavoro</strong>
                        <span className="text-sm text-gray-500">Per dimostrare la stabilità della tua posizione.</span>
                    </div>
                </li>
            </ul>

            <h2 id="lettera" className="scroll-mt-32">Come Scrivere una Lettera di Presentazione</h2>
            <p>
                Sì, hai letto bene. Una breve lettera di presentazione (o bio) può fare la differenza.
                Racconta chi sei, cosa fai nella vita e perché ti piace quella casa specifica.
                I proprietari affittano a <strong>persone</strong>, non a conti bancari.
            </p>
            <blockquote>
                "Gentile Proprietario, sono Marco, ingegnere informatico di 30 anni. Cerco un appartamento tranquillo per avvicinarmi al mio ufficio in centro.
                Sono una persona precisa, non fumo e non ho animali. Ho ottime referenze dal mio attuale locatore."
            </blockquote>
            <p>
                Semplice, efficace e rassicurante.
            </p>

            <h2 id="visita" className="scroll-mt-32">Comportamento durante la Visita</h2>
            <p>
                La visita è un colloquio. Vestiti in modo ordinato e sii puntuale (la puntualità è il primo indicatore di affidabilità nei pagamenti).
            </p>
            <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Cosa Fare</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                        <li>• Fai domande intelligenti sulla casa</li>
                        <li>• Controlla infissi e rubinetti (con discrezione)</li>
                        <li>• Mostrati interessato e positivo</li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Cosa NON Fare</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                        <li>• Criticare l'arredamento o il prezzo</li>
                        <li>• Arrivare in ritardo senza avvisare</li>
                        <li>• Parlare male del vecchio proprietario</li>
                    </ul>
                </div>
            </div>

            <h2 id="errori" className="scroll-mt-32">Errori Comuni da Evitare</h2>
            <p>
                L'errore numero uno? Mentire. Non nascondere animali domestici o situazioni lavorative precarie.
                La verità viene sempre a galla (spesso tramite controlli creditizi o referenze).
                AffittoChiaro ti aiuta a essere trasparente con il <strong>Tenant Score</strong>, che certifica la tua affidabilità in modo oggettivo.
            </p>

            <hr className="my-12" />

            {/* Contextual CTA */}
            <div className="bg-gray-900 text-white p-8 rounded-[2rem] text-center not-prose relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/30 rounded-full blur-[80px]"></div>
                <h3 className="text-2xl font-bold font-serif mb-4 relative z-10">Vuoi dimostrare di essere l'inquilino perfetto?</h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto relative z-10">
                    Ottieni il tuo Tenant Score certificato e presentati con una marcia in più. I proprietari si fidano di chi è verificato.
                </p>
                <div className="flex justify-center gap-4 relative z-10">
                    <Link to="/register" className="btn bg-primary-600 text-white font-bold border-none hover:bg-white hover:text-gray-900">
                        Certifica il tuo Profilo Gratis
                    </Link>
                </div>
            </div>

        </ArticleLayout>
    );
};
