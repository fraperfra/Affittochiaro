/**
 * Utilità per le pagine pubbliche (listing, guide, servizi).
 * Non duplica le funzioni già in src/utils/formatters.ts.
 */

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildListingUrl(
  regione: string,
  comune: string,
  tipologia?: string,
  slug?: string,
): string {
  const base = `/case-e-stanze-in-affitto/${regione}/${comune}`;
  if (tipologia && slug) return `${base}/${tipologia}/${slug}`;
  if (tipologia) return `${base}/${tipologia}`;
  return base;
}

export function formatPrice(price: number): string {
  return `€ ${price.toLocaleString('it-IT')}/mese`;
}

export function formatDateIt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const PRICE_RANGE_START = 200;
const PRICE_RANGE_STEP = 50;
const PRICE_RANGE_LIMIT = 2000;

export const PRICE_RANGES = (() => {
  const ranges: { value: string; label: string }[] = [];
  for (let min = PRICE_RANGE_START; min < PRICE_RANGE_LIMIT; min += PRICE_RANGE_STEP) {
    const max = min + PRICE_RANGE_STEP;
    ranges.push({
      value: `${min}-${max}`,
      label: `€${min.toLocaleString('it-IT')} – €${max.toLocaleString('it-IT')}`,
    });
  }
  ranges.push({
    value: `${PRICE_RANGE_LIMIT}+`,
    label: `Oltre €${PRICE_RANGE_LIMIT.toLocaleString('it-IT')}`,
  });
  return ranges;
})();

export function matchesPriceRange(amount: number, rangeValue: string): boolean {
  if (!rangeValue) return true;
  if (rangeValue.endsWith('+')) {
    return amount >= parseInt(rangeValue, 10);
  }
  const [minStr, maxStr] = rangeValue.split('-');
  const min = parseInt(minStr, 10);
  const max = parseInt(maxStr, 10);
  return amount >= min && amount < max;
}
