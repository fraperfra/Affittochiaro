import { Link } from 'react-router-dom';
import { MapPin, Home, Maximize2, BedDouble, Bath, Star } from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getExclusiveListings } from '@/lib/mock-data';
import { buildListingUrl, formatPrice } from '@/lib/utils';

export default function ExclusiveListingsPage() {
  const listings = getExclusiveListings();

  return (
    <>
      <PageMeta
        title="Affitti Esclusivi AffittoChiaro"
        description="Gli appartamenti e le case disponibili in esclusiva su AffittoChiaro. Annunci verificati con inquilini selezionati."
      />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Trova Affitto', href: '/case-e-stanze-in-affitto' },
            { label: 'Esclusivi AffittoChiaro' },
          ]}
        />

        {/* Hero header */}
        <div className="bg-gradient-to-br from-primary-500 to-teal-700 rounded-2xl p-6 md:p-10 mb-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Star size={18} className="fill-yellow-300 text-yellow-300" />
            <span className="text-sm font-semibold uppercase tracking-wider text-white/80">Solo su AffittoChiaro</span>
          </div>
          <h1 className="font-bold mb-3">Affitti Esclusivi</h1>
          <p className="text-white/80 max-w-xl">
            Questi annunci sono disponibili solo su AffittoChiaro. Le agenzie partner hanno
            selezionato immobili di qualità per inquilini verificati con profilo completo.
          </p>
          <div className="mt-4 text-sm text-white/70">
            {listings.length} annunci disponibili
          </div>
        </div>

        {/* Come funziona */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { n: '1', titolo: 'Completa il profilo', desc: 'Carica documenti e compila le informazioni richieste.' },
            { n: '2', titolo: 'Candidati', desc: 'Invia la candidatura direttamente dall\'annuncio.' },
            { n: '3', titolo: 'Vieni contattato', desc: "L'agenzia ti contatta entro 24 ore lavorative." },
          ].map((step) => (
            <div key={step.n} className="card flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {step.n}
              </div>
              <div>
                <div className="font-semibold text-text-primary text-sm">{step.titolo}</div>
                <div className="text-text-secondary text-sm mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Griglia annunci */}
        <h2 className="font-bold text-text-primary mb-4">
          Annunci in esclusiva ({listings.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              to={buildListingUrl(listing.regioneSlug, listing.comuneSlug, listing.tipologiaSlug, listing.slug)}
              className="card group overflow-hidden hover:shadow-card-hover transition-shadow p-0 block"
            >
              {/* Immagine */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={listing.immagini[0]}
                  alt={listing.titolo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <Star size={11} className="fill-white" /> Esclusiva
                </div>
              </div>

              {/* Contenuto */}
              <div className="p-4">
                <div className="flex items-center gap-1 text-text-muted text-xs mb-1.5">
                  <MapPin size={12} />
                  <span>{listing.zona}, {listing.comune}</span>
                </div>
                <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mb-2">
                  {listing.titolo}
                </h3>
                <div className="flex items-center gap-3 text-text-secondary text-xs mb-3">
                  <span className="flex items-center gap-1"><Maximize2 size={12} />{listing.mq} m²</span>
                  <span className="flex items-center gap-1"><BedDouble size={12} />{listing.camere} cam.</span>
                  <span className="flex items-center gap-1"><Bath size={12} />{listing.bagni} bagni</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-600 text-base">{formatPrice(listing.prezzo)}</span>
                  <span className="text-xs text-text-muted capitalize">{listing.tipologia}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA registrazione */}
        <div className="mt-12 card bg-background-secondary text-center py-10">
          <Home size={36} className="text-primary-500 mx-auto mb-3" />
          <h3 className="font-bold text-text-primary mb-2">Candidati agli esclusivi</h3>
          <p className="text-text-secondary mb-5 max-w-md mx-auto">
            Per candidarti agli annunci esclusivi è necessario un profilo completo e verificato.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Cerca casa ora
          </Link>
        </div>
      </div>
    </>
  );
}
