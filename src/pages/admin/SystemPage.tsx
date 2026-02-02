import { useState } from 'react';
import {
  Settings,
  Database,
  Shield,
  Bell,
  Mail,
  CreditCard,
  Globe,
  Server,
  HardDrive,
  Cpu,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  Key,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, Button, Badge, Modal, ModalFooter, Input } from '../../components/ui';
import toast from 'react-hot-toast';

// Mock system data
const systemStats = {
  serverStatus: 'online',
  uptime: '45 giorni, 12 ore',
  cpuUsage: 34,
  memoryUsage: 62,
  diskUsage: 48,
  activeConnections: 127,
  requestsPerMinute: 342,
  avgResponseTime: '45ms',
};

const recentLogs = [
  { id: 1, type: 'info', message: 'Backup completato con successo', time: '2 min fa' },
  { id: 2, type: 'warning', message: 'Alto utilizzo memoria rilevato', time: '15 min fa' },
  { id: 3, type: 'success', message: 'Nuova agenzia registrata: Immobiliare XYZ', time: '32 min fa' },
  { id: 4, type: 'info', message: 'Cache pulita automaticamente', time: '1 ora fa' },
  { id: 5, type: 'error', message: 'Tentativo di login fallito (IP: 192.168.1.45)', time: '2 ore fa' },
];

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'security' | 'notifications' | 'payments'>('overview');
  const [showApiKey, setShowApiKey] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Panoramica', icon: <Activity size={18} /> },
    { id: 'settings', label: 'Impostazioni', icon: <Settings size={18} /> },
    { id: 'security', label: 'Sicurezza', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifiche', icon: <Bell size={18} /> },
    { id: 'payments', label: 'Pagamenti', icon: <CreditCard size={18} /> },
  ];

  const handleSaveSettings = () => {
    toast.success('Impostazioni salvate con successo');
  };

  const handleClearCache = () => {
    toast.success('Cache pulita con successo');
  };

  const handleBackupNow = () => {
    toast.success('Backup avviato');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Impostazioni Sistema</h1>
        <p className="text-text-secondary">
          Gestisci le configurazioni della piattaforma
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Server Status */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server size={20} className="text-primary-500" />
                <span className="text-sm text-text-muted">Stato Server</span>
              </div>
              <Badge variant="success" className="text-sm">
                <CheckCircle size={12} className="mr-1" />
                Online
              </Badge>
              <p className="text-xs text-text-muted mt-2">Uptime: {systemStats.uptime}</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cpu size={20} className="text-primary-500" />
                <span className="text-sm text-text-muted">CPU</span>
              </div>
              <p className="text-2xl font-bold">{systemStats.cpuUsage}%</p>
              <div className="h-2 bg-background-secondary rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${systemStats.cpuUsage}%` }}
                />
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HardDrive size={20} className="text-primary-500" />
                <span className="text-sm text-text-muted">Memoria</span>
              </div>
              <p className="text-2xl font-bold">{systemStats.memoryUsage}%</p>
              <div className="h-2 bg-background-secondary rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${systemStats.memoryUsage > 80 ? 'bg-error' : 'bg-primary-500'}`}
                  style={{ width: `${systemStats.memoryUsage}%` }}
                />
              </div>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Database size={20} className="text-primary-500" />
                <span className="text-sm text-text-muted">Disco</span>
              </div>
              <p className="text-2xl font-bold">{systemStats.diskUsage}%</p>
              <div className="h-2 bg-background-secondary rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${systemStats.diskUsage}%` }}
                />
              </div>
            </Card>
          </div>

          {/* Performance Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Connessioni Attive</p>
                  <p className="text-2xl font-bold">{systemStats.activeConnections}</p>
                </div>
                <Activity size={24} className="text-primary-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Richieste/min</p>
                  <p className="text-2xl font-bold">{systemStats.requestsPerMinute}</p>
                </div>
                <Globe size={24} className="text-primary-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Tempo Risposta Medio</p>
                  <p className="text-2xl font-bold">{systemStats.avgResponseTime}</p>
                </div>
                <Activity size={24} className="text-success" />
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Azioni Rapide</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" leftIcon={<RefreshCw size={16} />} onClick={handleClearCache}>
                Pulisci Cache
              </Button>
              <Button variant="secondary" leftIcon={<Database size={16} />} onClick={handleBackupNow}>
                Backup Ora
              </Button>
              <Button variant="secondary" leftIcon={<RefreshCw size={16} />}>
                Riavvia Servizi
              </Button>
            </div>
          </Card>

          {/* Recent Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Log Recenti</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-background-secondary">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.type === 'error' ? 'bg-error' :
                    log.type === 'warning' ? 'bg-warning' :
                    log.type === 'success' ? 'bg-success' : 'bg-info'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-text-muted">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Generali</CardTitle>
            </CardHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Modalita Manutenzione</p>
                  <p className="text-sm text-text-muted">Disabilita l'accesso agli utenti durante la manutenzione</p>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    maintenanceMode ? 'bg-warning' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Backup Automatico</p>
                  <p className="text-sm text-text-muted">Esegui backup giornaliero alle 03:00</p>
                </div>
                <button
                  onClick={() => setAutoBackup(!autoBackup)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoBackup ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    autoBackup ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nome Piattaforma" defaultValue="Affittochiaro" />
                <Input label="Email Supporto" defaultValue="support@affittochiaro.it" />
                <Input label="Telefono Supporto" defaultValue="+39 02 1234567" />
                <Input label="URL Sito" defaultValue="https://affittochiaro.it" />
              </div>

              <Button leftIcon={<Save size={16} />} onClick={handleSaveSettings}>
                Salva Impostazioni
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chiavi API</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">API Key Produzione</p>
                  <button onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <code className="text-sm bg-white px-3 py-2 rounded-lg block">
                  {showApiKey ? '[API_KEY_NASCOSTA]' : '••••••••••••••••••••••••••••••••'}
                </code>
              </div>
              <Button variant="secondary" leftIcon={<RefreshCw size={16} />}>
                Rigenera API Key
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Sicurezza</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-primary-500" />
                  <div>
                    <p className="font-medium">Autenticazione a Due Fattori</p>
                    <p className="text-sm text-text-muted">Richiedi 2FA per tutti gli admin</p>
                  </div>
                </div>
                <Badge variant="success">Attivo</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-primary-500" />
                  <div>
                    <p className="font-medium">Blocco IP Sospetti</p>
                    <p className="text-sm text-text-muted">Blocca automaticamente IP con attivita sospetta</p>
                  </div>
                </div>
                <Badge variant="success">Attivo</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-3">
                  <Key size={20} className="text-primary-500" />
                  <div>
                    <p className="font-medium">Scadenza Password</p>
                    <p className="text-sm text-text-muted">Forza cambio password ogni 90 giorni</p>
                  </div>
                </div>
                <Badge variant="warning">Disattivo</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IP Bloccati</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {['192.168.1.45', '10.0.0.123', '172.16.0.89'].map((ip) => (
                <div key={ip} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                  <code className="text-sm">{ip}</code>
                  <Button variant="ghost" size="sm" className="text-error">
                    Sblocca
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifiche Email</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Nuove Registrazioni</p>
                  <p className="text-sm text-text-muted">Ricevi email per ogni nuova registrazione</p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    emailNotifications ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Nuovi Pagamenti</p>
                  <p className="text-sm text-text-muted">Notifica per ogni pagamento ricevuto</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-primary-500">
                  <div className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Report Settimanale</p>
                  <p className="text-sm text-text-muted">Ricevi un riepilogo settimanale delle attivita</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-primary-500">
                  <div className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Avvisi di Sistema</p>
                  <p className="text-sm text-text-muted">Notifiche per errori e problemi di sistema</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-primary-500">
                  <div className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurazione SMTP</CardTitle>
            </CardHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Server SMTP" defaultValue="smtp.affittochiaro.it" />
              <Input label="Porta" defaultValue="587" />
              <Input label="Username" defaultValue="noreply@affittochiaro.it" />
              <Input label="Password" type="password" defaultValue="••••••••" />
            </div>
            <Button className="mt-4" leftIcon={<Mail size={16} />}>
              Invia Email di Test
            </Button>
          </Card>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gateway di Pagamento</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-text-muted">Carte di credito, Apple Pay, Google Pay</p>
                  </div>
                </div>
                <Badge variant="success">Attivo</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-text-muted">PayPal, PayPal Credit</p>
                  </div>
                </div>
                <Badge variant="neutral">Disattivo</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credenziali Stripe</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <Input label="Publishable Key" defaultValue="pk_live_••••••••••••••••" />
              <Input label="Secret Key" type="password" defaultValue="sk_live_••••••••••••••••" />
              <Input label="Webhook Secret" type="password" defaultValue="whsec_••••••••••••••••" />
            </div>
            <Button className="mt-4" leftIcon={<Save size={16} />} onClick={handleSaveSettings}>
              Salva Credenziali
            </Button>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prezzi Piani</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-background-secondary rounded-xl">
                  <p className="text-sm text-text-muted">Free</p>
                  <p className="text-2xl font-bold">€0</p>
                  <p className="text-xs text-text-muted">/mese</p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl">
                  <p className="text-sm text-text-muted">Base</p>
                  <p className="text-2xl font-bold">€49</p>
                  <p className="text-xs text-text-muted">/mese</p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border-2 border-primary-500">
                  <p className="text-sm text-primary-600">Professional</p>
                  <p className="text-2xl font-bold">€99</p>
                  <p className="text-xs text-text-muted">/mese</p>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl">
                  <p className="text-sm text-text-muted">Enterprise</p>
                  <p className="text-2xl font-bold">€199</p>
                  <p className="text-xs text-text-muted">/mese</p>
                </div>
              </div>
              <Button variant="secondary">Modifica Prezzi</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
