/**
 * useDocuments Hook
 * Gestione CRUD documenti con stato e integrazione API/Mock
 */

import { useState, useCallback, useEffect } from 'react';
import { TenantDocument, DocumentType } from '@/types/tenant';
import { tenantsApi } from '@/services/api/tenants';
import { mockDocumentsApi, USE_MOCK_API } from '@/services/mock/mockTenantService';
import { useFileUpload, UploadStatus } from './useFileUpload';
import { DOCUMENT_CONSTRAINTS } from '@/utils/fileValidation';

interface UseDocumentsReturn {
  documents: TenantDocument[];
  isLoading: boolean;
  error: string | null;
  uploadStatus: UploadStatus;
  uploadProgress: number;
  uploadError: string | null;
  deletingId: string | null;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File, type: DocumentType) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  cancelUpload: () => void;
  resetUpload: () => void;
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Hook per upload
  const {
    state: uploadState,
    upload,
    reset: resetUpload,
    cancel: cancelUpload,
  } = useFileUpload({
    constraints: DOCUMENT_CONSTRAINTS,
    endpoint: '/tenants/me/documents',
    onSuccess: (response) => {
      // Aggiungi documento alla lista
      if (response?.data) {
        setDocuments((prev) => [...prev, response.data]);
      }
    },
    onError: (error) => {
      console.error('Upload error:', error);
    },
  });

  /**
   * Carica lista documenti
   */
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let docs: TenantDocument[];

      if (USE_MOCK_API) {
        docs = await mockDocumentsApi.getDocuments();
      } else {
        const response = await tenantsApi.getDocuments();
        // Mappa la risposta API al tipo TenantDocument
        docs = response.map((doc: any) => ({
          id: doc.id,
          type: doc.type as DocumentType,
          name: doc.name,
          file: {
            id: doc.id,
            name: doc.name,
            type: 'application/octet-stream',
            size: 0,
            url: doc.fileUrl,
            uploadedAt: new Date(doc.uploadedAt),
          },
          status: doc.status,
          uploadedAt: new Date(doc.uploadedAt),
          verifiedAt: doc.verifiedAt ? new Date(doc.verifiedAt) : undefined,
          rejectionReason: doc.rejectionReason,
        }));
      }

      setDocuments(docs);
    } catch (err: any) {
      const errorMessage = err.message || 'Errore nel caricamento dei documenti';
      setError(errorMessage);
      console.error('Fetch documents error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Upload documento
   */
  const uploadDocument = useCallback(
    async (file: File, type: DocumentType) => {
      try {
        if (USE_MOCK_API) {
          // Usa mock API con progress simulato
          const doc = await mockDocumentsApi.uploadDocument(
            type,
            file,
            (progress) => {
              // Il progress viene gestito internamente dal mock
            }
          );
          setDocuments((prev) => [...prev, doc]);
        } else {
          // Usa API reale
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', type);

          await upload(file, { type });
        }
      } catch (err: any) {
        console.error('Upload document error:', err);
        throw err;
      }
    },
    [upload]
  );

  /**
   * Elimina documento
   */
  const deleteDocument = useCallback(async (id: string) => {
    setDeletingId(id);

    try {
      if (USE_MOCK_API) {
        await mockDocumentsApi.deleteDocument(id);
      } else {
        await tenantsApi.deleteDocument(id);
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err: any) {
      console.error('Delete document error:', err);
      setError(err.message || 'Errore durante l\'eliminazione');
    } finally {
      setDeletingId(null);
    }
  }, []);

  // Carica documenti all'avvio
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    uploadStatus: uploadState.status,
    uploadProgress: uploadState.progress,
    uploadError: uploadState.error,
    deletingId,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    cancelUpload,
    resetUpload,
  };
}

export default useDocuments;
