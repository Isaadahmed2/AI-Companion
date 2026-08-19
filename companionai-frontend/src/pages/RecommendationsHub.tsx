import React, { useState, useEffect } from 'react'
import { Headphones, Gamepad2, Smile, Sparkles, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { getRecommendations } from '../services/recommendations'
import { RecommendationItem } from '../types'

const CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'music', label: 'Music & Lo-Fi', icon: Headphones },
  { id: 'game', label: 'Games & Puzzles', icon: Gamepad2 },
  { id: 'comedy', label: 'Comedy & Reels', icon: Smile },
  { id: 'motivation', label: 'Motivation & Stories', icon: Sparkles },
  { id: 'social', label: 'Social & Clubs', icon: Users },
]

export default function RecommendationsHub() {
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [items, setItems] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getRecommendations('joy')
      .then(res => {
        setItems(res)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredItems = selectedCat === 'all'
    ? items
    : items.filter(i => i.category === selectedCat)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Wellness Recommendations Hub</h1>
        <p className="text-sm text-slate-400 mt-1">
          Hand-picked relaxation tracks, mindful puzzles, lighthearted entertainment, and social clubs.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          const isSelected = selectedCat === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'glass-panel text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading recommendations...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <Card key={item.activity_id || idx} glow className="flex flex-col justify-between hover:scale-[1.02] transition-transform">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {Math.round((item.relevance_score || 0.9) * 100)}% Match
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 italic">
                  {item.reason || 'Emotion-tailored recommendation'}
                </span>
                <a
                  href={item.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
