/**
 * Sezione referenze del CV
 */

import { TenantReference } from '@/types/tenant';
import { Star, CheckCircle2, Clock, UserCheck, Plus } from 'lucide-react';

interface CVReferencesSectionProps {
  references: TenantReference[];
  onAdd?: () => void;
  editable?: boolean;
}

export default function CVReferencesSection({ references, onAdd, editable = false }: CVReferencesSectionProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
      />
    ));
  };

  return (
    <div id="section-references">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <UserCheck size={20} className="text-primary-500" />
          Referenze
        </h3>
        {editable && onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            <Plus size={16} />
            Richiedi
          </button>
        )}
      </div>

      {references.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <UserCheck size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-text-secondary">Nessuna referenza ricevuta</p>
          {editable && (
            <p className="text-xs text-text-secondary mt-1">
              Chiedi ai tuoi precedenti proprietari di lasciarti una referenza
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">{ref.landlordName}</p>
                    {ref.isVerified ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <Clock size={14} className="text-yellow-500" />
                    )}
                  </div>
                  {ref.propertyAddress && (
                    <p className="text-xs text-text-secondary mt-0.5">{ref.propertyAddress}</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {renderStars(ref.rating)}
                </div>
              </div>

              {ref.rentalPeriod && (
                <p className="text-xs text-text-secondary mt-2">
                  Periodo: {formatDate(ref.rentalPeriod.start)} - {formatDate(ref.rentalPeriod.end)}
                </p>
              )}

              {ref.comment && (
                <p className="mt-2 text-sm text-text-primary italic bg-gray-50 rounded-lg p-3">
                  "{ref.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
