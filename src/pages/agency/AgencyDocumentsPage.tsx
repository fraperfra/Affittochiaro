import { useState, useRef, useMemo } from 'react';
import {
  Upload, FileText, File, Trash2, Download, Eye, Search,
  FolderOpen, FileCheck, FileSpreadsheet, X, Calendar,
  ClipboardList, Bell, BellOff, CheckCircle2, AlertTriangle,
  Clock, Plus, ChevronDown, ChevronUp, Home, User, BadgeCheck,
  AlertCircle, Filter, Info,
} from 'lucide-react';
import { Card, Button, Badge, Modal, ModalFooter, EmptyState } from '../../components/ui';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AgencyDocument {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  blobUrl?: string;
}

type DocumentCategory = 'contract' | 'form' | 'checklist' | 'other';

type ContractType = '4+4' | '3+2' | 'transitorio' | 'universitari' | 'libero';
type ContractStatus = 'active' | 'expiring' | 'expired';

interface RegisteredContract {
  id: string;
  tenantName: string;
  propertyAddress: string;
  contractType: ContractType;
  startDate: string;
  endDate: string;
  registrationDate: string;
  registrationCode: string;
  annualRent: number;
  fileName?: string;
  fileSize?: number;
  blobUrl?: string;
}

type DeadlineType = 'scadenza_contratto' | 'rinnovo' | 'istat' | 'cedolare' | 'assicurazione' | 'altro';

interface Deadline {
  id: string;
  title: string;
  description: string;
  type: DeadlineType;
  dueDate: string;
  contractId?: string;
  completed: boolean;
  reminderDays: number;
  emailReminder: boolean;
}

type PageSection = 'archive' | 'contracts' | 'scadenzario';

// ─── Constants ────────────────────────────────────────────────────────────────

const ARCHIVE_KEY = 'affittochiaro_agency_documents';
const CONTRACTS_KEY = 'affittochiaro_agency_registered_contracts';
const DEADLINES_KEY = 'affittochiaro_agency_deadlines';

const CATEGORIES: { id: DocumentCategory | 'all'; label: string; icon: typeof FileText }[] = [
  { id: 'all', label: 'Tutti', icon: FolderOpen },
  { id: 'contract', label: 'Contratti', icon: FileCheck },
  { id: 'form', label: 'Moduli', icon: FileSpreadsheet },
  { id: 'checklist', label: 'Checklist', icon: FileText },
  { id: 'other', label: 'Altro', icon: File },
];

const categoryConfig: Record<DocumentCategory, { label: string; color: string }> = {
  contract: { label: 'Contratto', color: 'bg-purple-50 text-purple-600' },
  form: { label: 'Modulo', color: 'bg-blue-50 text-blue-600' },
  checklist: { label: 'Checklist', color: 'bg-amber-50 text-amber-600' },
  other: { label: 'Altro', color: 'bg-gray-50 text-gray-600' },
};

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  '4+4': '4+4 Canone Libero',
  '3+2': '3+2 Canone Concordato',
  transitorio: 'Transitorio',
  universitari: 'Uso Universitari',
  libero: 'Libero',
};

const DEADLINE_TYPE_CONFIG: Record<DeadlineType, { label: string; color: string; icon: typeof Clock }> = {
  scadenza_contratto: { label: 'Scadenza Contratto', color: 'bg-red-50 text-red-600', icon: FileCheck },
  rinnovo: { label: 'Rinnovo', color: 'bg-blue-50 text-blue-600', icon: FileText },
  istat: { label: 'Agg. ISTAT', color: 'bg-teal-50 text-teal-600', icon: BadgeCheck },
  cedolare: { label: 'Cedolare/IRPEF', color: 'bg-amber-50 text-amber-600', icon: ClipboardList },
  assicurazione: { label: 'Assicurazione', color: 'bg-purple-50 text-purple-600', icon: AlertTriangle },
  altro: { label: 'Altro', color: 'bg-gray-50 text-gray-600', icon: Clock },
};

// ─── Mock defaults ────────────────────────────────────────────────────────────

function loadArchive(): AgencyDocument[] {
  const stored = localStorage.getItem(ARCHIVE_KEY);
  if (stored) return JSON.parse(stored);
  const defaults: AgencyDocument[] = [
    { id: 'doc_1', name: 'Contratto 4+4 Canone Libero', description: 'Modello standard di contratto di locazione ad uso abitativo con durata 4+4 anni a canone libero.', category: 'contract', fileName: 'contratto_4+4_canone_libero.pdf', fileSize: 245000, fileType: 'application/pdf', uploadedAt: new Date('2024-09-15') },
    { id: 'doc_2', name: 'Contratto 3+2 Canone Concordato', description: 'Modello di contratto a canone concordato con durata 3+2 anni, conforme agli accordi territoriali.', category: 'contract', fileName: 'contratto_3+2_concordato.pdf', fileSize: 312000, fileType: 'application/pdf', uploadedAt: new Date('2024-09-15') },
    { id: 'doc_3', name: 'Contratto Transitorio', description: 'Modello per locazioni transitorie da 1 a 18 mesi, con motivazione obbligatoria.', category: 'contract', fileName: 'contratto_transitorio.pdf', fileSize: 198000, fileType: 'application/pdf', uploadedAt: new Date('2024-10-02') },
    { id: 'doc_4', name: 'Modulo Registrazione Contratto', description: "Modulo RLI per la registrazione del contratto presso l'Agenzia delle Entrate.", category: 'form', fileName: 'modulo_RLI.pdf', fileSize: 156000, fileType: 'application/pdf', uploadedAt: new Date('2024-08-20') },
    { id: 'doc_5', name: 'Verbale di Consegna Immobile', description: "Modulo per la consegna dell'immobile con inventario arredi e lettura contatori.", category: 'form', fileName: 'verbale_consegna.pdf', fileSize: 89000, fileType: 'application/pdf', uploadedAt: new Date('2024-07-10') },
    { id: 'doc_6', name: 'Checklist Documentazione Inquilino', description: 'Lista dei documenti da richiedere al candidato inquilino prima della firma.', category: 'checklist', fileName: 'checklist_documenti_inquilino.pdf', fileSize: 45000, fileType: 'application/pdf', uploadedAt: new Date('2024-11-01') },
    { id: 'doc_7', name: 'Disdetta Contratto di Locazione', description: 'Modello di lettera di disdetta del contratto con preavviso di 6 mesi.', category: 'form', fileName: 'disdetta_contratto.docx', fileSize: 34000, fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', uploadedAt: new Date('2024-10-15') },
  ];
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(defaults));
  return defaults;
}

function loadContracts(): RegisteredContract[] {
  const stored = localStorage.getItem(CONTRACTS_KEY);
  if (stored) return JSON.parse(stored);
  const defaults: RegisteredContract[] = [
    { id: 'rc_1', tenantName: 'Marco Rossi', propertyAddress: 'Via Roma 14, Milano', contractType: '4+4', startDate: '2023-04-01', endDate: '2027-03-31', registrationDate: '2023-04-10', registrationCode: 'MI-2023-12345', annualRent: 14400 },
    { id: 'rc_2', tenantName: 'Laura Bianchi', propertyAddress: 'Corso Buenos Aires 55, Milano', contractType: '3+2', startDate: '2024-01-15', endDate: '2026-04-16', registrationDate: '2024-01-20', registrationCode: 'MI-2024-00892', annualRent: 10800 },
    { id: 'rc_3', tenantName: 'Giuseppe Ferri', propertyAddress: 'Via Torino 8, Milano', contractType: 'transitorio', startDate: '2025-10-01', endDate: '2026-02-01', registrationDate: '2025-10-05', registrationCode: 'MI-2025-04471', annualRent: 9600 },
  ];
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(defaults));
  return defaults;
}

function loadDeadlines(): Deadline[] {
  const stored = localStorage.getItem(DEADLINES_KEY);
  if (stored) return JSON.parse(stored);
  const defaults: Deadline[] = [
    { id: 'dl_1', title: 'Scadenza contratto Bianchi', description: 'Contattare inquilino per eventuale rinnovo', type: 'scadenza_contratto', dueDate: '2026-04-16', contractId: 'rc_2', completed: false, reminderDays: 60, emailReminder: true },
    { id: 'dl_2', title: 'Aggiornamento ISTAT — Rossi', description: 'Calcolare e comunicare aggiornamento annuale del canone', type: 'istat', dueDate: '2026-03-10', contractId: 'rc_1', completed: false, reminderDays: 30, emailReminder: true },
    { id: 'dl_3', title: 'Scadenza contratto Ferri', description: 'Contratto transitorio in scadenza', type: 'scadenza_contratto', dueDate: '2026-02-01', contractId: 'rc_3', completed: false, reminderDays: 30, emailReminder: false },
    { id: 'dl_4', title: 'Cedolare secca acconto — Rossi', description: 'Versamento acconto cedolare secca giugno 2026', type: 'cedolare', dueDate: '2026-06-30', contractId: 'rc_1', completed: false, reminderDays: 15, emailReminder: true },
    { id: 'dl_5', title: 'Rinnovo polizza globale fabbricato', description: 'Via Roma 14 — polizza scade a maggio', type: 'assicurazione', dueDate: '2026-05-20', completed: false, reminderDays: 30, emailReminder: false },
    { id: 'dl_6', title: 'Invio raccomandata rinnovo Rossi', description: 'Comunicare rinnovo 4+4', type: 'rinnovo', dueDate: '2026-09-30', contractId: 'rc_1', completed: true, reminderDays: 90, emailReminder: true },
  ];
  localStorage.setItem(DEADLINES_KEY, JSON.stringify(defaults));
  return defaults;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string) {
  if (fileType.includes('pdf')) return <FileText size={20} className="text-red-500" />;
  if (fileType.includes('word') || fileType.includes('document')) return <FileText size={20} className="text-blue-500" />;
  if (fileType.includes('sheet') || fileType.includes('excel')) return <FileSpreadsheet size={20} className="text-green-500" />;
  return <File size={20} className="text-gray-500" />;
}

function getContractStatus(endDate: string): ContractStatus {
  const now = new Date();
  const end = new Date(endDate);
  const diffDays = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 60) return 'expiring';
  return 'active';
}

const contractStatusConfig: Record<ContractStatus, { label: string; color: string }> = {
  active: { label: 'Attivo', color: 'bg-green-50 text-green-700' },
  expiring: { label: 'In scadenza', color: 'bg-amber-50 text-amber-700' },
  expired: { label: 'Scaduto', color: 'bg-red-50 text-red-700' },
};

function getDaysRemaining(dueDate: string): number {
  return Math.floor((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

function getDeadlineUrgency(d: Deadline): 'overdue' | 'urgent' | 'soon' | 'ok' | 'done' {
  if (d.completed) return 'done';
  const days = getDaysRemaining(d.dueDate);
  if (days < 0) return 'overdue';
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'soon';
  return 'ok';
}

const urgencyConfig = {
  overdue: { bar: 'bg-red-500', badge: 'bg-red-50 text-red-700', label: 'Scaduta' },
  urgent:  { bar: 'bg-red-400', badge: 'bg-red-50 text-red-700', label: 'Urgente' },
  soon:    { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700', label: 'In scadenza' },
  ok:      { bar: 'bg-green-400', badge: 'bg-green-50 text-green-700', label: 'Programmata' },
  done:    { bar: 'bg-gray-300', badge: 'bg-gray-50 text-gray-500', label: 'Completata' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgencyDocumentsPage() {
  const [section, setSection] = useState<PageSection>('archive');

  // Archive state
  const [documents, setDocuments] = useState<AgencyDocument[]>(loadArchive);
  const [category, setCategory] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteDocTarget, setDeleteDocTarget] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<AgencyDocument | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('contract');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Registered contracts state
  const [contracts, setContracts] = useState<RegisteredContract[]>(loadContracts);
  const [showContractModal, setShowContractModal] = useState(false);
  const [deleteContractTarget, setDeleteContractTarget] = useState<string | null>(null);
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const contractFileRef = useRef<HTMLInputElement>(null);
  const [contractForm, setContractForm] = useState<Omit<RegisteredContract, 'id'>>({
    tenantName: '', propertyAddress: '', contractType: '4+4',
    startDate: '', endDate: '', registrationDate: '', registrationCode: '', annualRent: 0,
  });
  const [contractFile, setContractFile] = useState<File | null>(null);

  // Deadlines state
  const [deadlines, setDeadlines] = useState<Deadline[]>(loadDeadlines);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'pending' | 'overdue' | 'done'>('all');
  const [deadlineForm, setDeadlineForm] = useState<Omit<Deadline, 'id' | 'completed'>>({
    title: '', description: '', type: 'scadenza_contratto', dueDate: '',
    contractId: '', reminderDays: 30, emailReminder: true,
  });

  // ── Archive helpers ─────────────────────────────────────────────────────────

  const filteredDocs = documents.filter(doc => {
    if (category !== 'all' && doc.category !== category) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return doc.name.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q);
    }
    return true;
  });

  const catCounts = {
    all: documents.length,
    contract: documents.filter(d => d.category === 'contract').length,
    form: documents.filter(d => d.category === 'form').length,
    checklist: documents.filter(d => d.category === 'checklist').length,
    other: documents.filter(d => d.category === 'other').length,
  };

  const persistDocs = (docs: AgencyDocument[]) => { setDocuments(docs); localStorage.setItem(ARCHIVE_KEY, JSON.stringify(docs)); };

  const resetUploadForm = () => { setUploadName(''); setUploadDescription(''); setUploadCategory('contract'); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleUpload = () => {
    if (!uploadName.trim()) { toast.error('Inserisci un nome per il documento'); return; }
    if (!uploadFile) { toast.error('Seleziona un file da caricare'); return; }
    const newDoc: AgencyDocument = { id: `doc_${Date.now()}`, name: uploadName.trim(), description: uploadDescription.trim(), category: uploadCategory, fileName: uploadFile.name, fileSize: uploadFile.size, fileType: uploadFile.type, uploadedAt: new Date(), blobUrl: URL.createObjectURL(uploadFile) };
    persistDocs([newDoc, ...documents]);
    toast.success('Documento caricato!');
    setShowUploadModal(false);
    resetUploadForm();
  };

  const handleDeleteDoc = () => {
    if (!deleteDocTarget) return;
    const doc = documents.find(d => d.id === deleteDocTarget);
    if (doc?.blobUrl) URL.revokeObjectURL(doc.blobUrl);
    persistDocs(documents.filter(d => d.id !== deleteDocTarget));
    setDeleteDocTarget(null);
    toast.success('Documento eliminato');
  };

  const handleDownload = (name: string, blobUrl?: string) => {
    if (blobUrl) { const a = document.createElement('a'); a.href = blobUrl; a.download = name; a.click(); }
    else toast('Documento di esempio — download disponibile con il backend reale');
  };

  // ── Contracts helpers ───────────────────────────────────────────────────────

  const persistContracts = (list: RegisteredContract[]) => { setContracts(list); localStorage.setItem(CONTRACTS_KEY, JSON.stringify(list)); };

  const resetContractForm = () => { setContractForm({ tenantName: '', propertyAddress: '', contractType: '4+4', startDate: '', endDate: '', registrationDate: '', registrationCode: '', annualRent: 0 }); setContractFile(null); if (contractFileRef.current) contractFileRef.current.value = ''; };

  const handleSaveContract = () => {
    const { tenantName, propertyAddress, startDate, endDate, registrationDate, registrationCode } = contractForm;
    if (!tenantName.trim() || !propertyAddress.trim() || !startDate || !endDate || !registrationDate || !registrationCode.trim()) {
      toast.error('Compila tutti i campi obbligatori'); return;
    }
    const newC: RegisteredContract = {
      id: `rc_${Date.now()}`,
      ...contractForm,
      ...(contractFile ? { fileName: contractFile.name, fileSize: contractFile.size, blobUrl: URL.createObjectURL(contractFile) } : {}),
    };
    persistContracts([newC, ...contracts]);
    toast.success('Contratto registrato salvato!');
    setShowContractModal(false);
    resetContractForm();
  };

  const handleDeleteContract = () => {
    if (!deleteContractTarget) return;
    const c = contracts.find(x => x.id === deleteContractTarget);
    if (c?.blobUrl) URL.revokeObjectURL(c.blobUrl);
    persistContracts(contracts.filter(x => x.id !== deleteContractTarget));
    setDeleteContractTarget(null);
    toast.success('Contratto eliminato');
  };

  // ── Deadlines helpers ───────────────────────────────────────────────────────

  const persistDeadlines = (list: Deadline[]) => { setDeadlines(list); localStorage.setItem(DEADLINES_KEY, JSON.stringify(list)); };

  const filteredDeadlines = useMemo(() => {
    return deadlines
      .filter(d => {
        if (deadlineFilter === 'pending') return !d.completed && getDaysRemaining(d.dueDate) >= 0;
        if (deadlineFilter === 'overdue') return !d.completed && getDaysRemaining(d.dueDate) < 0;
        if (deadlineFilter === 'done') return d.completed;
        return true;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [deadlines, deadlineFilter]);

  const deadlineStats = useMemo(() => ({
    thisWeek: deadlines.filter(d => !d.completed && getDaysRemaining(d.dueDate) >= 0 && getDaysRemaining(d.dueDate) <= 7).length,
    thisMonth: deadlines.filter(d => !d.completed && getDaysRemaining(d.dueDate) >= 0 && getDaysRemaining(d.dueDate) <= 30).length,
    overdue: deadlines.filter(d => !d.completed && getDaysRemaining(d.dueDate) < 0).length,
  }), [deadlines]);

  const handleToggleDeadline = (id: string) => {
    const updated = deadlines.map(d => d.id === id ? { ...d, completed: !d.completed } : d);
    persistDeadlines(updated);
    const d = deadlines.find(x => x.id === id);
    toast.success(d?.completed ? 'Scadenza riaperta' : 'Scadenza completata');
  };

  const handleSaveDeadline = () => {
    if (!deadlineForm.title.trim()) { toast.error('Inserisci un titolo'); return; }
    if (!deadlineForm.dueDate) { toast.error('Seleziona una data di scadenza'); return; }
    const newD: Deadline = { id: `dl_${Date.now()}`, ...deadlineForm, contractId: deadlineForm.contractId || undefined, completed: false };
    persistDeadlines([...deadlines, newD]);
    toast.success('Scadenza aggiunta!');
    setShowDeadlineModal(false);
    setDeadlineForm({ title: '', description: '', type: 'scadenza_contratto', dueDate: '', contractId: '', reminderDays: 30, emailReminder: true });
  };

  const handleDeleteDeadline = (id: string) => {
    persistDeadlines(deadlines.filter(d => d.id !== id));
    toast.success('Scadenza eliminata');
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: 'archive', label: 'Archivio Documenti', icon: FolderOpen },
          { id: 'contracts', label: 'Contratti Registrati', icon: BadgeCheck },
          { id: 'scadenzario', label: 'Scadenzario', icon: Calendar },
        ] as { id: PageSection; label: string; icon: typeof Calendar }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              section === id
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white text-text-secondary hover:bg-background-secondary border border-border'
            }`}
          >
            <Icon size={15} />
            {label}
            {id === 'scadenzario' && deadlineStats.overdue > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {deadlineStats.overdue}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── ARCHIVE SECTION ───────────────────────────────────────────────── */}
      {section === 'archive' && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex gap-2 flex-wrap flex-1">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      category === cat.id ? 'bg-primary-500 text-white' : 'bg-white text-text-secondary hover:bg-background-secondary border border-border'
                    }`}
                  >
                    <Icon size={14} />
                    {cat.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${category === cat.id ? 'bg-white/20' : 'bg-background-secondary'}`}>
                      {catCounts[cat.id]}
                    </span>
                  </button>
                );
              })}
            </div>
            <Button leftIcon={<Upload size={16} />} onClick={() => setShowUploadModal(true)}>Carica Documento</Button>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Cerca documenti..." className="input pl-9 text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          {filteredDocs.length > 0 ? (
            <div className="space-y-3">
              {filteredDocs.map(doc => (
                <Card key={doc.id} padding="sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-background-secondary flex items-center justify-center flex-shrink-0">{getFileIcon(doc.fileType)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-text-primary truncate">{doc.name}</h3>
                        <Badge variant="neutral" size="sm" className={categoryConfig[doc.category].color}>{categoryConfig[doc.category].label}</Badge>
                      </div>
                      <p className="text-sm text-text-muted line-clamp-1">{doc.description}</p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><File size={11} />{doc.fileName}</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(new Date(doc.uploadedAt))}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setPreviewDoc(doc)} className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors" title="Anteprima"><Eye size={16} /></button>
                      <button onClick={() => handleDownload(doc.fileName, doc.blobUrl)} className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors" title="Scarica"><Download size={16} /></button>
                      <button onClick={() => setDeleteDocTarget(doc.id)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-error transition-colors" title="Elimina"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={<FileText size={40} className="text-text-muted" />} title="Nessun documento trovato" description={searchQuery || category !== 'all' ? 'Prova a modificare i filtri' : 'Carica contratti modello e documenti utili'} action={{ label: 'Carica Documento', onClick: () => setShowUploadModal(true) }} />
          )}
        </>
      )}

      {/* ── CONTRATTI REGISTRATI SECTION ─────────────────────────────────── */}
      {section === 'contracts' && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Totale', value: contracts.length, color: 'text-text-primary' },
              { label: 'In scadenza', value: contracts.filter(c => getContractStatus(c.endDate) === 'expiring').length, color: 'text-amber-600' },
              { label: 'Scaduti', value: contracts.filter(c => getContractStatus(c.endDate) === 'expired').length, color: 'text-red-600' },
            ].map(({ label, value, color }) => (
              <Card key={label} padding="sm">
                <p className="text-xs text-text-muted">{label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button leftIcon={<Plus size={16} />} onClick={() => setShowContractModal(true)}>Aggiungi Contratto</Button>
          </div>

          {contracts.length > 0 ? (
            <div className="space-y-3">
              {contracts.map(c => {
                const status = getContractStatus(c.endDate);
                const sConf = contractStatusConfig[status];
                const isExpanded = expandedContract === c.id;
                const daysLeft = getDaysRemaining(c.endDate);

                return (
                  <Card key={c.id} padding="sm">
                    <button className="w-full text-left" onClick={() => setExpandedContract(isExpanded ? null : c.id)}>
                      <div className="flex items-start gap-3">
                        {/* Status bar */}
                        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${status === 'active' ? 'bg-green-400' : status === 'expiring' ? 'bg-amber-400' : 'bg-red-400'}`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sConf.color}`}>
                              {status === 'active' && <CheckCircle2 size={11} />}
                              {status === 'expiring' && <Clock size={11} />}
                              {status === 'expired' && <AlertCircle size={11} />}
                              {sConf.label}
                            </span>
                            <span className="text-xs font-mono text-text-muted">{c.registrationCode}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <User size={13} className="text-text-muted flex-shrink-0" />
                            <p className="font-semibold text-text-primary truncate">{c.tenantName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home size={13} className="text-text-muted flex-shrink-0" />
                            <p className="text-sm text-text-muted truncate">{c.propertyAddress}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-text-muted">
                            <span className="font-medium text-text-secondary">{CONTRACT_TYPE_LABELS[c.contractType]}</span>
                            <span>{new Date(c.startDate).toLocaleDateString('it-IT')} → {new Date(c.endDate).toLocaleDateString('it-IT')}</span>
                            {status !== 'expired' && (
                              <span className={daysLeft <= 30 ? 'text-red-600 font-semibold' : daysLeft <= 60 ? 'text-amber-600 font-semibold' : ''}>
                                {daysLeft > 0 ? `${daysLeft} gg rimanenti` : 'Scaduto'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-text-muted">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div className="p-3 bg-background-secondary rounded-xl">
                            <p className="text-xs text-text-muted mb-0.5">Canone annuo</p>
                            <p className="font-semibold text-text-primary">€ {c.annualRent.toLocaleString('it-IT')}</p>
                          </div>
                          <div className="p-3 bg-background-secondary rounded-xl">
                            <p className="text-xs text-text-muted mb-0.5">Data registrazione</p>
                            <p className="font-semibold text-text-primary">{new Date(c.registrationDate).toLocaleDateString('it-IT')}</p>
                          </div>
                          <div className="p-3 bg-background-secondary rounded-xl">
                            <p className="text-xs text-text-muted mb-0.5">Cod. registrazione</p>
                            <p className="font-semibold text-text-primary font-mono text-xs">{c.registrationCode}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {c.blobUrl && (
                            <Button size="sm" variant="secondary" leftIcon={<Download size={14} />} onClick={() => handleDownload(c.fileName!, c.blobUrl)}>
                              Scarica PDF
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            leftIcon={<Bell size={14} />}
                            onClick={() => {
                              setDeadlineForm(f => ({ ...f, title: `Scadenza contratto ${c.tenantName}`, type: 'scadenza_contratto', dueDate: c.endDate, contractId: c.id }));
                              setSection('scadenzario');
                              setShowDeadlineModal(true);
                            }}
                          >
                            Aggiungi reminder
                          </Button>
                          <button onClick={() => setDeleteContractTarget(c.id)} className="ml-auto p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-error transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={<ClipboardList size={40} className="text-text-muted" />} title="Nessun contratto registrato" description="Aggiungi i contratti registrati presso l'Agenzia delle Entrate per monitorarne le scadenze." action={{ label: 'Aggiungi Contratto', onClick: () => setShowContractModal(true) }} />
          )}
        </>
      )}

      {/* ── SCADENZARIO SECTION ───────────────────────────────────────────── */}
      {section === 'scadenzario' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card padding="sm">
              <p className="text-xs text-text-muted">Questa settimana</p>
              <p className={`text-2xl font-bold mt-0.5 ${deadlineStats.thisWeek > 0 ? 'text-red-600' : 'text-text-primary'}`}>{deadlineStats.thisWeek}</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs text-text-muted">Questo mese</p>
              <p className={`text-2xl font-bold mt-0.5 ${deadlineStats.thisMonth > 0 ? 'text-amber-600' : 'text-text-primary'}`}>{deadlineStats.thisMonth}</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs text-text-muted">Scadute</p>
              <p className={`text-2xl font-bold mt-0.5 ${deadlineStats.overdue > 0 ? 'text-red-600' : 'text-text-primary'}`}>{deadlineStats.overdue}</p>
            </Card>
          </div>

          {/* Filters + Add */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 flex-1 flex-wrap">
              {([
                { id: 'all', label: 'Tutte' },
                { id: 'pending', label: 'Pendenti' },
                { id: 'overdue', label: 'Scadute' },
                { id: 'done', label: 'Completate' },
              ] as { id: typeof deadlineFilter; label: string }[]).map(f => (
                <button
                  key={f.id}
                  onClick={() => setDeadlineFilter(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    deadlineFilter === f.id ? 'bg-primary-500 text-white' : 'bg-white text-text-secondary hover:bg-background-secondary border border-border'
                  }`}
                >
                  <Filter size={12} />
                  {f.label}
                </button>
              ))}
            </div>
            <Button leftIcon={<Plus size={16} />} onClick={() => setShowDeadlineModal(true)}>Nuova Scadenza</Button>
          </div>

          {/* Deadlines list */}
          {filteredDeadlines.length > 0 ? (
            <div className="space-y-3">
              {filteredDeadlines.map(d => {
                const urgency = getDeadlineUrgency(d);
                const uConf = urgencyConfig[urgency];
                const dConf = DEADLINE_TYPE_CONFIG[d.type];
                const TypeIcon = dConf.icon;
                const daysLeft = getDaysRemaining(d.dueDate);
                const linkedContract = contracts.find(c => c.id === d.contractId);

                return (
                  <Card key={d.id} padding="sm" className={d.completed ? 'opacity-60' : ''}>
                    <div className="flex items-start gap-3">
                      {/* Urgency bar */}
                      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${uConf.bar}`} />

                      {/* Complete toggle */}
                      <button
                        onClick={() => handleToggleDeadline(d.id)}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          d.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {d.completed && <CheckCircle2 size={12} />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${uConf.badge}`}>
                            {uConf.label}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${dConf.color}`}>
                            <TypeIcon size={10} />
                            {dConf.label}
                          </span>
                        </div>
                        <p className={`font-semibold text-text-primary ${d.completed ? 'line-through' : ''}`}>{d.title}</p>
                        {d.description && <p className="text-sm text-text-muted mt-0.5">{d.description}</p>}
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-text-muted flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar size={11} />
                            {new Date(d.dueDate).toLocaleDateString('it-IT')}
                          </span>
                          {!d.completed && (
                            <span className={`font-semibold ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-red-500' : daysLeft <= 30 ? 'text-amber-600' : 'text-text-muted'}`}>
                              {daysLeft < 0 ? `Scaduta da ${Math.abs(daysLeft)} gg` : daysLeft === 0 ? 'Oggi!' : `tra ${daysLeft} gg`}
                            </span>
                          )}
                          {linkedContract && (
                            <span className="flex items-center gap-1">
                              <User size={10} />
                              {linkedContract.tenantName}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            {d.emailReminder ? <Bell size={10} className="text-primary-500" /> : <BellOff size={10} />}
                            Reminder {d.reminderDays} gg prima
                          </span>
                        </div>
                      </div>

                      <button onClick={() => handleDeleteDeadline(d.id)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-error transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={<Calendar size={40} className="text-text-muted" />} title="Nessuna scadenza trovata" description="Aggiungi scadenze per tenere traccia di rinnovi, aggiornamenti ISTAT, cedolare e altro." action={{ label: 'Nuova Scadenza', onClick: () => setShowDeadlineModal(true) }} />
          )}
        </>
      )}

      {/* ── MODALS ────────────────────────────────────────────────────────── */}

      {/* Upload doc modal */}
      <Modal isOpen={showUploadModal} onClose={() => { setShowUploadModal(false); resetUploadForm(); }} title="Carica Documento" size="md">
        <div className="space-y-4">
          <div><label className="label">Nome documento *</label><input type="text" className="input" placeholder="es. Contratto 4+4 Canone Libero" value={uploadName} onChange={e => setUploadName(e.target.value)} /></div>
          <div><label className="label">Descrizione</label><textarea className="input min-h-[60px] resize-y" placeholder="Breve descrizione..." rows={2} value={uploadDescription} onChange={e => setUploadDescription(e.target.value)} /></div>
          <div>
            <label className="label">Categoria</label>
            <select className="input" value={uploadCategory} onChange={e => setUploadCategory(e.target.value as DocumentCategory)}>
              <option value="contract">Contratto</option>
              <option value="form">Modulo</option>
              <option value="checklist">Checklist</option>
              <option value="other">Altro</option>
            </select>
          </div>
          <div>
            <label className="label">File *</label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 ${uploadFile ? 'border-success bg-success/5' : 'border-border'}`} onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf" onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 10 * 1024 * 1024) { toast.error('File troppo grande (max 10 MB)'); return; } setUploadFile(f); if (!uploadName) setUploadName(f.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')); }} />
              {uploadFile ? (
                <div className="flex items-center justify-center gap-3">{getFileIcon(uploadFile.type)}<div className="text-left"><p className="font-medium text-sm">{uploadFile.name}</p><p className="text-xs text-text-muted">{formatFileSize(uploadFile.size)}</p></div><button onClick={e => { e.stopPropagation(); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="p-1 rounded-lg hover:bg-background-secondary text-text-muted"><X size={16} /></button></div>
              ) : (<><Upload size={24} className="mx-auto text-text-muted mb-2" /><p className="text-sm text-text-muted">Clicca per selezionare un file</p><p className="text-xs text-text-muted mt-1">PDF, DOC, DOCX, XLS (max 10 MB)</p></>)}
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowUploadModal(false); resetUploadForm(); }}>Annulla</Button>
          <Button onClick={handleUpload} leftIcon={<Upload size={16} />}>Carica</Button>
        </ModalFooter>
      </Modal>

      {/* Registered contract modal */}
      <Modal isOpen={showContractModal} onClose={() => { setShowContractModal(false); resetContractForm(); }} title="Aggiungi Contratto Registrato" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Inquilino *</label><input type="text" className="input" placeholder="Nome e cognome" value={contractForm.tenantName} onChange={e => setContractForm(f => ({ ...f, tenantName: e.target.value }))} /></div>
            <div><label className="label">Indirizzo immobile *</label><input type="text" className="input" placeholder="Via, numero, città" value={contractForm.propertyAddress} onChange={e => setContractForm(f => ({ ...f, propertyAddress: e.target.value }))} /></div>
            <div>
              <label className="label">Tipologia contratto *</label>
              <select className="input" value={contractForm.contractType} onChange={e => setContractForm(f => ({ ...f, contractType: e.target.value as ContractType }))}>
                {(Object.entries(CONTRACT_TYPE_LABELS) as [ContractType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label className="label">Canone annuo (€) *</label><input type="number" className="input" placeholder="12000" value={contractForm.annualRent || ''} onChange={e => setContractForm(f => ({ ...f, annualRent: Number(e.target.value) }))} /></div>
            <div><label className="label">Data inizio *</label><input type="date" className="input" value={contractForm.startDate} onChange={e => setContractForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div><label className="label">Data fine *</label><input type="date" className="input" value={contractForm.endDate} onChange={e => setContractForm(f => ({ ...f, endDate: e.target.value }))} /></div>
            <div><label className="label">Data registrazione *</label><input type="date" className="input" value={contractForm.registrationDate} onChange={e => setContractForm(f => ({ ...f, registrationDate: e.target.value }))} /></div>
            <div><label className="label">Codice registrazione *</label><input type="text" className="input font-mono" placeholder="es. MI-2024-00123" value={contractForm.registrationCode} onChange={e => setContractForm(f => ({ ...f, registrationCode: e.target.value }))} /></div>
          </div>

          <div>
            <label className="label">Allega contratto (opzionale)</label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors hover:border-primary-300 hover:bg-primary-50/30 ${contractFile ? 'border-success bg-success/5' : 'border-border'}`} onClick={() => contractFileRef.current?.click()}>
              <input ref={contractFileRef} type="file" className="hidden" accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f && f.size <= 20 * 1024 * 1024) setContractFile(f); else if (f) toast.error('Max 20 MB'); }} />
              {contractFile ? (
                <div className="flex items-center justify-center gap-3"><FileText size={20} className="text-red-500" /><p className="text-sm font-medium">{contractFile.name}</p><button onClick={e => { e.stopPropagation(); setContractFile(null); }} className="p-1 rounded hover:bg-background-secondary text-text-muted"><X size={14} /></button></div>
              ) : (<><Upload size={20} className="mx-auto text-text-muted mb-1" /><p className="text-sm text-text-muted">Carica il PDF del contratto registrato (max 20 MB)</p></>)}
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowContractModal(false); resetContractForm(); }}>Annulla</Button>
          <Button onClick={handleSaveContract} leftIcon={<BadgeCheck size={16} />}>Salva Contratto</Button>
        </ModalFooter>
      </Modal>

      {/* Deadline modal */}
      <Modal isOpen={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} title="Nuova Scadenza" size="md">
        <div className="space-y-4">
          <div><label className="label">Titolo *</label><input type="text" className="input" placeholder="es. Scadenza contratto Rossi" value={deadlineForm.title} onChange={e => setDeadlineForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><label className="label">Descrizione</label><textarea className="input resize-none" rows={2} placeholder="Note aggiuntive..." value={deadlineForm.description} onChange={e => setDeadlineForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo *</label>
              <select className="input" value={deadlineForm.type} onChange={e => setDeadlineForm(f => ({ ...f, type: e.target.value as DeadlineType }))}>
                {(Object.entries(DEADLINE_TYPE_CONFIG) as [DeadlineType, typeof DEADLINE_TYPE_CONFIG[DeadlineType]][]).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div><label className="label">Data scadenza *</label><input type="date" className="input" value={deadlineForm.dueDate} onChange={e => setDeadlineForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
            <div>
              <label className="label">Contratto collegato</label>
              <select className="input" value={deadlineForm.contractId} onChange={e => setDeadlineForm(f => ({ ...f, contractId: e.target.value }))}>
                <option value="">— Nessuno —</option>
                {contracts.map(c => <option key={c.id} value={c.id}>{c.tenantName} — {c.propertyAddress}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Reminder (giorni prima)</label>
              <select className="input" value={deadlineForm.reminderDays} onChange={e => setDeadlineForm(f => ({ ...f, reminderDays: Number(e.target.value) }))}>
                {[7, 14, 30, 60, 90].map(d => <option key={d} value={d}>{d} giorni prima</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-primary-500" />
              <div>
                <p className="text-sm font-medium">Reminder via email</p>
                <p className="text-xs text-text-muted">Ricevi un'email {deadlineForm.reminderDays} giorni prima</p>
              </div>
            </div>
            <button onClick={() => setDeadlineForm(f => ({ ...f, emailReminder: !f.emailReminder }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${deadlineForm.emailReminder ? 'bg-primary-500' : 'bg-gray-200'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${deadlineForm.emailReminder ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowDeadlineModal(false)}>Annulla</Button>
          <Button onClick={handleSaveDeadline} leftIcon={<Bell size={16} />}>Aggiungi Scadenza</Button>
        </ModalFooter>
      </Modal>

      {/* Delete contract confirmation */}
      <Modal isOpen={!!deleteContractTarget} onClose={() => setDeleteContractTarget(null)} title="Elimina Contratto" size="sm">
        <p className="text-text-secondary">Eliminare questo contratto registrato? I reminder collegati non verranno rimossi.</p>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setDeleteContractTarget(null)}>Annulla</Button>
          <Button variant="danger" onClick={handleDeleteContract}>Elimina</Button>
        </ModalFooter>
      </Modal>

      {/* Delete doc confirmation */}
      <Modal isOpen={!!deleteDocTarget} onClose={() => setDeleteDocTarget(null)} title="Elimina Documento" size="sm">
        <p className="text-text-secondary">Sei sicuro di voler eliminare questo documento? L'azione non può essere annullata.</p>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setDeleteDocTarget(null)}>Annulla</Button>
          <Button variant="danger" onClick={handleDeleteDoc}>Elimina</Button>
        </ModalFooter>
      </Modal>

      {/* Preview modal */}
      <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title={previewDoc?.name || ''} size="md">
        {previewDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-background-secondary rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm">{getFileIcon(previewDoc.fileType)}</div>
              <div className="flex-1">
                <p className="font-semibold text-text-primary">{previewDoc.fileName}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                  <span>{formatFileSize(previewDoc.fileSize)}</span>
                  <Badge variant="neutral" size="sm" className={categoryConfig[previewDoc.category].color}>{categoryConfig[previewDoc.category].label}</Badge>
                </div>
              </div>
            </div>
            {previewDoc.description && <div><h4 className="text-sm font-semibold text-text-secondary mb-1">Descrizione</h4><p className="text-sm text-text-muted">{previewDoc.description}</p></div>}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-background-secondary rounded-lg"><p className="text-text-muted text-xs mb-0.5">Caricato il</p><p className="font-medium">{formatDate(new Date(previewDoc.uploadedAt))}</p></div>
              <div className="p-3 bg-background-secondary rounded-lg"><p className="text-text-muted text-xs mb-0.5">Dimensione</p><p className="font-medium">{formatFileSize(previewDoc.fileSize)}</p></div>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setPreviewDoc(null)}>Chiudi</Button>
          {previewDoc && <Button onClick={() => handleDownload(previewDoc.fileName, previewDoc.blobUrl)} leftIcon={<Download size={16} />}>Scarica</Button>}
        </ModalFooter>
      </Modal>
    </div>
  );
}
