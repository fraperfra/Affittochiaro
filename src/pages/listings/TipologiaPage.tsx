import { useParams, Link } from 'react-router-dom';
import { MapPin, Maximize2, BedDouble, Bath, Star } from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getNomeCitta, getNomeRegione } from '@/lib/geo-mock';
import { getListingsByTipologia } from '@/lib/mock-data';
import { buildListingUrl, formatPrice } from '@/lib/utils';

const TIPOLOGIA_LABELS: Record<string, string> = {
  appartamento: 'Appartamenti',
  bilocale: 'Bilocali',
  trilocale: 'Trilocali',
  stanza: 'Stanze',
  villa: 'Ville',
};

export default function TipologiaPage() {
  const { regione = '', comune = '', tipologia = '' } = useParams<{
    regione: string;
    comune: string;
    tipologia: string;
  }>();

  const nomeCitta = getNomeCitta(comune);
  const nomeRegione = getNomeRegione(regione);
  const nomeTipologia = TIPOLOGIA_LABELS[tipologia] ?? tipologia;
  const listings = getListingsByTipologia(comune, tipologia);

  return (
    <>
      <PageMeta
        title={`${nomeTipologia} in affitto a ${nomeCitta}`}
        description={`${nomeTipologia} in affitto a ${nomeCitta}, ${nomeRegione}. Annunci verificati con foto e prezzi aggiornati su AffittoChiaro.`}
      />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Trova Affitto', href: '/case-e-stanze-in-affitto' },
            { label: nomeRegione, href: `/case-e-stanze-in-affitto/${regione}` },
            { label: nomeCitta, href: `/case-e-stanze-in-affitto/${regione}/${comune}` },
            { label: nomeTipologia },
          ]}
        />

        <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-1">
          {nomeTipologia} in affitto a {nomeCitta}
        </h1>
        <p className="text-text-secondary mb-8">
          {listings.length > 0
            ? `${listings.length} annunci disponibili`
            : 'Nessun annuncio disponibile per questa tipologia.'}
        </p>

        {listings.length === 0 ? (
          <div className="card text-center py-12 text-text-muted">
            <p className="mb-4">Nessun annuncio trovato per questa tipologia.</p>
            <Link
              to={`/case-e-stanze-in-affitto/${regione}/${comune}`}
              className="btn btn-primary"
            >
              Vedi tutti gli annunci a {nomeCitta}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={buildListingUrl(listing.regioneSlug, listing.comuneSlug, listing.tipologiaSlug, listing.slug)}
                className="card group overflow-hidden hover:shadow-card-hover transition-shadow p-0 block"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={listing.immagini[0]}
                    alt={listing.titolo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {listing.isExclusive && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      <Star size={10} className="fill-white" /> Esclusiva
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-text-muted text-xs mb-1">
                    <MapPin size={11} />
                    <span>{listing.zona}</span>
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mb-2">
                    {listing.titolo}
                  </h3>
                  <div className="flex items-center gap-3 text-text-secondary text-xs mb-3">
                    <span className="flex items-center gap-1"><Maximize2 size={11} />{listing.mq} m²</span>
                    <span className="flex items-center gap-1"><BedDouble size={11} />{listing.camere} cam.</span>
                    <span className="flex items-center gap-1"><Bath size={11} />{listing.bagni} bagni</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600">{formatPrice(listing.prezzo)}</span>
                    <span className="text-xs text-text-muted capitalize">{listing.tipologia}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to={`/case-e-stanze-in-affitto/${regione}/${comune}`}
            className="text-primary-600 hover:underline text-sm"
          >
            ← Tutti gli annunci a {nomeCitta}
          </Link>
        </div>
      </div>
    </>
  );
}
