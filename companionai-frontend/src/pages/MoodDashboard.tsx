import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, TrendingUp, Sparkles, Calendar, Heart, Zap, CheckCircle2 } from 'lucide-react'
import { useMood } from '../hooks/useMood'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import MoodChart from '../components/analytics/MoodChart'
import { getMoodTrends, getMoodInsights } from '../services/moods'
import { getGoals, completeGoal } from '../services/activities'

export default function MoodDashboard() {
  const { history, fetchMoodHistory } = useMood()
  const [trends, setTrends] = useState<any[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])

  useEffect(() => {
    fetchMoodHistory()
    getMoodTrends().then(setTrends).catch(() => {})
    getMoodInsights().then(setInsights).catch(() => {})
    getGoals().then(setGoals).catch(() => {})
  }, [fetchMoodHistory])

  const handleToggleGoal = async (id: string) => {
    try {
      await completeGoal(id)
      setGoals(goals.map(g => g.id === id ? { ...g, completed: true } : g))
    } catch (e) {}
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Emotional Trends & Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Track patterns, celebrate streak milestones, and nurture well-being.</p>
        </div>
        <Link to="/checkin">
          <Button size="md" className="gap-2">
            <Sparkles className="w-4 h-4" /> New Check-in
          </Button>
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">7 Days</div>
            <div className="text-xs text-slate-400">Current Streak</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">7.2 / 10</div>
            <div className="text-xs text-slate-400">Avg Weekly Mood</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Joy & Calm</div>
            <div className="text-xs text-slate-400">Top State</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">+18%</div>
            <div className="text-xs text-slate-400">Mood Uplift</div>
          </div>
        </Card>
      </div>

      {/* Charts & AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2">
          <Card glow className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">7-Day Mood Trajectory</h3>
                <p className="text-xs text-slate-400">Visualizing your emotional rhythm over the week</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300">
                Weekly
              </span>
            </div>
            <MoodChart data={trends.length > 0 ? trends : undefined} />
          </Card>
        </div>

        {/* AI Companion Insights & Daily Goals */}
        <div className="space-y-6">
          <Card className="border-indigo-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Companion Insight</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {insights?.summary || "Your mood shows an upward trend after relaxing acoustic sessions and morning reflections."}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Positive driver: </span>
              {insights?.top_positive_driver || "Outdoor walks & music"}
            </div>
          </Card>

          {/* Daily Wellness Goals */}
          <Card>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>Today's Micro Goals</span>
              <span className="text-xs text-slate-400 font-normal">
                {goals.filter(g => g.completed).length}/{goals.length} Done
              </span>
            </h3>
            <div className="space-y-2">
              {goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleToggleGoal(g.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    g.completed
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400 line-through'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500/40'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      g.completed ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'
                    }`}
                  />
                  <span>{g.goal_text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent History Table */}
      <Card>
        <h3 className="text-base font-bold text-white mb-4">Recent Check-in Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Mood Score</th>
                <th className="pb-3">Emotion</th>
                <th className="pb-3">Reflection Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.length > 0 ? (
                history.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 text-slate-400">{new Date(log.created_at).toLocaleDateString()}</td>
                    <td className="py-3 font-semibold text-indigo-400">{log.mood_level} / 10</td>
                    <td className="py-3 capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-200">
                        {log.emotion}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 truncate max-w-xs">{log.message || 'Quick numerical check-in'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500">
                    No recent check-ins yet. <Link to="/checkin" className="text-indigo-400 hover:underline">Check in now</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
