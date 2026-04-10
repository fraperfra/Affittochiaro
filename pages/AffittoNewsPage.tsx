import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { articoli } from '@/lib/mock-data';
import { formatDateIt } from '@/lib/utils';

const CATEGORIA_LABELS: Record<string, string> = {
  'trovare-casa': 'Trovare Casa',
  'candidatura': 'Candidatura',
  'anti-truffa': 'Anti-Truffa',
  'guide-citta': 'Guide Città',
  'agenzie': 'Agenzie',
};

export const AffittoNewsPage: React.FC = () => {
  const featured = articoli[0];
  const others = articoli.slice(1);

  return (
    <>
      <PageMeta
        title="Guide Affitto"
        description="Guide pratiche, consigli e notizie sul mercato degli affitti in Italia. Trova casa con sicurezza grazie alle risorse di AffittoChiaro."
      />

      <div className="pt-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Guide Affitto' },
            ]}
          />
        </div>

        {/* Hero Featured Article */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-2 block">
                  {CATEGORIA_LABELS[featured.categoria] ?? featured.categoria}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight mb-6">
                  {featured.titolo}
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {featured.intro}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formatDateIt(featured.dataPubblicazione)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {featured.tempoLettura} min lettura
                  </span>
                </div>
                <Link to={`/guide-affitto/${featured.slug}`} className="btn btn-primary">
                  Leggi l'articolo
                </Link>
              </div>
              <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={featured.immagine}
                  alt={featured.titolo}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
          {/* Articles Grid */}
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-2xl font-bold font-serif border-l-4 border-primary-500 pl-4">
              Ultime Guide
            </h2>

            {others.map((articolo) => (
              <article key={articolo.id} className="flex flex-col md:flex-row gap-6 group">
                <div className="md:w-1/3 rounded-xl overflow-hidden aspect-video md:aspect-auto">
                  <img
                    src={articolo.immagine}
                    alt={articolo.titolo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="md:w-2/3">
                  <span className="text-primary-600 text-xs font-bold uppercase mb-2 block">
                    {CATEGORIA_LABELS[articolo.categoria] ?? articolo.categoria}
                  </span>
                  <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary-600 transition-colors">
                    <Link to={`/guide-affitto/${articolo.slug}`}>
                      {articolo.titolo}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {articolo.intro}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{formatDateIt(articolo.dataPubblicazione)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {articolo.tempoLettura} min
                    </span>
                  </div>
                  <Link
                    to={`/guide-affitto/${articolo.slug}`}
                    className="inline-flex items-center gap-1 mt-3 text-primary-600 text-sm font-semibold hover:underline"
                  >
                    Leggi la guida <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}

            {/* CTA fine pagina */}
            <div className="pt-4 border-t border-gray-100">
              <Link to="/case-e-stanze-in-affitto" className="btn btn-primary">
                Cerca casa ora
              </Link>
              <Link
                to="/register"
                className="ml-4 text-primary-600 text-sm font-semibold hover:underline"
              >
                Hai già un profilo? Trova i tuoi annunci →
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* Newsletter */}
            <div className="bg-gray-900 text-white p-8 rounded-2xl">
              <h3 className="font-bold font-serif text-xl mb-4">Resta aggiornato</h3>
              <p className="text-gray-400 text-sm mb-6">
                Ricevi le ultime guide sul mercato immobiliare direttamente nella tua email.
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="La tua email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button className="btn btn-primary w-full justify-center">
                  Ricevi le guide
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold font-serif text-lg mb-6">Esplora per Categoria</h3>
              <ul className="space-y-3">
                {Object.entries(CATEGORIA_LABELS).map(([slug, label]) => {
                  const count = articoli.filter((a) => a.categoria === slug).length;
                  return (
                    <li key={slug}>
                      <span className="flex justify-between items-center text-gray-600">
                        <span>{label}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                          {count}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Cerca casa */}
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
              <h3 className="font-bold text-text-primary mb-2">Trova il tuo affitto</h3>
              <p className="text-text-secondary text-sm mb-4">
                Sfoglia gli annunci disponibili nella tua città.
              </p>
              <Link to="/case-e-stanze-in-affitto" className="btn btn-primary w-full text-center text-sm">
                Cerca casa ora
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};
