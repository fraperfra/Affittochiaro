/**
 * Barra di completamento CV con dettaglio sezioni
 */

import { CVCompleteness, CV_SECTION_LABELS } from '@/types/cv';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface CVCompletenessBarProps {
  completeness: CVCompleteness;
  onSectionClick?: (sectionId: string) => void;
}

export default function CVCompletenessBar({ completeness, onSectionClick }: CVCompletenessBarProps) {
  const [expanded, setExpanded] = useState(false);

  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Completezza CV</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            {completeness.total < 50
              ? 'Il tuo CV ha bisogno di attenzione'
              : completeness.total < 80
              ? 'Buon inizio, continua a completare'
              : 'Ottimo! Il tuo CV e\' quasi completo'}
          </p>
        </div>
        <div className={`text-3xl font-bold ${completeness.total >= 80 ? 'text-green-600' : completeness.total >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
          {completeness.total}%
        </div>
      </div>

      {/* Progress bar principale */}
      <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getBarColor(completeness.total)}`}
          style={{ width: `${completeness.total}%` }}
        />
      </div>

      {/* Toggle dettagli */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
      >
        {expanded ? 'Nascondi dettagli' : 'Mostra dettagli sezioni'}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Dettaglio sezioni */}
      {expanded && (
        <div className="mt-4 space-y-3">
          {completeness.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick?.(section.id)}
              className="w-full text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {section.score === 100 ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <AlertCircle size={16} className={section.score > 0 ? 'text-yellow-500' : 'text-gray-300'} />
                  )}
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary-500 transition-colors">
                    {section.label}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getColor(section.score)}`}>
                  {section.score}%
                </span>
              </div>
              <div className="ml-6 w-[calc(100%-1.5rem)] bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${getBarColor(section.score)}`}
                  style={{ width: `${section.score}%` }}
                />
              </div>
              {section.missingFields.length > 0 && (
                <div className="ml-6 mt-1">
                  {section.missingFields.map((field, i) => (
                    <p key={i} className="text-xs text-text-secondary">
                      - {field}
                    </p>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
