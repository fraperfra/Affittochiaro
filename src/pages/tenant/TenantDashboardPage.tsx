import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Send,
  FileText,
  Video,
  Upload,
  Search,
  ArrowRight,
  Clock,
  TrendingUp,
  AlertCircle,
  Calculator,
  Euro,
  Info,
  ChevronDown,
  Sparkles,
  Camera,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { useAuthStore, useCVStore } from '../../store';
import { TenantUser } from '../../types';
import { ROUTES } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import { Card, CardHeader, CardTitle, Button, Badge, ProfileCompletionCard } from '../../components/ui';

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

function BudgetCalculatorCard() {
  const [rent, setRent] = useState(800);
  const [depositMonths, setDepositMonths] = useState(3);
  const [includeCurrentMonth, setIncludeCurrentMonth] = useState(true);
  const [includeAgency, setIncludeAgency] = useState(true);
  const [agencyMode, setAgencyMode] = useState<'month' | 'custom'>('month');
  const [agencyPercent, setAgencyPercent] = useState(10);

  const [isExpanded, setIsExpanded] = useState(false);

  const totals = useMemo(() => {
    const deposit = rent * depositMonths;
    const currentMonth = includeCurrentMonth ? rent : 0;
    const agencyFee = !includeAgency
      ? 0
      : agencyMode === 'month'
        ? rent
        : Math.round((rent * 12 * agencyPercent) / 100);
    const total = deposit + currentMonth + agencyFee;
    return { deposit, currentMonth, agencyFee, total };
  }, [rent, depositMonths, includeCurrentMonth, includeAgency, agencyMode, agencyPercent]);

  const formatCurrency = (n: number) =>
    n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <Card className="overflow-hidden transition-all duration-300">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Calculator size={20} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-text-primary">Budget Ingresso Casa</h3>
            <p className="text-sm font-sans text-text-muted">
              {isExpanded ? 'Calcola quanto ti serve per entrare in casa' : `Stima totale: ${formatCurrency(totals.total)}`}
            </p>
          </div>
        </div>
        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-text-muted" />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              {/* Affitto mensile */}
              <div>
                <label className="block text-sm font-medium font-sans text-text-primary mb-1.5">
                  Affitto mensile
                </label>
                <div className="relative">
                  <Euro size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="number"
                    value={rent}
                    onChange={e => setRent(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white font-sans text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
                    min={0}
                    step={50}
                  />
                </div>
              </div>

              {/* Mesi di cauzione */}
              <div>
                <label className="block text-sm font-medium font-sans text-text-primary mb-1.5">
                  Mesi di cauzione
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(m => (
                    <button
                      key={m}
                      onClick={() => setDepositMonths(m)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-sans font-medium transition-all ${depositMonths === m
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-background-secondary text-text-primary hover:bg-primary-50'
                        }`}
                    >
                      {m} {m === 1 ? 'mese' : 'mesi'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mese corrente */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={includeCurrentMonth}
                    onChange={e => setIncludeCurrentMonth(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-500 transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-sm font-sans text-text-primary group-hover:text-primary-600 transition-colors">
                  Includi primo mese di affitto
                </span>
              </label>

              {/* Provvigione agenzia */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group mb-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={includeAgency}
                      onChange={e => {
                        setIncludeAgency(e.target.checked);
                        if (e.target.checked) setAgencyMode('month');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-500 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-sm font-sans text-text-primary group-hover:text-primary-600 transition-colors">
                    Provvigione agenzia
                  </span>
                </label>
                {includeAgency && (
                  <div className="ml-[52px] space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAgencyMode('month')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-all ${agencyMode === 'month'
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-background-secondary text-text-primary hover:bg-primary-50'
                          }`}
                      >
                        1 mese
                      </button>
                      <button
                        onClick={() => setAgencyMode('custom')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition-all ${agencyMode === 'custom'
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-background-secondary text-text-muted hover:bg-primary-50 hover:text-text-primary'
                          }`}
                      >
                        Altro ({agencyPercent}%)
                      </button>
                    </div>
                    {agencyMode === 'custom' && (
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={5}
                            max={15}
                            step={1}
                            value={agencyPercent}
                            onChange={e => setAgencyPercent(Number(e.target.value))}
                            className="flex-1 accent-primary-500 h-2"
                          />
                          <span className="text-sm font-sans font-semibold text-primary-600 w-10 text-right">
                            {agencyPercent}%
                          </span>
                        </div>
                        <p className="text-xs font-sans text-text-muted mt-1">
                          del canone annuo ({formatCurrency(rent * 12)})
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-sans">
                  <span className="text-sm text-text-muted">Cauzione ({depositMonths} {depositMonths === 1 ? 'mese' : 'mesi'})</span>
                  <span className="font-medium text-text-primary">{formatCurrency(totals.deposit)}</span>
                </div>
                {includeCurrentMonth && (
                  <div className="flex items-center justify-between font-sans">
                    <span className="text-sm text-text-muted">Primo mese</span>
                    <span className="font-medium text-text-primary">{formatCurrency(totals.currentMonth)}</span>
                  </div>
                )}
                {includeAgency && (
                  <div className="flex items-center justify-between font-sans">
                    <span className="text-sm text-text-muted">
                      Agenzia ({agencyMode === 'month' ? '1 mese' : `${agencyPercent}%`})
                    </span>
                    <span className="font-medium text-text-primary">{formatCurrency(totals.agencyFee)}</span>
                  </div>
                )}
                <div className="border-t border-primary-200 pt-3 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-poppins font-semibold text-text-primary">Totale necessario</span>
                    <span className="font-poppins text-2xl font-bold text-primary-600">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2 bg-white/60 rounded-xl p-3">
                <Info size={14} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="text-xs font-sans text-text-muted leading-relaxed">
                  Stima indicativa. L'importo effettivo puo variare in base alle condizioni contrattuali e alle richieste del proprietario.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function ProfileHeaderCard({
  profile,
  tenantUser,
  calculatedCompletion,
}: {
  profile: any;
  tenantUser: TenantUser;
  calculatedCompletion: number;
}) {
  const firstName = profile?.firstName || tenantUser?.profile?.firstName || 'Utente';
  const lastName = profile?.lastName || tenantUser?.profile?.lastName || '';
  const avatarUrl = profile?.avatarUrl || tenantUser?.profile?.avatarUrl;
  const occupation = profile?.occupation || tenantUser?.profile?.occupation;
  const city =
    profile?.preferences?.preferredCity ||
    profile?.city ||
    tenantUser?.profile?.city;
  const isVerified = profile?.isVerified ?? tenantUser?.profile?.isVerified;
  const hasVideo = profile?.hasVideo ?? tenantUser?.profile?.hasVideo;

  const getAge = (): number | null => {
    const dob = profile?.dateOfBirth || tenantUser?.profile?.dateOfBirth;
    if (!dob) return null;
    const d = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age > 0 ? age : null;
  };
  const age = getAge();
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Accent strip */}
      <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />

      <div className="p-4 md:p-5">
        <div className="flex items-start gap-4">

          {/* Avatar column */}
          <Link to={ROUTES.TENANT_PROFILE} className="relative shrink-0 group">
            <div className="w-[68px] h-[68px] md:w-[84px] md:h-[84px] rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-emerald-200 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-teal-700 select-none leading-none">
                  {initials || '?'}
                </span>
              )}
            </div>
            {/* Camera button */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow border-2 border-white group-hover:bg-teal-600 transition-colors">
              <Camera size={13} className="text-white" />
            </div>
            {/* "Aggiungi foto" nudge */}
            {!avatarUrl && (
              <p className="mt-3 text-center text-[10px] text-gray-400 leading-tight whitespace-nowrap">
                Aggiungi foto
              </p>
            )}
          </Link>

          {/* Info column */}
          <div className="flex-1 min-w-0">
            {/* Name + completion */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight truncate">
                  {firstName} {lastName}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Benvenuto! come va oggi? 🙂</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                calculatedCompletion >= 80
                  ? 'bg-green-100 text-green-700'
                  : calculatedCompletion >= 50
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-600'
              }`}>
                {calculatedCompletion}% completo
              </span>
            </div>

            {/* Info pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {occupation && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <Briefcase size={11} />
                  {occupation}
                </span>
              )}
              {age !== null && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <Calendar size={11} />
                  {age} anni
                </span>
              )}
              {city && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <MapPin size={11} />
                  {city}
                </span>
              )}
              {!occupation && !city && (
                <Link
                  to={ROUTES.TENANT_PROFILE}
                  className="text-xs text-teal-600 hover:underline"
                >
                  + Completa le tue info
                </Link>
              )}
            </div>

            {/* Badges */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} />
                  Verificato
                </span>
              ) : (
                <Link
                  to={ROUTES.TENANT_PROFILE}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-gray-50 text-gray-500 border border-dashed border-gray-300 px-2 py-0.5 rounded-full hover:border-teal-400 hover:text-teal-600 transition-colors"
                >
                  <Shield size={10} />
                  Verifica profilo
                </Link>
              )}
              {hasVideo && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  🎥 Video
                </span>
              )}
              {calculatedCompletion >= 80 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  ⭐ Profilo completo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {/* Profile Header */}
      <ProfileHeaderCard
        profile={profile}
        tenantUser={tenantUser}
        calculatedCompletion={calculatedCompletion}
      />

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

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Cerca Casa */}
        <Link
          to={ROUTES.TENANT_LISTINGS}
          className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <Search size={20} className="text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 group-hover:text-teal-600 transition-colors">Cerca Casa</p>
            <p className="text-xs text-gray-500 mt-0.5">15.243 annunci</p>
          </div>
        </Link>

        {/* Candidature inviate */}
        <div className="bg-white rounded-2xl shadow-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Send size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">Candidature</p>
              <p className="text-xs text-gray-500">{profile?.applicationsSent ?? 8} inviate</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <p className="text-xs text-gray-600 truncate">Bilocale Milano</p>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">In attesa</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <p className="text-xs text-gray-600 truncate">Trilocale Roma</p>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full shrink-0">Accettata</span>
            </div>
          </div>
        </div>

        {/* Visualizzazione profilo */}
        <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
            <Eye size={20} className="text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">Visualizzazioni</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {profile?.profileViews ?? (calculatedCompletion >= 50 ? 127 : 3)} questo mese
            </p>
          </div>
        </div>

        {/* Extra Visibilità */}
        <Link
          to={ROUTES.TENANT_SERVICES}
          className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-amber-500" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 group-hover:text-amber-600 transition-colors">Extra Visibilità</p>
            <p className="text-xs text-gray-500 mt-0.5">Potenzia il profilo</p>
          </div>
        </Link>

      </div>

      {/* Recent Activity + Profile Completion + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card>
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
                className={`flex items-start gap-4 ${index < recentActivity.length - 1 ? 'pb-4 border-b border-border' : ''
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

        {/* Profile Completion */}
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

      {/* Budget Calculator */}
      <BudgetCalculatorCard />

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
