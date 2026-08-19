import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Heart, Brain, Headphones, Smile, ShieldCheck, ArrowRight, Mic, Volume2, Activity } from 'lucide-react'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import RealtimeVoiceModal from '../components/voice/RealtimeVoiceModal'

export default function Home() {
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)

  return (
    <div className="relative overflow-hidden pt-6 pb-16">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10 pt-10 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-semibold text-indigo-300 mb-6 border border-indigo-500/30">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Your 24/7 Empathetic Speech & Emotional Companion</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-6">
          Feel heard, supported, and <br />
          <span className="gradient-text">never alone again.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
          Talk naturally with an ultra-responsive AI voice companion powered by <strong>OpenAI Realtime Speech-to-Speech</strong>, or log daily reflections with DeepSeek emotional intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/voice">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/30 shadow-xl flex items-center gap-2">
              <Mic className="w-5 h-5 text-white animate-pulse" />
              Open Voice Sanctuary
            </Button>
          </Link>
          <Link to="/checkin">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 py-4">
              Daily Mood Check-in <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Voice Companion Feature Highlight */}
      <div className="max-w-5xl mx-auto px-4 mb-14">
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-900 border border-purple-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20 text-purple-300 flex-shrink-0">
              <Volume2 className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Live Voice Speech-to-Speech</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-500/40">
                  REALTIME
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Experience natural verbal dialogue with soothing voices (Shimmer, Sage, Alloy). Talk through anxiety, stress, or get guided breathing support instantly.
              </p>
            </div>
          </div>
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Mic className="w-4 h-4" />
            Quick Talk
          </button>
        </div>
      </div>

      {/* 5-Step Core Pipeline Feature Cards */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">How CompanionAI Cares for You</h2>
          <p className="text-slate-400 text-sm mt-2">A comprehensive emotional support system designed around your mental wellness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glow className="relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">1. Realtime Voice Therapy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Express your feelings through low-latency speech-to-speech audio with OpenAI Realtime, featuring live transcription and empathetic active listening.
            </p>
          </Card>

          <Card glow className="relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">2. DeepSeek Empathy Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time emotion categorization and multi-turn conversational empathy that validates your struggles without judgment.
            </p>
          </Card>

          <Card glow className="relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">3. Emotion-Tailored Care</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receive personalized Lo-Fi playlists, calming breathing exercises, mood-lifting activities, and daily achievable wellness goals.
            </p>
          </Card>
        </div>
      </div>

      {/* Floating Modal for Voice */}
      <RealtimeVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  )
}
