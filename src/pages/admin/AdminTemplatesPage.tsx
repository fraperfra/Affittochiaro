import { useState, useMemo } from 'react';
import {
  FileText, Plus, Edit3, Eye, Trash2, Search, Copy,
  Mail, Bell, Shield, Settings, Check, MoreVertical,
  ToggleLeft, ToggleRight, AlertTriangle, Code
} from 'lucide-react';

interface SystemTemplate {
  id: string;
  name: string;
  description: string;
  category: 'email' | 'notification' | 'system' | 'legal';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  lastModified: string;
  modifiedBy: string;
  version: number;
}

const SYSTEM_TEMPLATES: SystemTemplate[] = [
  // Email Templates
  {
    id: 'email_welcome',
    name: 'Email di Benvenuto',
    description: 'Inviata automaticamente alla registrazione di un nuovo utente.',
    category: 'email',
    subject: 'Benvenuto su Affittochiaro, {{nome}}!',
    content: 'Ciao {{nome}},\n\nBenvenuto su Affittochiaro! Il tuo account e stato creato con successo.\n\nEcco i prossimi passi:\n1. Completa il tuo profilo\n2. Carica i tuoi documenti\n3. Inizia a cercare casa\n\nSe hai bisogno di aiuto, contattaci a supporto@affittochiaro.it\n\nIl team Affittochiaro',
    variables: ['nome', 'email', 'ruolo'],
    isActive: true,
    lastModified: '2024-12-15T10:30:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 3,
  },
  {
    id: 'email_verify',
    name: 'Verifica Email',
    description: 'Codice OTP per la verifica dell\'indirizzo email.',
    category: 'email',
    subject: 'Il tuo codice di verifica: {{codice}}',
    content: 'Ciao {{nome}},\n\nIl tuo codice di verifica e: {{codice}}\n\nQuesto codice scade tra 15 minuti.\n\nSe non hai richiesto questo codice, ignora questa email.\n\nIl team Affittochiaro',
    variables: ['nome', 'codice'],
    isActive: true,
    lastModified: '2024-11-20T14:00:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 2,
  },
  {
    id: 'email_reset_password',
    name: 'Reset Password',
    description: 'Link per il reset della password dell\'utente.',
    category: 'email',
    subject: 'Reset della password - Affittochiaro',
    content: 'Ciao {{nome}},\n\nHai richiesto il reset della password. Clicca sul link seguente per impostare una nuova password:\n\n{{link_reset}}\n\nIl link scade tra 1 ora.\n\nSe non hai richiesto il reset, contattaci immediatamente.\n\nIl team Affittochiaro',
    variables: ['nome', 'link_reset'],
    isActive: true,
    lastModified: '2024-10-05T09:15:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 1,
  },
  {
    id: 'email_doc_verified',
    name: 'Documento Verificato',
    description: 'Notifica quando un documento viene approvato.',
    category: 'email',
    subject: 'Documento verificato: {{tipo_documento}}',
    content: 'Ciao {{nome}},\n\nIl tuo documento "{{tipo_documento}}" e stato verificato con successo.\n\nIl tuo punteggio di affidabilita e stato aggiornato.\n\nIl team Affittochiaro',
    variables: ['nome', 'tipo_documento'],
    isActive: true,
    lastModified: '2024-12-01T16:45:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 2,
  },
  {
    id: 'email_doc_rejected',
    name: 'Documento Rifiutato',
    description: 'Notifica quando un documento viene rifiutato con motivazione.',
    category: 'email',
    subject: 'Documento da correggere: {{tipo_documento}}',
    content: 'Ciao {{nome}},\n\nIl tuo documento "{{tipo_documento}}" non ha superato la verifica.\n\nMotivo: {{motivo_rifiuto}}\n\nPuoi ricaricare una versione corretta dalla tua area documenti.\n\nIl team Affittochiaro',
    variables: ['nome', 'tipo_documento', 'motivo_rifiuto'],
    isActive: true,
    lastModified: '2024-12-01T16:50:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 2,
  },
  // Notification Templates
  {
    id: 'notif_new_application',
    name: 'Nuova Candidatura',
    description: 'Notifica push/in-app per nuova candidatura ricevuta (agenzia).',
    category: 'notification',
    content: '{{nome_inquilino}} ha inviato una candidatura per "{{titolo_annuncio}}"',
    variables: ['nome_inquilino', 'titolo_annuncio', 'id_annuncio'],
    isActive: true,
    lastModified: '2024-11-10T11:00:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 1,
  },
  {
    id: 'notif_message',
    name: 'Nuovo Messaggio',
    description: 'Notifica per un nuovo messaggio nella chat.',
    category: 'notification',
    content: 'Nuovo messaggio da {{mittente}}: "{{anteprima}}"',
    variables: ['mittente', 'anteprima', 'id_conversazione'],
    isActive: true,
    lastModified: '2024-11-10T11:05:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 1,
  },
  {
    id: 'notif_listing_match',
    name: 'Match Annuncio',
    description: 'Notifica quando un nuovo annuncio corrisponde alle preferenze (inquilino).',
    category: 'notification',
    content: 'Nuovo annuncio in {{citta}}: {{titolo_annuncio}} - {{prezzo}}/mese',
    variables: ['citta', 'titolo_annuncio', 'prezzo', 'id_annuncio'],
    isActive: true,
    lastModified: '2024-12-20T08:30:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 2,
  },
  // System Templates
  {
    id: 'sys_maintenance',
    name: 'Avviso Manutenzione',
    description: 'Banner/pagina visualizzato durante la manutenzione programmata.',
    category: 'system',
    content: 'Affittochiaro e in manutenzione programmata. Torneremo online alle {{ora_fine}}. Ci scusiamo per il disagio.',
    variables: ['ora_inizio', 'ora_fine', 'data'],
    isActive: false,
    lastModified: '2024-12-28T22:00:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 4,
  },
  {
    id: 'sys_terms_update',
    name: 'Aggiornamento Termini',
    description: 'Notifica di aggiornamento dei termini di servizio.',
    category: 'system',
    content: 'I Termini di Servizio di Affittochiaro sono stati aggiornati in data {{data_aggiornamento}}. Le modifiche entrano in vigore il {{data_effettiva}}. Consulta i nuovi termini nella sezione dedicata.',
    variables: ['data_aggiornamento', 'data_effettiva', 'link_termini'],
    isActive: true,
    lastModified: '2024-09-15T10:00:00Z',
    modifiedBy: 'admin@affittochiaro.it',
    version: 1,
  },
  // Legal Templates
  {
    id: 'legal_privacy',
    name: 'Informativa Privacy',
    description: 'Template dell\'informativa privacy per il trattamento dati.',
    category: 'legal',
    content: 'INFORMATIVA SULLA PRIVACY\n\nAi sensi del Regolamento UE 2016/679 (GDPR), informiamo che i dati personali forniti saranno trattati da {{titolare}} per le finalita di {{finalita}}.\n\nBase giuridica: {{base_giuridica}}\nConservazione: {{periodo_conservazione}}\n\nDiritti dell\'interessato: accesso, rettifica, cancellazione, portabilita.',
    variables: ['titolare', 'finalita', 'base_giuridica', 'periodo_conservazione'],
    isActive: true,
    lastModified: '2024-08-01T09:00:00Z',
    modifiedBy: 'legal@affittochiaro.it',
    version: 5,
  },
  {
    id: 'legal_consent',
    name: 'Consenso Trattamento Dati',
    description: 'Testo per la richiesta di consenso al trattamento dei dati personali.',
    category: 'legal',
    content: 'Acconsento al trattamento dei miei dati personali da parte di {{titolare}} per le finalita descritte nell\'informativa privacy. Dichiaro di aver letto e compreso l\'informativa.',
    variables: ['titolare'],
    isActive: true,
    lastModified: '2024-08-01T09:30:00Z',
    modifiedBy: 'legal@affittochiaro.it',
    version: 3,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tutti', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'notification', label: 'Notifiche', icon: Bell },
  { id: 'system', label: 'Sistema', icon: Settings },
  { id: 'legal', label: 'Legale', icon: Shield },
];

export default function AdminTemplatesPage() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [templates, setTemplates] = useState(SYSTEM_TEMPLATES);

  const filtered = useMemo(() => {
    let result = [...templates];
    if (category !== 'all') {
      result = result.filter(t => t.category === category);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [templates, category, searchQuery]);

  const stats = useMemo(() => ({
    total: templates.length,
    active: templates.filter(t => t.isActive).length,
    inactive: templates.filter(t => !t.isActive).length,
    emails: templates.filter(t => t.category === 'email').length,
  }), [templates]);

  const toggleActive = (id: string) => {
    setTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const categoryColors: Record<string, string> = {
    email: 'bg-blue-50 text-blue-600 border-blue-100',
    notification: 'bg-amber-50 text-amber-600 border-amber-100',
    system: 'bg-gray-50 text-gray-600 border-gray-200',
    legal: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const categoryLabels: Record<string, string> = {
    email: 'Email',
    notification: 'Notifica',
    system: 'Sistema',
    legal: 'Legale',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Template di Sistema</h1>
          <p className="text-text-secondary">
            Gestisci i template per email, notifiche, messaggi di sistema e documenti legali
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nuovo Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <FileText size={20} className="text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-text-muted">Template Totali</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Check size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
              <p className="text-xs text-text-muted">Attivi</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
              <p className="text-xs text-text-muted">Disattivati</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.emails}</p>
              <p className="text-xs text-text-muted">Template Email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const count = cat.id === 'all'
            ? templates.length
            : templates.filter(t => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-text-secondary hover:bg-background-secondary border border-border'
              }`}
            >
              <Icon size={16} />
              {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                category === cat.id ? 'bg-white/20' : 'bg-background-secondary'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Cerca template per nome, descrizione o contenuto..."
          className="input pl-9 text-sm"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Template List */}
      <div className="space-y-3">
        {filtered.map(template => {
          const isExpanded = expandedId === template.id;

          return (
            <div
              key={template.id}
              className={`bg-white rounded-xl shadow-card overflow-hidden ${
                !template.isActive ? 'opacity-70' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleActive(template.id)}
                    className="flex-shrink-0 mt-1"
                    title={template.isActive ? 'Disattiva' : 'Attiva'}
                  >
                    {template.isActive ? (
                      <ToggleRight size={28} className="text-success" />
                    ) : (
                      <ToggleLeft size={28} className="text-gray-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-text-primary">{template.name}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColors[template.category]}`}>
                        {categoryLabels[template.category]}
                      </span>
                      <span className="text-[10px] text-text-muted">v{template.version}</span>
                    </div>
                    <p className="text-sm text-text-muted">{template.description}</p>
                    {template.subject && (
                      <p className="text-xs text-text-secondary mt-1">
                        Oggetto: <span className="font-mono">{template.subject}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                      <span>Modificato: {formatDate(template.lastModified)}</span>
                      <span>Da: {template.modifiedBy}</span>
                      <span>{template.variables.length} variabili</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : template.id)}
                      className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors"
                      title="Anteprima"
                    >
                      <Eye size={16} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMenuId(menuId === template.id ? null : template.id)}
                        className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuId === template.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                          <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-lg shadow-lg border border-border py-1">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary">
                              <Edit3 size={14} />
                              Modifica
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary">
                              <Copy size={14} />
                              Duplica
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary">
                              <Code size={14} />
                              Vedi JSON
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-red-50">
                              <Trash2 size={14} />
                              Elimina
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Contenuto Template</h4>
                    <pre className="bg-gray-50 rounded-lg p-3 text-sm text-text-primary whitespace-pre-wrap font-sans border border-gray-100">
                      {template.content}
                    </pre>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Variabili Disponibili</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {template.variables.map(v => (
                        <span key={v} className="px-2 py-1 text-xs font-mono bg-primary-50 text-primary-600 rounded border border-primary-100">
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                    <span>ID: {template.id}</span>
                    <span>Versione: {template.version}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-card text-center">
          <FileText size={40} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary mb-1">Nessun template trovato</h3>
          <p className="text-sm text-text-muted">Prova a modificare i filtri di ricerca</p>
        </div>
      )}

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-medium mb-1">Attenzione</p>
          <p className="text-amber-600">
            Modificare i template di sistema puo influire sulle comunicazioni inviate agli utenti.
            Le modifiche vengono applicate immediatamente. Si consiglia di testare sempre
            le modifiche prima di attivare un template in produzione.
          </p>
        </div>
      </div>
    </div>
  );
}
