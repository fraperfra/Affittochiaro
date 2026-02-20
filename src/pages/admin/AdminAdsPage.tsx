import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Megaphone, ToggleLeft, ToggleRight, Monitor, Smartphone, Layout, Type, Image as ImageIcon, ExternalLink, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge, Modal, ModalFooter, Input } from '../../components/ui';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

type AdPlacement =
  | 'homepage_hero_banner'
  | 'homepage_below_cities'
  | 'tenant_dashboard_top'
  | 'tenant_listings_sidebar'
  | 'agency_dashboard_top'
  | 'agency_tenants_sidebar'
  | 'landing_footer_cta';

type AdType = 'banner' | 'card' | 'cta' | 'popup';
type AdStatus = 'active' | 'paused' | 'draft';
type AdTarget = 'all' | 'tenant' | 'agency' | 'public';

interface AdContent {
  title?: string;
  subtitle?: string;
  body?: string;
  ctaText?: string;
  ctaUrl?: string;
  bgColor?: string;
  textColor?: string;
  imageUrl?: string;
  badgeText?: string;
}

interface Ad {
  id: string;
  name: string;
  placement: AdPlacement;
  type: AdType;
  target: AdTarget;
  status: AdStatus;
  content: AdContent;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

const PLACEMENT_CONFIG: Record<AdPlacement, { label: string; description: string; device: 'both' | 'desktop' | 'mobile' }> = {
  homepage_hero_banner: { label: 'Homepage — Hero Banner', description: 'Banner grande in cima alla homepage pubblica', device: 'both' },
  homepage_below_cities: { label: 'Homepage — Sotto Mappa Città', description: 'Spazio pubblicitario sotto la sezione città', device: 'both' },
  tenant_dashboard_top: { label: 'Dashboard Inquilino — Top', description: 'Banner in cima alla dashboard dell\'inquilino', device: 'both' },
  tenant_listings_sidebar: { label: 'Cerca Annunci — Sidebar', description: 'Card laterale nella ricerca annunci', device: 'desktop' },
  agency_dashboard_top: { label: 'Dashboard Agenzia — Top', description: 'Banner in cima alla dashboard dell\'agenzia', device: 'both' },
  agency_tenants_sidebar: { label: 'Cerca Inquilini — Sidebar', description: 'Card laterale nella ricerca inquilini', device: 'desktop' },
  landing_footer_cta: { label: 'Landing — Footer CTA', description: 'Call-to-action prima del footer in tutte le pagine pubbliche', device: 'both' },
};

const AD_TYPE_LABELS: Record<AdType, string> = {
  banner: 'Banner', card: 'Card', cta: 'CTA', popup: 'Popup',
};

const STATUS_CONFIG: Record<AdStatus, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  active: { label: 'Attivo', variant: 'success' },
  paused: { label: 'In pausa', variant: 'warning' },
  draft: { label: 'Bozza', variant: 'neutral' },
};

const TARGET_LABELS: Record<AdTarget, string> = {
  all: 'Tutti', tenant: 'Inquilini', agency: 'Agenzie', public: 'Pubblico',
};

const INITIAL_ADS: Ad[] = [
  {
    id: '1', name: 'Promo Piano Pro Agenzie', placement: 'agency_dashboard_top', type: 'banner', target: 'agency',
    status: 'active',
    content: { title: '🚀 Passa al Piano Pro', subtitle: 'Sblocca profili illimitati e funzionalità avanzate', ctaText: 'Scopri il Piano Pro', ctaUrl: '/agency/plan', bgColor: '#004832', textColor: '#ffffff', badgeText: 'Offerta Limitata' },
    impressions: 4820, clicks: 312, createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: '2', name: 'Completa il Profilo — Inquilini', placement: 'tenant_dashboard_top', type: 'cta', target: 'tenant',
    status: 'active',
    content: { title: 'Il tuo profilo è incompleto', body: 'Completa il tuo CV dell\'inquilino per aumentare le possibilità di trovare casa.', ctaText: 'Completa ora', ctaUrl: '/tenant/profile', bgColor: '#f0fdf4', textColor: '#004832' },
    impressions: 6120, clicks: 891, createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: '3', name: 'Banner Homepage — Registrazione', placement: 'homepage_hero_banner', type: 'banner', target: 'public',
    status: 'draft',
    content: { title: 'Trova casa con il tuo CV inquilino', subtitle: 'La piattaforma che mette in contatto inquilini affidabili con le migliori agenzie', ctaText: 'Inizia Gratis', ctaUrl: '/register', bgColor: '#00D094', textColor: '#004832', badgeText: 'Nuovo' },
    impressions: 0, clicks: 0, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const EMPTY_AD: Omit<Ad, 'id' | 'impressions' | 'clicks' | 'createdAt' | 'updatedAt'> = {
  name: '', placement: 'tenant_dashboard_top', type: 'banner', target: 'all', status: 'draft',
  content: { title: '', subtitle: '', body: '', ctaText: 'Scopri di più', ctaUrl: '', bgColor: '#004832', textColor: '#ffffff' },
};

// Live Preview component
function AdPreview({ content, type, placement }: { content: AdContent; type: AdType; placement: AdPlacement }) {
  const bg = content.bgColor || '#004832';
  const text = content.textColor || '#ffffff';
  const isLight = text === '#ffffff' || text.toLowerCase() === '#ffffff';

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ backgroundColor: bg, color: text }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: text }} />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: text }} />

      <div className="relative">
        {content.badgeText && (
          <span className="inline-block text-xs font-bold px-2 py-1 rounded-full mb-3" style={{ backgroundColor: text, color: bg }}>
            {content.badgeText}
          </span>
        )}
        {content.title && <p className="font-bold text-lg leading-tight">{content.title}</p>}
        {content.subtitle && <p className="text-sm mt-1 opacity-80">{content.subtitle}</p>}
        {content.body && <p className="text-sm mt-2 opacity-75 leading-relaxed">{content.body}</p>}
        {content.ctaText && (
          <div className="mt-4">
            <span className="inline-block text-sm font-semibold px-4 py-2 rounded-xl" style={{ backgroundColor: text, color: bg }}>
              {content.ctaText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState(INITIAL_ADS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState<Omit<Ad, 'id' | 'impressions' | 'clicks' | 'createdAt' | 'updatedAt'>>(EMPTY_AD);
  const [deleteTarget, setDeleteTarget] = useState<Ad | null>(null);
  const [placementFilter, setPlacementFilter] = useState<AdPlacement | ''>('');
  const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('desktop');

  const filtered = placementFilter ? ads.filter(a => a.placement === placementFilter) : ads;

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_AD);
    setShowModal(true);
  };

  const openEdit = (a: Ad) => {
    setEditing(a);
    setForm({ name: a.name, placement: a.placement, type: a.type, target: a.target, status: a.status, content: { ...a.content }, startDate: a.startDate, endDate: a.endDate });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Inserisci un nome per l\'annuncio'); return; }
    const now = new Date().toISOString();
    if (editing) {
      setAds(prev => prev.map(a => a.id === editing.id ? { ...a, ...form, updatedAt: now } : a));
      toast.success('Annuncio aggiornato');
    } else {
      setAds(prev => [...prev, { ...form, id: Date.now().toString(), impressions: 0, clicks: 0, createdAt: now, updatedAt: now }]);
      toast.success('Annuncio creato');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setAds(prev => prev.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('Annuncio eliminato');
  };

  const toggleStatus = (id: string) => {
    setAds(prev => prev.map(a => {
      if (a.id !== id) return a;
      const next: AdStatus = a.status === 'active' ? 'paused' : 'active';
      return { ...a, status: next, updatedAt: new Date().toISOString() };
    }));
  };

  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clicks, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  const updateContent = (key: keyof AdContent, value: string) => {
    setForm(f => ({ ...f, content: { ...f.content, [key]: value } }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Pubblicità & CMS</h1>
          <p className="text-text-secondary">Gestisci banner e contenuti promozionali nell'app</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>Nuovo Annuncio</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Annunci Attivi', value: ads.filter(a => a.status === 'active').length, color: 'text-green-600' },
          { label: 'Placement Disponibili', value: Object.keys(PLACEMENT_CONFIG).length, color: 'text-primary-600' },
          { label: 'Impression Totali', value: totalImpressions.toLocaleString(), color: 'text-teal-600' },
          { label: 'CTR Medio', value: `${ctr}%`, color: 'text-accent-600' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Placement filter */}
      <Card className="p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setPlacementFilter('')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!placementFilter ? 'bg-primary-600 text-white' : 'bg-background-secondary hover:bg-gray-100 text-text-secondary'}`}
          >
            Tutti i placement
          </button>
          {(Object.keys(PLACEMENT_CONFIG) as AdPlacement[]).map(p => (
            <button
              key={p}
              onClick={() => setPlacementFilter(p)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${placementFilter === p ? 'bg-primary-600 text-white' : 'bg-background-secondary hover:bg-gray-100 text-text-secondary'}`}
            >
              {PLACEMENT_CONFIG[p].label}
            </button>
          ))}
        </div>
      </Card>

      {/* Ad cards */}
      <div className="space-y-4">
        {filtered.map(a => (
          <Card key={a.id} className="p-5">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Preview thumbnail */}
              <div className="sm:w-64 flex-shrink-0">
                <AdPreview content={a.content} type={a.type} placement={a.placement} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={STATUS_CONFIG[a.status].variant}>{STATUS_CONFIG[a.status].label}</Badge>
                      <span className="text-xs bg-background-secondary px-2 py-0.5 rounded-full">{AD_TYPE_LABELS[a.type]}</span>
                      <span className="text-xs bg-background-secondary px-2 py-0.5 rounded-full">{TARGET_LABELS[a.target]}</span>
                    </div>
                    <p className="font-semibold text-text-primary">{a.name}</p>
                    <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1.5">
                      <Layout size={13} />
                      {PLACEMENT_CONFIG[a.placement].label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-muted">
                      {PLACEMENT_CONFIG[a.placement].device === 'desktop' ? <Monitor size={12} /> : PLACEMENT_CONFIG[a.placement].device === 'mobile' ? <Smartphone size={12} /> : <><Monitor size={12} /><Smartphone size={12} /></>}
                      {PLACEMENT_CONFIG[a.placement].device === 'both' ? 'Desktop & Mobile' : PLACEMENT_CONFIG[a.placement].device === 'desktop' ? 'Solo Desktop' : 'Solo Mobile'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-1.5 rounded-lg hover:bg-background-secondary" onClick={() => toggleStatus(a.id)} title={a.status === 'active' ? 'Metti in pausa' : 'Attiva'}>
                      {a.status === 'active' ? <ToggleRight size={18} className="text-green-600" /> : <ToggleLeft size={18} className="text-gray-400" />}
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-background-secondary" onClick={() => openEdit(a)}>
                      <Edit2 size={15} className="text-text-muted" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50" onClick={() => setDeleteTarget(a)}>
                      <Trash2 size={15} className="text-error" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-text-muted">Impression</p>
                    <p className="font-semibold text-sm mt-0.5">{a.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Click</p>
                    <p className="font-semibold text-sm mt-0.5">{a.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">CTR</p>
                    <p className="font-semibold text-sm mt-0.5">{a.impressions > 0 ? ((a.clicks / a.impressions) * 100).toFixed(1) : '0.0'}%</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <Megaphone size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">Nessun annuncio per questo placement</p>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal isOpen onClose={() => setShowModal(false)} title={editing ? 'Modifica Annuncio' : 'Nuovo Annuncio'} size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Form */}
            <div className="space-y-4 p-4 border-r border-border">
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Configurazione</p>
              <div>
                <label className="block text-sm font-medium mb-1.5">Nome Annuncio *</label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome interno dell'annuncio" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Placement</label>
                <select className="input" value={form.placement} onChange={e => setForm(f => ({ ...f, placement: e.target.value as AdPlacement }))}>
                  {(Object.keys(PLACEMENT_CONFIG) as AdPlacement[]).map(p => (
                    <option key={p} value={p}>{PLACEMENT_CONFIG[p].label}</option>
                  ))}
                </select>
                <p className="text-xs text-text-muted mt-1">{PLACEMENT_CONFIG[form.placement].description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tipo</label>
                  <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as AdType }))}>
                    {(Object.keys(AD_TYPE_LABELS) as AdType[]).map(t => <option key={t} value={t}>{AD_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Visibile a</label>
                  <select className="input" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value as AdTarget }))}>
                    {(Object.keys(TARGET_LABELS) as AdTarget[]).map(t => <option key={t} value={t}>{TARGET_LABELS[t]}</option>)}
                  </select>
                </div>
              </div>

              <hr className="border-border" />
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Contenuto</p>

              <div>
                <label className="block text-sm font-medium mb-1.5">Titolo</label>
                <Input value={form.content.title || ''} onChange={e => updateContent('title', e.target.value)} placeholder="Titolo principale" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Sottotitolo</label>
                <Input value={form.content.subtitle || ''} onChange={e => updateContent('subtitle', e.target.value)} placeholder="Sottotitolo opzionale" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Testo corpo</label>
                <textarea rows={2} className="input resize-none" value={form.content.body || ''} onChange={e => updateContent('body', e.target.value)} placeholder="Testo aggiuntivo" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Testo CTA</label>
                  <Input value={form.content.ctaText || ''} onChange={e => updateContent('ctaText', e.target.value)} placeholder="es. Scopri di più" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">URL CTA</label>
                  <Input value={form.content.ctaUrl || ''} onChange={e => updateContent('ctaUrl', e.target.value)} placeholder="/agency/plan" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Badge</label>
                  <Input value={form.content.badgeText || ''} onChange={e => updateContent('badgeText', e.target.value)} placeholder="Novità" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Colore sfondo</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.content.bgColor || '#004832'} onChange={e => updateContent('bgColor', e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer p-1" />
                    <Input value={form.content.bgColor || ''} onChange={e => updateContent('bgColor', e.target.value)} className="flex-1" placeholder="#004832" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Colore testo</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.content.textColor || '#ffffff'} onChange={e => updateContent('textColor', e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer p-1" />
                    <Input value={form.content.textColor || ''} onChange={e => updateContent('textColor', e.target.value)} className="flex-1" placeholder="#ffffff" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Stato</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as AdStatus }))}>
                  <option value="draft">Bozza</option>
                  <option value="active">Attivo</option>
                  <option value="paused">In pausa</option>
                </select>
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-4 bg-background-secondary">
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">Anteprima Live</p>
              <div className="flex gap-2 mb-4">
                {(['desktop', 'mobile'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPreviewTab(tab)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${previewTab === tab ? 'bg-white shadow-sm font-medium' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    {tab === 'desktop' ? <Monitor size={14} /> : <Smartphone size={14} />}
                    {tab === 'desktop' ? 'Desktop' : 'Mobile'}
                  </button>
                ))}
              </div>
              <div className={previewTab === 'mobile' ? 'max-w-xs mx-auto' : ''}>
                <AdPreview content={form.content} type={form.type} placement={form.placement} />
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-2">
                <AlertTriangle size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">L'annuncio sarà visualizzato solo alle pagine/ruoli selezionati nel placement configurato.</p>
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annulla</Button>
            <Button onClick={handleSave}>{editing ? 'Salva Modifiche' : 'Crea Annuncio'}</Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <Modal isOpen onClose={() => setDeleteTarget(null)} title="Elimina Annuncio" size="sm">
          <div className="p-4">
            <p className="text-text-secondary">Eliminare <strong>"{deleteTarget.name}"</strong>? Questa azione non può essere annullata.</p>
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
