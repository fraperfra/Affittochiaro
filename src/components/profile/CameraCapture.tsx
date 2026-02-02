/**
 * CameraCapture Component
 * Interfaccia per scattare foto con la camera
 */

import React from 'react';
import { Camera, SwitchCamera, RotateCcw, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useCamera, CameraState } from '@/hooks/useCamera';
import { isUserMediaSupported, isMobile } from '@/utils/mediaUtils';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onCancel?: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const {
    state,
    capturedUrl,
    capturedImage,
    error,
    isMobileDevice,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capture,
    resetCapture,
    switchCamera,
  } = useCamera();

  // Verifica supporto
  if (!isUserMediaSupported()) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Camera non supportata
        </h3>
        <p className="text-sm text-gray-500 text-center">
          Il tuo browser non supporta l'accesso alla camera.
        </p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Chiudi
          </button>
        )}
      </div>
    );
  }

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel?.();
  };

  // Stato iniziale - avvia camera
  if (state === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
        <div className="w-20 h-20 rounded-full bg-action-green/10 flex items-center justify-center mb-4">
          <Camera className="w-10 h-10 text-action-green" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Scatta una foto profilo
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
          Usa la tua camera per scattare una foto del tuo profilo
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          onClick={startCamera}
          className="px-6 py-3 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors font-medium"
        >
          Avvia Camera
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Annulla
          </button>
        )}
      </div>
    );
  }

  // Richiesta permessi
  if (state === 'requesting') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
        <Loader2 className="w-12 h-12 text-action-green animate-spin mb-4" />
        <p className="text-gray-700">Richiesta accesso camera...</p>
        <p className="text-sm text-gray-500 mt-2">
          Consenti l'accesso quando richiesto
        </p>
      </div>
    );
  }

  // Foto catturata - preview
  if (state === 'captured' && capturedUrl) {
    return (
      <div className="flex flex-col items-center">
        {/* Preview immagine */}
        <div className="relative w-64 h-64 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
          <img
            src={capturedUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Azioni */}
        <div className="flex gap-4">
          <button
            onClick={resetCapture}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Riprova
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors font-medium"
          >
            <Check className="w-4 h-4" />
            Usa questa foto
          </button>
        </div>
      </div>
    );
  }

  // Camera pronta - live preview
  return (
    <div className="flex flex-col items-center">
      {/* Live preview */}
      <div className="relative">
        {/* Video */}
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${isMobileDevice ? '' : 'transform scale-x-[-1]'}`}
          />
        </div>

        {/* Guida per centrare il volto */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full rounded-full border-2 border-dashed border-white/50" />
        </div>

        {/* Canvas nascosto per cattura */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Istruzioni */}
      <p className="text-sm text-gray-500 mt-4 text-center">
        Centra il tuo volto nel cerchio
      </p>

      {/* Controlli */}
      <div className="flex items-center gap-4 mt-6">
        {/* Cambia camera (solo mobile) */}
        {isMobileDevice && (
          <button
            onClick={switchCamera}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title="Cambia camera"
          >
            <SwitchCamera className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Scatta */}
        <button
          onClick={capture}
          className="w-16 h-16 rounded-full bg-white border-4 border-action-green flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          title="Scatta foto"
        >
          <div className="w-12 h-12 rounded-full bg-action-green" />
        </button>

        {/* Annulla */}
        <button
          onClick={handleCancel}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Annulla"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default CameraCapture;
