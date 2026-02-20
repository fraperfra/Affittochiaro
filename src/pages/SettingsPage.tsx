import { useState, useRef } from 'react';
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
  LifeBuoy,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Camera,
  Trash2,
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

type SettingsTab = 'notifications' | 'account' | 'security' | 'feedback' | 'tickets';

type TicketStatus = 'aperto' | 'in_lavorazione' | 'risolto' | 'chiuso';
type TicketPriority = 'bassa' | 'media' | 'alta';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
  response?: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Impossibile caricare foto profilo',
    category: 'problema_tecnico',
    priority: 'media',
    status: 'risolto',
    message: 'Quando provo a caricare una foto profilo il sistema mi dà errore 413. Ho provato con diversi file JPG.',
    createdAt: '2026-02-15T10:30:00',
    updatedAt: '2026-02-16T14:22:00',
    response: 'Abbiamo risolto il problema con il limite di dimensione file. Puoi ora caricare foto fino a 5MB.',
  },
  {
    id: 'TKT-002',
    subject: 'Richiesta sblocco profilo agenzia',
    category: 'richiesta_specifica',
    priority: 'alta',
    status: 'in_lavorazione',
    message: "Siamo un'agenzia immobiliare con 15 anni di attività. Vorremmo accedere al piano premium con sblocco illimitato di profili.",
    createdAt: '2026-02-18T09:00:00',
    updatedAt: '2026-02-19T11:45:00',
  },
];

export default function SettingsPage() {
  const { user, logout, setUser } = useAuthStore();
  const isTenant = user?.role === 'tenant';
  const isAgency = user?.role === 'agency';

  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Ticket state
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'problema_tecnico',
    priority: 'media' as TicketPriority,
    message: '',
  });

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

  // Logo state (agency only)
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Il file è troppo grande. Massimo 5MB.');
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSaveLogo = () => {
    if (!logoPreview || !user) return;
    const agencyUser = user as AgencyUser;
    const updated: AgencyUser = { ...agencyUser, agency: { ...agencyUser.agency, logoUrl: logoPreview } };
    setUser(updated as unknown as typeof user);
    setLogoPreview(null);
    toast.success('Logo aggiornato con successo!');
  };

  const handleRemoveLogo = () => {
    if (!user) return;
    const agencyUser = user as AgencyUser;
    const updated: AgencyUser = { ...agencyUser, agency: { ...agencyUser.agency, logoUrl: undefined } };
    setUser(updated as unknown as typeof user);
    toast.success('Logo rimosso');
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'notifications', label: 'Notifiche', icon: <Bell size={18} /> },
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'security', label: 'Sicurezza', icon: <Shield size={18} /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={18} /> },
    { id: 'tickets', label: 'Assistenza', icon: <LifeBuoy size={18} /> },
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

  const handleSubmitTicket = () => {
    if (!newTicket.subject.trim()) {
      toast.error('Inserisci un oggetto per il ticket');
      return;
    }
    if (!newTicket.message.trim() || newTicket.message.trim().length < 20) {
      toast.error('Descrivi il problema con almeno 20 caratteri');
      return;
    }
    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'aperto',
      message: newTicket.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', category: 'problema_tecnico', priority: 'media', message: '' });
    setShowNewTicketForm(false);
    toast.success(`Ticket ${ticket.id} aperto con successo! Ti risponderemo entro 24 ore.`);
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

              {/* Logo Agenzia */}
              {isAgency && (
                <Card>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary">Logo Agenzia</h2>
                      <p className="text-sm text-text-secondary mt-1">
                        Il logo appare nella dashboard, nel profilo e nelle comunicazioni
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      {/* Preview */}
                      <div className="shrink-0 relative">
                        {(logoPreview || (user as AgencyUser).agency.logoUrl) ? (
                          <img
                            src={logoPreview || (user as AgencyUser).agency.logoUrl}
                            alt="Logo agenzia"
                            className="w-24 h-24 rounded-2xl object-cover border border-border"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-400 to-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                            {(user as AgencyUser).agency.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col gap-2.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Camera size={15} />}
                          onClick={() => logoInputRef.current?.click()}
                        >
                          {(user as AgencyUser).agency.logoUrl ? 'Cambia logo' : 'Carica logo'}
                        </Button>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/svg+xml"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                        {(user as AgencyUser).agency.logoUrl && !logoPreview && (
                          <button
                            onClick={handleRemoveLogo}
                            className="flex items-center gap-1.5 text-xs text-error hover:underline"
                          >
                            <Trash2 size={13} /> Rimuovi logo
                          </button>
                        )}
                        <p className="text-xs text-text-muted">JPG, PNG, WEBP, SVG · max 5 MB</p>
                      </div>
                    </div>

                    {/* Pending save banner */}
                    {logoPreview && (
                      <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-xl">
                        <p className="text-sm text-primary-700 flex-1">
                          Nuovo logo selezionato. Salva per applicarlo ovunque.
                        </p>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => setLogoPreview(null)}>
                            Annulla
                          </Button>
                          <Button size="sm" onClick={handleSaveLogo}>
                            Salva
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

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

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {/* Header + nuovo ticket */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Assistenza</h2>
                  <p className="text-sm text-text-secondary">Apri un ticket per problemi tecnici o richieste specifiche</p>
                </div>
                <Button
                  leftIcon={<Plus size={16} />}
                  onClick={() => setShowNewTicketForm(!showNewTicketForm)}
                  variant={showNewTicketForm ? 'secondary' : 'primary'}
                  size="sm"
                >
                  {showNewTicketForm ? 'Annulla' : 'Nuovo ticket'}
                </Button>
              </div>

              {/* Form nuovo ticket */}
              {showNewTicketForm && (
                <Card>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-text-primary">Apri un nuovo ticket</h3>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Oggetto *</label>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder="Descrivi brevemente il problema..."
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                        maxLength={100}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Categoria</label>
                        <select
                          className="input w-full text-sm"
                          value={newTicket.category}
                          onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        >
                          <option value="problema_tecnico">Problema tecnico</option>
                          <option value="account">Problema account</option>
                          <option value="pagamento">Pagamento / crediti</option>
                          <option value="richiesta_specifica">Richiesta specifica</option>
                          <option value="segnalazione">Segnalazione utente</option>
                          <option value="altro">Altro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Priorita</label>
                        <select
                          className="input w-full text-sm"
                          value={newTicket.priority}
                          onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as TicketPriority })}
                        >
                          <option value="bassa">Bassa</option>
                          <option value="media">Media</option>
                          <option value="alta">Alta</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Descrizione *</label>
                      <textarea
                        className="input w-full resize-none"
                        rows={5}
                        placeholder="Descrivi il problema nel dettaglio: cosa hai fatto, cosa ti aspettavi, cosa è successo invece..."
                        value={newTicket.message}
                        onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                        maxLength={2000}
                      />
                      <p className="text-xs text-text-muted mt-1 text-right">{newTicket.message.length}/2000</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                      <Button variant="secondary" size="sm" onClick={() => setShowNewTicketForm(false)}>Annulla</Button>
                      <Button size="sm" leftIcon={<Send size={14} />} onClick={handleSubmitTicket}>
                        Invia ticket
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Lista ticket */}
              {tickets.length === 0 ? (
                <Card>
                  <div className="py-10 text-center text-text-muted">
                    <LifeBuoy size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Nessun ticket aperto</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => {
                    const isExpanded = expandedTicket === ticket.id;
                    const statusConfig: Record<TicketStatus, { label: string; color: string; icon: React.ReactNode }> = {
                      aperto: { label: 'Aperto', color: 'bg-blue-100 text-blue-700', icon: <AlertCircle size={12} /> },
                      in_lavorazione: { label: 'In lavorazione', color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> },
                      risolto: { label: 'Risolto', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} /> },
                      chiuso: { label: 'Chiuso', color: 'bg-gray-100 text-gray-500', icon: <XCircle size={12} /> },
                    };
                    const priorityConfig: Record<TicketPriority, { label: string; color: string }> = {
                      bassa: { label: 'Bassa', color: 'text-gray-500' },
                      media: { label: 'Media', color: 'text-amber-600' },
                      alta: { label: 'Alta', color: 'text-red-600' },
                    };
                    const categoryLabels: Record<string, string> = {
                      problema_tecnico: 'Problema tecnico',
                      account: 'Account',
                      pagamento: 'Pagamento',
                      richiesta_specifica: 'Richiesta specifica',
                      segnalazione: 'Segnalazione',
                      altro: 'Altro',
                    };
                    const s = statusConfig[ticket.status];
                    const p = priorityConfig[ticket.priority];
                    return (
                      <Card key={ticket.id} padding="sm">
                        <button
                          className="w-full text-left"
                          onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                        >
                          <div className="flex items-start justify-between gap-3 px-1 py-1">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-mono text-text-muted">{ticket.id}</span>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                                  {s.icon}
                                  {s.label}
                                </span>
                                <span className={`text-xs font-medium ${p.color}`}>
                                  ● {p.label}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-text-primary truncate">{ticket.subject}</p>
                              <p className="text-xs text-text-muted mt-0.5">
                                {categoryLabels[ticket.category] || ticket.category} · {new Date(ticket.createdAt).toLocaleDateString('it-IT')}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-text-muted mt-1">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-border space-y-3 px-1">
                            <div>
                              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">La tua richiesta</p>
                              <p className="text-sm text-text-primary whitespace-pre-wrap">{ticket.message}</p>
                            </div>
                            {ticket.response && (
                              <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Risposta del team</p>
                                <p className="text-sm text-green-800">{ticket.response}</p>
                                <p className="text-xs text-green-600 mt-2">
                                  Aggiornato il {new Date(ticket.updatedAt).toLocaleDateString('it-IT')}
                                </p>
                              </div>
                            )}
                            {!ticket.response && ticket.status !== 'chiuso' && (
                              <p className="text-xs text-text-muted italic">
                                Il team ti risponderà entro 24 ore lavorative.
                              </p>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Info */}
              <div className="flex items-start gap-3 p-4 bg-background-secondary rounded-xl text-sm text-text-muted">
                <LifeBuoy size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  Per problemi urgenti scrivi a <span className="font-medium text-text-primary">support@affittochiaro.it</span>.
                  I ticket vengono gestiti dal lunedi al venerdi, 9:00–18:00.
                </p>
              </div>
            </div>
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
