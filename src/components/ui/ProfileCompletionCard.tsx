import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Briefcase,
  FileText,
  Camera,
  Video,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  TrendingUp,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

interface ProfileSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  weight: number;
  isComplete: boolean;
  link: string;
  tip: string;
}

interface ProfileCompletionCardProps {
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    birthDate?: string;
    occupation?: string;
    employmentType?: string;
    monthlyIncome?: string;
    bio?: string;
    avatar?: string;
    hasVideo?: boolean;
    isVerified?: boolean;
    preferences?: {
      preferredCity?: string;
      maxBudget?: string;
    };
  } | null;
}

export function ProfileCompletionCard({ profile }: ProfileCompletionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profile) return null;

  // Calculate sections
  const sections: ProfileSection[] = [
    {
      id: 'personal',
      label: 'Dati Personali',
      icon: <User size={16} />,
      weight: 20,
      isComplete: !!(profile.firstName && profile.lastName && profile.phone),
      link: ROUTES.TENANT_PROFILE,
      tip: 'Nome, cognome e telefono',
    },
    {
      id: 'employment',
      label: 'Lavoro',
      icon: <Briefcase size={16} />,
      weight: 25,
      isComplete: !!(profile.occupation && profile.employmentType && profile.monthlyIncome),
      link: ROUTES.TENANT_PROFILE,
      tip: 'Occupazione e reddito',
    },
    {
      id: 'bio',
      label: 'Presentazione',
      icon: <FileText size={16} />,
      weight: 20,
      isComplete: !!(profile.bio && profile.bio.length >= 50),
      link: ROUTES.TENANT_PROFILE,
      tip: 'Almeno 50 caratteri',
    },
    {
      id: 'photo',
      label: 'Foto Profilo',
      icon: <Camera size={16} />,
      weight: 15,
      isComplete: !!profile.avatar,
      link: ROUTES.TENANT_PROFILE,
      tip: 'Una foto aumenta la fiducia',
    },
    {
      id: 'video',
      label: 'Video Presentazione',
      icon: <Video size={16} />,
      weight: 20,
      isComplete: !!profile.hasVideo,
      link: ROUTES.TENANT_PROFILE,
      tip: 'I profili con video hanno 5x piu risposte',
    },
  ];

  // Calculate completion percentage
  const completedWeight = sections
    .filter(s => s.isComplete)
    .reduce((sum, s) => sum + s.weight, 0);
  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const completionPercentage = Math.round((completedWeight / totalWeight) * 100);

  // Get color based on percentage
  const getColor = () => {
    if (completionPercentage >= 80) return { bg: 'bg-green-500', text: 'text-green-500', bgLight: 'bg-green-50' };
    if (completionPercentage >= 50) return { bg: 'bg-amber-500', text: 'text-amber-500', bgLight: 'bg-amber-50' };
    return { bg: 'bg-red-500', text: 'text-red-500', bgLight: 'bg-red-50' };
  };

  const colors = getColor();
  const incompleteSections = sections.filter(s => !s.isComplete);

  // Get status message
  const getStatusMessage = () => {
    if (completionPercentage >= 100) return { emoji: '🎉', text: 'Profilo completo! Le agenzie ti noteranno sicuramente.' };
    if (completionPercentage >= 80) return { emoji: '🌟', text: 'Ottimo lavoro! Il tuo profilo e quasi perfetto.' };
    if (completionPercentage >= 50) return { emoji: '💪', text: 'Buon inizio! Completa il profilo per piu visibilita.' };
    return { emoji: '⚠️', text: 'Profilo incompleto. Le agenzie potrebbero non trovarti.' };
  };

  const status = getStatusMessage();

  return (
    <div className={`rounded-2xl border ${completionPercentage < 50 ? 'border-red-200 bg-red-50/50' : 'border-border bg-white'} overflow-hidden`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{status.emoji}</span>
            <h3 className="font-semibold text-text-primary">Completamento Profilo</h3>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${colors.bgLight}`}>
            {completionPercentage >= 80 ? (
              <Star size={14} className={colors.text} />
            ) : (
              <TrendingUp size={14} className={colors.text} />
            )}
            <span className={`text-sm font-bold ${colors.text}`}>{completionPercentage}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full ${colors.bg} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <p className="text-sm text-text-secondary">{status.text}</p>
      </div>

      {/* Sections List */}
      {completionPercentage < 100 && (
        <div className="border-t border-border">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-text-secondary hover:bg-background-secondary transition-colors"
          >
            <span>
              {incompleteSections.length} {incompleteSections.length === 1 ? 'sezione da completare' : 'sezioni da completare'}
            </span>
            <ArrowRight
              size={16}
              className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>

          {isExpanded && (
            <div className="px-4 pb-4 space-y-2">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  to={section.link}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    section.isComplete
                      ? 'bg-green-50 text-green-700'
                      : 'bg-background-secondary hover:bg-background-tertiary'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    section.isComplete ? 'bg-green-100' : 'bg-white'
                  }`}>
                    {section.isComplete ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      section.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{section.label}</p>
                    <p className="text-xs text-text-muted">{section.tip}</p>
                  </div>
                  {!section.isComplete && (
                    <span className="text-xs font-medium text-primary-500">+{section.weight}%</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA for incomplete profiles */}
      {completionPercentage < 80 && (
        <div className="px-4 pb-4">
          <Link
            to={ROUTES.TENANT_PROFILE}
            className="block w-full py-3 bg-primary-500 text-white text-center rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            Completa il tuo profilo
          </Link>
        </div>
      )}
    </div>
  );
}
