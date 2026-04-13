import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { articoli, getArticoloBySlug } from '@/lib/mock-data';
import { formatDateIt } from '@/lib/utils';

const CATEGORIA_LABELS: Record<string, string> = {
  'trovare-casa': 'Trovare Casa',
  'candidatura': 'Candidatura',
  'anti-truffa': 'Anti-Truffa',
  'guide-citta': 'Guide Città',
  'agenzie': 'Agenzie',
};

const CATEGORIA_COLORS: Record<string, string> = {
  'trovare-casa': 'bg-blue-50 text-blue-700',
  'candidatura': 'bg-primary-50 text-primary-700',
  'anti-truffa': 'bg-red-50 text-red-700',
  'guide-citta': 'bg-teal-50 text-teal-700',
  'agenzie': 'bg-purple-50 text-purple-700',
};

export default function ArticoloPage() {
  const { slugArticolo = '' } = useParams<{ slugArticolo: string }>();
  const articolo = getArticoloBySlug(slugArticolo);

  if (!articolo) return <Navigate to="/guide-affitto" replace />;

  const altriArticoli = articoli
    .filter((a) => a.id !== articolo.id)
    .slice(0, 3);

  const categoriaLabel = CATEGORIA_LABELS[articolo.categoria] ?? articolo.categoria;
  const categoriaColor = CATEGORIA_COLORS[articolo.categoria] ?? 'bg-gray-100 text-gray-700';

  // Converte il contenuto markdown-like in paragrafi con h2/h3
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="font-bold text-text-primary mt-8 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-lg font-semibold text-text-primary mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="text-text-secondary leading-relaxed ml-4 list-disc">
            {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </li>
        );
      }
      if (line.match(/^\d+\. /)) {
        const text = line.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '$1');
        return (
          <li key={i} className="text-text-secondary leading-relaxed ml-4 list-decimal">
            {text}
          </li>
        );
      }
      if (line.startsWith('❌') || line.startsWith('✅')) {
        return (
          <p key={i} className="text-text-secondary leading-relaxed py-0.5">
            {line}
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      // Bold inline
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-text-secondary leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-semibold text-text-primary">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <>
      <PageMeta
        title={articolo.titolo}
        description={articolo.intro.slice(0, 155)}
        canonical={`https://affittochiaro.it/guide-affitto/${articolo.slug}`}
      />

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Guide Affitto', href: '/guide-affitto' },
            { label: articolo.titolo },
          ]}
        />

        {/* Badge categoria */}
        <div className="mb-4">
          <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${categoriaColor}`}>
            {categoriaLabel}
          </span>
        </div>

        {/* Titolo */}
        <h1 className="font-bold text-text-primary mb-4 leading-tight">
          {articolo.titolo}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDateIt(articolo.dataPubblicazione)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {articolo.tempoLettura} min lettura
          </span>
        </div>

        {/* Intro */}
        <p className="text-lg text-text-secondary leading-relaxed mb-8 border-l-4 border-primary-200 pl-4">
          {articolo.intro}
        </p>

        {/* Immagine hero */}
        <div className="rounded-2xl overflow-hidden mb-10 shadow-sm">
          <img
            src={articolo.immagine}
            alt={articolo.titolo}
            className="w-full h-56 md:h-80 object-cover"
          />
        </div>

        {/* Contenuto */}
        <div className="prose-affitto space-y-1 mb-12">
          {renderContent(articolo.contenuto)}
        </div>

        {/* CTA interna */}
        <div className="card bg-primary-50 border border-primary-100 text-center py-8 mb-12">
          <BookOpen size={32} className="text-primary-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-text-primary mb-2">
            Trova il tuo prossimo affitto
          </h3>
          <p className="text-text-secondary text-sm mb-5 max-w-sm mx-auto">
            Crei il profilo una volta sola. Vale per tutti gli annunci.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/case-e-stanze-in-affitto" className="btn btn-primary">
              Cerca casa ora
            </Link>
            <Link
              to="/come-funziona"
              className="text-primary-600 text-sm font-semibold hover:underline"
            >
              Scopri come funziona per te →
            </Link>
          </div>
        </div>

        {/* Altri articoli */}
        {altriArticoli.length > 0 && (
          <div>
            <h2 className="font-bold text-text-primary mb-6">Altre guide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {altriArticoli.map((a) => (
                <Link
                  key={a.id}
                  to={`/guide-affitto/${a.slug}`}
                  className="card group overflow-hidden hover:shadow-card-hover transition-shadow p-0 block"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={a.immagine}
                      alt={a.titolo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-xs font-bold text-primary-600 uppercase">
                      {CATEGORIA_LABELS[a.categoria] ?? a.categoria}
                    </span>
                    <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mt-1 mb-2">
                      {a.titolo}
                    </h3>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Clock size={11} /> {a.tempoLettura} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/guide-affitto"
                className="text-primary-600 hover:underline text-sm flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Torna a tutte le guide
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
