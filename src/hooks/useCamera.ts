/**
 * useCamera Hook
 * Hook per accesso camera e scatto foto
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { isUserMediaSupported, stopMediaStream, isMobile } from '@/utils/mediaUtils';

export type CameraState = 'idle' | 'requesting' | 'ready' | 'captured';

export interface UseCameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export interface UseCameraReturn {
  state: CameraState;
  stream: MediaStream | null;
  capturedImage: Blob | null;
  capturedUrl: string | null;
  error: string | null;
  isMobileDevice: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capture: () => void;
  resetCapture: () => void;
  switchCamera: () => Promise<void>;
}

export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const {
    facingMode: initialFacingMode = 'user',
    width = 640,
    height = 480,
  } = options;

  const [state, setState] = useState<CameraState>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(initialFacingMode);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isMobileDevice = isMobile();

  /**
   * Avvia la camera
   */
  const startCamera = useCallback(async () => {
    if (!isUserMediaSupported()) {
      setError('Il tuo browser non supporta l\'accesso alla camera');
      return;
    }

    setState('requesting');
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode,
        },
        audio: false,
      });

      setStream(mediaStream);

      // Collega al video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setState('ready');
    } catch (err: any) {
      let errorMessage = 'Errore nell\'accesso alla camera';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Permesso camera negato. Abilita l\'accesso nelle impostazioni del browser.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Nessuna camera trovata sul dispositivo.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'La camera è già in uso da un\'altra applicazione.';
      }

      setError(errorMessage);
      setState('idle');
    }
  }, [width, height, facingMode]);

  /**
   * Ferma la camera
   */
  const stopCamera = useCallback(() => {
    stopMediaStream(stream);
    setStream(null);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState('idle');
  }, [stream]);

  /**
   * Scatta foto
   */
  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      setError('Camera non pronta');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Errore nella creazione dell\'immagine');
      return;
    }

    // Imposta dimensioni canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Se camera frontale, specchia l'immagine
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Disegna frame corrente
    ctx.drawImage(video, 0, 0);

    // Converti in blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Revoca URL precedente
          if (capturedUrl) {
            URL.revokeObjectURL(capturedUrl);
          }

          setCapturedImage(blob);
          setCapturedUrl(URL.createObjectURL(blob));
          setState('captured');
        } else {
          setError('Errore nella creazione dell\'immagine');
        }
      },
      'image/jpeg',
      0.9
    );
  }, [stream, facingMode, capturedUrl]);

  /**
   * Reset cattura, torna a camera ready
   */
  const resetCapture = useCallback(() => {
    if (capturedUrl) {
      URL.revokeObjectURL(capturedUrl);
    }
    setCapturedImage(null);
    setCapturedUrl(null);
    setState(stream ? 'ready' : 'idle');
  }, [stream, capturedUrl]);

  /**
   * Cambia camera (frontale/posteriore)
   */
  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);

    // Riavvia camera con nuova direzione
    stopMediaStream(stream);
    setStream(null);

    setState('requesting');

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: newFacingMode,
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setState('ready');
    } catch (err: any) {
      setError('Impossibile cambiare camera');
      setState('idle');
    }
  }, [facingMode, stream, width, height]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream(stream);
      if (capturedUrl) {
        URL.revokeObjectURL(capturedUrl);
      }
    };
  }, []);

  return {
    state,
    stream,
    capturedImage,
    capturedUrl,
    error,
    isMobileDevice,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capture,
    resetCapture,
    switchCamera,
  };
}

export default useCamera;
