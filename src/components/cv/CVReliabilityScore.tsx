/**
 * Badge/Card del punteggio di affidabilita'
 */

import { TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CVReliabilityScoreProps {
  score: number;
  compact?: boolean;
}

export default function CVReliabilityScore({ score, compact = false }: CVReliabilityScoreProps) {
  const getConfig = (score: number) => {
    if (score >= 80) return {
      label: 'Eccellente',
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      icon: ShieldCheck,
      description: 'Profilo altamente affidabile',
    };
    if (score >= 60) return {
      label: 'Buono',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      icon: TrendingUp,
      description: 'Profilo affidabile, puo\' migliorare',
    };
    if (score >= 40) return {
      label: 'Sufficiente',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200',
      icon: TrendingUp,
      description: 'Completa il profilo per aumentare il punteggio',
    };
    return {
      label: 'Da completare',
      color: 'text-red-500',
      bg: 'bg-red-50 border-red-200',
      icon: AlertTriangle,
      description: 'Il profilo necessita di informazioni aggiuntive',
    };
  };

  const config = getConfig(score);
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg}`}>
        <Icon size={14} className={config.color} />
        <span className={`text-sm font-semibold ${config.color}`}>{score}</span>
        <span className={`text-xs ${config.color}`}>/ 100</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${config.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center`}>
            <Icon size={20} className={config.color} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">Punteggio affidabilita'</p>
            <p className={`text-lg font-bold ${config.color}`}>
              {score}/100 - {config.label}
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs text-text-secondary mt-2">{config.description}</p>
    </div>
  );
}
