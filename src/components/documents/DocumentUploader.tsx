/**
 * DocumentUploader Component
 * Dropzone per upload documenti con drag & drop
 */

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { DocumentType } from '@/types/tenant';
import { DOCUMENT_CONSTRAINTS, formatFileSize } from '@/utils/fileValidation';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { UploadProgress } from './UploadProgress';
import { UploadStatus } from '@/hooks/useFileUpload';

interface DocumentUploaderProps {
  onUpload: (file: File, type: DocumentType) => Promise<void>;
  disabled?: boolean;
  uploadStatus?: UploadStatus;
  uploadProgress?: number;
  uploadError?: string | null;
  onCancel?: () => void;
}

export function DocumentUploader({
  onUpload,
  disabled = false,
  uploadStatus = 'idle',
  uploadProgress = 0,
  uploadError,
  onCancel,
}: DocumentUploaderProps) {
  const [selectedType, setSelectedType] = useState<DocumentType | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'validating';

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      // Gestisci file rifiutati
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File troppo grande. Massimo ${formatFileSize(DOCUMENT_CONSTRAINTS.maxSize)}`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Formato non supportato. Usa PDF, JPG o PNG');
        } else {
          setError(rejection.errors[0]?.message || 'File non valido');
        }
        return;
      }

      // Prendi il primo file accettato
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: DOCUMENT_CONSTRAINTS.maxSize,
    multiple: false,
    disabled: disabled || isUploading,
  });

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      if (!selectedType) {
        setError('Seleziona il tipo di documento');
      }
      return;
    }

    setError(null);

    try {
      await onUpload(selectedFile, selectedType);
      // Reset dopo successo
      setSelectedFile(null);
      setSelectedType('');
    } catch (err: any) {
      setError(err.message || 'Errore durante il caricamento');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedType('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Selector tipo documento */}
      <DocumentTypeSelector
        value={selectedType}
        onChange={setSelectedType}
        disabled={disabled || isUploading}
        error={!selectedType && error?.includes('tipo') ? error : undefined}
      />

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center
          transition-all duration-200 cursor-pointer
          ${isDragActive && !isDragReject ? 'border-action-green bg-green-50' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-action-green hover:bg-green-50/50'}
          ${!isDragActive && !isDragReject && !disabled ? 'border-gray-300 bg-white' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          {isDragReject ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-red-600 font-medium">File non supportato</p>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="w-12 h-12 text-action-green animate-bounce" />
              <p className="text-action-green font-medium">Rilascia il file qui</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-action-green" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  Trascina un documento qui
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  oppure <span className="text-action-green">sfoglia</span> per selezionare
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                PDF, JPG, PNG • Max {formatFileSize(DOCUMENT_CONSTRAINTS.maxSize)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* File selezionato */}
      {selectedFile && uploadStatus === 'idle' && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-8 h-8 text-action-green flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-600 transition-colors px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Progress durante upload */}
      {uploadStatus !== 'idle' && (
        <UploadProgress
          status={uploadStatus}
          progress={uploadProgress}
          fileName={selectedFile?.name}
          fileSize={selectedFile?.size}
          error={uploadError}
          onCancel={onCancel}
          onRetry={handleUpload}
        />
      )}

      {/* Errore */}
      {error && uploadStatus === 'idle' && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Bottone carica */}
      {selectedFile && uploadStatus === 'idle' && (
        <button
          onClick={handleUpload}
          disabled={!selectedType || disabled}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white
            transition-all duration-200
            ${!selectedType || disabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-action-green hover:bg-brand-green'
            }
          `}
        >
          Carica Documento
        </button>
      )}
    </div>
  );
}

export default DocumentUploader;
