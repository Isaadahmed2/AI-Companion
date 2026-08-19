import React from 'react'
import { Mic, MicOff, Radio } from 'lucide-react'

interface VoiceInputProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function VoiceInput({ isListening, onStart, onStop }: VoiceInputProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-500/30 rounded-2xl bg-indigo-950/20 text-center">
      <button
        type="button"
        onClick={isListening ? onStop : onStart}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50 scale-110'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105'
        }`}
      >
        {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
      </button>

      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-200">
          {isListening ? 'Listening with OpenAI Realtime...' : 'Tap to speak your thoughts'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {isListening ? 'Speak freely. Click stop when finished.' : 'Share how you feel via voice'}
        </p>
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
