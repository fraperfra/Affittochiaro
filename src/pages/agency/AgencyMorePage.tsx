import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  Bell,
  ChevronRight,
  Inbox,
  CreditCard,
  FileText,
  Calculator,
  ShieldCheck,
  UserCog,
  LifeBuoy,
  Star,
  Crown,
  Zap,
  LogOut,
  MapPin,
  Unlock,
  Sparkles,
  Check,
} from 'lucide-react';
import { AvatarUpload } from '../../components/ui';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../utils/constants';
import { formatInitials } from '../../utils/formatters';
import { AgencyUser } from '../../types';

const PLAN_LABELS: Record<string, string> = {
  free: 'Gratuito',
  base: 'Base',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

const PLAN_COLORS: Record<string, string> = {
  free: 'text-gray-500',
  base: 'text-blue-600',
  professional: 'text-teal-600',
  enterprise: 'text-purple-600',
};

export default function AgencyMorePage() {
  const { user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const agencyUser = user as AgencyUser | null;

  const [unreadApplications, setUnreadApplications] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('affittochiaro_agency_notifications');
    if (stored) {
      try {
        const notifications = JSON.parse(stored);
        setUnreadApplications(notifications.filter((n: { read: boolean }) => !n.read).length);
      } catch { /* ignore */ }
    }
  }, []);

  const name = agencyUser?.agency.name || 'Agenzia';
  const logo = agencyUser?.agency.logoUrl;

  const handleLogoUpload = (blobUrl: string) => {
    if (!agencyUser) return;
    setUser({ ...agencyUser, agency: { ...agencyUser.agency, logoUrl: blobUrl } } as AgencyUser);
  };
  const credits = agencyUser?.agency.credits ?? 0;
  const city = agencyUser?.agency.city || 'Italia';
  const plan = agencyUser?.agency.plan || 'free';
  const isUpgradeable = plan === 'free' || plan === 'base';

  // Sezioni del menu
  const menuSections = [
    {
      title: 'Strumenti',
      items: [
        { icon: Unlock,     label: 'Profili Sbloccati', path: ROUTES.AGENCY_UNLOCKED_PROFILES },
        { icon: FileText,   label: 'Documenti',         path: ROUTES.AGENCY_DOCUMENTS },
        { icon: Calculator, label: 'Calcolatori',       path: ROUTES.AGENCY_CALCULATORS },
        { icon: Sparkles,   label: 'Servizi',           path: ROUTES.AGENCY_SERVICES },
        { icon: CreditCard, label: 'Piano & Crediti',   path: ROUTES.AGENCY_PLAN },
      ],
    },
    {
      title: 'Impostazioni',
      items: [
        { icon: UserCog,    label: 'Account',    path: `${ROUTES.AGENCY_SETTINGS}?tab=account` },
        { icon: ShieldCheck,label: 'Sicurezza',  path: `${ROUTES.AGENCY_SETTINGS}?tab=security` },
        { icon: Bell,       label: 'Notifiche',  path: `${ROUTES.AGENCY_SETTINGS}?tab=notifications` },
        { icon: LifeBuoy,   label: 'Assistenza', path: `${ROUTES.AGENCY_SETTINGS}?tab=tickets` },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-8 pt-2">
      {/* Agency Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        {/* Profile row */}
        <div className="flex items-center gap-4 mb-6">
          <AvatarUpload
            src={logo}
            initials={formatInitials(name.split(' ')[0], name.split(' ')[1])}
            onUpload={handleLogoUpload}
            avatarClassName="w-16 h-16 text-xl"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">{name}</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={12} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-500 truncate">{city}</p>
            </div>
            <div className="mt-1">
              <span className={`text-xs font-semibold ${PLAN_COLORS[plan] || 'text-gray-500'}`}>
                Piano {PLAN_LABELS[plan] || plan}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Panoramica</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Inbox size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Candidature</p>
                <p className="text-sm font-semibold text-gray-900">
                  {unreadApplications > 0 ? `${unreadApplications} nuove` : 'Aggiornate'}
                </p>
              </div>
            </div>
            <div className="bg-orange-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <CreditCard size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Crediti</p>
                <p className="text-sm font-semibold text-gray-900">{credits}</p>
              </div>
            </div>
            <div className="bg-purple-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Crown size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Piano</p>
                <p className={`text-sm font-semibold ${PLAN_COLORS[plan] || 'text-gray-900'}`}>
                  {PLAN_LABELS[plan] || plan}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Banner — solo per piani free/base */}
      {isUpgradeable && (
        <div
          onClick={() => navigate(ROUTES.AGENCY_PLAN)}
          className="bg-gradient-to-r from-teal-500 to-primary-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
        >
          <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
            <Zap size={100} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Crown size={14} />
              Professional
            </div>
            <h3 className="text-xl font-bold mb-2">Più accessi, più affitti</h3>
            <p className="text-teal-50 text-sm mb-4">
              Sblocca annunci illimitati, più crediti mensili e supporto prioritario.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['Annunci illimitati', 'Crediti extra', 'Supporto H24'].map((f) => (
                <div key={f} className="flex items-start gap-1 bg-white/10 rounded-xl px-2 py-1.5">
                  <Check size={11} className="text-teal-200 flex-shrink-0 mt-0.5" />
                  <span className="text-[10px] text-teal-50 leading-tight">{f}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-white text-teal-700 font-bold py-2.5 rounded-xl text-center text-sm group-hover:bg-teal-50 transition-colors">
              Scopri Professional
            </div>
          </div>
        </div>
      )}

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
            {section.title}
          </p>
          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition-colors">
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
              </NavLink>
            );
          })}
        </div>
      ))}

      {/* Bottom Actions */}
      <div className="flex gap-3 pt-2 pb-6">
        <button
          onClick={() => window.open('https://it.trustpilot.com/review/affittochiaro.it', '_blank')}
          className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-colors active:scale-[0.98] cursor-pointer"
        >
          <Star size={18} className="fill-yellow-900" />
          Valuta App
        </button>
        <button
          onClick={() => logout()}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-colors active:scale-[0.98] cursor-pointer"
        >
          <LogOut size={18} />
          Esci
        </button>
      </div>
    </div>
  );
}
