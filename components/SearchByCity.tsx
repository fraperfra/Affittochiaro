import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { buildListingUrl } from '../src/lib/utils';

const CITTA_IN_EVIDENZA = [
  { nome: 'Milano',        slug: 'milano',        regione: 'lombardia',      annunci: 124 },
  { nome: 'Roma',          slug: 'roma',           regione: 'lazio',          annunci: 98  },
  { nome: 'Bologna',       slug: 'bologna',        regione: 'emilia-romagna', annunci: 67  },
  { nome: 'Torino',        slug: 'torino',         regione: 'piemonte',       annunci: 54  },
  { nome: 'Firenze',       slug: 'firenze',        regione: 'toscana',        annunci: 43  },
  { nome: 'Reggio Emilia', slug: 'reggio-emilia',  regione: 'emilia-romagna', annunci: 21  },
];

export const SearchByCity: React.FC = () => {
  return (
    <section className="bg-white border-b border-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-green mb-1">
              Cerca nella tua città
            </h2>
            <p className="text-medium-gray text-sm">
              Annunci verificati in tutta Italia, aggiornati ogni giorno.
            </p>
          </div>
          <Link
            to="/case-e-stanze-in-affitto"
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-action-green hover:text-brand-green transition-colors"
          >
            Tutte le città
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CITTA_IN_EVIDENZA.map(({ nome, slug, regione, annunci }) => (
            <Link
              key={slug}
              to={buildListingUrl(regione, slug)}
              className="group flex flex-col gap-2 bg-gray-50 hover:bg-soft-green border border-gray-200 hover:border-action-green rounded-2xl p-4 transition-all hover:shadow-medium active:scale-[0.97]"
            >
              <div className="flex items-center gap-1.5 text-xs text-medium-gray mb-1">
                <MapPin size={12} className="text-action-green flex-shrink-0" />
                <span className="capitalize truncate">
                  {regione.replace(/-/g, ' ')}
                </span>
              </div>
              <span className="font-bold text-brand-green text-sm leading-tight">{nome}</span>
              <span className="text-xs text-medium-gray mt-auto">
                {annunci} annunci
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
