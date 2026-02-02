import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

// Currency formatting
export function formatCurrency(
  amount: number,
  options: { showDecimals?: boolean; currency?: string } = {}
): string {
  const { showDecimals = false, currency = 'EUR' } = options;

  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

// Number formatting
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('it-IT').format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// Percentage formatting
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// Date formatting
export function formatDate(
  date: Date | string | null | undefined,
  formatString = 'dd/MM/yyyy'
): string {
  if (!date) return '-';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(parsedDate)) return '-';

  return format(parsedDate, formatString, { locale: it });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return '-';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(parsedDate)) return '-';

  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: it });
}

// Phone formatting
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Italian phone format
  if (digits.startsWith('39') && digits.length === 12) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phone;
}

// File size formatting
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

// Name formatting
export function formatFullName(firstName?: string, lastName?: string): string {
  return [firstName, lastName].filter(Boolean).join(' ') || '-';
}

export function formatInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
}

// Address formatting
export function formatAddress(address: {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}): string {
  const parts = [
    address.street,
    [address.postalCode, address.city].filter(Boolean).join(' '),
    address.province ? `(${address.province})` : null,
  ].filter(Boolean);

  return parts.join(', ') || '-';
}

// Duration formatting (for video)
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Square meters formatting
export function formatSquareMeters(sqm: number): string {
  return `${formatNumber(sqm)} m²`;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

// Pluralize (Italian)
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
