/**
 * VideoUploader Component
 * Upload di video esistenti con validazione
 */

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, AlertCircle, Loader2, X } from 'lucide-react';
import {
  VIDEO_CONSTRAINTS,
  validateVideo,
  validateVideoDuration,
  getVideoDuration,
  formatFileSize,
  formatDuration,
} from '@/utils/fileValidation';
import { UploadProgress } from '@/components/documents/UploadProgress';
import { UploadStatus } from '@/hooks/useFileUpload';

interface VideoUploaderProps {
  onUpload: (file: File, duration: number) => Promise<void>;
  disabled?: boolean;
  uploadStatus?: UploadStatus;
  uploadProgress?: number;
  uploadError?: string | null;
  onCancel?: () => void;
}

export function VideoUploader({
  onUpload,
  disabled = false,
  uploadStatus = 'idle',
  uploadProgress = 0,
  uploadError,
  onCancel,
}: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'validating';

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setIsValidating(true);

    try {
      // Valida tipo e dimensione
      const validation = validateVideo(file);
      if (!validation.valid) {
        setError(validation.error || 'File non valido');
        setIsValidating(false);
        return;
      }

      // Ottieni e valida durata
      const duration = await getVideoDuration(file);
      const durationValidation = validateVideoDuration(duration);
      if (!durationValidation.valid) {
        setError(durationValidation.error || 'Video troppo lungo');
        setIsValidating(false);
        return;
      }

      // Crea preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);

      setSelectedFile(file);
      setPreviewUrl(url);
      setVideoDuration(Math.floor(duration));
    } catch (err: any) {
      setError(err.message || 'Errore nella lettura del video');
    } finally {
      setIsValidating(false);
    }
  }, [previewUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileSelect(acceptedFiles[0]);
      }
    },
    [handleFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/quicktime': ['.mov'],
    },
    maxSize: VIDEO_CONSTRAINTS.maxSize,
    multiple: false,
    disabled: disabled || isUploading || isValidating,
  });

  const handleUpload = async () => {
    if (!selectedFile || videoDuration === null) return;

    setError(null);
    try {
      await onUpload(selectedFile, videoDuration);
    } catch (err: any) {
      setError(err.message || 'Errore durante il caricamento');
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setVideoDuration(null);
    setError(null);
  };

  // Preview video selezionato
  if (selectedFile && previewUrl && uploadStatus === 'idle') {
    return (
      <div className="space-y-4">
        {/* Video preview */}
        <div className="relative rounded-xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={previewUrl}
            controls
            className="w-full aspect-video"
          />
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info file */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 min-w-0">
            <Video className="w-8 h-8 text-action-green flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)} • {formatDuration(videoDuration || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Errore */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Azioni */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={disabled}
            className="flex-1 py-2.5 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Carica Video
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cambia
          </button>
        </div>
      </div>
    );
  }

  // Progress upload
  if (uploadStatus !== 'idle') {
    return (
      <UploadProgress
        status={uploadStatus}
        progress={uploadProgress}
        fileName={selectedFile?.name}
        fileSize={selectedFile?.size}
        error={uploadError}
        onCancel={onCancel}
        onRetry={handleUpload}
      />
    );
  }

  // Validazione in corso
  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <Loader2 className="w-10 h-10 text-action-green animate-spin mb-3" />
        <p className="text-gray-600">Verifica video in corso...</p>
      </div>
    );
  }

  // Dropzone
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center
          transition-all duration-200 cursor-pointer
          ${isDragActive && !isDragReject ? 'border-action-green bg-green-50' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-action-green hover:bg-green-50/50'}
          ${!isDragActive && !isDragReject && !disabled ? 'border-gray-300 bg-white' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          {isDragReject ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-red-600 font-medium">Video non supportato</p>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="w-12 h-12 text-action-green animate-bounce" />
              <p className="text-action-green font-medium">Rilascia il video qui</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Video className="w-8 h-8 text-action-green" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  Trascina un video qui
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  oppure <span className="text-action-green">sfoglia</span> per selezionare
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                MP4, WebM, MOV • Max {formatFileSize(VIDEO_CONSTRAINTS.maxSize)} • Max {formatDuration(VIDEO_CONSTRAINTS.maxDuration)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Errore */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default VideoUploader;
