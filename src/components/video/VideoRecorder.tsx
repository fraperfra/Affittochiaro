/**
 * VideoRecorder Component
 * Interfaccia completa per registrazione video
 */

import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useVideoRecorder, RecordingState } from '@/hooks/useVideoRecorder';
import { VideoRecordingControls } from './VideoRecordingControls';
import { isMediaRecorderSupported, isMobile } from '@/utils/mediaUtils';
import { VIDEO_CONSTRAINTS } from '@/utils/fileValidation';

interface VideoRecorderProps {
  maxDuration?: number;
  onRecordingComplete: (file: File, duration: number) => void;
  onCancel?: () => void;
}

export function VideoRecorder({
  maxDuration = VIDEO_CONSTRAINTS.maxDuration,
  onRecordingComplete,
  onCancel,
}: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  const {
    state,
    stream,
    recordedUrl,
    duration,
    error,
    startCamera,
    stopCamera,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    getRecordedFile,
  } = useVideoRecorder({
    maxDuration,
    onMaxDurationReached: () => {
      // Auto-stop già gestito nell'hook
    },
  });

  // Collega stream al video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Verifica supporto
  if (!isMediaRecorderSupported()) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
        <VideoOff className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Registrazione non supportata
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Il tuo browser non supporta la registrazione video.
          Prova ad usare Chrome, Firefox o Edge.
        </p>
      </div>
    );
  }

  const handleConfirm = () => {
    const file = getRecordedFile();
    if (file) {
      onRecordingComplete(file, duration);
      setConfirmed(true);
    }
  };

  const handleReset = () => {
    setConfirmed(false);
    resetRecording();
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
          <Video className="w-10 h-10 text-action-green" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Registra il tuo video di presentazione
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
          Presenta te stesso ai proprietari in massimo {Math.floor(maxDuration / 60)} minuto.
          Un video aumenta le tue possibilità del 300%!
        </p>
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
        <p className="text-gray-700">Richiesta accesso camera e microfono...</p>
        <p className="text-sm text-gray-500 mt-2">
          Consenti l'accesso quando richiesto dal browser
        </p>
      </div>
    );
  }

  // Errore
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Errore
        </h3>
        <p className="text-sm text-red-600 text-center max-w-sm mb-6">
          {error}
        </p>
        <div className="flex gap-3">
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors"
          >
            Riprova
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
          )}
        </div>
      </div>
    );
  }

  // Registrazione completata - mostra preview
  if (state === 'stopped' && recordedUrl) {
    return (
      <div className="flex flex-col items-center">
        {/* Video preview */}
        <div className="relative w-full max-w-lg rounded-xl overflow-hidden bg-black mb-4">
          <video
            src={recordedUrl}
            controls
            className="w-full aspect-video"
          />
          {confirmed && (
            <div className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center text-white">
              <CheckCircle className="w-16 h-16 mb-3" />
              <p className="text-lg font-medium">Video pronto!</p>
            </div>
          )}
        </div>

        {/* Info */}
        <p className="text-sm text-gray-500 mb-4">
          Durata: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
        </p>

        {/* Azioni */}
        {!confirmed ? (
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors font-medium"
            >
              Usa questo video
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Registra di nuovo
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Il video verrà caricato...
          </p>
        )}
      </div>
    );
  }

  // Camera pronta o in registrazione
  return (
    <div className="flex flex-col items-center">
      {/* Preview camera */}
      <div className="relative w-full max-w-lg rounded-xl overflow-hidden bg-black mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full aspect-video ${isMobile() ? 'transform scale-x-[-1]' : ''}`}
        />

        {/* Overlay durante registrazione */}
        {state === 'recording' && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white text-sm rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            REC
          </div>
        )}

        {/* Overlay pausa */}
        {state === 'paused' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white text-lg font-medium">In pausa</p>
          </div>
        )}
      </div>

      {/* Controlli */}
      <VideoRecordingControls
        state={state}
        duration={duration}
        maxDuration={maxDuration}
        onStart={startRecording}
        onStop={stopRecording}
        onPause={pauseRecording}
        onResume={resumeRecording}
        onReset={resetRecording}
      />

      {/* Bottone annulla */}
      {state === 'ready' && onCancel && (
        <button
          onClick={handleCancel}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Annulla
        </button>
      )}
    </div>
  );
}

export default VideoRecorder;
