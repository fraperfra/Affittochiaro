/**
 * useFileUpload Hook
 * Hook generico per upload file con progress, validazione e retry
 */

import { useState, useCallback, useRef } from 'react';
import axios, { AxiosProgressEvent, CancelTokenSource } from 'axios';
import { getAccessToken } from '@/services/api/client';
import {
  FileConstraints,
  FileValidationResult,
  validateFile,
  formatFileSize,
} from '@/utils/fileValidation';

export type UploadStatus = 'idle' | 'validating' | 'uploading' | 'success' | 'error';

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error: string | null;
  fileName: string | null;
  fileSize: number | null;
}

export interface UseFileUploadOptions {
  constraints: FileConstraints;
  endpoint?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseFileUploadReturn {
  state: UploadState;
  upload: (file: File, metadata?: Record<string, any>) => Promise<any>;
  uploadToUrl: (file: File | Blob, presignedUrl: string) => Promise<void>;
  validate: (file: File) => FileValidationResult;
  reset: () => void;
  cancel: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export function useFileUpload(options: UseFileUploadOptions): UseFileUploadReturn {
  const { constraints, endpoint, onSuccess, onError, onProgress } = options;

  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    error: null,
    fileName: null,
    fileSize: null,
  });

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateState = useCallback((updates: Partial<UploadState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const validate = useCallback(
    (file: File): FileValidationResult => {
      return validateFile(file, constraints);
    },
    [constraints]
  );

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      error: null,
      fileName: null,
      fileSize: null,
    });
  }, []);

  const cancel = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Upload cancelled');
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    reset();
  }, [reset]);

  /**
   * Upload file al backend con FormData
   */
  const upload = useCallback(
    async (file: File, metadata?: Record<string, any>): Promise<any> => {
      // Import dynamic per evitare dipendenze circolari/pesanti se non servono
      const { USE_MOCK } = await import('@/services');

      // Reset state
      updateState({
        status: 'validating',
        progress: 0,
        error: null,
        fileName: file.name,
        fileSize: file.size,
      });

      // Validazione
      const validation = validate(file);
      if (!validation.valid) {
        updateState({ status: 'error', error: validation.error || 'File non valido' });
        onError?.(validation.error || 'File non valido');
        return Promise.reject(new Error(validation.error));
      }

      if (!endpoint) {
        const error = 'Endpoint non configurato';
        updateState({ status: 'error', error });
        onError?.(error);
        return Promise.reject(new Error(error));
      }

      updateState({ status: 'uploading' });

      // MOCK MODE HANDLING
      if (USE_MOCK) {
        try {
          const { mockDocumentsApi, mockVideoApi, mockAvatarApi } = await import('@/services/mock/mockTenantService');

          let responseData;

          // Gestione progress simulato
          const handleProgress = (percent: number) => {
            updateState({ progress: percent });
            onProgress?.(percent);
          };

          // Routing endpoint mock
          if (endpoint.includes('/documents')) {
            // Estrai tipo dal metadata o default
            const type = metadata?.type || 'other';
            responseData = await mockDocumentsApi.uploadDocument(type, file, handleProgress);
          } else if (endpoint.includes('/video')) {
            // Video upload (che in realtà usa presigned ma qui simuliamo)
            const url = await mockVideoApi.uploadVideo(file, handleProgress);
            responseData = { uploadUrl: url, videoUrl: url };
          } else if (endpoint.includes('/avatar')) {
            const url = await mockAvatarApi.uploadAvatar(file, handleProgress);
            responseData = { url };
          } else {
            // Fallback generico
            await new Promise(r => setTimeout(r, 1000));
            handleProgress(100);
            responseData = { success: true, mock: true };
          }

          updateState({ status: 'success', progress: 100 });
          onSuccess?.(responseData);
          return responseData;

        } catch (error: any) {
          const errorMessage = error.message || 'Errore mock';
          updateState({ status: 'error', error: errorMessage });
          onError?.(errorMessage);
          return Promise.reject(error);
        }
      }

      // REAL API HANDLING
      // Prepara FormData
      const formData = new FormData();
      formData.append('file', file);

      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      // Crea cancel token
      cancelTokenRef.current = axios.CancelToken.source();

      try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getAccessToken()}`,
          },
          cancelToken: cancelTokenRef.current.token,
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              updateState({ progress: percentCompleted });
              onProgress?.(percentCompleted);
            }
          },
        });

        updateState({ status: 'success', progress: 100 });
        onSuccess?.(response.data);
        return response.data;
      } catch (error: any) {
        if (axios.isCancel(error)) {
          updateState({ status: 'idle', error: null });
          return Promise.reject(error);
        }

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Errore durante il caricamento';

        updateState({ status: 'error', error: errorMessage });
        onError?.(errorMessage);
        return Promise.reject(new Error(errorMessage));
      } finally {
        cancelTokenRef.current = null;
      }
    },
    [endpoint, validate, updateState, onSuccess, onError, onProgress]
  );

  /**
   * Upload diretto a URL presigned (es. S3)
   */
  const uploadToUrl = useCallback(
    async (file: File | Blob, presignedUrl: string): Promise<void> => {
      updateState({
        status: 'uploading',
        progress: 0,
        error: null,
        fileName: file instanceof File ? file.name : 'blob',
        fileSize: file.size,
      });

      // Crea abort controller
      abortControllerRef.current = new AbortController();

      try {
        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentCompleted = Math.round((event.loaded * 100) / event.total);
              updateState({ progress: percentCompleted });
              onProgress?.(percentCompleted);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              updateState({ status: 'success', progress: 100 });
              resolve();
            } else {
              const error = `Upload fallito: ${xhr.statusText}`;
              updateState({ status: 'error', error });
              onError?.(error);
              reject(new Error(error));
            }
          };

          xhr.onerror = () => {
            const error = 'Errore di rete durante il caricamento';
            updateState({ status: 'error', error });
            onError?.(error);
            reject(new Error(error));
          };

          xhr.onabort = () => {
            updateState({ status: 'idle', error: null });
            reject(new Error('Upload cancelled'));
          };
        });

        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.send(file);

        // Store abort function
        abortControllerRef.current.signal.addEventListener('abort', () => {
          xhr.abort();
        });

        await uploadPromise;
        onSuccess?.({ url: presignedUrl });
      } catch (error: any) {
        if (error.message === 'Upload cancelled') {
          return;
        }
        throw error;
      } finally {
        abortControllerRef.current = null;
      }
    },
    [updateState, onSuccess, onError, onProgress]
  );

  return {
    state,
    upload,
    uploadToUrl,
    validate,
    reset,
    cancel,
  };
}

export default useFileUpload;
