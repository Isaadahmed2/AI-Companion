import React from 'react'
import { Mic, Square, Sparkles, Loader2 } from 'lucide-react'

interface VoiceInputProps {
  isListening: boolean;
  isProcessing?: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function VoiceInput({ isListening, isProcessing = false, onStart, onStop }: VoiceInputProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-500/30 rounded-2xl bg-indigo-950/20 text-center transition-all">
      <button
        type="button"
        disabled={isProcessing}
        onClick={isListening ? onStop : onStart}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isProcessing
            ? 'bg-indigo-700/50 text-indigo-300 cursor-wait'
            : isListening
            ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/50 scale-110'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105'
        }`}
        title={isListening ? 'Click to finish and transcribe with Whisper' : 'Click to start recording voice'}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isListening ? (
          <Square className="w-6 h-6 fill-current" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-200">
          {isProcessing
            ? 'Transcribing audio with Whisper Speech-to-Text...'
            : isListening
            ? 'Recording... Tap square when finished'
            : 'Tap to speak your thoughts'}
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Whisper Speech-to-Text Model</span>
        </div>
      </div>

      {isListening && (
        <div className="flex items-center gap-1.5 mt-4">
          <span className="w-2 h-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-7 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-5 bg-indigo-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-8 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
          <span className="w-2 h-3 bg-indigo-400 rounded-full animate-bounce"></span>
        </div>
      )}
    </div>
  )
}
