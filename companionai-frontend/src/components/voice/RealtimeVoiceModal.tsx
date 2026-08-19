import React, { useState, useEffect, useRef } from 'react'
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Volume2,
  Wind,
  Smile,
  Moon,
  MessageSquare,
  Send,
  X,
  ChevronDown,
  Activity,
  Heart
} from 'lucide-react'
import { useRealtimeVoice } from '../../hooks/useRealtimeVoice'

interface RealtimeVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RealtimeVoiceModal({ isOpen, onClose }: RealtimeVoiceModalProps) {
  const {
    connectionState,
    companionState,
    isMuted,
    error,
    selectedVoice,
    availableVoices,
    messages,
    liveUserTranscript,
    liveCompanionTranscript,
    userVolume,
    companionVolume,
    connect,
    disconnect,
    toggleMute,
    sendTextMessage,
    changeVoice,
    triggerBreathingExercise,
    triggerGratitudeCheck
  } = useRealtimeVoice()

  const [textPrompt, setTextPrompt] = useState('')
  const [showHistory, setShowHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && connectionState === 'disconnected') {
      connect()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, liveCompanionTranscript, liveUserTranscript])

  const handleClose = () => {
    disconnect()
    onClose()
  }

  if (!isOpen) return null

  // Calculate dynamic scale for glowing orb based on speaking volume
  const orbScale = companionState === 'speaking'
    ? 1 + (companionVolume / 180)
    : companionState === 'listening'
    ? 1 + (userVolume / 220)
    : 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">Live Voice Sanctuary</h3>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OpenAI Realtime
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Natural two-way speech with compassionate listening</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Persona Selector */}
            <div className="relative">
              <select
                value={selectedVoice}
                onChange={(e) => changeVoice(e.target.value)}
                disabled={connectionState === 'connecting'}
                className="text-xs bg-slate-800/90 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              >
                {availableVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.gender})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Orb & Visualizer Area */}
        <div className="relative flex flex-col items-center justify-center py-10 px-6 overflow-hidden bg-gradient-to-b from-slate-900/60 via-slate-950/80 to-slate-900/90 min-h-[260px]">
          
          {/* Background Ambient Glow */}
          <div
            className={`absolute w-72 h-72 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
              companionState === 'speaking'
                ? 'bg-purple-500 scale-125 opacity-40'
                : companionState === 'listening'
                ? 'bg-emerald-500 scale-110 opacity-35'
                : companionState === 'thinking'
                ? 'bg-indigo-500 scale-100 animate-pulse'
                : 'bg-indigo-600/30'
            }`}
          />

          {/* Dynamic Interactive Glowing Orb */}
          <div
            style={{ transform: `scale(${orbScale})` }}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-100 ease-out shadow-2xl cursor-pointer ${
              companionState === 'speaking'
                ? 'bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 shadow-purple-500/50 animate-pulse'
                : companionState === 'listening'
                ? 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 shadow-emerald-500/40'
                : companionState === 'thinking'
                ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-slate-700 shadow-indigo-500/30 animate-spin-slow'
                : 'bg-gradient-to-tr from-indigo-700 to-slate-800 shadow-indigo-500/20'
            }`}
          >
            {/* Pulsing Concentric Rings */}
            <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20 pointer-events-none" />
            
            {connectionState === 'connecting' ? (
              <div className="flex flex-col items-center">
                <Activity className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : companionState === 'speaking' ? (
              <Volume2 className="w-10 h-10 text-white animate-pulse" />
            ) : companionState === 'listening' ? (
              <Mic className="w-10 h-10 text-white" />
            ) : (
              <Sparkles className="w-10 h-10 text-indigo-200" />
            )}
          </div>

          {/* Status Badge */}
          <div className="mt-6 flex flex-col items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                connectionState === 'connecting'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                  : companionState === 'speaking'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : companionState === 'listening'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : companionState === 'thinking'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {connectionState === 'connecting'
                ? 'Connecting to Realtime Sanctuary...'
                : connectionState === 'error'
                ? 'Connection Error'
                : companionState === 'speaking'
                ? 'Companion is speaking...'
                : companionState === 'listening'
                ? 'Listening to you...'
                : companionState === 'thinking'
                ? 'Companion is listening...'
                : 'Listening for your voice... Speak anytime'}
            </span>

            {error && (
              <p className="mt-2 text-xs text-rose-400 bg-rose-950/40 px-3 py-1 rounded-lg border border-rose-800/40">
                {error}
              </p>
            )}
          </div>

          {/* Quick Guided Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              onClick={triggerBreathingExercise}
              disabled={connectionState !== 'connected'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700 text-slate-300 hover:text-indigo-200 transition-all"
            >
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Breathing Guide
            </button>
            <button
              onClick={triggerGratitudeCheck}
              disabled={connectionState !== 'connected'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-purple-600/30 hover:border-purple-500/50 border border-slate-700 text-slate-300 hover:text-purple-200 transition-all"
            >
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              Gratitude Moment
            </button>
            <button
              onClick={() => sendTextMessage("I had a stressful day today. Can you give me some gentle words to unwind?")}
              disabled={connectionState !== 'connected'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700 text-slate-300 hover:text-indigo-200 transition-all"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              Evening Unwind
            </button>
          </div>
        </div>

        {/* Live Conversation Transcript Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-slate-950/60 min-h-[160px] max-h-[240px] border-t border-slate-800/80">
          {messages.length === 0 && !liveCompanionTranscript && !liveUserTranscript && (
            <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500 text-xs">
              <Sparkles className="w-5 h-5 text-indigo-500/40 mb-1" />
              Say "Hello" or share whatever is on your mind. CompanionAI is listening.
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md'
                }`}
              >
                <p className="font-semibold text-[10px] uppercase tracking-wider mb-1 opacity-70">
                  {m.sender === 'user' ? 'You' : `Companion (${selectedVoice})`}
                </p>
                {m.text}
              </div>
            </div>
          ))}

          {/* Live Streaming Spoken Text */}
          {liveUserTranscript && (
            <div className="flex flex-col items-end animate-pulse">
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-indigo-600/70 text-white text-xs rounded-br-none italic">
                {liveUserTranscript}...
              </div>
            </div>
          )}

          {liveCompanionTranscript && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-indigo-500/40 text-slate-100 text-xs rounded-bl-none shadow-lg shadow-indigo-500/10">
                <p className="font-semibold text-[10px] uppercase tracking-wider mb-1 text-indigo-400">
                  Companion (Speaking)
                </p>
                {liveCompanionTranscript}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Controls & Optional Text Prompt */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
          
          {/* Quick text guidance if user prefers to type while speaking */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (textPrompt.trim()) {
                sendTextMessage(textPrompt.trim())
                setTextPrompt('')
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Or type a thought or topic for Companion..."
              disabled={connectionState !== 'connected'}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!textPrompt.trim() || connectionState !== 'connected'}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Call Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={toggleMute}
              disabled={connectionState !== 'connected'}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              {isMuted ? 'Muted' : 'Mute Mic'}
            </button>

            {connectionState === 'connected' ? (
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 hover:scale-105 transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                End Session
              </button>
            ) : (
              <button
                onClick={() => connect()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Start Voice Chat
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
