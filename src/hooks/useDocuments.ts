/**
 * useDocuments Hook
 * Gestione CRUD documenti con stato e integrazione API/Mock
 */

import { useState, useCallback, useEffect } from 'react';
import { TenantDocument, DocumentType } from '@/types/tenant';
import { mockDocumentsApi } from '@/services/mock/mockTenantService';
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
      const docs = await mockDocumentsApi.getDocuments();
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
        const doc = await mockDocumentsApi.uploadDocument(type, file, () => {});
        setDocuments((prev) => [...prev, doc]);
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
      await mockDocumentsApi.deleteDocument(id);
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
