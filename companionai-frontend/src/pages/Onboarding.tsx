import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const INTEREST_OPTIONS = [
  'Mindfulness & Breathing',
  'Lo-Fi & Ambient Music',
  'Cognitive Puzzles',
  'Stress Relief & Meditation',
  'Daily Affirmations',
  'Gentle Habit Building',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { signup, login, isLoading } = useAuth()
  const [isSignupMode, setIsSignupMode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Mindfulness & Breathing',
    'Lo-Fi & Ambient Music',
  ])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignupMode) {
        await signup(email, password, displayName, selectedInterests)
      } else {
        await login(email, password)
      }
      navigate('/checkin')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card glow>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {isSignupMode ? 'Welcome to CompanionAI' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isSignupMode
              ? 'Your private, empathetic wellness space'
              : 'Log in to continue your daily journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignupMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {isSignupMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                What brings you peace? (Interests)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {INTEREST_OPTIONS.map((item, idx) => {
                  const isSelected = selectedInterests.includes(item)
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleInterest(item)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {item}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading} size="lg" className="w-full mt-2">
            {isLoading ? 'Processing...' : isSignupMode ? 'Start My Wellness Journey' : 'Log In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isSignupMode ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignupMode(!isSignupMode)}
            className="text-indigo-400 font-semibold hover:underline"
          >
            {isSignupMode ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </Card>
    </div>
  )
}
