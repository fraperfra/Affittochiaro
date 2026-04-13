import { useParams, Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getCittaByRegione, getNomeRegione } from '@/lib/geo-mock';
import { publicListings } from '@/lib/mock-data';

export default function RegionePage() {
  const { regione = '' } = useParams<{ regione: string }>();
  const nomeRegione = getNomeRegione(regione);
  const citta = getCittaByRegione(regione);

  // Conta annunci per città
  const countPerCitta = (comuneSlug: string) =>
    publicListings.filter((l) => l.comuneSlug === comuneSlug).length;

  return (
    <>
      <PageMeta
        title={`Affitti in ${nomeRegione}`}
        description={`Case e stanze in affitto in ${nomeRegione}. Scegli la città e trova il tuo prossimo appartamento con AffittoChiaro.`}
      />

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Trova Affitto', href: '/case-e-stanze-in-affitto' },
            { label: nomeRegione },
          ]}
        />

        <h1 className="font-bold text-text-primary mb-2">
          Affitti in {nomeRegione}
        </h1>
        <p className="text-text-secondary mb-8">
          Scegli una città per visualizzare gli annunci disponibili.
        </p>

        {citta.length === 0 ? (
          <div className="card text-center py-12 text-text-muted">
            Nessuna città trovata per questa regione.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {citta.map((c) => {
              const count = countPerCitta(c.slug);
              return (
                <Link
                  key={c.slug}
                  to={`/case-e-stanze-in-affitto/${regione}/${c.slug}`}
                  className="card group flex items-center justify-between hover:shadow-card-hover hover:border-primary-200 border border-transparent transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-primary-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{c.nome}</div>
                      <div className="text-text-muted text-sm">
                        {count > 0 ? `${count} annunci disponibili` : 'Annunci in arrivo'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-text-muted group-hover:text-primary-500 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10">
          <Link
            to="/case-e-stanze-in-affitto"
            className="text-primary-600 hover:underline text-sm"
          >
            ← Torna a tutte le regioni
          </Link>
        </div>
      </div>
    </>
  );
}
