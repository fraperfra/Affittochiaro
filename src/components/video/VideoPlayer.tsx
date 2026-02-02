/**
 * VideoPlayer Component
 * Player per visualizzare il video di presentazione caricato
 */

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Trash2, Video, RefreshCw } from 'lucide-react';
import { formatTime } from '@/utils/mediaUtils';

interface VideoPlayerProps {
  src: string;
  duration?: number;
  onDelete?: () => void;
  onRerecord?: () => void;
  isDeleting?: boolean;
  showControls?: boolean;
}

export function VideoPlayer({
  src,
  duration,
  onDelete,
  onRerecord,
  isDeleting = false,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [showOverlay, setShowOverlay] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      setShowOverlay(false);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setVideoDuration(videoRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowOverlay(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const progress = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  return (
    <div className="relative group rounded-xl overflow-hidden bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* Overlay play iniziale */}
      {showOverlay && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors">
            <Play className="w-8 h-8 text-gray-900 ml-1" />
          </div>
        </div>
      )}

      {/* Controlli video - appaiono su hover */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress bar */}
          <div className="relative mb-3">
            <input
              type="range"
              min={0}
              max={videoDuration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00D094 ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
              }}
            />
          </div>

          {/* Controlli */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-action-green transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="text-white hover:text-action-green transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Tempo */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-action-green transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge durata */}
      {!showOverlay && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
          {formatTime(videoDuration)}
        </div>
      )}

      {/* Overlay loading durante eliminazione */}
      {isDeleting && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Eliminazione in corso...</p>
          </div>
        </div>
      )}

      {/* Azioni (fuori dal video) */}
      {(onDelete || onRerecord) && (
        <div className="flex items-center justify-end gap-2 mt-3">
          {onRerecord && (
            <button
              onClick={onRerecord}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Registra di nuovo
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Elimina
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Placeholder quando non c'è video
 */
export function VideoPlaceholder({
  onRecord,
  onUpload,
}: {
  onRecord?: () => void;
  onUpload?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Video className="w-8 h-8 text-gray-400" />
      </div>
      <h4 className="font-medium text-gray-900 mb-1">
        Nessun video di presentazione
      </h4>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-4">
        Un video aumenta la tua visibilità e le possibilità di essere contattato
      </p>
      <div className="flex gap-3">
        {onRecord && (
          <button
            onClick={onRecord}
            className="px-4 py-2 bg-action-green text-white rounded-lg hover:bg-brand-green transition-colors text-sm font-medium"
          >
            Registra Video
          </button>
        )}
        {onUpload && (
          <button
            onClick={onUpload}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Carica Video
          </button>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
