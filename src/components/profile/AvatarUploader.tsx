/**
 * AvatarUploader Component
 * Upload foto profilo con opzione camera/file
 */

import React, { useState, useCallback, useRef } from 'react';
import { Camera, Upload, User, X, Loader2, AlertCircle } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { AVATAR_CONSTRAINTS, validateAvatar, formatFileSize } from '@/utils/fileValidation';
import { isMobile } from '@/utils/mediaUtils';

interface AvatarUploaderProps {
  currentAvatar?: string | null;
  onUpload: (file: File | Blob) => Promise<void>;
  disabled?: boolean;
  isUploading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

type Mode = 'view' | 'options' | 'camera' | 'uploading';

export function AvatarUploader({
  currentAvatar,
  onUpload,
  disabled = false,
  isUploading = false,
  size = 'lg',
}: AvatarUploaderProps) {
  const [mode, setMode] = useState<Mode>('view');
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMobileDevice = isMobile();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);

      // Valida file
      const validation = validateAvatar(file);
      if (!validation.valid) {
        setError(validation.error || 'File non valido');
        return;
      }

      // Upload
      try {
        setMode('uploading');
        await onUpload(file);
        setMode('view');
      } catch (err: any) {
        setError(err.message || 'Errore durante il caricamento');
        setMode('view');
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onUpload]
  );

  const handleCameraCapture = useCallback(
    async (blob: Blob) => {
      setError(null);

      try {
        setMode('uploading');
        await onUpload(blob);
        setMode('view');
      } catch (err: any) {
        setError(err.message || 'Errore durante il caricamento');
        setMode('view');
      }
    },
    [onUpload]
  );

  const handleClick = () => {
    if (disabled || isUploading) return;
    setMode('options');
    setError(null);
  };

  // Modal camera
  if (mode === 'camera') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 px-3 md:p-4"
        style={{ paddingBottom: 'max(96px, calc(84px + env(safe-area-inset-bottom, 0px)))' }}
      >
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full overflow-x-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Scatta foto</h3>
            <button
              onClick={() => setMode('view')}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <CameraCapture
            onCapture={handleCameraCapture}
            onCancel={() => setMode('view')}
          />
        </div>
      </div>
    );
  }

  // Modal opzioni
  if (mode === 'options') {
    return (
      <>
        {/* Avatar con overlay */}
        <div className="relative">
          <div
            className={`
              ${sizeClasses[size]} rounded-full overflow-hidden
              bg-gray-100 border-2 border-white shadow-lg
              flex items-center justify-center
            `}
          >
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className={`${iconSizes[size]} text-gray-400`} />
            )}
          </div>
        </div>

        {/* Modal opzioni */}
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 px-3"
          style={{ paddingBottom: 'max(96px, calc(84px + env(safe-area-inset-bottom, 0px)))' }}
        >
          <div
            className="bg-white rounded-2xl w-full md:max-w-sm p-6 animate-slide-up overflow-x-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Cambia foto profilo</h3>
              <button
                onClick={() => setMode('view')}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              {/* Scatta foto (principalmente per mobile) */}
              <button
                onClick={() => setMode('camera')}
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Scatta foto</p>
                  <p className="text-sm text-gray-500">Usa la camera del dispositivo</p>
                </div>
              </button>

              {/* Carica da file */}
              <label className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Carica foto</p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG • Max {formatFileSize(AVATAR_CONSTRAINTS.maxSize)}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => setMode('view')}
              className="w-full mt-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm"
            >
              Annulla
            </button>
          </div>
        </div>
      </>
    );
  }

  // Vista normale - avatar cliccabile
  return (
    <div className="relative inline-block group">
      <button
        onClick={handleClick}
        disabled={disabled || isUploading}
        className={`
          ${sizeClasses[size]} rounded-full overflow-hidden
          bg-gray-100 border-2 border-white shadow-lg
          flex items-center justify-center
          transition-all duration-200
          ${!disabled && !isUploading ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
          relative
        `}
      >
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </button>

      {/* Badge camera - angolo basso dx, visibile solo su hover */}
      {!disabled && !isUploading && (
        <button
          type="button"
          onClick={handleClick}
          aria-label="Cambia foto profilo"
          className="absolute bottom-0.5 right-0.5 w-8 h-8 bg-action-green rounded-full flex items-center justify-center border-2 border-white shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Errore sotto avatar */}
      {error && mode === 'view' && (
        <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default AvatarUploader;
