/**
 * DocumentList Component
 * Lista di tutti i documenti caricati
 */

import React from 'react';
import { FileText, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { TenantDocument } from '@/types/tenant';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: TenantDocument[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (id: string) => void;
  onView?: (document: TenantDocument) => void;
  onDownload?: (document: TenantDocument) => void;
  onAddNew?: () => void;
  deletingId?: string | null;
}

export function DocumentList({
  documents,
  isLoading = false,
  error,
  onDelete,
  onView,
  onDownload,
  onAddNew,
  deletingId,
}: DocumentListProps) {
  // Stato di caricamento
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p>Caricamento documenti...</p>
      </div>
    );
  }

  // Stato di errore
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <AlertCircle className="w-8 h-8 mb-3" />
        <p className="font-medium">Errore nel caricamento</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    );
  }

  // Stato vuoto
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="font-medium text-gray-700">Nessun documento caricato</p>
        <p className="text-sm mt-1 max-w-xs text-center">
          Carica i tuoi documenti per aumentare la credibilità del tuo profilo
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors"
          >
            <Plus className="w-4 h-4" />
            Carica documento
          </button>
        )}
      </div>
    );
  }

  // Raggruppa documenti per stato
  const verifiedDocs = documents.filter((d) => d.status === 'verified');
  const pendingDocs = documents.filter((d) => d.status === 'pending');
  const rejectedDocs = documents.filter((d) => d.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Header con statistiche */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {documents.length} document{documents.length !== 1 ? 'i' : 'o'}
          </span>
          {verifiedDocs.length > 0 && (
            <span className="text-sm text-green-600">
              {verifiedDocs.length} verificat{verifiedDocs.length !== 1 ? 'i' : 'o'}
            </span>
          )}
          {pendingDocs.length > 0 && (
            <span className="text-sm text-yellow-600">
              {pendingDocs.length} in attesa
            </span>
          )}
        </div>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-action-green hover:bg-green-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Aggiungi
          </button>
        )}
      </div>

      {/* Lista documenti rifiutati (in evidenza) */}
      {rejectedDocs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Documenti da ricaricare ({rejectedDocs.length})
          </h4>
          <div className="grid gap-3">
            {rejectedDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={onDelete}
                onView={onView}
                onDownload={onDownload}
                isDeleting={deletingId === doc.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lista documenti in verifica */}
      {pendingDocs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-yellow-600">
            In attesa di verifica ({pendingDocs.length})
          </h4>
          <div className="grid gap-3">
            {pendingDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={onDelete}
                onView={onView}
                onDownload={onDownload}
                isDeleting={deletingId === doc.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lista documenti verificati */}
      {verifiedDocs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-green-600">
            Documenti verificati ({verifiedDocs.length})
          </h4>
          <div className="grid gap-3">
            {verifiedDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={onDelete}
                onView={onView}
                onDownload={onDownload}
                isDeleting={deletingId === doc.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentList;
