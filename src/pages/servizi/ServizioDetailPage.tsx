import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getServizioBySlug, servizi } from '@/lib/mock-data';

export default function ServizioDetailPage() {
  const { nomeServizio = '' } = useParams<{ nomeServizio: string }>();
  const servizio = getServizioBySlug(nomeServizio);

  if (!servizio) return <Navigate to="/servizi" replace />;

  const altriServizi = servizi.filter((s) => s.id !== servizio.id).slice(0, 3);

  return (
    <>
      <PageMeta
        title={servizio.nome}
        description={servizio.descrizione.slice(0, 155)}
      />

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Servizi', href: '/servizi' },
            { label: servizio.nome },
          ]}
        />

        <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
          {servizio.nome}
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed mb-8">
          {servizio.descrizione}
        </p>

        {/* Vantaggi */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-5">
            Cosa è incluso
          </h2>
          <ul className="space-y-3">
            {servizio.vantaggi.map((v, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <span className="text-text-secondary">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="card bg-primary-50 border border-primary-100 text-center py-10 mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Vuoi attivare questo servizio?
          </h2>
          <p className="text-text-secondary text-sm mb-5">
            Ti mettiamo in contatto con il partner direttamente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn btn-primary flex items-center gap-2">
              Attiva il servizio <ArrowRight size={16} />
            </Link>
            <Link
              to="/case-e-stanze-in-affitto"
              className="text-primary-600 text-sm font-semibold hover:underline"
            >
              Richiedi informazioni →
            </Link>
          </div>
        </div>

        {/* Altri servizi */}
        {altriServizi.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Altri servizi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {altriServizi.map((s) => (
                <Link
                  key={s.id}
                  to={`/servizi/${s.slug}`}
                  className="card hover:shadow-card-hover transition-shadow"
                >
                  <h3 className="font-semibold text-text-primary text-sm mb-1">{s.nome}</h3>
                  <p className="text-text-muted text-xs line-clamp-2">{s.descrizione}</p>
                </Link>
              ))}
            </div>

            <Link
              to="/servizi"
              className="text-primary-600 hover:underline text-sm flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Tutti i servizi
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
