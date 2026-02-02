/**
 * useVideoRecorder Hook
 * Hook per registrazione video con MediaRecorder API
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  requestMediaPermissions,
  stopMediaStream,
  getPreferredVideoMimeType,
  getVideoConstraints,
  blobToFile,
  getVideoBlobDuration,
} from '@/utils/mediaUtils';
import { VIDEO_CONSTRAINTS } from '@/utils/fileValidation';

export type RecordingState = 'idle' | 'requesting' | 'ready' | 'recording' | 'paused' | 'stopped';

export interface UseVideoRecorderOptions {
  maxDuration?: number; // secondi
  onMaxDurationReached?: () => void;
}

export interface UseVideoRecorderReturn {
  state: RecordingState;
  stream: MediaStream | null;
  recordedBlob: Blob | null;
  recordedUrl: string | null;
  duration: number;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  resetRecording: () => void;
  getRecordedFile: (filename?: string) => File | null;
}

export function useVideoRecorder(
  options: UseVideoRecorderOptions = {}
): UseVideoRecorderReturn {
  const { maxDuration = VIDEO_CONSTRAINTS.maxDuration, onMaxDurationReached } = options;

  const [state, setState] = useState<RecordingState>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  /**
   * Avvia timer per durata
   */
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDuration(elapsed);

      if (elapsed >= maxDuration) {
        // Ferma registrazione al raggiungimento del limite
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        onMaxDurationReached?.();
      }
    }, 100);
  }, [maxDuration, onMaxDurationReached]);

  /**
   * Ferma timer
   */
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Avvia camera
   */
  const startCamera = useCallback(async () => {
    setState('requesting');
    setError(null);

    try {
      const mediaStream = await requestMediaPermissions(getVideoConstraints());
      setStream(mediaStream);
      setState('ready');
    } catch (err: any) {
      setError(err.message);
      setState('idle');
    }
  }, []);

  /**
   * Ferma camera
   */
  const stopCamera = useCallback(() => {
    stopMediaStream(stream);
    setStream(null);
    setState('idle');
    stopTimer();
  }, [stream, stopTimer]);

  /**
   * Avvia registrazione
   */
  const startRecording = useCallback(() => {
    if (!stream) {
      setError('Camera non avviata');
      return;
    }

    try {
      const mimeType = getPreferredVideoMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stopTimer();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);

        // Crea URL per preview
        if (recordedUrl) {
          URL.revokeObjectURL(recordedUrl);
        }
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);

        // Ottieni durata effettiva
        try {
          const actualDuration = await getVideoBlobDuration(blob);
          setDuration(Math.floor(actualDuration));
        } catch {
          // Usa durata dal timer
        }

        setState('stopped');
      };

      mediaRecorder.onerror = (event: any) => {
        setError('Errore durante la registrazione: ' + event.error?.message);
        stopTimer();
        setState('ready');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Chunk ogni secondo
      startTimer();
      setDuration(0);
      setState('recording');
    } catch (err: any) {
      setError('Impossibile avviare la registrazione: ' + err.message);
    }
  }, [stream, recordedUrl, startTimer, stopTimer]);

  /**
   * Ferma registrazione
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  /**
   * Pausa registrazione
   */
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      stopTimer();
      setState('paused');
    }
  }, [stopTimer]);

  /**
   * Riprendi registrazione
   */
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      startTimer();
      setState('recording');
    }
  }, [startTimer]);

  /**
   * Reset registrazione
   */
  const resetRecording = useCallback(() => {
    stopTimer();

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }

    chunksRef.current = [];
    setRecordedBlob(null);
    setRecordedUrl(null);
    setDuration(0);
    setError(null);
    setState(stream ? 'ready' : 'idle');
  }, [stream, recordedUrl, stopTimer]);

  /**
   * Ottieni file dal blob registrato
   */
  const getRecordedFile = useCallback(
    (filename: string = 'video_presentazione.webm'): File | null => {
      if (!recordedBlob) return null;
      return blobToFile(recordedBlob, filename);
    },
    [recordedBlob]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopMediaStream(stream);
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, []);

  return {
    state,
    stream,
    recordedBlob,
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
  };
}

export default useVideoRecorder;
