import React, { useEffect, useState } from 'react'
import { Users, Sparkles, UserPlus, MessageCircle, ShieldCheck } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { getSocialMatches, getClubs, joinClub } from '../services/social'

export default function SocialConnect() {
  const [matches, setMatches] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [joinedClubIds, setJoinedClubIds] = useState<string[]>([])

  useEffect(() => {
    getSocialMatches().then(setMatches).catch(() => {})
    getClubs().then(setClubs).catch(() => {})
  }, [])

  const handleJoin = async (id: string) => {
    await joinClub(id)
    setJoinedClubIds(prev => [...prev, id])
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Community & Social Connection</h1>
        <p className="text-sm text-slate-400 mt-1">
          Connect with mindful peers who share your wellness interests in a positive, moderated space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Peer Matches */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Suggested Peer Matches
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map((match, i) => (
              <Card key={i} className="hover:border-indigo-500/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                    {match.display_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{match.display_name}</h3>
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      {Math.round((match.compatibility_score || 0.8) * 100)}% Interest Match
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {match.shared_interests?.map((interest: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                      {interest}
                    </span>
                  ))}
                </div>

                <Button size="sm" variant="secondary" className="w-full gap-1 text-xs">
                  <UserPlus className="w-3.5 h-3.5" /> Connect
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Wellness Clubs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Active Wellness Clubs
          </h2>

          <div className="space-y-3">
            {clubs.map(club => {
              const isJoined = joinedClubIds.includes(club.id)
              return (
                <Card key={club.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{club.name}</h4>
                      <p className="text-[11px] text-slate-400">{club.members_count} active members</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isJoined ? 'secondary' : 'primary'}
                      onClick={() => handleJoin(club.id)}
                      className="text-xs py-1"
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="bg-indigo-950/20 border-indigo-500/20 text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              All community conversations are actively moderated to ensure a safe, supportive, and kind atmosphere.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
