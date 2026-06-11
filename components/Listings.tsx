import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Maximize2, BedDouble, Bath, Star } from 'lucide-react';
import { publicListings } from '../src/lib/mock-data';
import { buildListingUrl, formatPrice } from '../src/lib/utils';

interface ListingsProps {
  activeCityName: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTERS = ['Tutti', 'appartamento', 'bilocale', 'trilocale', 'stanza', 'villa'];
const FILTER_LABELS: Record<string, string> = {
  Tutti: 'Tutti',
  appartamento: 'Appartamento',
  bilocale: 'Bilocale',
  trilocale: 'Trilocale',
  stanza: 'Stanza',
  villa: 'Villa',
};

export const Listings: React.FC<ListingsProps> = ({
  activeCityName,
  activeFilter,
  onFilterChange,
}) => {
  const navigate = useNavigate();

  const filteredListings = activeFilter === 'Tutti'
    ? publicListings
    : publicListings.filter(item => item.tipologiaSlug === activeFilter);

  return (
    <section id="annunci" className="py-16 bg-[#FAFAFA] px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[24px] font-bold text-brand-green mb-4 leading-[1.2]">Scegli la Tua Prossima Casa</h2>
        <p className="text-lg text-medium-gray mb-10 leading-[1.5]">
          Sfoglia le migliori opportunità immobiliari aggiornate in tempo reale dai portali e dai social a{' '}
          <span className="font-bold text-brand-green">{activeCityName}</span> e dintorni.
        </p>

        <div className="flex flex-wrap gap-3 justify-start mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-8 py-3 rounded-2xl font-bold text-sm border transition-all ${
                activeFilter === f
                  ? 'bg-brand-green text-white border-brand-green shadow-xl shadow-brand-green/20'
                  : 'bg-white text-brand-green border-gray-100 hover:border-brand-green/20'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredListings.slice(0, 3).map((listing) => {
            const url = buildListingUrl(listing.regioneSlug, listing.comuneSlug, listing.tipologiaSlug, listing.slug);
            return (
              <div key={listing.id} className="card group overflow-hidden hover:shadow-card-hover transition-shadow p-0 flex flex-col">
                <Link to={url} className="relative h-44 overflow-hidden block">
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
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-text-muted text-xs mb-1">
                    <MapPin size={11} /><span>{listing.zona}</span>
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mb-2">{listing.titolo}</h3>
                  <div className="flex items-center gap-3 text-text-secondary text-xs mb-3">
                    <span className="flex items-center gap-1"><Maximize2 size={11} />{listing.mq} m²</span>
                    <span className="flex items-center gap-1"><BedDouble size={11} />{listing.camere} cam.</span>
                    <span className="flex items-center gap-1"><Bath size={11} />{listing.bagni} bagni</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-primary-600">{formatPrice(listing.prezzo)}</span>
                    <span className="text-xs text-text-muted capitalize">{listing.tipologia}</span>
                  </div>
                  <Link to={url} className="btn btn-primary w-full justify-center text-sm mt-auto">
                    Candidati
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 group">
          <button
            onClick={() => navigate('/case-e-stanze-in-affitto')}
            className="inline-flex items-center gap-3 text-brand-green font-bold text-lg hover:text-action-green transition-all"
          >
            <span>Vedi tutti gli annunci disponibili</span>
          </button>
        </div>
      </div>
    </section>
  );
};
