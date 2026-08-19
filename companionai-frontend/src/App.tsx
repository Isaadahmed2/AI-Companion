import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import DailyCheckin from './pages/DailyCheckin'
import MoodDashboard from './pages/MoodDashboard'
import RecommendationsHub from './pages/RecommendationsHub'
import ActivitiesHub from './pages/ActivitiesHub'
import SocialConnect from './pages/SocialConnect'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import VoiceSanctuary from './pages/VoiceSanctuary'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/voice" element={<VoiceSanctuary />} />
          <Route path="/checkin" element={<DailyCheckin />} />
          <Route path="/dashboard" element={<MoodDashboard />} />
          <Route path="/recommendations" element={<RecommendationsHub />} />
          <Route path="/activities" element={<ActivitiesHub />} />
          <Route path="/social" element={<SocialConnect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
