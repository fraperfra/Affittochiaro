import { useState, useRef, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';

interface AvatarUploadProps {
  src?: string;
  initials: string;
  onUpload: (blobUrl: string) => void;
  className?: string;
  /** Extra classes for the avatar circle itself */
  avatarClassName?: string;
}

/**
 * Clickable avatar circle that opens an inline popover with
 * "Carica foto" and "Scatta foto" options.
 * Returns a blob URL via onUpload — persisting to a real server is the caller's responsibility.
 */
export function AvatarUpload({ src, initials, onUpload, className = '', avatarClassName = '' }: AvatarUploadProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Avatar circle — clickable */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="relative group block focus:outline-none"
      >
        {src ? (
          <img
            src={src}
            alt="avatar"
            className={`rounded-full object-cover border-2 border-teal-50 ${avatarClassName}`}
          />
        ) : (
          <div className={`rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold border-2 border-teal-100 ${avatarClassName}`}>
            {initials}
          </div>
        )}
        {/* Camera overlay on hover */}
        <span className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={20} className="text-white" />
        </span>
        {/* Small camera badge always visible */}
        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center">
          <Camera size={11} className="text-white" />
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-medium border border-border w-44 overflow-hidden">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-background-secondary transition-colors"
          >
            <Camera size={16} className="text-teal-600 shrink-0" />
            Scatta foto
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-background-secondary transition-colors border-t border-border"
          >
            <Upload size={16} className="text-primary-600 shrink-0" />
            Carica foto
          </button>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
