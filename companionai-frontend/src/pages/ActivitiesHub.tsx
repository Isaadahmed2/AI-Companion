import React, { useState, useEffect } from 'react'
import { Headphones, Gamepad2, Play, CheckCircle2, ArrowRight } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { getActivities, startActivity, completeActivity } from '../services/activities'
import { Activity } from '../types'

export default function ActivitiesHub() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    getActivities().then(setActivities).catch(() => {})
  }, [])

  const filtered = activeTab === 'all'
    ? activities
    : activities.filter(a => a.category === activeTab)

  const handleStart = async (id: string) => {
    await startActivity(id)
  }

  const handleComplete = async (id: string) => {
    await completeActivity(id)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Activities & Mindful Playground</h1>
        <p className="text-sm text-slate-400 mt-1">
          Engage in soothing audio sessions, focus puzzles, and mood-boosting mini-challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(act => (
          <Card key={act.id} className="flex flex-col justify-between hover:border-indigo-500/40 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                {act.category === 'music' ? <Headphones className="w-5 h-5" /> : <Gamepad2 className="w-5 h-5" />}
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{act.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{act.description}</p>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <Button size="sm" onClick={() => handleStart(act.id)} className="flex-1 gap-1">
                <Play className="w-3.5 h-3.5" /> Start
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleComplete(act.id)}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
