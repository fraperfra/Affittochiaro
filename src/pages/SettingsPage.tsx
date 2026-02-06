import { useState } from 'react';
import {
  Bell,
  Shield,
  Eye,
  Lock,
  Trash2,
  Globe,
  Moon,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  User,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { TenantUser, AgencyUser } from '../types';
import { Card, Button, Modal, ModalFooter, Input } from '../components/ui';
import toast from 'react-hot-toast';

interface NotificationPreferences {
  emailNewMatch: boolean;
  emailNewApplication: boolean;
  emailMessages: boolean;
  emailMarketing: boolean;
  pushNewMatch: boolean;
  pushNewApplication: boolean;
  pushMessages: boolean;
  smsImportant: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  showIncome: boolean;
  showPhone: boolean;
  showEmail: boolean;
  allowAgencyContact: boolean;
}

type SettingsTab = 'notifications' | 'privacy' | 'account' | 'security';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const isTenant = user?.role === 'tenant';
  const isAgency = user?.role === 'agency';

  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Notification preferences state
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNewMatch: true,
    emailNewApplication: true,
    emailMessages: true,
    emailMarketing: false,
    pushNewMatch: true,
    pushNewApplication: true,
    pushMessages: true,
    smsImportant: true,
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisible: true,
    showIncome: false,
    showPhone: false,
    showEmail: true,
    allowAgencyContact: true,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'notifications', label: 'Notifiche', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye size={18} /> },
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'security', label: 'Sicurezza', icon: <Shield size={18} /> },
  ];

  const handleSaveNotifications = () => {
    toast.success('Preferenze notifiche salvate');
  };

  const handleSavePrivacy = () => {
    toast.success('Impostazioni privacy salvate');
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Compila tutti i campi');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('La password deve essere almeno 8 caratteri');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Le password non corrispondono');
      return;
    }
    toast.success('Password aggiornata con successo');
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'ELIMINA') {
      toast.error('Scrivi ELIMINA per confermare');
      return;
    }
    toast.success('Account eliminato');
    setShowDeleteModal(false);
    logout();
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Impostazioni</h1>
        <p className="text-text-secondary">Gestisci le tue preferenze e impostazioni account</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-text-secondary hover:bg-background-secondary'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Preferenze Notifiche</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Scegli come e quando vuoi essere avvisato
                  </p>
                </div>

                {/* Email notifications */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Mail size={18} className="text-text-muted" />
                    <h3 className="font-medium text-text-primary">Email</h3>
                  </div>
                  <div className="space-y-4">
                    {isTenant && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Nuovi match</p>
                          <p className="text-xs text-text-muted">
                            Quando un annuncio corrisponde alle tue preferenze
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={notifications.emailNewMatch}
                          onChange={(v) => setNotifications({ ...notifications, emailNewMatch: v })}
                        />
                      </div>
                    )}
                    {isAgency && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Nuove candidature</p>
                          <p className="text-xs text-text-muted">
                            Quando ricevi una nuova candidatura
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={notifications.emailNewApplication}
                          onChange={(v) => setNotifications({ ...notifications, emailNewApplication: v })}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Messaggi</p>
                        <p className="text-xs text-text-muted">
                          Quando ricevi un nuovo messaggio
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={notifications.emailMessages}
                        onChange={(v) => setNotifications({ ...notifications, emailMessages: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Aggiornamenti e promozioni</p>
                        <p className="text-xs text-text-muted">
                          Novita, offerte e suggerimenti
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={notifications.emailMarketing}
                        onChange={(v) => setNotifications({ ...notifications, emailMarketing: v })}
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Push notifications */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone size={18} className="text-text-muted" />
                    <h3 className="font-medium text-text-primary">Push & SMS</h3>
                  </div>
                  <div className="space-y-4">
                    {isTenant && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Push nuovi match</p>
                          <p className="text-xs text-text-muted">
                            Notifiche push per nuovi annunci compatibili
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={notifications.pushNewMatch}
                          onChange={(v) => setNotifications({ ...notifications, pushNewMatch: v })}
                        />
                      </div>
                    )}
                    {isAgency && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Push nuove candidature</p>
                          <p className="text-xs text-text-muted">
                            Notifiche push per nuove candidature
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={notifications.pushNewApplication}
                          onChange={(v) => setNotifications({ ...notifications, pushNewApplication: v })}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Push messaggi</p>
                        <p className="text-xs text-text-muted">
                          Notifiche push per nuovi messaggi
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={notifications.pushMessages}
                        onChange={(v) => setNotifications({ ...notifications, pushMessages: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">SMS per comunicazioni importanti</p>
                        <p className="text-xs text-text-muted">
                          Solo per verifiche e avvisi urgenti
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={notifications.smsImportant}
                        onChange={(v) => setNotifications({ ...notifications, smsImportant: v })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={handleSaveNotifications} leftIcon={<Save size={16} />}>
                    Salva Preferenze
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Privacy e Visibilita</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Controlla chi puo vedere le tue informazioni
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Profilo visibile</p>
                      <p className="text-xs text-text-muted">
                        {isTenant
                          ? 'Le agenzie possono vedere il tuo profilo nella ricerca'
                          : 'Gli inquilini possono vedere il profilo della tua agenzia'}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={privacy.profileVisible}
                      onChange={(v) => setPrivacy({ ...privacy, profileVisible: v })}
                    />
                  </div>

                  {isTenant && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Mostra reddito</p>
                          <p className="text-xs text-text-muted">
                            Le agenzie possono vedere il tuo reddito annuale
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={privacy.showIncome}
                          onChange={(v) => setPrivacy({ ...privacy, showIncome: v })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Mostra telefono</p>
                          <p className="text-xs text-text-muted">
                            Il tuo numero di telefono sara visibile alle agenzie
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={privacy.showPhone}
                          onChange={(v) => setPrivacy({ ...privacy, showPhone: v })}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Mostra email</p>
                      <p className="text-xs text-text-muted">
                        La tua email sara visibile nel profilo
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={privacy.showEmail}
                      onChange={(v) => setPrivacy({ ...privacy, showEmail: v })}
                    />
                  </div>

                  {isTenant && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Consenti contatto agenzie</p>
                        <p className="text-xs text-text-muted">
                          Le agenzie possono contattarti direttamente per proposte
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={privacy.allowAgencyContact}
                        onChange={(v) => setPrivacy({ ...privacy, allowAgencyContact: v })}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button onClick={handleSavePrivacy} leftIcon={<Save size={16} />}>
                    Salva Impostazioni
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Account Info */}
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Informazioni Account</h2>
                    <p className="text-sm text-text-secondary mt-1">
                      I tuoi dati di accesso e informazioni base
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background-secondary rounded-xl">
                      <p className="text-xs text-text-muted mb-1">Email</p>
                      <p className="font-medium text-text-primary">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-xl">
                      <p className="text-xs text-text-muted mb-1">Ruolo</p>
                      <p className="font-medium text-text-primary">
                        {user?.role === 'tenant' ? 'Inquilino' : user?.role === 'agency' ? 'Agenzia' : 'Admin'}
                      </p>
                    </div>
                    {isTenant && user && (
                      <>
                        <div className="p-4 bg-background-secondary rounded-xl">
                          <p className="text-xs text-text-muted mb-1">Nome</p>
                          <p className="font-medium text-text-primary">
                            {(user as TenantUser).profile.firstName} {(user as TenantUser).profile.lastName}
                          </p>
                        </div>
                        <div className="p-4 bg-background-secondary rounded-xl">
                          <p className="text-xs text-text-muted mb-1">Citta</p>
                          <p className="font-medium text-text-primary">
                            {(user as TenantUser).profile.city || 'Non specificata'}
                          </p>
                        </div>
                      </>
                    )}
                    {isAgency && user && (
                      <>
                        <div className="p-4 bg-background-secondary rounded-xl">
                          <p className="text-xs text-text-muted mb-1">Agenzia</p>
                          <p className="font-medium text-text-primary">
                            {(user as AgencyUser).agency.name}
                          </p>
                        </div>
                        <div className="p-4 bg-background-secondary rounded-xl">
                          <p className="text-xs text-text-muted mb-1">P.IVA</p>
                          <p className="font-medium text-text-primary">
                            {(user as AgencyUser).agency.vatNumber}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="p-4 bg-background-secondary rounded-xl">
                      <p className="text-xs text-text-muted mb-1">Registrato il</p>
                      <p className="font-medium text-text-primary">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('it-IT')
                          : '-'}
                      </p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-xl">
                      <p className="text-xs text-text-muted mb-1">Stato verifica email</p>
                      <p className="font-medium text-text-primary">
                        {user?.emailVerified ? 'Verificata' : 'Non verificata'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Language & Appearance (placeholder) */}
              <Card>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Preferenze</h2>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-text-muted" />
                      <div>
                        <p className="text-sm font-medium">Lingua</p>
                        <p className="text-xs text-text-muted">Lingua dell'interfaccia</p>
                      </div>
                    </div>
                    <select className="input w-auto text-sm" defaultValue="it">
                      <option value="it">Italiano</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon size={18} className="text-text-muted" />
                      <div>
                        <p className="text-sm font-medium">Tema scuro</p>
                        <p className="text-xs text-text-muted">Prossimamente disponibile</p>
                      </div>
                    </div>
                    <ToggleSwitch checked={false} onChange={() => toast('Prossimamente disponibile!')} />
                  </div>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-error">Zona Pericolosa</h2>
                    <p className="text-sm text-text-secondary mt-1">
                      Azioni irreversibili sul tuo account
                    </p>
                  </div>

                  <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-error">Elimina account</p>
                        <p className="text-xs text-text-muted mt-1">
                          Tutti i tuoi dati, profilo, CV e candidature verranno eliminati permanentemente.
                          Questa azione non puo essere annullata.
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                        className="!text-error !border-red-200 hover:!bg-red-100 flex-shrink-0"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Elimina
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Sicurezza</h2>
                    <p className="text-sm text-text-secondary mt-1">
                      Gestisci la sicurezza del tuo account
                    </p>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-text-muted" />
                      <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-xs text-text-muted">Ultima modifica: mai</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)}>
                      Cambia password
                    </Button>
                  </div>

                  {/* 2FA */}
                  <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-text-muted" />
                      <div>
                        <p className="text-sm font-medium">Autenticazione a due fattori</p>
                        <p className="text-xs text-text-muted">Non attiva - Prossimamente</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" disabled>
                      Attiva
                    </Button>
                  </div>

                  {/* Active sessions */}
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">Sessioni attive</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-success rounded-full" />
                          <div>
                            <p className="text-sm font-medium">Sessione corrente</p>
                            <p className="text-xs text-text-muted">Browser web - Attiva ora</p>
                          </div>
                        </div>
                        <span className="text-xs text-success font-medium">Attiva</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Login history */}
              <Card>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-text-primary">Cronologia Accessi</h2>
                  <div className="space-y-2">
                    {[
                      { date: 'Oggi, 10:32', device: 'Chrome su Windows', location: 'Milano, IT' },
                      { date: 'Ieri, 18:15', device: 'Safari su iPhone', location: 'Milano, IT' },
                      { date: '3 giorni fa', device: 'Chrome su Windows', location: 'Roma, IT' },
                    ].map((entry, i) => (
                      <div key={i} className="flex items-center justify-between py-2 text-sm">
                        <div>
                          <p className="font-medium">{entry.device}</p>
                          <p className="text-xs text-text-muted">{entry.location}</p>
                        </div>
                        <span className="text-text-muted text-xs">{entry.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }}
        title="Cambia Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Password attuale
            </label>
            <input
              type="password"
              className="input"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Nuova password
            </label>
            <input
              type="password"
              className="input"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <p className="text-xs text-text-muted mt-1">Almeno 8 caratteri</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Conferma nuova password
            </label>
            <input
              type="password"
              className="input"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setShowPasswordModal(false);
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }}
          >
            Annulla
          </Button>
          <Button onClick={handleChangePassword}>Cambia Password</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirm('');
        }}
        title="Elimina Account"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-error font-medium">Attenzione: questa azione e irreversibile!</p>
            <p className="text-sm text-text-secondary mt-2">
              Eliminando il tuo account perderai:
            </p>
            <ul className="text-sm text-text-secondary mt-2 space-y-1 list-disc pl-4">
              <li>Tutti i dati del profilo</li>
              {isTenant && <li>Il tuo CV dell'inquilino</li>}
              {isTenant && <li>Tutte le candidature inviate</li>}
              {isAgency && <li>Tutti gli annunci pubblicati</li>}
              {isAgency && <li>I crediti rimanenti</li>}
              <li>Lo storico messaggi</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Scrivi <strong>ELIMINA</strong> per confermare
            </label>
            <input
              type="text"
              className="input"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="ELIMINA"
            />
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirm('');
            }}
          >
            Annulla
          </Button>
          <Button
            onClick={handleDeleteAccount}
            className="!bg-error hover:!bg-red-600"
          >
            <Trash2 size={14} className="mr-1" />
            Elimina Account
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
