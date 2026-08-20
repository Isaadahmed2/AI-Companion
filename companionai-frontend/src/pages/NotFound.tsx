import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <h1 className="text-6xl font-black text-indigo-500 mb-4">404</h1>
      <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-400 mb-6">
        Let's take a deep breath and guide you back to your wellness space.
      </p>
      <Link to="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
