import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  FileText,
  Calculator,
  ShieldCheck,
  UserCog,
  LifeBuoy,
  Star,
  LogOut,
  MapPin,
  Home,
  Users,
  Inbox,
  BadgeCheck,
  Zap,
  Check,
} from 'lucide-react';
import { AvatarUpload } from '../../components/ui';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../utils/constants';
import { formatInitials } from '../../utils/formatters';
import { LandlordUser } from '../../types';

export default function LandlordMorePage() {
  const { user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const landlordUser = user as LandlordUser | null;

  const firstName = landlordUser?.profile.firstName || 'Proprietario';
  const lastName = landlordUser?.profile.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const avatar = landlordUser?.profile.avatarUrl;
  const city = landlordUser?.profile.city || 'Italia';
  const isVerified = landlordUser?.profile.isVerified ?? false;
  const propertiesCount = landlordUser?.profile.propertiesCount ?? 0;
  const activeListingsCount = landlordUser?.profile.activeListingsCount ?? 0;
  const activeTenantsCount = landlordUser?.profile.activeTenantsCount ?? 0;
  const applicationsCount = landlordUser?.profile.applicationsCount ?? 0;

  const handleAvatarUpload = (blobUrl: string) => {
    if (!landlordUser) return;
    setUser({
      ...landlordUser,
      profile: { ...landlordUser.profile, avatarUrl: blobUrl },
    } as LandlordUser);
  };

  const menuSections = [
    {
      title: 'I miei immobili',
      items: [
        { icon: Home,      label: 'I miei annunci',       path: ROUTES.LANDLORD_LISTINGS },
        { icon: Inbox,     label: 'Candidature ricevute', path: ROUTES.LANDLORD_APPLICATIONS },
        { icon: FileText,  label: 'Contratti',            path: ROUTES.LANDLORD_DOCUMENTS },
        { icon: Calculator,label: 'Calcolatori',          path: ROUTES.LANDLORD_CALCULATORS },
      ],
    },
    {
      title: 'Impostazioni',
      items: [
        { icon: UserCog,    label: 'Account',    path: `${ROUTES.LANDLORD_SETTINGS}?tab=account` },
        { icon: ShieldCheck,label: 'Sicurezza',  path: `${ROUTES.LANDLORD_SETTINGS}?tab=security` },
        { icon: Bell,       label: 'Notifiche',  path: `${ROUTES.LANDLORD_SETTINGS}?tab=notifications` },
        { icon: LifeBuoy,   label: 'Assistenza', path: `${ROUTES.LANDLORD_SETTINGS}?tab=tickets` },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-8 pt-2">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        {/* Profile row */}
        <div className="flex items-center gap-4 mb-6">
          <AvatarUpload
            src={avatar}
            initials={formatInitials(firstName, lastName)}
            onUpload={handleAvatarUpload}
            avatarClassName="w-16 h-16 text-xl"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 truncate">{fullName}</h2>
              {isVerified && (
                <BadgeCheck size={16} className="text-teal-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={12} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-500 truncate">{city}</p>
            </div>
            <div className="mt-1">
              <span className={`text-xs font-semibold ${isVerified ? 'text-teal-600' : 'text-gray-400'}`}>
                {isVerified ? 'Identità verificata' : 'Non verificato'}
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
                <Home size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Immobili</p>
                <p className="text-sm font-semibold text-gray-900">{propertiesCount}</p>
              </div>
            </div>
            <div className="bg-green-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <Star size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Annunci attivi</p>
                <p className="text-sm font-semibold text-gray-900">{activeListingsCount}</p>
              </div>
            </div>
            <div className="bg-orange-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Inbox size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Candidature</p>
                <p className="text-sm font-semibold text-gray-900">
                  {applicationsCount > 0 ? `${applicationsCount} nuove` : 'Nessuna'}
                </p>
              </div>
            </div>
            <div className="bg-purple-50/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Users size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Inquilini</p>
                <p className="text-sm font-semibold text-gray-900">{activeTenantsCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner — verifica identità / strumenti premium */}
      {!isVerified && (
        <div
          onClick={() => navigate(`${ROUTES.LANDLORD_SETTINGS}?tab=account`)}
          className="bg-gradient-to-r from-primary-600 to-teal-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
        >
          <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
            <Zap size={100} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-3">
              <BadgeCheck size={14} />
              Verifica identità
            </div>
            <h3 className="font-bold mb-2">Affittare è più facile con la spunta blu</h3>
            <p className="text-teal-50 text-sm mb-4">
              I profili verificati ricevono il triplo delle candidature e trasmettono più fiducia agli inquilini.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['Più candidature', 'Spunta blu', 'Fiducia garantita'].map((f) => (
                <div key={f} className="flex items-start gap-1 bg-white/10 rounded-xl px-2 py-1.5">
                  <Check size={11} className="text-teal-200 flex-shrink-0 mt-0.5" />
                  <span className="text-[10px] text-teal-50 leading-tight">{f}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-white text-teal-700 font-bold py-2.5 rounded-xl text-center text-sm group-hover:bg-teal-50 transition-colors">
              Verifica ora
            </div>
          </div>
        </div>
      )}

      {/* Banner strumenti premium (quando già verificato) */}
      {isVerified && (
        <div
          onClick={() => navigate(ROUTES.LANDLORD_CALCULATORS)}
          className="bg-gradient-to-r from-primary-600 to-teal-500 rounded-3xl p-5 text-white shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
        >
          <div className="absolute top-0 right-0 opacity-15 transform translate-x-2 -translate-y-2">
            <Calculator size={80} />
          </div>
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight mb-1">Strumenti per proprietari</p>
              <p className="text-teal-100 text-xs leading-tight">
                Cedolare secca, canone concordato, rendimento netto e molto altro.
              </p>
            </div>
            <div className="bg-white text-teal-700 font-bold py-2 px-4 rounded-xl text-sm flex-shrink-0 group-hover:bg-teal-50 transition-colors">
              Apri
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
