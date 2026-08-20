import React from 'react'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>CompanionAI Emotional Wellness Platform</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Safe & Confidential</span>
        </div>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for empathetic support
        </p>
      </div>
    </footer>
  )
}
