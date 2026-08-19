import React, { useState } from 'react'
import { User as UserIcon, Shield, Bell, Key, Save } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { updateProfile } from '../services/auth'

export default function Profile() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({ display_name: displayName })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {}
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Your Profile & Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account preferences and personal information.</p>
      </div>

      <Card glow>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {displayName.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{displayName || 'Companion User'}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Registered Email</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            {saved ? (
              <span className="text-xs font-semibold text-emerald-400">Settings saved successfully!</span>
            ) : <span />}
            <Button type="submit" size="md" className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
