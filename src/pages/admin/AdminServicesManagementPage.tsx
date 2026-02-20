import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Sparkles, FileText, Home, HelpCircle } from 'lucide-react';
import { Card, Button, Badge, Modal, ModalFooter, Input } from '../../components/ui';
import toast from 'react-hot-toast';

type ServiceStatus = 'active' | 'coming_soon' | 'disabled';
type ServiceCategory = 'Contratti & Burocrazia' | 'Certificazioni' | 'Casa & Logistica' | 'Consulenza';

interface ManagedService {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  icon: string;
  targetRole: 'tenant' | 'agency' | 'both';
  price?: number;
  order: number;
}

const STATUS_CONFIG: Record<ServiceStatus, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  active: { label: 'Attivo', variant: 'success' },
  coming_soon: { label: 'Prossimamente', variant: 'warning' },
  disabled: { label: 'Disabilitato', variant: 'neutral' },
};

const CATEGORIES: ServiceCategory[] = ['Contratti & Burocrazia', 'Certificazioni', 'Casa & Logistica', 'Consulenza'];

const INITIAL_SERVICES: ManagedService[] = [
  { id: '1', title: 'Redazione Contratto', description: 'Contratto di locazione redatto da avvocati specializzati', category: 'Contratti & Burocrazia', status: 'coming_soon', icon: '📄', targetRole: 'agency', order: 1 },
  { id: '2', title: 'Registrazione Contratto', description: 'Registrazione automatica all\'Agenzia delle Entrate', category: 'Contratti & Burocrazia', status: 'coming_soon', icon: '🏛️', targetRole: 'both', order: 2 },
  { id: '3', title: 'Cedolare Secca', description: 'Gestione regime fiscale agevolato', category: 'Contratti & Burocrazia', status: 'coming_soon', icon: '💰', targetRole: 'agency', order: 3 },
  { id: '4', title: 'Attestato di Prestazione Energetica', description: 'APE certificato da tecnici abilitati', category: 'Certificazioni', status: 'coming_soon', icon: '⚡', targetRole: 'agency', order: 4 },
  { id: '5', title: 'Visura Catastale', description: 'Visure catastali e ipotecarie aggiornate', category: 'Certificazioni', status: 'coming_soon', icon: '🗺️', targetRole: 'both', order: 5 },
  { id: '6', title: 'Servizio di Trasloco', description: 'Trasloco professionale con preventivo online', category: 'Casa & Logistica', status: 'coming_soon', icon: '🚚', targetRole: 'tenant', order: 6 },
  { id: '7', title: 'Pulizie Professionali', description: 'Pulizia profonda appartamento al cambio inquilino', category: 'Casa & Logistica', status: 'coming_soon', icon: '🧹', targetRole: 'both', order: 7 },
  { id: '8', title: 'Utenze Domestiche', description: 'Attivazione e cambio intestazione utenze', category: 'Casa & Logistica', status: 'coming_soon', icon: '💡', targetRole: 'tenant', order: 8 },
  { id: '9', title: 'Assicurazione Affitto', description: 'Polizza tutela affitti e danni all\'immobile', category: 'Casa & Logistica', status: 'coming_soon', icon: '🛡️', targetRole: 'both', order: 9 },
  { id: '10', title: 'Consulenza Legale', description: 'Consulenza con avvocato specializzato in locazioni', category: 'Consulenza', status: 'coming_soon', icon: '⚖️', targetRole: 'both', order: 10 },
  { id: '11', title: 'Consulenza Fiscale', description: 'Ottimizzazione fiscale per proprietari e agenzie', category: 'Consulenza', status: 'coming_soon', icon: '📊', targetRole: 'agency', order: 11 },
];

const EMPTY_FORM: Omit<ManagedService, 'id'> = {
  title: '', description: '', category: 'Contratti & Burocrazia', status: 'coming_soon', icon: '⭐', targetRole: 'both', order: 99,
};

export default function AdminServicesManagementPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ManagedService | null>(null);
  const [form, setForm] = useState<Omit<ManagedService, 'id'>>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<ManagedService | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | ''>('');

  const filtered = categoryFilter ? services.filter(s => s.category === categoryFilter) : services;
  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filtered.filter(s => s.category === cat).sort((a, b) => a.order - b.order);
    return acc;
  }, {} as Record<ServiceCategory, ManagedService[]>);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (s: ManagedService) => { setEditing(s); setForm({ title: s.title, description: s.description, category: s.category, status: s.status, icon: s.icon, targetRole: s.targetRole, order: s.order, price: s.price }); setShowModal(true); };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Inserisci un titolo'); return; }
    if (editing) {
      setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s));
      toast.success('Servizio aggiornato');
    } else {
      setServices(prev => [...prev, { ...form, id: Date.now().toString() }]);
      toast.success('Servizio creato');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setServices(prev => prev.filter(s => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('Servizio eliminato');
  };

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next: ServiceStatus = s.status === 'active' ? 'disabled' : s.status === 'disabled' ? 'coming_soon' : 'active';
      return { ...s, status: next };
    }));
  };

  const stats = {
    active: services.filter(s => s.status === 'active').length,
    comingSoon: services.filter(s => s.status === 'coming_soon').length,
    disabled: services.filter(s => s.status === 'disabled').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestione Servizi</h1>
          <p className="text-text-secondary">Catalogo servizi visibile a inquilini e agenzie</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>Nuovo Servizio</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Attivi', value: stats.active, color: 'text-green-600' },
          { label: 'Prossimamente', value: stats.comingSoon, color: 'text-yellow-600' },
          { label: 'Disabilitati', value: stats.disabled, color: 'text-gray-400' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoryFilter ? 'bg-primary-600 text-white' : 'bg-background-secondary hover:bg-gray-100 text-text-secondary'}`}
        >
          Tutte
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-primary-600 text-white' : 'bg-background-secondary hover:bg-gray-100 text-text-secondary'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services by category */}
      {CATEGORIES.filter(cat => !categoryFilter || cat === categoryFilter).map(cat => (
        grouped[cat].length > 0 && (
          <div key={cat}>
            <h2 className="text-lg font-semibold text-text-primary mb-3">{cat}</h2>
            <div className="space-y-2">
              {grouped[cat].map(s => (
                <Card key={s.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-text-primary">{s.title}</p>
                        <Badge variant={STATUS_CONFIG[s.status].variant}>{STATUS_CONFIG[s.status].label}</Badge>
                        <span className="text-xs text-text-muted capitalize">{s.targetRole === 'both' ? 'Tutti' : s.targetRole === 'agency' ? 'Agenzie' : 'Inquilini'}</span>
                      </div>
                      <p className="text-sm text-text-secondary truncate">{s.description}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        className="p-1.5 rounded-lg hover:bg-background-secondary"
                        onClick={() => toggleStatus(s.id)}
                        title="Cambia stato"
                      >
                        {s.status === 'active' ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} className="text-gray-400" />}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-background-secondary" onClick={() => openEdit(s)}>
                        <Edit2 size={15} className="text-text-muted" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50" onClick={() => setDeleteTarget(s)}>
                        <Trash2 size={15} className="text-error" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      ))}

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal isOpen onClose={() => setShowModal(false)} title={editing ? 'Modifica Servizio' : 'Nuovo Servizio'} size="md">
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Emoji / Icona</label>
                <Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="es. 📄" maxLength={4} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Ordine</label>
                <Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Titolo *</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nome del servizio" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Descrizione</label>
                <textarea rows={2} className="input resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Breve descrizione del servizio" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Categoria</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ServiceCategory }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Visibile a</label>
                <select className="input" value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value as 'tenant' | 'agency' | 'both' }))}>
                  <option value="both">Tutti</option>
                  <option value="agency">Solo Agenzie</option>
                  <option value="tenant">Solo Inquilini</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Stato</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ServiceStatus }))}>
                  <option value="active">Attivo</option>
                  <option value="coming_soon">Prossimamente</option>
                  <option value="disabled">Disabilitato</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Prezzo (€, opzionale)</label>
                <Input type="number" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: e.target.value ? +e.target.value : undefined }))} placeholder="0" />
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annulla</Button>
            <Button onClick={handleSave}>{editing ? 'Salva Modifiche' : 'Crea Servizio'}</Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <Modal isOpen onClose={() => setDeleteTarget(null)} title="Elimina Servizio" size="sm">
          <div className="p-4">
            <p className="text-text-secondary">Eliminare <strong>{deleteTarget.title}</strong>? Questa azione non può essere annullata.</p>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Annulla</Button>
            <Button variant="danger" onClick={handleDelete}>Elimina</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
