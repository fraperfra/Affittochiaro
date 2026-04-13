import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`animate-spin text-primary-500 ${sizeClasses[size]} ${className}`} />
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <img
        src="/m_walk_hq.gif"
        alt="Caricamento..."
        className="w-[min(220px,55vw)] h-auto"
        draggable={false}
      />
    </div>
  );
}
