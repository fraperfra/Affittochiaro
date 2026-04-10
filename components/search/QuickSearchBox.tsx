import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { CITTA, type Citta } from '../../src/lib/geo-mock';
import { buildListingUrl } from '../../src/lib/utils';

const TIPOLOGIE = [
  { label: 'Appartamento',           slug: 'appartamento' },
  { label: 'Bilocale',               slug: 'bilocale'     },
  { label: 'Trilocale',              slug: 'trilocale'    },
  { label: 'Stanza singola',         slug: 'stanza'       },
  { label: 'Villa / Casa indipendente', slug: 'villa'     },
];

export type Props = {
  size?: 'large' | 'compact';
  className?: string;
  prefilledTipologia?: string | null;
  onTipologiaFilled?: () => void;
  cityInputRef?: React.RefObject<HTMLInputElement | null>;
};

export const QuickSearchBox: React.FC<Props> = ({
  size = 'large',
  className = '',
  prefilledTipologia,
  onTipologiaFilled,
  cityInputRef: externalRef,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [comuneSelezionato, setComuneSelezionato] = useState<Citta | null>(null);
  const [tipologia, setTipologia] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [cityError, setCityError] = useState(false);

  const internalRef = useRef<HTMLInputElement>(null);
  const cityInputRef = (externalRef ?? internalRef) as React.RefObject<HTMLInputElement>;
  const containerRef = useRef<HTMLDivElement>(null);

  // Prefill tipologia from parent
  useEffect(() => {
    if (prefilledTipologia != null) {
      setTipologia(prefilledTipologia);
      onTipologiaFilled?.();
    }
  }, [prefilledTipologia]);

  // Filter suggestions
  const filtered =
    query.length >= 2
      ? CITTA.filter((c) =>
          c.nome.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
      : [];

  const selectComune = (citta: Citta) => {
    setComuneSelezionato(citta);
    setQuery(citta.nome);
    setShowDropdown(false);
    setActiveIndex(-1);
    setCityError(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setComuneSelezionato(null);
    setShowDropdown(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) selectComune(filtered[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const onSubmit = () => {
    if (!comuneSelezionato) {
      setCityError(true);
      cityInputRef.current?.focus();
      return;
    }
    const url = buildListingUrl(comuneSelezionato.regione, comuneSelezionato.slug);
    navigate(url, {
      state: { filtri: { tipologia: tipologia || null } },
    });
  };

  const isLarge = size === 'large';

  return (
    <div className={`w-full ${className}`}>
      <div
        className={
          isLarge
            ? 'flex flex-col sm:flex-row gap-3 sm:gap-0 sm:bg-white sm:rounded-2xl sm:shadow-large sm:border sm:border-gray-200 sm:p-2'
            : 'flex flex-col sm:flex-row gap-3'
        }
      >
        {/* City combobox */}
        <div className="relative flex-1" ref={containerRef}>
          <div
            className={
              isLarge
                ? 'relative flex items-center sm:border-r sm:border-gray-200'
                : 'relative flex items-center bg-white border border-gray-200 rounded-xl'
            }
          >
            <MapPin size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              ref={cityInputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="In quale città cerchi casa?"
              aria-label="Città"
              role="combobox"
              aria-expanded={showDropdown && filtered.length > 0}
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
              }
              className={`w-full pl-9 pr-8 bg-transparent outline-none text-gray-800 placeholder-gray-400 ${
                isLarge ? 'py-3 text-base' : 'py-2.5 text-sm rounded-xl'
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setComuneSelezionato(null);
                  setCityError(false);
                  cityInputRef.current?.focus();
                }}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cancella città"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown suggestions */}
          {showDropdown && filtered.length > 0 && (
            <div
              role="listbox"
              aria-label="Suggerimenti città"
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-large overflow-hidden"
            >
              {filtered.map((citta, i) => (
                <div
                  key={citta.slug}
                  id={`city-option-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => selectComune(citta)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                    i === activeIndex
                      ? 'bg-soft-green text-brand-green'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{citta.nome}</span>
                  <span className="ml-auto text-xs text-gray-400 capitalize">
                    {citta.regione.replace(/-/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tipologia select */}
        <div className={isLarge ? 'relative sm:w-[220px]' : 'relative sm:w-[200px]'}>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={tipologia}
            onChange={(e) => setTipologia(e.target.value)}
            aria-label="Tipologia immobile"
            className={`w-full appearance-none bg-transparent outline-none cursor-pointer pr-8 ${
              isLarge
                ? 'py-3 pl-4 text-base sm:border-r sm:border-gray-200'
                : 'py-2.5 pl-3 text-sm bg-white border border-gray-200 rounded-xl'
            } ${!tipologia ? 'text-gray-400' : 'text-gray-800'}`}
          >
            <option value="">Qualsiasi tipologia</option>
            {TIPOLOGIE.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={onSubmit}
          className={`flex items-center justify-center gap-2 bg-brand-green hover:bg-black text-white font-bold uppercase tracking-wide transition-colors ${
            isLarge
              ? 'sm:w-[130px] py-3 px-5 rounded-xl text-sm'
              : 'w-full sm:w-auto py-2.5 px-5 rounded-xl text-sm'
          }`}
        >
          <Search size={15} />
          Cerca
        </button>
      </div>

      {/* City validation error */}
      {cityError && (
        <p className="mt-2 text-sm text-error-red pl-1">
          Inserisci la città in cui cerchi casa
        </p>
      )}
    </div>
  );
};
