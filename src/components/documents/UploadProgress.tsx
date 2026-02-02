/**
 * UploadProgress Component
 * Progress bar per upload con stato e animazioni
 */

import React from 'react';
import { CheckCircle, XCircle, Loader2, Upload } from 'lucide-react';
import { UploadStatus } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/utils/fileValidation';

interface UploadProgressProps {
  status: UploadStatus;
  progress: number;
  fileName?: string | null;
  fileSize?: number | null;
  error?: string | null;
  onCancel?: () => void;
  onRetry?: () => void;
}

export function UploadProgress({
  status,
  progress,
  fileName,
  fileSize,
  error,
  onCancel,
  onRetry,
}: UploadProgressProps) {
  if (status === 'idle') {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'validating':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'uploading':
        return <Upload className="w-5 h-5 text-action-green" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'validating':
        return 'Verifica file in corso...';
      case 'uploading':
        return `Caricamento ${progress}%`;
      case 'success':
        return 'Caricato con successo!';
      case 'error':
        return error || 'Errore durante il caricamento';
      default:
        return '';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-action-green';
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start gap-3">
        {/* Icona stato */}
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>

        {/* Contenuto */}
        <div className="flex-1 min-w-0">
          {/* Nome file */}
          {fileName && (
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </p>
          )}

          {/* Dimensione file */}
          {fileSize && (
            <p className="text-xs text-gray-500 mt-0.5">
              {formatFileSize(fileSize)}
            </p>
          )}

          {/* Progress bar */}
          {(status === 'uploading' || status === 'validating') && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${getProgressBarColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stato testuale */}
          <p className={`text-xs mt-1 ${status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
            {getStatusText()}
          </p>
        </div>

        {/* Azioni */}
        <div className="flex-shrink-0">
          {status === 'uploading' && onCancel && (
            <button
              onClick={onCancel}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Annulla
            </button>
          )}
          {status === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-action-green hover:text-brand-green transition-colors font-medium"
            >
              Riprova
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadProgress;
