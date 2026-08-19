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
  Send,
  Heart,
  ChevronDown,
  Activity,
  ShieldCheck,
  RefreshCw,
  Sliders
} from 'lucide-react'
import { useRealtimeVoice } from '../hooks/useRealtimeVoice'

export default function VoiceSanctuary() {
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
    triggerGratitudeCheck,
    clearMessages
  } = useRealtimeVoice()

  const [textPrompt, setTextPrompt] = useState('')
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale')
  const [breathSeconds, setBreathSeconds] = useState(4)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, liveCompanionTranscript, liveUserTranscript])

  // Simple visual breathing cycle helper
  useEffect(() => {
    if (!breathingActive) return

    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'Inhale') return 'Hold'
            if (currentPhase === 'Hold') return 'Exhale'
            return 'Inhale'
          })
          return 4
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [breathingActive])

  // Scale of glowing orb
  const orbScale = companionState === 'speaking'
    ? 1 + (companionVolume / 150)
    : companionState === 'listening'
    ? 1 + (userVolume / 200)
    : 1

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Animated Ambient Lights */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Header & Voice Persona Selection */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              OpenAI Realtime Speech-to-Speech
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">Ultra-low latency audio stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Voice Wellness Sanctuary
          </h1>
        </div>

        {/* Voice Persona Selector */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 shadow-lg backdrop-blur-md">
          <span className="text-xs font-medium text-slate-400 pl-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Voice:
          </span>
          <div className="relative">
            <select
              value={selectedVoice}
              onChange={(e) => changeVoice(e.target.value)}
              className="text-xs bg-slate-800 text-slate-100 font-semibold rounded-xl px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {availableVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} • {v.gender} ({v.id === 'shimmer' ? 'Gentle' : v.id === 'sage' ? 'Mindful' : 'Empathetic'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Center Interactive Presence / Glowing Orb */}
      <div className="w-full max-w-2xl flex flex-col items-center justify-center my-6 z-10">
        
        {/* Dynamic Orb */}
        <div className="relative flex items-center justify-center">
          
          {/* Outer Glow Halo */}
          <div
            className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none absolute ${
              companionState === 'speaking'
                ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 scale-125 opacity-50'
                : companionState === 'listening'
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 scale-110 opacity-45'
                : companionState === 'thinking'
                ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 scale-100 animate-pulse'
                : 'bg-indigo-700/30'
            }`}
          />

          {/* Glowing Orb Button */}
          <button
            onClick={() => {
              if (connectionState === 'disconnected' || connectionState === 'error') {
                connect()
              } else {
                toggleMute()
              }
            }}
            style={{ transform: `scale(${orbScale})` }}
            className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-transform duration-100 ease-out shadow-2xl ${
              connectionState === 'connecting'
                ? 'bg-gradient-to-tr from-indigo-700 via-purple-700 to-slate-800 shadow-indigo-500/40 animate-pulse'
                : companionState === 'speaking'
                ? 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-rose-500 shadow-purple-500/60'
                : companionState === 'listening'
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 shadow-emerald-500/50'
                : companionState === 'thinking'
                ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-slate-700 shadow-indigo-500/30'
                : 'bg-gradient-to-tr from-indigo-600 to-slate-900 shadow-indigo-600/30 hover:scale-105'
            }`}
          >
            {connectionState === 'connecting' ? (
              <Activity className="w-12 h-12 text-white animate-spin" />
            ) : companionState === 'speaking' ? (
              <Volume2 className="w-14 h-14 text-white animate-bounce" />
            ) : companionState === 'listening' ? (
              <Mic className="w-14 h-14 text-white" />
            ) : (
              <Sparkles className="w-14 h-14 text-indigo-200" />
            )}

            <span className="text-[11px] font-bold tracking-wider uppercase text-white/90 mt-2">
              {connectionState === 'disconnected'
                ? 'Tap to Connect'
                : connectionState === 'connecting'
                ? 'Connecting...'
                : companionState === 'speaking'
                ? 'Speaking'
                : companionState === 'listening'
                ? 'Listening'
                : 'Tap to Mute'}
            </span>
          </button>
        </div>

        {/* Status Indicator Pill */}
        <div className="mt-8 flex flex-col items-center">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
              connectionState === 'connecting'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                : companionState === 'speaking'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/10'
                : companionState === 'listening'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                : companionState === 'thinking'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : connectionState === 'connected'
                ? 'bg-slate-900 text-slate-300 border-slate-700'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionState === 'connected'
                  ? companionState === 'speaking'
                    ? 'bg-purple-400 animate-ping'
                    : companionState === 'listening'
                    ? 'bg-emerald-400 animate-ping'
                    : 'bg-emerald-400'
                  : 'bg-slate-500'
              }`}
            />
            {connectionState === 'connecting'
              ? 'Establishing secure OpenAI Realtime WebRTC channel...'
              : connectionState === 'connected'
              ? companionState === 'speaking'
                ? `Companion (${selectedVoice}) is speaking with you...`
                : companionState === 'listening'
                ? 'Listening to you... Speak freely anytime'
                : companionState === 'thinking'
                ? 'Reflecting and understanding...'
                : 'Ready & listening. Say anything on your heart.'
              : 'Click Start Voice Sanctuary below to begin.'}
          </div>

          {error && (
            <p className="mt-3 text-xs text-rose-300 bg-rose-950/60 px-4 py-2 rounded-xl border border-rose-800/60 max-w-md text-center">
              {error}
            </p>
          )}
        </div>

        {/* Guided Wellness Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
          <button
            onClick={() => {
              setBreathingActive(!breathingActive)
              if (!breathingActive) triggerBreathingExercise()
            }}
            disabled={connectionState !== 'connected'}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              breathingActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 hover:bg-indigo-600/20 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Wind className="w-4 h-4 text-cyan-400" />
            {breathingActive ? `Breathing (${breathPhase} ${breathSeconds}s)` : 'Guided 4-4-4 Breathing'}
          </button>

          <button
            onClick={triggerGratitudeCheck}
            disabled={connectionState !== 'connected'}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-slate-900/80 hover:bg-purple-600/20 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <Smile className="w-4 h-4 text-amber-400" />
            Gratitude Reflection
          </button>

          <button
            onClick={() => sendTextMessage("I feel very overwhelmed today. Could you validate my feelings and help me slow down?")}
            disabled={connectionState !== 'connected'}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            Anxiety & Comfort
          </button>

          <button
            onClick={() => sendTextMessage("Help me unwind and relax for bedtime with a calming visualization.")}
            disabled={connectionState !== 'connected'}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            Night Calm
          </button>
        </div>
      </div>

      {/* Live Conversation Transcript Stream */}
      <div className="w-full max-w-3xl bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 shadow-xl backdrop-blur-xl z-10 flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Live Conversation Transcript
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="h-44 overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 && !liveCompanionTranscript && !liveUserTranscript && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs py-4">
              <ShieldCheck className="w-6 h-6 text-indigo-500/40 mb-1" />
              Your voice conversation is private & streamed securely in real time.
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
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-800 text-slate-200 border border-slate-700/70 rounded-bl-none shadow-md'
                }`}
              >
                <span className="font-semibold text-[10px] uppercase tracking-wider block mb-1 opacity-70">
                  {m.sender === 'user' ? 'You' : `Companion (${selectedVoice})`}
                </span>
                {m.text}
              </div>
            </div>
          ))}

          {liveUserTranscript && (
            <div className="flex flex-col items-end animate-pulse">
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-indigo-600/70 text-white text-xs rounded-br-none italic">
                {liveUserTranscript}...
              </div>
            </div>
          )}

          {liveCompanionTranscript && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="max-w-[85%] px-4 py-2.5 rounded-2xl bg-slate-800/95 border border-purple-500/40 text-slate-100 text-xs rounded-bl-none shadow-lg">
                <span className="font-semibold text-[10px] uppercase tracking-wider block mb-1 text-purple-400">
                  Companion (Speaking)
                </span>
                {liveCompanionTranscript}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Bar: Text Input + Main Action Controls */}
        <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
          
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (textPrompt.trim()) {
                sendTextMessage(textPrompt.trim())
                setTextPrompt('')
              }
            }}
            className="flex-1 flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Or type a question or thought for voice response..."
              disabled={connectionState !== 'connected'}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!textPrompt.trim() || connectionState !== 'connected'}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={toggleMute}
              disabled={connectionState !== 'connected'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              {isMuted ? 'Muted' : 'Mute'}
            </button>

            {connectionState === 'connected' ? (
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 hover:scale-105 transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                End Session
              </button>
            ) : (
              <button
                onClick={() => connect()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Start Voice Sanctuary
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}
