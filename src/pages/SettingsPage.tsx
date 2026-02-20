import { useState } from 'react';
import {
  Bell,
  Shield,
  Lock,
  Globe,
  Moon,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  User,
  Building2,
  PauseCircle,
  Star,
  Send,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { TenantUser, AgencyUser } from '../types';
import { Card, Button, Modal, ModalFooter } from '../components/ui';
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

type SettingsTab = 'notifications' | 'account' | 'security' | 'feedback';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const isTenant = user?.role === 'tenant';
  const isAgency = user?.role === 'agency';

  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState('generale');
  const [feedbackText, setFeedbackText] = useState('');

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

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'notifications', label: 'Notifiche', icon: <Bell size={18} /> },
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'security', label: 'Sicurezza', icon: <Shield size={18} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={18} /> },
  ];

  const handleSaveNotifications = () => {
    toast.success('Preferenze notifiche salvate');
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

  const handlePauseAccount = () => {
    toast.success('Account messo in pausa. Puoi riattivarlo in qualsiasi momento.');
    setShowPauseModal(false);
    logout();
  };

  const handleSendFeedback = () => {
    if (feedbackRating === 0) {
      toast.error('Seleziona una valutazione prima di inviare');
      return;
    }
    if (!feedbackText.trim()) {
      toast.error('Scrivi un commento per il tuo feedback');
      return;
    }
    toast.success('Grazie per il tuo feedback! Lo terremo in grande considerazione.');
    setFeedbackRating(0);
    setFeedbackText('');
    setFeedbackCategory('generale');
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

  const ratingLabels: Record<number, string> = {
    1: 'Molto scarso',
    2: 'Scarso',
    3: 'Nella media',
    4: 'Buono',
    5: 'Eccellente',
  };

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

              {/* Language & Appearance */}
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

              {/* Pause Account */}
              <Card>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Gestione Account</h2>
                    <p className="text-sm text-text-secondary mt-1">
                      Metti in pausa il tuo account temporaneamente
                    </p>
                  </div>

                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-amber-800">Metti in pausa l'account</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Il tuo profilo non sarà visibile durante la pausa. Puoi riattivarlo in qualsiasi momento
                          effettuando nuovamente il login.
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowPauseModal(true)}
                        className="!text-amber-700 !border-amber-300 hover:!bg-amber-100 flex-shrink-0"
                      >
                        <PauseCircle size={14} className="mr-1" />
                        Pausa
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
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
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Lascia una recensione</h2>
                    <p className="text-sm text-text-secondary mt-1">
                      La tua opinione ci aiuta a migliorare Affittochiaro per tutti
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <p className="text-sm font-medium text-text-primary mb-3">La tua valutazione complessiva</p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          onMouseEnter={() => setFeedbackHover(star)}
                          onMouseLeave={() => setFeedbackHover(0)}
                          className="transition-transform hover:scale-110 active:scale-95"
                          aria-label={`${star} stelle`}
                        >
                          <Star
                            size={36}
                            className={`transition-colors ${
                              star <= (feedbackHover || feedbackRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      {(feedbackHover || feedbackRating) > 0 && (
                        <span className="ml-2 text-sm font-medium text-text-secondary">
                          {ratingLabels[feedbackHover || feedbackRating]}
                        </span>
                      )}
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Categoria
                    </label>
                    <select
                      className="input w-full md:w-auto text-sm"
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                    >
                      <option value="generale">Esperienza generale</option>
                      <option value="profilo">Gestione profilo</option>
                      <option value="annunci">Ricerca annunci</option>
                      <option value="messaggi">Messaggi e comunicazione</option>
                      <option value="agenzia">Rapporto con le agenzie</option>
                      <option value="app">App e usabilita</option>
                    </select>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Il tuo commento
                    </label>
                    <textarea
                      className="input w-full resize-none"
                      rows={5}
                      placeholder="Raccontaci la tua esperienza. Cosa ti è piaciuto? Cosa miglioreresti?"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      maxLength={1000}
                    />
                    <p className="text-xs text-text-muted mt-1 text-right">
                      {feedbackText.length}/1000
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button onClick={handleSendFeedback} leftIcon={<Send size={16} />}>
                      Invia Recensione
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Privacy note */}
              <div className="flex items-start gap-3 p-4 bg-background-secondary rounded-xl text-sm text-text-muted">
                <MessageSquare size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  Le tue recensioni ci aiutano a capire come migliorare il servizio. Il tuo feedback
                  è anonimo e non verrà condiviso pubblicamente senza il tuo consenso.
                </p>
              </div>
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

      {/* Pause Account Modal */}
      <Modal
        isOpen={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        title="Metti in pausa l'account"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 font-medium">Cosa succede durante la pausa?</p>
            <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc pl-4">
              <li>Il tuo profilo non sarà visibile nelle ricerche</li>
              {isTenant && <li>Le agenzie non potranno contattarti</li>}
              {isTenant && <li>Le candidature attive verranno sospese</li>}
              {isAgency && <li>I tuoi annunci non saranno visibili</li>}
              <li>I tuoi dati vengono conservati intatti</li>
              <li>Puoi riattivare l'account in qualsiasi momento</li>
            </ul>
          </div>
          <p className="text-sm text-text-secondary">
            Verrai disconnesso. Per riattivare l'account, accedi nuovamente con le tue credenziali.
          </p>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowPauseModal(false)}>
            Annulla
          </Button>
          <Button
            onClick={handlePauseAccount}
            className="!bg-amber-500 hover:!bg-amber-600"
          >
            <PauseCircle size={14} className="mr-1" />
            Metti in Pausa
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
