/**
 * Sezione documenti del CV
 */

import { TenantDocument, DOCUMENT_TYPE_LABELS, DocumentType } from '@/types/tenant';
import { FileText, CheckCircle2, Clock, XCircle, Upload } from 'lucide-react';

interface CVDocumentsSectionProps {
  documents: TenantDocument[];
  onUpload?: () => void;
  editable?: boolean;
}

export default function CVDocumentsSection({ documents, onUpload, editable = false }: CVDocumentsSectionProps) {
  const statusConfig = {
    verified: { icon: CheckCircle2, label: 'Verificato', color: 'text-green-500', bg: 'bg-green-50' },
    pending: { icon: Clock, label: 'In verifica', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    rejected: { icon: XCircle, label: 'Rifiutato', color: 'text-red-500', bg: 'bg-red-50' },
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const pendingCount = documents.filter(d => d.status === 'pending').length;

  return (
    <div id="section-documents">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <FileText size={20} className="text-primary-500" />
            Documenti
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {verifiedCount} verificat{verifiedCount === 1 ? 'o' : 'i'}
            {pendingCount > 0 && `, ${pendingCount} in attesa`}
          </p>
        </div>
        {editable && onUpload && (
          <button
            onClick={onUpload}
            className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            <Upload size={16} />
            Carica
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <FileText size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-text-secondary">Nessun documento caricato</p>
          {editable && (
            <p className="text-xs text-text-secondary mt-1">
              Carica carta d'identita' e busta paga per verificare il profilo
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const status = statusConfig[doc.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${status.bg} flex items-center justify-center`}>
                    <FileText size={16} className={status.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {DOCUMENT_TYPE_LABELS[doc.type as DocumentType] || doc.type}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {doc.name} - {formatSize(doc.file.size)} - {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusIcon size={14} className={status.color} />
                  <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
