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
