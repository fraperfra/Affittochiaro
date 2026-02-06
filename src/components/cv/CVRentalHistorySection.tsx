/**
 * Sezione storia abitativa del CV
 */

import { CVRentalEntry } from '@/types/cv';
import { Home, MapPin, Calendar, ArrowRight, Plus } from 'lucide-react';

interface CVRentalHistorySectionProps {
  entries: CVRentalEntry[];
  onAdd?: () => void;
  editable?: boolean;
}

export default function CVRentalHistorySection({ entries, onAdd, editable = false }: CVRentalHistorySectionProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDuration = (start: Date, end?: Date) => {
    const endDate = end ? new Date(end) : new Date();
    const months = Math.round(
      (endDate.getTime() - new Date(start).getTime()) / (30.44 * 24 * 60 * 60 * 1000)
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0) {
      return `${years}a ${remainingMonths}m`;
    }
    return `${remainingMonths}m`;
  };

  return (
    <div id="section-rental_history">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Home size={20} className="text-primary-500" />
          Storia abitativa
        </h3>
        {editable && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            <Plus size={16} />
            Aggiungi
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Home size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-text-secondary">Nessun affitto precedente inserito</p>
          {editable && (
            <p className="text-xs text-text-secondary mt-1">
              Aggiungi la tua storia abitativa per aumentare la credibilita'
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {entries
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      entry.isCurrent ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <MapPin size={16} className={entry.isCurrent ? 'text-green-500' : 'text-gray-400'} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{entry.address}</p>
                      <p className="text-xs text-text-secondary">{entry.city}{entry.province ? ` (${entry.province})` : ''}</p>
                    </div>
                  </div>
                  {entry.isCurrent && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Attuale
                    </span>
                  )}
                  {entry.hasReference && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Con referenza
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(entry.startDate)}
                    <ArrowRight size={10} />
                    {entry.endDate ? formatDate(entry.endDate) : 'Presente'}
                  </div>
                  <span className="text-gray-300">|</span>
                  <span>{calculateDuration(entry.startDate, entry.endDate)}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-medium text-text-primary">{formatCurrency(entry.monthlyRent)}/mese</span>
                </div>

                {entry.reasonForLeaving && (
                  <p className="mt-2 text-xs text-text-secondary">
                    Motivo fine contratto: {entry.reasonForLeaving}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
