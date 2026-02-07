import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Send,
  Star,
  FileText,
  Video,
  Upload,
  Search,
  ArrowRight,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore, useCVStore } from '../../store';
import { TenantUser } from '../../types';
import { ROUTES } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, Button, StatCard, Badge, ProfileCompletionCard } from '../../components/ui';

// Mock recent activity
const recentActivity = [
  {
    id: 1,
    type: 'view',
    message: 'Immobiliare Centrale ha visualizzato il tuo profilo',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: '👁️',
  },
  {
    id: 2,
    type: 'match',
    message: 'Hai un nuovo match con Casa Milano',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    icon: '⭐',
  },
  {
    id: 3,
    type: 'application',
    message: 'La tua candidatura e stata inviata',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: '📩',
  },
  {
    id: 4,
    type: 'document',
    message: 'Documento verificato con successo',
    time: new Date(Date.now() - 48 * 60 * 60 * 1000),
    icon: '✅',
  },
];

export default function TenantDashboardPage() {
  const { user } = useAuthStore();
  const { cv, loadCV } = useCVStore();
  const tenantUser = user as TenantUser;
  const [localProfile, setLocalProfile] = useState<any>(null);

  // Try to load profile from localStorage (for users registered via modal)
  useEffect(() => {
    const currentUser = localStorage.getItem('affittochiaro_current_user');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (parsed.profile) {
        setLocalProfile(parsed.profile);
      }
    }
  }, []);

  // Load CV for completeness data
  useEffect(() => {
    if (tenantUser?.id && !cv) {
      loadCV(tenantUser.id);
    }
  }, [tenantUser?.id, cv, loadCV]);

  // Use localStorage profile if available, otherwise use store profile
  const profile = localProfile || tenantUser?.profile;
  const profileCompleteness = profile?.completionPercentage || profile?.profileCompleteness || 0;

  // Calculate a more accurate completion percentage
  const calculateCompletion = () => {
    if (!profile) return 0;

    const fields = [
      { value: profile.firstName, weight: 10 },
      { value: profile.lastName, weight: 10 },
      { value: profile.phone, weight: 8 },
      { value: profile.occupation, weight: 15 },
      { value: profile.employmentType, weight: 10 },
      { value: profile.monthlyIncome, weight: 15 },
      { value: profile.bio, weight: 15 },
      { value: profile.avatarUrl, weight: 10 },
      { value: profile.hasVideo, weight: 12 },
      { value: profile.preferences?.preferredCity, weight: 5 },
    ];

    const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
    const completedWeight = fields.reduce((sum, f) => {
      if (typeof f.value === 'string' && f.value.trim()) return sum + f.weight;
      if (typeof f.value === 'boolean' && f.value) return sum + f.weight;
      return sum;
    }, 0);

    return Math.round((completedWeight / totalWeight) * 100);
  };

  const calculatedCompletion = profile ? calculateCompletion() : profileCompleteness;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-teal-600 to-primary-500 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Benvenuto, {profile?.firstName || tenantUser?.profile?.firstName || 'Utente'}!
            </h1>
            <p className="text-white/80">
              {calculatedCompletion >= 100
                ? 'Il tuo profilo e completo. Sei pronto per trovare casa!'
                : calculatedCompletion >= 80
                  ? 'Ottimo lavoro! Il tuo profilo e quasi completo.'
                  : `Il tuo profilo e completo al ${calculatedCompletion}%`}
            </p>
            {calculatedCompletion < 100 && (
              <div className="mt-3">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden w-64">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      calculatedCompletion >= 80 ? 'bg-green-400' : calculatedCompletion >= 50 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${calculatedCompletion}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {calculatedCompletion < 80 && (
            <Link to={ROUTES.TENANT_PROFILE}>
              <Button variant="secondary" rightIcon={<ArrowRight size={18} />}>
                Completa il profilo
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Alert for low completion */}
      {calculatedCompletion < 50 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <p className="font-medium text-red-700">Attenzione: il tuo profilo e incompleto</p>
            <p className="text-sm text-red-600 mt-1">
              Le agenzie potrebbero non visualizzare il tuo profilo. Completa almeno il 50% per essere visibile nei risultati di ricerca.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👁️"
          label="Visualizzazioni Profilo"
          value={profile?.profileViews ?? (calculatedCompletion >= 50 ? 127 : 3)}
          change={calculatedCompletion >= 50 ? 12 : undefined}
          changeLabel={calculatedCompletion >= 50 ? "vs mese scorso" : undefined}
        />
        <StatCard
          icon="📩"
          label="Candidature Inviate"
          value={profile?.applicationsSent ?? 8}
        />
        <StatCard
          icon={<Star className="text-yellow-500" size={28} />}
          label="Match Ricevuti"
          value={profile?.matchesReceived ?? (calculatedCompletion >= 50 ? 3 : 0)}
        />
        <StatCard
          icon="📄"
          label="CV Completezza"
          value={cv ? `${cv.completeness.total}%` : `${calculatedCompletion}%`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attivita Recenti</CardTitle>
              <Link to={ROUTES.TENANT_NOTIFICATIONS} className="text-sm text-primary-500 hover:text-primary-600">
                Vedi tutte
              </Link>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-4 ${
                  index < recentActivity.length - 1 ? 'pb-4 border-b border-border' : ''
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background-secondary flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary">{activity.message}</p>
                  <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                    <Clock size={12} />
                    {formatRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Completion Card */}
        <div className="space-y-6">
          <ProfileCompletionCard profile={profile} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Azioni Rapide</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {!profile?.hasVideo && (
                <Link
                  to={ROUTES.TENANT_PROFILE}
                  className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Video size={20} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-primary-600">Aggiungi Video</p>
                    <p className="text-sm text-text-muted">+78% risposte</p>
                  </div>
                  <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
                </Link>
              )}

              <Link
                to={ROUTES.TENANT_DOCUMENTS}
                className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Upload size={20} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:text-primary-600">Carica Documenti</p>
                  <p className="text-sm text-text-muted">Gestisci i tuoi documenti</p>
                </div>
                <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
              </Link>

              <Link
                to={ROUTES.TENANT_PROFILE}
                className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileText size={20} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:text-primary-600">Il Mio Profilo</p>
                  <p className="text-sm text-text-muted">{cv ? `${cv.completeness.total}% completo` : 'Gestisci il tuo profilo'}</p>
                </div>
                <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
              </Link>

              <Link
                to={ROUTES.TENANT_LISTINGS}
                className="flex items-center gap-4 p-4 rounded-xl bg-background-secondary hover:bg-primary-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Search size={20} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:text-primary-600">Cerca Casa</p>
                  <p className="text-sm text-text-muted">15.243 annunci</p>
                </div>
                <ArrowRight size={18} className="text-text-muted group-hover:text-primary-500" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle>I tuoi Badge</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-3">
          {(profile?.isVerified || tenantUser?.profile?.isVerified) && (
            <Badge variant="success" size="md">✓ Profilo Verificato</Badge>
          )}
          {(profile?.hasVideo || tenantUser?.profile?.hasVideo) && (
            <Badge variant="info" size="md">🎥 Video Presentazione</Badge>
          )}
          {calculatedCompletion >= 80 && (
            <Badge variant="primary" size="md">⭐ Profilo Completo</Badge>
          )}
          {calculatedCompletion >= 50 && calculatedCompletion < 80 && (
            <Badge variant="warning" size="md">📝 In Costruzione</Badge>
          )}
          {!(profile?.isVerified || tenantUser?.profile?.isVerified) && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background-secondary rounded-full text-sm text-text-muted">
              <span>🔒</span>
              <span>Verifica il profilo per sbloccare</span>
            </div>
          )}
        </div>
      </Card>

      {/* Tips for improving profile visibility */}
      {calculatedCompletion < 100 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Vuoi piu visibilita?</h3>
              <p className="text-sm text-amber-700 mb-3">
                I profili completi ricevono in media 3 volte piu visualizzazioni e 5 volte piu risposte dalle agenzie.
              </p>
              <div className="flex flex-wrap gap-2">
                {!profile?.bio && (
                  <span className="px-2 py-1 bg-white rounded-lg text-xs text-amber-700">+ Aggiungi presentazione</span>
                )}
                {!profile?.hasVideo && (
                  <span className="px-2 py-1 bg-white rounded-lg text-xs text-amber-700">+ Carica video</span>
                )}
                {!profile?.avatarUrl && (
                  <span className="px-2 py-1 bg-white rounded-lg text-xs text-amber-700">+ Aggiungi foto</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
