/**
 * Sezione situazione lavorativa del CV
 */

import { CVEmploymentInfo, EMPLOYMENT_TYPE_LABELS } from '@/types/cv';
import { Briefcase, Building2, DollarSign, Calendar } from 'lucide-react';

interface CVEmploymentSectionProps {
  data: CVEmploymentInfo;
  showIncome?: boolean;
}

export default function CVEmploymentSection({ data, showIncome = true }: CVEmploymentSectionProps) {
  const formatIncome = (income?: number) => {
    if (!income) return '-';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(income);
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('it-IT', {
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateTenure = (startDate?: Date) => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const now = new Date();
    const years = Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(((now.getTime() - start.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    if (years > 0) return `${years} ann${years === 1 ? 'o' : 'i'}${months > 0 ? ` e ${months} mes${months === 1 ? 'e' : 'i'}` : ''}`;
    return `${months} mes${months === 1 ? 'e' : 'i'}`;
  };

  const tenure = calculateTenure(data.employmentStartDate);

  return (
    <div id="section-employment">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Briefcase size={20} className="text-primary-500" />
        Situazione lavorativa
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.occupation && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Briefcase size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Professione</p>
              <p className="text-sm font-medium text-text-primary">{data.occupation}</p>
              {data.employmentType && (
                <p className="text-xs text-text-secondary mt-0.5">
                  {EMPLOYMENT_TYPE_LABELS[data.employmentType] || data.employmentType}
                </p>
              )}
            </div>
          </div>
        )}

        {data.employer && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Building2 size={16} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Azienda</p>
              <p className="text-sm font-medium text-text-primary">{data.employer}</p>
              {data.sector && (
                <p className="text-xs text-text-secondary mt-0.5">{data.sector}</p>
              )}
            </div>
          </div>
        )}

        {showIncome && data.incomeVisible && data.annualIncome && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <DollarSign size={16} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Reddito annuo lordo</p>
              <p className="text-sm font-medium text-text-primary">{formatIncome(data.annualIncome)}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {formatIncome(data.annualIncome / 12)}/mese
              </p>
            </div>
          </div>
        )}

        {data.employmentStartDate && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">In servizio da</p>
              <p className="text-sm font-medium text-text-primary">
                {formatDate(data.employmentStartDate)}
              </p>
              {tenure && (
                <p className="text-xs text-green-600 mt-0.5">{tenure} di anzianita'</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
