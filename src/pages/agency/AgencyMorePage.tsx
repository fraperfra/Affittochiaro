import { NavLink } from 'react-router-dom';
import {
  Inbox,
  FileText,
  Calculator,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../utils/constants';
import { formatInitials } from '../../utils/formatters';
import { AgencyUser } from '../../types';

const menuItems = [
  { icon: Inbox, label: 'Candidature', path: ROUTES.AGENCY_APPLICATIONS, description: 'Gestisci le candidature ricevute' },
  { icon: Users, label: 'Archivio Sbloccati', path: ROUTES.AGENCY_UNLOCKED_PROFILES, description: 'Profili e contatti sbloccati' },
  { icon: FileText, label: 'Documenti', path: ROUTES.AGENCY_DOCUMENTS, description: 'Contratti e documenti' },
  { icon: Calculator, label: 'Calcolatori', path: ROUTES.AGENCY_CALCULATORS, description: '14 calcolatori immobiliari' },
  { icon: CreditCard, label: 'Piano', path: ROUTES.AGENCY_PLAN, description: 'Gestisci il tuo abbonamento' },
  { icon: Settings, label: 'Impostazioni', path: ROUTES.AGENCY_SETTINGS, description: 'Privacy, notifiche, account' },
];

export default function AgencyMorePage() {
  const { user, logout } = useAuthStore();
  const agencyUser = user as AgencyUser | null;

  const name = agencyUser?.agency.name || 'Agenzia';
  const email = user?.email || '';
  const logo = agencyUser?.agency.logoUrl;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Agency card */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
        {logo ? (
          <img src={logo} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 text-white flex items-center justify-center font-semibold text-sm">
            {formatInitials(name.split(' ')[0], name.split(' ')[1])}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">{name}</p>
          <p className="text-sm text-text-secondary truncate">{email}</p>
        </div>
      </div>

      {/* Menu list */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-gray-100">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-background-secondary flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={() => logout()}
        className="w-full bg-white rounded-2xl shadow-card px-4 py-3.5 flex items-center gap-3 hover:bg-red-50 active:bg-red-100 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
          <LogOut size={18} className="text-red-500" />
        </div>
        <span className="text-sm font-medium text-red-600">Esci</span>
      </button>
    </div>
  );
}
