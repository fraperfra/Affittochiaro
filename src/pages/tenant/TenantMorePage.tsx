import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Edit2,
  ChevronRight,
  MapPin,
  Home,
  Wallet,
  PawPrint,
  Sparkles,
  ShieldCheck,
  UserCog,
  Star,
  LifeBuoy,
  Eye,
  Crown,
  Check
} from 'lucide-react';
import { Modal, Button } from '../../components/ui';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../utils/constants';
import { formatInitials } from '../../utils/formatters';
import { TenantUser } from '../../types';

interface VisibilityPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const visibilityPlans: VisibilityPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 'Gratis',
    period: '',
    description: 'Il profilo base',
    icon: <Eye size={20} className="text-gray-500" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    features: [
      'Profilo visibile nelle ricerche',
      'Curriculum completo'
    ],
    cta: 'Piano attuale',
    highlighted: false,
  },
  {
    id: 'evidenziato',
    name: 'In Evidenza',
    price: '€3,99',
    period: '/mese',
    description: 'Mettiti in risalto',
    icon: <Star size={20} className="text-amber-500" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    features: [
      'Badge "In Evidenza"',
      'Appari tra i primi 20 risultati'
    ],
    cta: 'Inizia ora',
    highlighted: false,
  },
  {
    id: 'top',
    name: 'Top Profilo',
    price: '€7,99',
    period: '/mese',
    description: 'Massima visibilità',
    icon: <Crown size={20} className="text-white" />,
    color: 'text-white',
    bgColor: 'bg-gradient-to-br from-teal-500 to-teal-700',
    borderColor: 'border-transparent',
    features: [
      'Badge "Top" dorato',
      'Primo risultato in ricerche',
      'Notifiche push alle agenzie'
    ],
    cta: 'Attiva Top Profilo',
    highlighted: true,
  },
];

export default function TenantMorePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const tenantUser = user as TenantUser | null;

  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const name = tenantUser
    ? `${tenantUser.profile.firstName} ${tenantUser.profile.lastName}`
    : 'Utente';
  const avatar = tenantUser?.profile.avatarUrl;

  // Stats
  const citta = tenantUser?.profile.city || 'Tutta Italia';
  const tipologia = 'Qualsiasi'; // Manca in TenantProfile
  const budget = 'N/D'; // Manca in TenantProfile
  const animali = 'No'; // Manca in TenantProfile

  const menuItems = [
    { icon: User, label: 'Il mio profilo', path: ROUTES.TENANT_PROFILE },
    { icon: Bell, label: 'Notifiche', path: ROUTES.TENANT_NOTIFICATIONS },
    { icon: UserCog, label: 'Account', path: `${ROUTES.TENANT_SETTINGS}?tab=account` },
    { icon: ShieldCheck, label: 'Sicurezza', path: `${ROUTES.TENANT_SETTINGS}?tab=security` },
    { icon: LifeBuoy, label: 'Assistenza', path: `${ROUTES.TENANT_SETTINGS}?tab=tickets` },
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-8 pt-2">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-teal-50" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl border-2 border-teal-100">
                {formatInitials(name.split(' ')[0], name.split(' ')[1])}
              </div>
            )}
            <NavLink
              to={ROUTES.TENANT_PROFILE}
              className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-teal-600 hover:bg-gray-50 cursor-pointer"
            >
              <Edit2 size={12} strokeWidth={2.5} />
            </NavLink>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {name.split(' ')[0]}
              <NavLink to={ROUTES.TENANT_PROFILE} className="text-gray-400 hover:text-teal-600 cursor-pointer">
                <Edit2 size={14} />
              </NavLink>
            </h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Panoramica e Riepilogo</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Città</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{citta}</p>
              </div>
            </div>
            <div className="bg-green-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <Home size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Tipologia</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{tipologia}</p>
              </div>
            </div>
            <div className="bg-orange-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Wallet size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Budget max</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{budget}</p>
              </div>
            </div>
            <div className="bg-purple-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <PawPrint size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Animali</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{animali}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Visibilità Banner */}
      <div
        onClick={() => setIsExtraModalOpen(true)}
        className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-4 py-3.5 text-white shadow-md relative overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="absolute top-0 right-0 opacity-15 transform translate-x-2 -translate-y-2">
          <Sparkles size={60} />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Extra Visibilità</p>
              <p className="text-orange-100 text-xs leading-tight truncate">Fatti notare di più dalle agenzie</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setIsExtraModalOpen(true); }}
            className="bg-white text-orange-600 font-bold py-1.5 px-4 rounded-xl text-sm flex-shrink-0 hover:scale-105 transition-transform shadow-sm"
          >
            Ottieni
          </button>
        </div>
      </div>

      {/* Menu Links */}
      <div className="space-y-3">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={idx}
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

      {/* Bottom Actions */}
      <div className="pt-2 pb-6">
        <button
          onClick={() => window.open('https://it.trustpilot.com/review/affittochiaro.it', '_blank')}
          className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-colors active:scale-[0.98] cursor-pointer"
        >
          <Star size={18} className="fill-yellow-900" />
          Valuta App su Trustpilot
        </button>
      </div>

      <Modal
        isOpen={isExtraModalOpen}
        onClose={() => setIsExtraModalOpen(false)}
        title="Extra Visibilità"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Aumenta le tue chance di trovare casa apparendo in cima alle ricerche delle agenzie partner.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {visibilityPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-5 flex flex-col ${plan.bgColor} ${plan.borderColor} ${plan.highlighted ? 'shadow-lg' : ''}`}
              >
                {/* Plan header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.highlighted ? 'bg-white/20' : 'bg-white'}`}>
                    {plan.icon}
                  </div>
                </div>

                <h3 className={`font-bold text-base ${plan.color}`}>{plan.name}</h3>
                <p className={`text-[11px] mt-0.5 mb-3 ${plan.highlighted ? 'text-teal-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>

                <div className="mb-4">
                  <span className={`text-2xl font-extrabold ${plan.color}`}>{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? 'text-teal-200' : 'text-gray-400'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={13} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-teal-200' : 'text-teal-600'}`} />
                      <span className={`text-xs leading-snug ${plan.highlighted ? 'text-teal-50' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setActivePlan(plan.id)}
                  disabled={plan.id === 'standard'}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                     ${plan.id === 'standard'
                      ? 'bg-gray-200 text-gray-400 cursor-default'
                      : plan.highlighted
                        ? 'bg-white text-teal-700 hover:bg-gray-50 active:scale-[0.98]'
                        : 'bg-teal-600 text-white hover:bg-opacity-90 active:scale-[0.98]'
                    }`}
                >
                  {activePlan === plan.id ? 'Selezionato ✓' : plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-4">
            I piani si rinnovano automaticamente. Puoi disdire in qualsiasi momento dalle impostazioni.
          </p>
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsExtraModalOpen(false)}>Chiudi</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
