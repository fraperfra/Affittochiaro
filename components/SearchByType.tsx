import React from 'react';
import { Home, BedSingle, Building2, Building, TreePine } from 'lucide-react';

const TIPOLOGIE = [
  { label: 'Appartamento', slug: 'appartamento', icon: Home,      annunci: 87,  color: 'brand-green' },
  { label: 'Stanza',       slug: 'stanza',       icon: BedSingle, annunci: 52,  color: 'trust-blue'  },
  { label: 'Bilocale',     slug: 'bilocale',     icon: Building2, annunci: 44,  color: 'action-green' },
  { label: 'Trilocale',    slug: 'trilocale',    icon: Building,  annunci: 31,  color: 'warning'     },
  { label: 'Villa',        slug: 'villa',        icon: TreePine,  annunci: 18,  color: 'error-red'   },
];

type Props = {
  onTypeSelect: (slug: string) => void;
  variant?: 'default' | 'hero';
};

export const SearchByType: React.FC<Props> = ({ onTypeSelect, variant = 'default' }) => {
  const isHero = variant === 'hero';

  return (
    <section className={isHero ? 'px-0' : 'bg-gray-50 border-b border-gray-100 py-16 px-4'}>
      <div className={isHero ? 'max-w-3xl mx-auto lg:mx-0' : 'max-w-7xl mx-auto'}>
        <div className={isHero ? 'text-center lg:text-left mb-5' : 'text-center mb-10'}>
          <h2 className={isHero ? 'text-xs font-bold text-medium-gray uppercase tracking-wider mb-2' : 'text-2xl md:text-3xl font-bold text-brand-green mb-2'}>
            Cosa stai cercando?
          </h2>
          <p className={isHero ? 'text-sm text-medium-gray max-w-xl mx-auto lg:mx-0' : 'text-medium-gray'}>
            Seleziona la tipologia e la città. Ti mostriamo subito gli annunci disponibili.
          </p>
        </div>

        <div className={isHero ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'}>
          {TIPOLOGIE.map(({ label, slug, icon: Icon, annunci }) => (
            <button
              key={slug}
              type="button"
              onClick={() => onTypeSelect(slug)}
              className={isHero
                ? 'group flex items-center justify-start gap-2.5 bg-white border border-gray-200 hover:border-action-green hover:bg-soft-green rounded-xl px-3 py-2.5 transition-all active:scale-[0.98] cursor-pointer text-left'
                : 'group flex flex-col items-center gap-3 bg-white border border-gray-200 hover:border-action-green rounded-2xl p-5 transition-all hover:shadow-medium active:scale-[0.97] cursor-pointer'}
            >
              <div className={isHero ? 'w-8 h-8 rounded-lg bg-soft-green flex items-center justify-center group-hover:bg-action-green transition-colors flex-shrink-0' : 'w-12 h-12 rounded-xl bg-soft-green flex items-center justify-center group-hover:bg-action-green transition-colors'}>
                <Icon
                  size={isHero ? 16 : 24}
                  className="text-brand-green group-hover:text-white transition-colors"
                />
              </div>
              <div className={isHero ? 'flex flex-col items-start leading-tight' : 'flex flex-col items-center'}>
                <span className="font-bold text-sm text-brand-green">{label}</span>
                <span className="text-xs text-medium-gray">{annunci} annunci</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
