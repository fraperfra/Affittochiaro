import { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  CreditCard,
  Save,
  Key,
  Lock,
  Edit2,
  Check,
  X,
  Users,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, Button, Badge, Input } from '../../components/ui';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────────────────────
interface PricePlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'mese' | 'anno';
  credits?: number;
  description: string;
  highlighted: boolean;
}

// ── Initial state ──────────────────────────────────────────────────────────
const INITIAL_AGENCY_PLANS: PricePlan[] = [
  { id: 'agency_free', name: 'Free', price: 0, billingPeriod: 'mese', credits: 3, description: '3 crediti inclusi, 1 annuncio attivo', highlighted: false },
  { id: 'agency_base', name: 'Base', price: 49, billingPeriod: 'mese', credits: 20, description: '20 crediti/mese, 5 annunci attivi', highlighted: false },
  { id: 'agency_pro', name: 'Professional', price: 99, billingPeriod: 'mese', credits: 60, description: '60 crediti/mese, annunci illimitati', highlighted: true },
  { id: 'agency_enterprise', name: 'Enterprise', price: 199, billingPeriod: 'mese', credits: 200, description: 'Crediti illimitati, supporto dedicato', highlighted: false },
];

const INITIAL_TENANT_PLANS: PricePlan[] = [
  { id: 'tenant_free', name: 'Free', price: 0, billingPeriod: 'mese', description: 'Profilo base, visibile alle agenzie', highlighted: false },
  { id: 'tenant_premium', name: 'Premium', price: 4, billingPeriod: 'mese', description: 'Profilo in evidenza, badge verificato prioritario', highlighted: true },
  { id: 'tenant_pro', name: 'Pro', price: 9, billingPeriod: 'mese', description: 'Profilo top, video incluso, matching avanzato', highlighted: false },
];

// ── Editable plan card ─────────────────────────────────────────────────────
function PlanCard({
  plan,
  onSave,
}: {
  plan: PricePlan;
  onSave: (updated: PricePlan) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(plan);

  const handleSave = () => {
    if (!draft.name.trim()) { toast.error('Inserisci un nome'); return; }
    onSave(draft);
    setEditing(false);
    toast.success(`Piano "${draft.name}" aggiornato`);
  };

  const handleCancel = () => {
    setDraft(plan);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={`p-4 rounded-2xl border-2 space-y-3 ${plan.highlighted ? 'border-primary-500 bg-primary-50' : 'border-border bg-background-secondary'}`}>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Nome piano</label>
          <input
            className="input text-sm"
            value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Prezzo (€/mese)</label>
          <input
            type="number"
            min={0}
            className="input text-sm"
            value={draft.price}
            onChange={e => setDraft(d => ({ ...d, price: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        {draft.credits !== undefined && (
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Crediti inclusi</label>
            <input
              type="number"
              min={0}
              className="input text-sm"
              value={draft.credits}
              onChange={e => setDraft(d => ({ ...d, credits: parseInt(e.target.value) || 0 }))}
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Descrizione</label>
          <input
            className="input text-sm"
            value={draft.description}
            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <label className="text-xs font-medium text-text-muted">In evidenza</label>
          <button
            onClick={() => setDraft(d => ({ ...d, highlighted: !d.highlighted }))}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${draft.highlighted ? 'bg-primary-600' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${draft.highlighted ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
          </button>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={handleSave} className="flex items-center gap-1.5 text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700">
            <Check size={12} /> Salva
          </button>
          <button onClick={handleCancel} className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-background-secondary">
            <X size={12} /> Annulla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border-2 relative group ${plan.highlighted ? 'border-primary-500 bg-primary-50' : 'border-border bg-background-secondary'}`}>
      {plan.highlighted && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs bg-primary-600 text-white px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">
          Più popolare
        </span>
      )}
      <button
        onClick={() => { setDraft(plan); setEditing(true); }}
        className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity"
      >
        <Edit2 size={13} className="text-text-muted" />
      </button>
      <p className={`text-sm font-medium ${plan.highlighted ? 'text-primary-600' : 'text-text-secondary'}`}>{plan.name}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-text-primary">€{plan.price}</span>
        <span className="text-xs text-text-muted">/{plan.billingPeriod}</span>
      </div>
      {plan.credits !== undefined && (
        <p className="text-xs font-medium text-teal-600 mt-1">{plan.credits === 200 ? 'Illimitati' : `${plan.credits} crediti`}</p>
      )}
      <p className="text-xs text-text-muted mt-2 leading-relaxed">{plan.description}</p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SystemPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'security' | 'notifications' | 'payments'>('settings');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);
  const [agencyPlans, setAgencyPlans] = useState(INITIAL_AGENCY_PLANS);
  const [tenantPlans, setTenantPlans] = useState(INITIAL_TENANT_PLANS);

  const tabs = [
    { id: 'settings', label: 'Impostazioni', icon: <Settings size={18} /> },
    { id: 'security', label: 'Sicurezza', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifiche', icon: <Bell size={18} /> },
    { id: 'payments', label: 'Pagamenti', icon: <CreditCard size={18} /> },
  ];

  const updateAgencyPlan = (updated: PricePlan) =>
    setAgencyPlans(prev => prev.map(p => p.id === updated.id ? updated : p));

  const updateTenantPlan = (updated: PricePlan) =>
    setTenantPlans(prev => prev.map(p => p.id === updated.id ? updated : p));

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-primary-500' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Impostazioni Sistema</h1>
        <p className="text-text-secondary">Gestisci le configurazioni della piattaforma</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

      {/* ── Impostazioni ── */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Impostazioni Generali</CardTitle></CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Modalità Manutenzione</p>
                  <p className="text-sm text-text-muted">Disabilita l'accesso agli utenti durante la manutenzione</p>
                </div>
                <Toggle value={maintenanceMode} onChange={() => setMaintenanceMode(v => !v)} />
              </div>
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                <div>
                  <p className="font-medium">Backup Automatico</p>
                  <p className="text-sm text-text-muted">Esegui backup giornaliero alle 03:00</p>
                </div>
                <Toggle value={autoBackup} onChange={() => setAutoBackup(v => !v)} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nome Piattaforma" defaultValue="Affittochiaro" />
                <Input label="Email Supporto" defaultValue="support@affittochiaro.it" />
                <Input label="Telefono Supporto" defaultValue="+39 02 1234567" />
                <Input label="URL Sito" defaultValue="https://affittochiaro.it" />
              </div>
              <Button leftIcon={<Save size={16} />} onClick={() => toast.success('Impostazioni salvate')}>
                Salva Impostazioni
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Sicurezza ── */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Impostazioni Sicurezza</CardTitle></CardHeader>
            <div className="space-y-4">
              {[
                { icon: <Lock size={20} className="text-primary-500" />, label: 'Autenticazione a Due Fattori', desc: 'Richiedi 2FA per tutti gli admin', active: true },
                { icon: <Shield size={20} className="text-primary-500" />, label: 'Blocco IP Sospetti', desc: 'Blocca automaticamente IP con attività sospetta', active: true },
                { icon: <Key size={20} className="text-primary-500" />, label: 'Scadenza Password', desc: 'Forza cambio password ogni 90 giorni', active: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                  </div>
                  <Badge variant={item.active ? 'success' : 'warning'}>{item.active ? 'Attivo' : 'Disattivo'}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Notifiche ── */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Notifiche Email</CardTitle></CardHeader>
            <div className="space-y-4">
              {[
                { label: 'Nuove Registrazioni', desc: 'Ricevi email per ogni nuova registrazione', value: emailNotifications, onChange: () => setEmailNotifications(v => !v) },
                { label: 'Nuovi Pagamenti', desc: 'Notifica per ogni pagamento ricevuto', value: notifPayments, onChange: () => setNotifPayments(v => !v) },
                { label: 'Report Settimanale', desc: 'Ricevi un riepilogo settimanale delle attività', value: notifWeekly, onChange: () => setNotifWeekly(v => !v) },
                { label: 'Avvisi di Sistema', desc: 'Notifiche per errori e problemi di sistema', value: notifSystem, onChange: () => setNotifSystem(v => !v) },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-background-secondary rounded-xl">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Pagamenti / Prezzi Piani ── */}
      {activeTab === 'payments' && (
        <div className="space-y-8">
          {/* Agency Plans */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-teal-600" />
                <CardTitle>Piani Agenzie</CardTitle>
              </div>
            </CardHeader>
            <p className="text-sm text-text-muted mb-4">Passa il cursore su un piano e clicca la matita per modificarlo.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {agencyPlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} onSave={updateAgencyPlan} />
              ))}
            </div>
          </Card>

          {/* Tenant Plans */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary-600" />
                <CardTitle>Piani Inquilini</CardTitle>
              </div>
            </CardHeader>
            <p className="text-sm text-text-muted mb-4">Passa il cursore su un piano e clicca la matita per modificarlo.</p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
              {tenantPlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} onSave={updateTenantPlan} />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
