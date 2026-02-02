/**
 * Media Utilities
 * Utilities per MediaRecorder e Camera API
 */

/**
 * Verifica se MediaRecorder è supportato
 */
export function isMediaRecorderSupported(): boolean {
  return typeof MediaRecorder !== 'undefined';
}

/**
 * Verifica se getUserMedia è supportato
 */
export function isUserMediaSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Verifica se siamo su mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Ottiene il codec preferito per la registrazione video
 */
export function getPreferredVideoMimeType(): string {
  const mimeTypes = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];

  for (const mimeType of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return 'video/webm';
}

/**
 * Configurazione video per la registrazione
 */
export interface VideoConstraints {
  video: {
    width: { ideal: number; max: number };
    height: { ideal: number; max: number };
    frameRate: { ideal: number };
    facingMode: 'user' | 'environment';
  };
  audio: boolean;
}

/**
 * Ottiene i vincoli video ottimali
 */
export function getVideoConstraints(facingMode: 'user' | 'environment' = 'user'): VideoConstraints {
  return {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30 },
      facingMode,
    },
    audio: true,
  };
}

/**
 * Richiede accesso a camera e microfono
 */
export async function requestMediaPermissions(
  constraints: MediaStreamConstraints = getVideoConstraints()
): Promise<MediaStream> {
  if (!isUserMediaSupported()) {
    throw new Error('Il tuo browser non supporta l\'accesso alla camera');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error: any) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      throw new Error('Permesso camera/microfono negato. Abilita l\'accesso nelle impostazioni del browser.');
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      throw new Error('Camera o microfono non trovato.');
    }
    if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      throw new Error('La camera è già in uso da un\'altra applicazione.');
    }
    throw new Error('Errore nell\'accesso alla camera: ' + error.message);
  }
}

/**
 * Ferma tutti i track di uno stream
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

/**
 * Converte un Blob in File
 */
export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  });
}

/**
 * Ottiene la durata di un blob video
 */
export function getVideoBlobDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration === Infinity) {
        // Workaround per alcuni browser
        video.currentTime = Number.MAX_SAFE_INTEGER;
        video.ontimeupdate = () => {
          video.ontimeupdate = null;
          resolve(video.duration);
          video.currentTime = 0;
        };
      } else {
        resolve(video.duration);
      }
    };

    video.onerror = () => {
      reject(new Error('Impossibile leggere i metadati del video'));
    };

    video.src = URL.createObjectURL(blob);
  });
}

/**
 * Crea un thumbnail da un video
 */
export function createVideoThumbnail(
  videoUrl: string,
  seekTime: number = 0.5
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      } else {
        reject(new Error('Canvas context non disponibile'));
      }
    };

    video.onerror = () => {
      reject(new Error('Errore nel caricamento del video'));
    };

    video.src = videoUrl;
    video.load();
  });
}

/**
 * Formatta il tempo in MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Verifica le capacità del dispositivo
 */
export interface DeviceCapabilities {
  hasCamera: boolean;
  hasMicrophone: boolean;
  supportsRecording: boolean;
  isMobile: boolean;
}

export async function checkDeviceCapabilities(): Promise<DeviceCapabilities> {
  const capabilities: DeviceCapabilities = {
    hasCamera: false,
    hasMicrophone: false,
    supportsRecording: isMediaRecorderSupported(),
    isMobile: isMobile(),
  };

  if (!isUserMediaSupported()) {
    return capabilities;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    capabilities.hasCamera = devices.some((d) => d.kind === 'videoinput');
    capabilities.hasMicrophone = devices.some((d) => d.kind === 'audioinput');
  } catch (error) {
    console.error('Error checking device capabilities:', error);
  }

  return capabilities;
}
