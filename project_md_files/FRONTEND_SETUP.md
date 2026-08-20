# CompanionAI Frontend Setup Guide

## Project Structure

```
companionai-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── index.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── components/               # Reusable UI components
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── GoogleAuthButton.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── mood/
│   │   │   ├── MoodCheckinForm.tsx
│   │   │   ├── MoodLevel.tsx
│   │   │   ├── VoiceInput.tsx (OpenAI Realtime)
│   │   │   └── MoodIndicator.tsx
│   │   ├── recommendations/
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── RecommendationGrid.tsx
│   │   │   ├── RecommendationFilters.tsx
│   │   │   └── CategorySelector.tsx
│   │   ├── activities/
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ActivityList.tsx
│   │   │   ├── ActivityPlayer.tsx (music, games)
│   │   │   └── ActivityRating.tsx
│   │   ├── goals/
│   │   │   ├── GoalForm.tsx
│   │   │   ├── GoalList.tsx
│   │   │   ├── GoalItem.tsx
│   │   │   └── GoalProgress.tsx
│   │   ├── social/
│   │   │   ├── UserMatch.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── ConnectionRequest.tsx
│   │   │   └── ClubCard.tsx
│   │   └── analytics/
│   │       ├── MoodChart.tsx (Recharts)
│   │       ├── StatsCard.tsx
│   │       ├── ProgressBar.tsx
│   │       └── Dashboard.tsx
│   ├── pages/                    # Page components (route-based)
│   │   ├── Home.tsx
│   │   ├── Onboarding.tsx
│   │   ├── DailyCheckin.tsx
│   │   ├── MoodDashboard.tsx
│   │   ├── RecommendationsHub.tsx
│   │   ├── ActivitiesHub.tsx
│   │   ├── SocialConnect.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useMood.ts
│   │   ├── useRecommendations.ts
│   │   ├── useActivities.ts
│   │   ├── useVoice.ts           # OpenAI Realtime integration
│   │   ├── useFetch.ts
│   │   └── useLocalStorage.ts
│   ├── services/                 # API & external service integration
│   │   ├── api.ts                # Axios instance & base config
│   │   ├── auth.ts               # Authentication API calls
│   │   ├── moods.ts              # Mood API calls
│   │   ├── recommendations.ts
│   │   ├── activities.ts
│   │   ├── voice.ts              # OpenAI Realtime client
│   │   └── social.ts
│   ├── store/                    # Redux state management
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── moodSlice.ts
│   │   │   ├── recommendationSlice.ts
│   │   │   ├── activitiesSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── selectors/
│   │       └── index.ts
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── mood.ts
│   │   ├── activity.ts
│   │   ├── recommendation.ts
│   │   └── api.ts
│   ├── utils/                    # Utility functions
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── dateHelpers.ts
│   │   └── helpers.ts
│   ├── styles/                   # Global styles
│   │   ├── globals.css
│   │   ├── tailwind.css
│   │   ├── variables.css
│   │   └── animations.css
│   ├── assets/                   # Images, icons, fonts
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   └── config/
│       └── env.ts                # Environment configuration
├── .env.example
├── .gitignore
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation & Setup

### 1. Prerequisites

```bash
# Node.js 18+ and npm
node --version
npm --version

# Git
git --version
```

### 2. Create React App

```bash
# Using Vite (recommended for faster development)
npm create vite@latest companionai-frontend -- --template react-ts
cd companionai-frontend

# Or using Create React App
npx create-react-app companionai-frontend --template typescript
cd companionai-frontend
```

### 3. Install Dependencies

```bash
npm install

# UI & Styling
npm install @radix-ui/primitives shadcn-ui tailwindcss postcss autoprefixer
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# State Management
npm install @reduxjs/toolkit react-redux

# API Client
npm install axios

# Authentication
npm install @supabase/supabase-js
npm install @react-oauth/google  # Google OAuth

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Charts & Analytics
npm install recharts

# Voice & Audio
npm install wavesurfer.js

# Utilities
npm install date-fns clsx classnames
npm install react-hot-toast          # Notifications

# Development
npm install -D typescript @types/react @types/react-dom
npm install -D eslint eslint-config-prettier prettier
npm install -D @typescript-eslint/eslint-plugin
```

### 4. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### .env.example

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# OpenAI Realtime (Voice)
VITE_OPENAI_API_KEY=your-openai-api-key

# Feature Flags
VITE_ENABLE_VOICE=true
VITE_ENABLE_SOCIAL=true
VITE_ENABLE_ANALYTICS=true

# Environment
VITE_ENV=development
```

### 5. Setup Tailwind CSS

```bash
# tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        calm: "#0ea5e9",
      },
    },
  },
  plugins: [],
}
```

### 6. Initialize Supabase

```bash
# src/config/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 7. Run Development Server

```bash
npm run dev
# Open http://localhost:5173 (Vite) or http://localhost:3000 (CRA)
```

---

## Core Hooks Implementation

### useAuth Hook

```typescript
// src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setLoading, setError, clearAuth } from '../store/slices/authSlice'
import * as authService from '../services/auth'
import { supabase } from '../config/supabase'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isLoading, error, isAuthenticated } = useSelector(
    (state: any) => state.auth
  )

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch(setLoading(true))
        
        // Check existing session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Fetch user profile from backend
          const profile = await authService.getProfile()
          dispatch(setUser(profile))
        }
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Auth failed'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    initializeAuth()
  }, [dispatch])

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // User logged in
          dispatch(setUser(session.user))
        } else {
          // User logged out
          dispatch(clearAuth())
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [dispatch])

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true))
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      const profile = await authService.getProfile()
      dispatch(setUser(profile))
      return data.user
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      dispatch(setError(message))
      throw err
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      dispatch(clearAuth())
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Logout failed'))
    }
  }, [dispatch])

  const signup = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        dispatch(setLoading(true))
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        // Create user profile in backend
        const profile = await authService.createProfile({
          email,
          display_name: displayName,
        })

        dispatch(setUser(profile))
        return data.user
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed'
        dispatch(setError(message))
        throw err
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch]
  )

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    signup,
  }
}
```

### useVoice Hook (OpenAI Realtime)

```typescript
// src/hooks/useVoice.ts

import { useState, useEffect, useRef, useCallback } from 'react'
import * as voiceService from '../services/voice'

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const startListening = useCallback(async () => {
    try {
      setError(null)
      setIsListening(true)
      setTranscript('')
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
        },
      })
      mediaStreamRef.current = stream
      
      // Get WebSocket token from backend
      const { token, url } = await voiceService.getRealtimeToken()
      
      // Connect to OpenAI Realtime API
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      wsRef.current = new WebSocket(`${url}/?token=${token}`)
      
      wsRef.current.onopen = () => {
        console.log('Connected to OpenAI Realtime')
        // Send audio stream
        sendAudioStream(stream)
      }
      
      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data)
        
        if (message.type === 'response.text.delta') {
          setResponse(prev => prev + message.delta)
        } else if (message.type === 'input_audio_buffer.speech_started') {
          setIsProcessing(true)
        }
      }
      
      wsRef.current.onerror = (err) => {
        setError('Voice connection error')
        console.error(err)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Microphone access denied')
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (wsRef.current) {
      wsRef.current.close()
    }
    
    setIsListening(false)
    setIsProcessing(false)
  }, [])

  const sendAudioStream = async (stream: MediaStream) => {
    // Implementation for sending audio stream to WebSocket
    // Uses Web Audio API to capture and send audio chunks
  }

  return {
    isListening,
    isProcessing,
    transcript,
    response,
    error,
    startListening,
    stopListening,
  }
}
```

---

## Key Pages Implementation

### Daily Check-in Page

```typescript
// src/pages/DailyCheckin.tsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMood } from '../hooks/useMood'
import { useVoice } from '../hooks/useVoice'
import MoodCheckinForm from '../components/mood/MoodCheckinForm'
import VoiceInput from '../components/mood/VoiceInput'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

export default function DailyCheckin() {
  const navigate = useNavigate()
  const { submitMoodCheckin } = useMood()
  const { isListening, startListening, stopListening } = useVoice()
  const [moodLevel, setMoodLevel] = useState(5)
  const [message, setMessage] = useState('')
  const [useVoiceInput, setUseVoiceInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitMoodCheckin({
        mood_level: moodLevel,
        message: message,
        voice_input: useVoiceInput,
      })

      // Show AI response
      console.log('AI Response:', result.ai_response)
      console.log('Recommendations:', result.recommendations)

      // Navigate to recommendations
      navigate('/recommendations', { state: { result } })
    } catch (error) {
      console.error('Error submitting mood:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">How are you feeling?</h1>
            <p className="text-gray-600 mt-2">
              Your daily check-in helps us understand you better
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Level Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Mood Level: {moodLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodLevel}
                onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>😢 Sad</span>
                <span>😐 Neutral</span>
                <span>😊 Happy</span>
              </div>
            </div>

            {/* Input Method Toggle */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={!useVoiceInput ? 'primary' : 'secondary'}
                onClick={() => setUseVoiceInput(false)}
                className="flex-1"
              >
                Text
              </Button>
              <Button
                type="button"
                variant={useVoiceInput ? 'primary' : 'secondary'}
                onClick={() => setUseVoiceInput(true)}
                className="flex-1"
              >
                Voice
              </Button>
            </div>

            {/* Text or Voice Input */}
            {!useVoiceInput ? (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me what's on your mind..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={4}
              />
            ) : (
              <VoiceInput
                isListening={isListening}
                onStart={startListening}
                onStop={stopListening}
              />
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Analyzing...' : 'Submit Check-in'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
```

---

## package.json

```json
{
  "name": "companionai-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "react-redux": "^8.1.3",
    "@reduxjs/toolkit": "^1.9.7",
    "axios": "^1.6.0",
    "@supabase/supabase-js": "^2.38.1",
    "@react-oauth/google": "^0.12.1",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "recharts": "^2.10.2",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "react-hot-toast": "^2.4.1",
    "wavesurfer.js": "^7.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.33",
    "@types/react-dom": "^18.2.11",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.0",
    "eslint": "^8.53.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.0.3",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "typescript": "^5.2.2",
    "vite": "^5.0.2"
  }
}
```

---

## Redux Store Setup

```typescript
// src/store/store.ts

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import moodReducer from './slices/moodSlice'
import recommendationReducer from './slices/recommendationSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mood: moodReducer,
    recommendations: recommendationReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

---

## API Service Setup

```typescript
// src/services/api.ts

import axios, { AxiosInstance } from 'axios'
import { supabase } from '../config/supabase'

const baseURL = import.meta.env.VITE_API_BASE_URL

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL,
      timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
    })

    // Add request interceptor for auth
    this.client.interceptors.request.use(
      async (config) => {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          const { data, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError) {
            await supabase.auth.signOut()
          }
        }
        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config)
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config)
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config)
  }
}

export const apiClient = new APIClient()
```

---

## Deployment with Vercel

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@api_base_url",
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_key",
    "VITE_GOOGLE_CLIENT_ID": "@google_client_id"
  }
}
```

Deploy with: `vercel deploy`

---

## Testing Setup

```typescript
// src/__tests__/useAuth.test.ts

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'
import * as authService from '../services/auth'

jest.mock('../services/auth')

describe('useAuth', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.login('test@example.com', 'password123')
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toBeDefined()
    })
  })
})
```

---

## Key Features Implementation Checklist

- [ ] Authentication (email/password + Google OAuth)
- [ ] User Onboarding Flow
- [ ] Daily Mood Check-in
- [ ] AI Response Display
- [ ] Mood History & Trends Dashboard
- [ ] Recommendation Hub
- [ ] Activity Cards & Players
- [ ] Goals Tracker
- [ ] Social Connections
- [ ] Voice Input (OpenAI Realtime)
- [ ] Notifications
- [ ] User Settings & Preferences
- [ ] Data Export
- [ ] Dark Mode Support
- [ ] Mobile Responsiveness
- [ ] Error Handling & Loading States
- [ ] Offline Support (PWA)

