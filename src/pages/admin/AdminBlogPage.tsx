import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, BookOpen, Calendar, Tag } from 'lucide-react';
import { Card, Button, Badge, Modal, ModalFooter, Input } from '../../components/ui';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

type ArticleStatus = 'published' | 'draft' | 'archived';
type ArticleCategory = 'Guida Inquilini' | 'Guida Agenzie' | 'Normativa' | 'Mercato' | 'Tips & Tricks';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  tags: string[];
  status: ArticleStatus;
  author: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

const STATUS_CONFIG: Record<ArticleStatus, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  published: { label: 'Pubblicato', variant: 'success' },
  draft: { label: 'Bozza', variant: 'warning' },
  archived: { label: 'Archiviato', variant: 'neutral' },
};

const CATEGORIES: ArticleCategory[] = ['Guida Inquilini', 'Guida Agenzie', 'Normativa', 'Mercato', 'Tips & Tricks'];

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1', title: 'Come presentarsi al proprietario di casa', slug: 'come-presentarsi-proprietario',
    excerpt: 'Guida completa per fare una buona impressione durante la visita all\'appartamento.',
    body: 'Il primo incontro con un proprietario è fondamentale. Preparati con documenti, referenze e un profilo completo su Affittochiaro...',
    category: 'Guida Inquilini', tags: ['inquilino', 'presentazione', 'documenti'], status: 'published',
    author: 'Team Affittochiaro', publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(), views: 1842,
  },
  {
    id: '2', title: 'Guida al contratto 4+4: tutto quello che devi sapere', slug: 'contratto-4-4-guida',
    excerpt: 'Il contratto a canone libero spiegato in modo semplice per inquilini e proprietari.',
    body: 'Il contratto 4+4 è la tipologia di locazione più diffusa in Italia. Ecco come funziona...',
    category: 'Normativa', tags: ['contratto', '4+4', 'locazione'], status: 'published',
    author: 'Avv. Mario Bianchi', publishedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 25 * 86400000).toISOString(), views: 3210,
  },
  {
    id: '3', title: 'Mercato degli affitti 2026: le tendenze', slug: 'mercato-affitti-2026',
    excerpt: 'Analisi del mercato immobiliare italiano nel 2026 con focus sugli affitti.',
    body: 'Il 2026 si preannuncia come un anno di stabilizzazione per il mercato degli affitti...',
    category: 'Mercato', tags: ['mercato', '2026', 'analisi'], status: 'draft',
    author: 'Team Affittochiaro',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(), views: 0,
  },
  {
    id: '4', title: '5 errori da evitare nella ricerca di inquilini', slug: 'errori-ricerca-inquilini',
    excerpt: 'Le agenzie immobiliari spesso commettono questi errori nella selezione degli inquilini.',
    body: 'La selezione di un buon inquilino è fondamentale per evitare problemi futuri...',
    category: 'Guida Agenzie', tags: ['agenzia', 'selezione', 'errori'], status: 'published',
    author: 'Team Affittochiaro', publishedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 45 * 86400000).toISOString(), views: 2156,
  },
];

const EMPTY_FORM: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'> = {
  title: '', slug: '', excerpt: '', body: '', category: 'Guida Inquilini', tags: [],
  status: 'draft', author: 'Team Affittochiaro',
};

export default function AdminBlogPage() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'>>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const filtered = useMemo(() => articles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  }), [articles, search, categoryFilter, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setTagsInput('');
    setShowModal(true);
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({ title: a.title, slug: a.slug, excerpt: a.excerpt, body: a.body, category: a.category, tags: a.tags, status: a.status, author: a.author, coverImage: a.coverImage, publishedAt: a.publishedAt });
    setTagsInput(a.tags.join(', '));
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Inserisci un titolo'); return; }
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    const now = new Date().toISOString();

    if (editing) {
      setArticles(prev => prev.map(a => a.id === editing.id ? { ...a, ...form, tags, slug, updatedAt: now, publishedAt: form.status === 'published' && !a.publishedAt ? now : a.publishedAt } : a));
      toast.success('Articolo aggiornato');
    } else {
      const newArticle: Article = { ...form, tags, slug, id: Date.now().toString(), createdAt: now, updatedAt: now, views: 0, publishedAt: form.status === 'published' ? now : undefined };
      setArticles(prev => [newArticle, ...prev]);
      toast.success('Articolo creato');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setArticles(prev => prev.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success('Articolo eliminato');
  };

  const togglePublish = (a: Article) => {
    const newStatus: ArticleStatus = a.status === 'published' ? 'draft' : 'published';
    setArticles(prev => prev.map(art => art.id === a.id ? { ...art, status: newStatus, publishedAt: newStatus === 'published' ? new Date().toISOString() : art.publishedAt, updatedAt: new Date().toISOString() } : art));
    toast.success(newStatus === 'published' ? 'Articolo pubblicato' : 'Articolo portato in bozza');
  };

  const stats = {
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    totalViews: articles.reduce((s, a) => s + a.views, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gestione Blog</h1>
          <p className="text-text-secondary">Crea e gestisci gli articoli della sezione AffittoNews</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>Nuovo Articolo</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pubblicati', value: stats.published, color: 'text-green-600' },
          { label: 'Bozze', value: stats.draft, color: 'text-yellow-600' },
          { label: 'Visualizzazioni tot.', value: stats.totalViews.toLocaleString(), color: 'text-primary-600' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-text-secondary mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input type="text" placeholder="Cerca articoli..." className="input pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-44" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as ArticleCategory | '')}>
            <option value="">Tutte le categorie</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input sm:w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value as ArticleStatus | '')}>
            <option value="">Tutti gli stati</option>
            {(Object.keys(STATUS_CONFIG) as ArticleStatus[]).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
          </select>
        </div>
      </Card>

      {/* Articles */}
      <div className="space-y-3">
        {filtered.map(a => (
          <Card key={a.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center">
                <BookOpen size={18} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant={STATUS_CONFIG[a.status].variant}>{STATUS_CONFIG[a.status].label}</Badge>
                  <span className="text-xs bg-background-secondary px-2 py-0.5 rounded-full">{a.category}</span>
                  {a.views > 0 && <span className="text-xs text-text-muted">{a.views.toLocaleString()} views</span>}
                </div>
                <p className="font-semibold text-text-primary">{a.title}</p>
                <p className="text-sm text-text-secondary truncate mt-0.5">{a.excerpt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span>{a.author}</span>
                  {a.publishedAt && <span>· Pubblicato il {formatDate(a.publishedAt)}</span>}
                  <span>· Aggiornato il {formatDate(a.updatedAt)}</span>
                </div>
                {a.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {a.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs bg-background-secondary px-2 py-0.5 rounded-full">
                        <Tag size={10} />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-background-secondary" onClick={() => togglePublish(a)} title={a.status === 'published' ? 'Nascondi' : 'Pubblica'}>
                  {a.status === 'published' ? <EyeOff size={15} className="text-text-muted" /> : <Eye size={15} className="text-text-muted" />}
                </button>
                <button className="p-1.5 rounded-lg hover:bg-background-secondary" onClick={() => openEdit(a)}>
                  <Edit2 size={15} className="text-text-muted" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50" onClick={() => setDeleteTarget(a)}>
                  <Trash2 size={15} className="text-error" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">Nessun articolo trovato</p>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <Modal isOpen onClose={() => setShowModal(false)} title={editing ? 'Modifica Articolo' : 'Nuovo Articolo'} size="xl">
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Titolo *</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titolo dell'articolo" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Slug URL</label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="generato automaticamente" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Autore</label>
                <Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Categoria</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ArticleCategory }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Stato</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ArticleStatus }))}>
                  <option value="draft">Bozza</option>
                  <option value="published">Pubblicato</option>
                  <option value="archived">Archiviato</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Sommario</label>
                <textarea rows={2} className="input resize-none" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Breve sommario dell'articolo (mostrato nelle anteprime)" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Contenuto</label>
                <textarea rows={8} className="input resize-none font-mono text-sm" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Corpo dell'articolo..." />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Tag (separati da virgola)</label>
                <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="es. inquilino, contratto, documenti" />
              </div>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Annulla</Button>
            <Button onClick={handleSave}>{editing ? 'Salva Modifiche' : 'Crea Articolo'}</Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <Modal isOpen onClose={() => setDeleteTarget(null)} title="Elimina Articolo" size="sm">
          <div className="p-4">
            <p className="text-text-secondary">Eliminare <strong>"{deleteTarget.title}"</strong>? Questa azione non può essere annullata.</p>
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
