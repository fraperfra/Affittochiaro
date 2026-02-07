import { useState, useRef } from 'react';
import {
  Upload, FileText, File, Trash2, Download, Eye, Search,
  FolderOpen, FileCheck, FileSpreadsheet, X, Calendar,
} from 'lucide-react';
import { Card, Button, Badge, Modal, ModalFooter, EmptyState } from '../../components/ui';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

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

const STORAGE_KEY = 'affittochiaro_agency_documents';

function loadDocuments(): AgencyDocument[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  // Default sample documents
  const defaults: AgencyDocument[] = [
    {
      id: 'doc_1',
      name: 'Contratto 4+4 Canone Libero',
      description: 'Modello standard di contratto di locazione ad uso abitativo con durata 4+4 anni a canone libero.',
      category: 'contract',
      fileName: 'contratto_4+4_canone_libero.pdf',
      fileSize: 245000,
      fileType: 'application/pdf',
      uploadedAt: new Date('2024-09-15'),
    },
    {
      id: 'doc_2',
      name: 'Contratto 3+2 Canone Concordato',
      description: 'Modello di contratto a canone concordato con durata 3+2 anni, conforme agli accordi territoriali.',
      category: 'contract',
      fileName: 'contratto_3+2_concordato.pdf',
      fileSize: 312000,
      fileType: 'application/pdf',
      uploadedAt: new Date('2024-09-15'),
    },
    {
      id: 'doc_3',
      name: 'Contratto Transitorio',
      description: 'Modello per locazioni transitorie da 1 a 18 mesi, con motivazione obbligatoria.',
      category: 'contract',
      fileName: 'contratto_transitorio.pdf',
      fileSize: 198000,
      fileType: 'application/pdf',
      uploadedAt: new Date('2024-10-02'),
    },
    {
      id: 'doc_4',
      name: 'Modulo Registrazione Contratto',
      description: 'Modulo RLI per la registrazione del contratto presso l\'Agenzia delle Entrate.',
      category: 'form',
      fileName: 'modulo_RLI.pdf',
      fileSize: 156000,
      fileType: 'application/pdf',
      uploadedAt: new Date('2024-08-20'),
    },
    {
      id: 'doc_5',
      name: 'Verbale di Consegna Immobile',
      description: 'Modulo per la consegna dell\'immobile con inventario arredi e lettura contatori.',
      category: 'form',
      fileName: 'verbale_consegna.pdf',
      fileSize: 89000,
      fileType: 'application/pdf',
      uploadedAt: new Date('2024-07-10'),
    },
    {
      id: 'doc_6',
      name: 'Checklist Documentazione Inquilino',
      description: 'Lista dei documenti da richiedere al candidato inquilino prima della firma.',
      category: 'checklist',
      fileName: 'checklist_documenti_inquilino.pdf',
      fileSize: 45000,
      fileType: 'application/pdf',
      uploadedAt: new Date('2024-11-01'),
    },
    {
      id: 'doc_7',
      name: 'Disdetta Contratto di Locazione',
      description: 'Modello di lettera di disdetta del contratto con preavviso di 6 mesi.',
      category: 'form',
      fileName: 'disdetta_contratto.docx',
      fileSize: 34000,
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: new Date('2024-10-15'),
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

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

export default function AgencyDocumentsPage() {
  const [documents, setDocuments] = useState<AgencyDocument[]>(loadDocuments);
  const [category, setCategory] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<AgencyDocument | null>(null);

  // Upload form state
  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('contract');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = documents.filter(doc => {
    if (category !== 'all' && doc.category !== category) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return doc.name.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q) || doc.fileName.toLowerCase().includes(q);
    }
    return true;
  });

  const categoryCounts = {
    all: documents.length,
    contract: documents.filter(d => d.category === 'contract').length,
    form: documents.filter(d => d.category === 'form').length,
    checklist: documents.filter(d => d.category === 'checklist').length,
    other: documents.filter(d => d.category === 'other').length,
  };

  const persist = (docs: AgencyDocument[]) => {
    setDocuments(docs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  };

  const resetUploadForm = () => {
    setUploadName('');
    setUploadDescription('');
    setUploadCategory('contract');
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = () => {
    if (!uploadName.trim()) { toast.error('Inserisci un nome per il documento'); return; }
    if (!uploadFile) { toast.error('Seleziona un file da caricare'); return; }

    const blobUrl = URL.createObjectURL(uploadFile);

    const newDoc: AgencyDocument = {
      id: `doc_${Date.now()}`,
      name: uploadName.trim(),
      description: uploadDescription.trim(),
      category: uploadCategory,
      fileName: uploadFile.name,
      fileSize: uploadFile.size,
      fileType: uploadFile.type,
      uploadedAt: new Date(),
      blobUrl,
    };

    persist([newDoc, ...documents]);
    toast.success('Documento caricato!');
    setShowUploadModal(false);
    resetUploadForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const doc = documents.find(d => d.id === deleteTarget);
    if (doc?.blobUrl) URL.revokeObjectURL(doc.blobUrl);
    persist(documents.filter(d => d.id !== deleteTarget));
    setDeleteTarget(null);
    toast.success('Documento eliminato');
  };

  const handleDownload = (doc: AgencyDocument) => {
    if (doc.blobUrl) {
      const a = document.createElement('a');
      a.href = doc.blobUrl;
      a.download = doc.fileName;
      a.click();
    } else {
      toast('Documento di esempio — il download sara disponibile con il backend reale', { icon: 'ℹ️' });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File troppo grande (max 10 MB)');
      return;
    }
    setUploadFile(file);
    if (!uploadName) {
      setUploadName(file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '));
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs + Search + Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex gap-2 flex-wrap flex-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  category === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-text-secondary hover:bg-background-secondary border border-border'
                }`}
              >
                <Icon size={14} />
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  category === cat.id ? 'bg-white/20' : 'bg-background-secondary'
                }`}>
                  {categoryCounts[cat.id]}
                </span>
              </button>
            );
          })}
        </div>
        <Button leftIcon={<Upload size={16} />} onClick={() => setShowUploadModal(true)}>
          Carica Documento
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Cerca documenti..."
          className="input pl-9 text-sm"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Documents List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(doc => (
            <Card key={doc.id} padding="sm">
              <div className="flex items-start gap-4">
                {/* File icon */}
                <div className="w-12 h-12 rounded-xl bg-background-secondary flex items-center justify-center flex-shrink-0">
                  {getFileIcon(doc.fileType)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-text-primary truncate">{doc.name}</h3>
                    <Badge variant="neutral" size="sm" className={categoryConfig[doc.category].color}>
                      {categoryConfig[doc.category].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-muted line-clamp-1">{doc.description}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <File size={11} />
                      {doc.fileName}
                    </span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(new Date(doc.uploadedAt))}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors"
                    title="Anteprima"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 rounded-lg hover:bg-background-secondary text-text-muted transition-colors"
                    title="Scarica"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(doc.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-error transition-colors"
                    title="Elimina"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📄"
          title="Nessun documento trovato"
          description={searchQuery || category !== 'all'
            ? 'Prova a modificare i filtri di ricerca'
            : 'Carica i tuoi contratti di esempio e documenti utili'}
          action={{ label: 'Carica Documento', onClick: () => setShowUploadModal(true) }}
        />
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => { setShowUploadModal(false); resetUploadForm(); }}
        title="Carica Documento"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Nome documento *</label>
            <input
              type="text"
              className="input"
              placeholder="es. Contratto 4+4 Canone Libero"
              value={uploadName}
              onChange={e => setUploadName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Descrizione</label>
            <textarea
              className="input min-h-[60px] resize-y"
              placeholder="Breve descrizione del documento..."
              rows={2}
              value={uploadDescription}
              onChange={e => setUploadDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Categoria</label>
            <select
              className="input"
              value={uploadCategory}
              onChange={e => setUploadCategory(e.target.value as DocumentCategory)}
            >
              <option value="contract">Contratto</option>
              <option value="form">Modulo</option>
              <option value="checklist">Checklist</option>
              <option value="other">Altro</option>
            </select>
          </div>

          <div>
            <label className="label">File *</label>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 ${
                uploadFile ? 'border-success bg-success/5' : 'border-border'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf"
                onChange={handleFileSelect}
              />
              {uploadFile ? (
                <div className="flex items-center justify-center gap-3">
                  {getFileIcon(uploadFile.type)}
                  <div className="text-left">
                    <p className="font-medium text-sm text-text-primary">{uploadFile.name}</p>
                    <p className="text-xs text-text-muted">{formatFileSize(uploadFile.size)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="p-1 rounded-lg hover:bg-background-secondary text-text-muted"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={24} className="mx-auto text-text-muted mb-2" />
                  <p className="text-sm text-text-muted">
                    Clicca per selezionare un file
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    PDF, DOC, DOCX, XLS, XLSX, TXT (max 10 MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => { setShowUploadModal(false); resetUploadForm(); }}>
            Annulla
          </Button>
          <Button onClick={handleUpload} leftIcon={<Upload size={16} />}>
            Carica
          </Button>
        </ModalFooter>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.name || ''}
        size="md"
      >
        {previewDoc && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-background-secondary rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm">
                {getFileIcon(previewDoc.fileType)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text-primary">{previewDoc.fileName}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                  <span>{formatFileSize(previewDoc.fileSize)}</span>
                  <Badge variant="neutral" size="sm" className={categoryConfig[previewDoc.category].color}>
                    {categoryConfig[previewDoc.category].label}
                  </Badge>
                </div>
              </div>
            </div>

            {previewDoc.description && (
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-1">Descrizione</h4>
                <p className="text-sm text-text-muted">{previewDoc.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-background-secondary rounded-lg">
                <p className="text-text-muted text-xs mb-0.5">Caricato il</p>
                <p className="font-medium">{formatDate(new Date(previewDoc.uploadedAt))}</p>
              </div>
              <div className="p-3 bg-background-secondary rounded-lg">
                <p className="text-text-muted text-xs mb-0.5">Dimensione</p>
                <p className="font-medium">{formatFileSize(previewDoc.fileSize)}</p>
              </div>
            </div>
          </div>
        )}
        <ModalFooter>
          <Button variant="secondary" onClick={() => setPreviewDoc(null)}>
            Chiudi
          </Button>
          {previewDoc && (
            <Button onClick={() => handleDownload(previewDoc)} leftIcon={<Download size={16} />}>
              Scarica
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Elimina Documento" size="sm">
        <p className="text-text-secondary">
          Sei sicuro di voler eliminare questo documento? Questa azione non puo essere annullata.
        </p>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Annulla</Button>
          <Button variant="danger" onClick={handleDelete}>Elimina</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
