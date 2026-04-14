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
        <div className={isHero ? 'text-center lg:text-left mb-4' : 'text-center mb-10'}>
          <h2 className={isHero ? 'text-lg md:text-xl font-bold text-brand-green uppercase tracking-[0.08em] mb-2' : 'text-2xl md:text-3xl font-bold text-brand-green mb-2'}>
            Cosa stai cercando?
          </h2>
          <p className={isHero ? 'text-sm md:text-base text-medium-gray max-w-xl mx-auto lg:mx-0 leading-relaxed' : 'text-medium-gray'}>
            Seleziona la tipologia e la città. Ti mostriamo subito gli annunci disponibili.
          </p>
        </div>

        {!isHero && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TIPOLOGIE.map(({ label, slug, icon: Icon, annunci }) => (
            <button
              key={slug}
              type="button"
              onClick={() => onTypeSelect(slug)}
              className="group flex flex-col items-center gap-3 bg-white border border-gray-200 hover:border-action-green rounded-2xl p-5 transition-all hover:shadow-medium active:scale-[0.97] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-soft-green flex items-center justify-center group-hover:bg-action-green transition-colors">
                <Icon
                  size={24}
                  className="text-brand-green group-hover:text-white transition-colors"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-sm text-brand-green">{label}</span>
                <span className="text-xs text-medium-gray">{annunci} annunci</span>
              </div>
            </button>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};
