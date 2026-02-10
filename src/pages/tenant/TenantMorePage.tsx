import { NavLink } from 'react-router-dom';
import {
  User,
  Building2,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { ROUTES } from '../../utils/constants';
import { formatInitials } from '../../utils/formatters';
import { TenantUser } from '../../types';

const menuItems = [
  { icon: User, label: 'Il Mio Profilo', path: ROUTES.TENANT_PROFILE, description: 'Modifica i tuoi dati personali' },
  { icon: Building2, label: 'Agenzie', path: ROUTES.TENANT_AGENCIES, description: 'Sfoglia le agenzie disponibili' },
  { icon: Bell, label: 'Notifiche', path: ROUTES.TENANT_NOTIFICATIONS, description: 'Controlla avvisi e aggiornamenti', badge: 3 },
  { icon: Settings, label: 'Impostazioni', path: ROUTES.TENANT_SETTINGS, description: 'Privacy, notifiche, account' },
];

export default function TenantMorePage() {
  const { user, logout } = useAuthStore();
  const tenantUser = user as TenantUser | null;

  const name = tenantUser
    ? `${tenantUser.profile.firstName} ${tenantUser.profile.lastName}`
    : 'Utente';
  const email = user?.email || '';
  const avatar = tenantUser?.profile.avatarUrl;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* User card */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
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
              <div className="flex items-center gap-2 shrink-0">
                {item.badge && item.badge > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-300" />
              </div>
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
