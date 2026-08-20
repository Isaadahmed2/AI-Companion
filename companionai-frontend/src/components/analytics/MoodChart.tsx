import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface MoodChartProps {
  data?: Array<{ day: string; mood: number; emotion: string }>;
}

const defaultData = [
  { day: 'Mon', mood: 6.5, emotion: 'calm' },
  { day: 'Tue', mood: 7.0, emotion: 'joy' },
  { day: 'Wed', mood: 4.5, emotion: 'anxiety' },
  { day: 'Thu', mood: 6.0, emotion: 'neutral' },
  { day: 'Fri', mood: 7.8, emotion: 'joy' },
  { day: 'Sat', mood: 8.5, emotion: 'joy' },
  { day: 'Sun', mood: 8.0, emotion: 'calm' },
]

export default function MoodChart({ data = defaultData }: MoodChartProps) {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis domain={[1, 10]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
            formatter={(value: any) => [`${value} / 10`, 'Mood Level']}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#818cf8"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#moodGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
