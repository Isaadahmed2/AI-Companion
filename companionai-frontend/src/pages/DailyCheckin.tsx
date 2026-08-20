import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, MessageSquare, Mic, Heart, CheckCircle2, ArrowRight, Music, Gamepad2, Smile, Compass } from 'lucide-react'
import { useMood } from '../hooks/useMood'
import { useVoice } from '../hooks/useVoice'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import VoiceInput from '../components/mood/VoiceInput'
import MoodIndicator from '../components/mood/MoodIndicator'
import RealtimeVoiceModal from '../components/voice/RealtimeVoiceModal'
import { MoodCheckinResult } from '../types'

export default function DailyCheckin() {
  const navigate = useNavigate()
  const { submitMoodCheckin, isLoading } = useMood()
  const { isListening, isProcessing, transcript, setTranscript, startListening, stopListening } = useVoice()

  const [moodLevel, setMoodLevel] = useState<number>(6)
  const [message, setMessage] = useState<string>('')
  const [useVoiceMode, setUseVoiceMode] = useState<boolean>(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false)
  const [result, setResult] = useState<MoodCheckinResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = useVoiceMode ? transcript : message
    try {
      const res = await submitMoodCheckin({
        mood_level: moodLevel,
        message: content,
        voice_input: useVoiceMode
      })
      setResult(res)
    } catch (err) {
      console.error('Checkin error:', err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {!result ? (
        <Card glow className="relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Daily Emotional Check-in</h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Take a pause and tune into how you're feeling right now.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Scale Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-200">
                  How would you rate your overall mood today?
                </label>
                <span className="text-lg font-bold text-indigo-400">{moodLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodLevel}
                onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
              />
              <div className="mt-3">
                <MoodIndicator moodLevel={moodLevel} />
              </div>
            </div>

            {/* Input Toggle (Text vs Voice) */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setUseVoiceMode(false)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  !useVoiceMode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Text Reflection
              </button>
              <button
                type="button"
                onClick={() => setUseVoiceMode(true)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  useVoiceMode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" /> Voice Input (OpenAI Realtime)
              </button>
            </div>

            {/* Reflection Input */}
            {!useVoiceMode ? (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  What's on your mind? (Any thoughts, triggers, or highlights)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Had a busy day at work. Feeling a bit tired but proud of what I finished..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <VoiceInput
                  isListening={isListening}
                  isProcessing={isProcessing}
                  onStart={startListening}
                  onStop={async () => {
                    const text = await stopListening()
                    if (text) {
                      setMessage(text)
                    }
                  }}
                />
                
                {/* Live Speech-to-Speech Promo Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Prefer natural speech-to-speech dialogue?
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Talk live with OpenAI Realtime with zero typing.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md transition-all whitespace-nowrap"
                  >
                    Open Live Sanctuary
                  </button>
                </div>

                {transcript && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-indigo-400">Transcribed: </span>
                    {transcript}
                  </div>
                )}
              </div>
            )}

            <Button type="submit" disabled={isLoading} size="lg" className="w-full py-3.5 text-base">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing with CompanionAI...
                </span>
              ) : (
                'Submit & Get AI Guidance'
              )}
            </Button>
          </form>
        </Card>
      ) : (
        /* Result Screen */
        <div className="space-y-6 animate-fadeIn">
          {/* Empathetic Response Card */}
          <Card glow className="border-indigo-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">CompanionAI Response</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-medium">
                    Detected: {result.detected_emotion.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">Intensity: {result.intensity}/5</span>
                </div>
              </div>
            </div>

            <p className="text-slate-200 text-base leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              "{result.ai_response}"
            </p>

            {/* Suggested Micro-Goals */}
            {result.goal_suggestions?.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Suggested Micro-Goals For You:
                </h3>
                <div className="space-y-2">
                  {result.goal_suggestions.map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Personalized Recommendations */}
          {result.recommendations?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  Tailored Recommendations
                </h3>
                <span className="text-xs text-slate-400">Curated for your state of mind</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.recommendations.map((rec, i) => (
                  <Card key={i} className="hover:border-indigo-500/50 transition-all">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                        {rec.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {Math.round((rec.relevance_score || 0.9) * 100)}% Match
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2 mb-1">{rec.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{rec.description}</p>
                    <a
                      href={rec.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Open Activity <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="secondary" onClick={() => setResult(null)}>
              Log Another Mood
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              View Mood Trends
            </Button>
          </div>
        </div>
      )}

      {/* Floating Voice Sanctuary Modal */}
      <RealtimeVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  )
}
