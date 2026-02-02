/**
 * File Validation Utilities
 * Costanti e funzioni per validazione upload file
 */

// Costanti per documenti
export const DOCUMENT_CONSTRAINTS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
} as const;

// Costanti per video
export const VIDEO_CONSTRAINTS = {
  maxSize: 50 * 1024 * 1024, // 50MB
  maxDuration: 60, // 1 minuto
  allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  allowedExtensions: ['.mp4', '.webm', '.mov'],
} as const;

// Costanti per avatar/foto profilo
export const AVATAR_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png'],
  allowedExtensions: ['.jpg', '.jpeg', '.png'],
} as const;

// Tipi
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileConstraints {
  maxSize: number;
  allowedMimeTypes: readonly string[];
  allowedExtensions: readonly string[];
  maxDuration?: number;
}

/**
 * Valida un file contro i vincoli specificati
 */
export function validateFile(
  file: File,
  constraints: FileConstraints
): FileValidationResult {
  // Verifica dimensione
  if (file.size > constraints.maxSize) {
    const maxSizeMB = (constraints.maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `Il file supera la dimensione massima di ${maxSizeMB} MB`,
    };
  }

  // Verifica tipo MIME
  if (!constraints.allowedMimeTypes.includes(file.type)) {
    const allowed = constraints.allowedExtensions.join(', ').toUpperCase();
    return {
      valid: false,
      error: `Formato non supportato. Usa: ${allowed}`,
    };
  }

  // Verifica estensione
  const extension = getFileExtension(file.name).toLowerCase();
  if (!constraints.allowedExtensions.includes(extension)) {
    const allowed = constraints.allowedExtensions.join(', ').toUpperCase();
    return {
      valid: false,
      error: `Estensione non valida. Usa: ${allowed}`,
    };
  }

  return { valid: true };
}

/**
 * Valida un documento
 */
export function validateDocument(file: File): FileValidationResult {
  return validateFile(file, DOCUMENT_CONSTRAINTS);
}

/**
 * Valida un video
 */
export function validateVideo(file: File): FileValidationResult {
  return validateFile(file, VIDEO_CONSTRAINTS);
}

/**
 * Valida un'immagine avatar
 */
export function validateAvatar(file: File): FileValidationResult {
  return validateFile(file, AVATAR_CONSTRAINTS);
}

/**
 * Verifica la durata di un video
 */
export function validateVideoDuration(
  duration: number,
  maxDuration: number = VIDEO_CONSTRAINTS.maxDuration
): FileValidationResult {
  if (duration > maxDuration) {
    return {
      valid: false,
      error: `Il video supera la durata massima di ${maxDuration} secondi`,
    };
  }
  return { valid: true };
}

/**
 * Ottiene la durata di un file video
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error('Impossibile leggere i metadati del video'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Estrae l'estensione dal nome file
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot);
}

/**
 * Formatta la dimensione del file in modo leggibile
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Formatta la durata in MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Genera un ID univoco per il file
 */
export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verifica se il browser supporta MediaRecorder (per registrazione video)
 */
export function isMediaRecorderSupported(): boolean {
  return typeof MediaRecorder !== 'undefined';
}

/**
 * Verifica se il browser supporta getUserMedia (per accesso camera)
 */
export function isCameraSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Determina se siamo su un dispositivo mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
