import { useState, useMemo } from 'react';
import {
  FileText, Upload, Shield, Clock, CheckCircle, XCircle,
  Filter, Search, FolderOpen, AlertTriangle, Info
} from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { TenantDocument, DocumentType, DOCUMENT_TYPE_LABELS } from '@/types/tenant';

const REQUIRED_DOCS: DocumentType[] = [
  'identity_card',
  'fiscal_code',
  'payslip',
  'employment_contract',
];

const OPTIONAL_DOCS: DocumentType[] = [
  'bank_statement',
  'tax_return',
  'guarantee',
  'reference_letter',
];

export default function TenantDocumentsPage() {
  const {
    documents,
    isLoading,
    error,
    uploadStatus,
    uploadProgress,
    uploadError,
    deletingId,
    uploadDocument,
    deleteDocument,
    cancelUpload,
  } = useDocuments();

  const [showUpload, setShowUpload] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const stats = useMemo(() => {
    const verified = documents.filter(d => d.status === 'verified').length;
    const pending = documents.filter(d => d.status === 'pending').length;
    const rejected = documents.filter(d => d.status === 'rejected').length;
    return { total: documents.length, verified, pending, rejected };
  }, [documents]);

  // Required docs coverage
  const requiredCoverage = useMemo(() => {
    const uploaded = REQUIRED_DOCS.filter(type =>
      documents.some(d => d.type === type)
    );
    return { uploaded: uploaded.length, total: REQUIRED_DOCS.length };
  }, [documents]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    let filtered = [...documents];
    if (filterStatus !== 'all') {
      filtered = filtered.filter(d => d.status === filterStatus);
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(d => d.type === filterType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        DOCUMENT_TYPE_LABELS[d.type as DocumentType]?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [documents, filterStatus, filterType, searchQuery]);

  // Missing required docs
  const missingRequired = useMemo(() => {
    return REQUIRED_DOCS.filter(type => !documents.some(d => d.type === type));
  }, [documents]);

  const handleView = (doc: TenantDocument) => {
    if (doc.file?.url) {
      window.open(doc.file.url, '_blank');
    }
  };

  const handleDownload = (doc: TenantDocument) => {
    if (doc.file?.url) {
      const a = document.createElement('a');
      a.href = doc.file.url;
      a.download = doc.name;
      a.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">I Miei Documenti</h1>
          <p className="text-text-secondary">
            Gestisci i documenti per il tuo profilo inquilino
          </p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Carica Documento
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <FolderOpen size={20} className="text-primary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-muted">Totali</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{stats.verified}</p>
              <p className="text-xs text-text-muted">Verificati</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              <p className="text-xs text-text-muted">In Verifica</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
              <XCircle size={20} className="text-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-error">{stats.rejected}</p>
              <p className="text-xs text-text-muted">Rifiutati</p>
            </div>
          </div>
        </div>
      </div>

      {/* Required Docs Progress */}
      <div className="bg-white rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary-500" />
            <h3 className="font-semibold text-text-primary">Documenti Obbligatori</h3>
          </div>
          <span className="text-sm font-medium text-primary-500">
            {requiredCoverage.uploaded}/{requiredCoverage.total}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${(requiredCoverage.uploaded / requiredCoverage.total) * 100}%` }}
          />
        </div>
        {missingRequired.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {missingRequired.map(type => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200"
              >
                <AlertTriangle size={12} />
                {DOCUMENT_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        )}
        {missingRequired.length === 0 && (
          <p className="text-sm text-success flex items-center gap-1">
            <CheckCircle size={14} />
            Tutti i documenti obbligatori sono stati caricati
          </p>
        )}
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Carica Nuovo Documento</h3>
            <button
              onClick={() => setShowUpload(false)}
              className="text-text-muted hover:text-text-primary"
            >
              Chiudi
            </button>
          </div>
          <DocumentUploader
            onUpload={uploadDocument}
            uploadStatus={uploadStatus}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
            onCancel={cancelUpload}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cerca documenti..."
              className="input pl-9 text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input text-sm min-w-[140px]"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">Tutti gli stati</option>
              <option value="verified">Verificati</option>
              <option value="pending">In Verifica</option>
              <option value="rejected">Rifiutati</option>
            </select>
            <select
              className="input text-sm min-w-[160px]"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">Tutti i tipi</option>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl p-6 shadow-card">
        <DocumentList
          documents={filteredDocs}
          isLoading={isLoading}
          error={error}
          onDelete={deleteDocument}
          onView={handleView}
          onDownload={handleDownload}
          onAddNew={() => setShowUpload(true)}
          deletingId={deletingId}
        />
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Come funziona la verifica</p>
          <ul className="space-y-1 text-blue-600">
            <li>I documenti caricati vengono verificati entro 24-48 ore lavorative</li>
            <li>I documenti verificati aumentano il punteggio di affidabilita del tuo CV</li>
            <li>Puoi ricaricare documenti rifiutati con le correzioni richieste</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
