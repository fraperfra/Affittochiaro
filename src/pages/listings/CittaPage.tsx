import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Maximize2, BedDouble, Bath, LayoutGrid, List, Star } from 'lucide-react';
import { PageMeta } from '@/components/ui/PageMeta';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getNomeCitta, getNomeRegione } from '@/lib/geo-mock';
import { getListingsByComune } from '@/lib/mock-data';
import { buildListingUrl, formatPrice } from '@/lib/utils';

const TIPOLOGIE = ['Tutti', 'appartamento', 'bilocale', 'trilocale', 'stanza', 'villa'];

export default function CittaPage() {
  const { regione = '', comune = '' } = useParams<{ regione: string; comune: string }>();
  const nomeCitta = getNomeCitta(comune);
  const nomeRegione = getNomeRegione(regione);
  const allListings = getListingsByComune(comune);

  const [tipologiaFiltro, setTipologiaFiltro] = useState('Tutti');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [ordinamento, setOrdinamento] = useState<'prezzo-asc' | 'prezzo-desc' | 'recente'>('recente');

  const filtered = allListings
    .filter((l) => tipologiaFiltro === 'Tutti' || l.tipologiaSlug === tipologiaFiltro)
    .sort((a, b) => {
      if (ordinamento === 'prezzo-asc') return a.prezzo - b.prezzo;
      if (ordinamento === 'prezzo-desc') return b.prezzo - a.prezzo;
      return 0;
    });

  return (
    <>
      <PageMeta
        title={`Affitti a ${nomeCitta}`}
        description={`Case e stanze in affitto a ${nomeCitta}, ${nomeRegione}. Trova il tuo prossimo appartamento con AffittoChiaro.`}
      />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Trova Affitto', href: '/case-e-stanze-in-affitto' },
            { label: nomeRegione, href: `/case-e-stanze-in-affitto/${regione}` },
            { label: nomeCitta },
          ]}
        />

        <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-1">
          Affitti a {nomeCitta}
        </h1>
        <p className="text-text-secondary mb-6">
          {allListings.length > 0
            ? `${allListings.length} annunci disponibili`
            : 'Nessun annuncio disponibile al momento.'}
        </p>

        {/* Filtri */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Tipologia */}
          <div className="flex flex-wrap gap-2">
            {TIPOLOGIE.map((t) => (
              <button
                key={t}
                onClick={() => setTipologiaFiltro(t)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  tipologiaFiltro === t
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {t === 'Tutti' ? 'Tutti i tipi' : t}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Ordinamento */}
          <select
            value={ordinamento}
            onChange={(e) => setOrdinamento(e.target.value as typeof ordinamento)}
            className="input text-sm py-1.5 pr-8 cursor-pointer"
          >
            <option value="recente">Più recenti</option>
            <option value="prezzo-asc">Prezzo crescente</option>
            <option value="prezzo-desc">Prezzo decrescente</option>
          </select>

          {/* Toggle view */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-text-muted hover:text-text-primary'}`}
              aria-label="Vista griglia"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-text-muted hover:text-text-primary'}`}
              aria-label="Vista lista"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Risultati */}
        {filtered.length === 0 ? (
          <div className="card text-center py-12 text-text-muted">
            Nessun annuncio trovato per i filtri selezionati.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((listing) => (
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
        ) : (
          <div className="space-y-3">
            {filtered.map((listing) => (
              <Link
                key={listing.id}
                to={buildListingUrl(listing.regioneSlug, listing.comuneSlug, listing.tipologiaSlug, listing.slug)}
                className="card group flex gap-4 hover:shadow-card-hover transition-shadow p-0 overflow-hidden"
              >
                <div className="w-32 h-28 sm:w-44 sm:h-32 shrink-0 overflow-hidden">
                  <img
                    src={listing.immagini[0]}
                    alt={listing.titolo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 py-3 pr-4 min-w-0">
                  <div className="flex items-center gap-1 text-text-muted text-xs mb-1">
                    <MapPin size={11} />
                    <span>{listing.zona}, {listing.comune}</span>
                    {listing.isExclusive && (
                      <span className="ml-2 flex items-center gap-0.5 bg-primary-50 text-primary-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        <Star size={9} className="fill-primary-500" /> Esclusiva
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-1">
                    {listing.titolo}
                  </h3>
                  <div className="flex items-center gap-3 text-text-secondary text-xs mb-2">
                    <span className="flex items-center gap-1"><Maximize2 size={11} />{listing.mq} m²</span>
                    <span className="flex items-center gap-1"><BedDouble size={11} />{listing.camere} cam.</span>
                    <span className="flex items-center gap-1"><Bath size={11} />{listing.bagni} bagni</span>
                  </div>
                  <span className="font-bold text-primary-600">{formatPrice(listing.prezzo)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            to={`/case-e-stanze-in-affitto/${regione}`}
            className="text-primary-600 hover:underline text-sm"
          >
            ← Torna a {nomeRegione}
          </Link>
        </div>
      </div>
    </>
  );
}
