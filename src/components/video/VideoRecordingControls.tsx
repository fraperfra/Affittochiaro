/**
 * VideoRecordingControls Component
 * Controlli per registrazione video (rec, stop, timer)
 */

import React from 'react';
import { Circle, Square, Pause, Play, RotateCcw } from 'lucide-react';
import { RecordingState } from '@/hooks/useVideoRecorder';
import { formatTime } from '@/utils/mediaUtils';
import { VIDEO_CONSTRAINTS } from '@/utils/fileValidation';

interface VideoRecordingControlsProps {
  state: RecordingState;
  duration: number;
  maxDuration?: number;
  onStart: () => void;
  onStop: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
}

export function VideoRecordingControls({
  state,
  duration,
  maxDuration = VIDEO_CONSTRAINTS.maxDuration,
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
}: VideoRecordingControlsProps) {
  const isRecording = state === 'recording';
  const isPaused = state === 'paused';
  const isReady = state === 'ready';
  const progress = Math.min((duration / maxDuration) * 100, 100);
  const timeRemaining = maxDuration - duration;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer e progress */}
      {(isRecording || isPaused) && (
        <div className="flex flex-col items-center gap-2">
          {/* Progress bar circolare */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke={timeRemaining <= 10 ? '#ef4444' : '#00D094'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                className="transition-all duration-100"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-gray-900'}`}>
                {formatTime(duration)}
              </span>
              {isRecording && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  REC
                </span>
              )}
            </div>
          </div>

          {/* Tempo rimanente */}
          <p className="text-sm text-gray-500">
            {timeRemaining > 0 ? (
              <>Tempo rimanente: <span className={timeRemaining <= 10 ? 'text-red-500 font-medium' : ''}>{formatTime(timeRemaining)}</span></>
            ) : (
              <span className="text-red-500 font-medium">Tempo esaurito</span>
            )}
          </p>
        </div>
      )}

      {/* Controlli */}
      <div className="flex items-center gap-4">
        {/* Bottone principale */}
        {isReady && (
          <button
            onClick={onStart}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            title="Avvia registrazione"
          >
            <Circle className="w-6 h-6 fill-current" />
          </button>
        )}

        {isRecording && (
          <>
            {/* Pausa */}
            {onPause && (
              <button
                onClick={onPause}
                className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition-colors"
                title="Pausa"
              >
                <Pause className="w-5 h-5" />
              </button>
            )}

            {/* Stop */}
            <button
              onClick={onStop}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 shadow-lg animate-pulse"
              title="Ferma registrazione"
            >
              <Square className="w-6 h-6 fill-current" />
            </button>
          </>
        )}

        {isPaused && (
          <>
            {/* Riprendi */}
            {onResume && (
              <button
                onClick={onResume}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors shadow-lg"
                title="Riprendi"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
            )}

            {/* Stop */}
            <button
              onClick={onStop}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              title="Ferma registrazione"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          </>
        )}
      </div>

      {/* Reset */}
      {(isPaused || state === 'stopped') && onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Ricomincia
        </button>
      )}

      {/* Istruzioni */}
      {isReady && (
        <p className="text-sm text-gray-500 text-center max-w-xs">
          Premi il pulsante rosso per iniziare a registrare.
          <br />
          Hai a disposizione {formatTime(maxDuration)}.
        </p>
      )}
    </div>
  );
}

export default VideoRecordingControls;
