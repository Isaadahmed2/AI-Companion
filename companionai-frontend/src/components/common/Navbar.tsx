import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Heart, Activity, Compass, Users, Mic, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="text-xl font-bold gradient-text tracking-tight">CompanionAI</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              WELLNESS
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/voice"
            className="px-3.5 py-2 text-sm font-semibold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-purple-500/10"
          >
            <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
            Voice Sanctuary
            <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/30 text-purple-200 rounded-full font-bold">LIVE</span>
          </Link>
          <Link
            to="/checkin"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Check-in
          </Link>
          <Link
            to="/dashboard"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            Mood Trends
          </Link>
          <Link
            to="/recommendations"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Explore
          </Link>
          <Link
            to="/social"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            Community
          </Link>
        </nav>

        {/* User / CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                  {user.display_name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                  {user.display_name || user.email}
                </span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/onboarding"
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
