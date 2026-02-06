/**
 * Sezione garanti/fideiussioni del CV
 */

import { CVGuarantor, GUARANTOR_TYPE_LABELS } from '@/types/cv';
import { Shield, CheckCircle2, Clock, Plus, Phone, Mail } from 'lucide-react';

interface CVGuarantorsSectionProps {
  guarantors: CVGuarantor[];
  onAdd?: () => void;
  editable?: boolean;
}

export default function CVGuarantorsSection({ guarantors, onAdd, editable = false }: CVGuarantorsSectionProps) {
  const formatIncome = (income?: number) => {
    if (!income) return null;
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(income);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Shield size={20} className="text-primary-500" />
          Garanzie
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

      {guarantors.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Shield size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-text-secondary">Nessun garante o fideiussione inserita</p>
          {editable && (
            <p className="text-xs text-text-secondary mt-1">
              Aggiungi un garante per rafforzare la tua candidatura
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {guarantors.map((g) => (
            <div
              key={g.id}
              className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">{g.fullName}</p>
                    {g.isVerified ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 size={12} /> Verificato
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-yellow-600">
                        <Clock size={12} /> In attesa
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {GUARANTOR_TYPE_LABELS[g.type]} - {g.relationship}
                  </p>
                </div>
                {g.documentUploaded && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                    Documento allegato
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-text-secondary">
                {g.occupation && (
                  <span>Professione: {g.occupation}</span>
                )}
                {g.annualIncome && (
                  <span>Reddito: {formatIncome(g.annualIncome)}/anno</span>
                )}
                {g.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={10} /> {g.phone}
                  </span>
                )}
                {g.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={10} /> {g.email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
