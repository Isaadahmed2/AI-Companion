import React from 'react'

interface MoodIndicatorProps {
  moodLevel: number;
}

export default function MoodIndicator({ moodLevel }: MoodIndicatorProps) {
  const getMoodConfig = (level: number) => {
    if (level <= 2) return { emoji: '😢', text: 'Struggling', color: 'from-rose-500 to-red-600', bg: 'bg-rose-500/10' }
    if (level <= 4) return { emoji: '😔', text: 'Low / Anxious', color: 'from-orange-500 to-amber-600', bg: 'bg-amber-500/10' }
    if (level <= 6) return { emoji: '😐', text: 'Neutral / Okay', color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-500/10' }
    if (level <= 8) return { emoji: '😊', text: 'Good / Peaceful', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10' }
    return { emoji: '🌟', text: 'Joyful & Energized', color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-500/10' }
  }

  const config = getMoodConfig(moodLevel)

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border border-slate-800 ${config.bg}`}>
      <span className="text-3xl">{config.emoji}</span>
      <div>
        <div className="text-sm font-semibold text-slate-100">{config.text}</div>
        <div className="text-xs text-slate-400">Mood score: {moodLevel} / 10</div>
      </div>
    </div>
  )
}
