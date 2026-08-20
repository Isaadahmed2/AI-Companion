# CompanionAI — Empathetic Emotional Wellness Companion 🌿✨

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat&logo=Vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?style=flat&logo=Supabase&logoColor=white)](https://supabase.com)
[![DeepSeek](https://img.shields.io/badge/DeepSeek-LLM-4D6BFE.svg?style=flat)](https://deepseek.com)
[![OpenAI Realtime](https://img.shields.io/badge/OpenAI-Realtime%20Voice-412991.svg?style=flat&logo=OpenAI&logoColor=white)](https://openai.com)
[![Whisper STT](https://img.shields.io/badge/OpenAI-Whisper%20STT-10A37F.svg?style=flat&logo=OpenAI&logoColor=white)](https://openai.com)

**CompanionAI** is an advanced, full-stack emotional wellness application engineered to help users navigate stress, anxiety, burnout, and daily emotional states. It provides **live two-way conversational voice therapy**, **speech-to-text mood journaling**, **empathetic AI guidance**, **personalized content recommendations**, and **interactive mindfulness activities**.

---

## 📑 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [AI Models & Technology Stack](#-ai-models--technology-stack)
3. [How Each Feature Works](#-how-each-feature-works)
4. [Database Schema & Supabase](#-database-schema--supabase)
5. [Prerequisites & Environment Configuration](#-prerequisites--environment-configuration)
6. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
7. [API Reference](#-api-reference)
8. [Testing & Quality Assurance](#-testing--quality-assurance)

---

## 🏗️ Architecture Overview

```
                          ┌────────────────────────────────────────┐
                          │         CompanionAI Frontend           │
                          │   (React 18 + TypeScript + Vite + CSS)  │
                          └───────────────────┬────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │ HTTP REST / JSON API                              │ WebRTC SDP Stream
                    ▼                                                   ▼
┌───────────────────────────────────────────────┐     ┌───────────────────────────────────┐
│              FastAPI Backend                  │     │       OpenAI Realtime WebRTC      │
│  (Auth, Mood Analytics, Recommendations, STT) │     │    (`gpt-realtime-2.1` Audio)     │
└──────────────┬────────────────┬───────────────┘     └───────────────────────────────────┘
               │                │
               │                ├────────────────────────┐
               ▼                ▼                        ▼
┌───────────────────────┐ ┌───────────────┐  ┌───────────────────────┐
│ Supabase PostgreSQL   │ │ DeepSeek LLM  │  │  OpenAI Whisper STT   │
│ (or SQLite fallback)  │ │ (Empathy Chat)│  │    (`whisper-1`)      │
└───────────────────────┘ └───────────────┘  └───────────────────────┘
```

---

## 🤖 AI Models & Technology Stack

CompanionAI orchestrates a multi-model AI pipeline where each model handles the specialized task it is best suited for:

### 1. **DeepSeek Chat LLM (`deepseek-chat`)**
- **Purpose**: Empathetic conversational intelligence, mood reflection analysis, and dynamic wellness recommendations.
- **How it works**: When a user submits a mood check-in (with mood rating and text notes), DeepSeek parses the context using customized empathetic system prompts. It generates non-judgmental, warm validation messages, identifies cognitive distortions gently, and recommends specific actions tailored to the user's emotion.
- **Fallback**: If the API is unreachable, a built-in emotional reasoning fallback engine ensures the user receives continuous support without interruptions.

### 2. **OpenAI Realtime Voice WebRTC (`gpt-realtime-2.1` / `gpt-realtime`)**
- **Purpose**: Live, low-latency, two-way spoken conversation in the **Voice Sanctuary** (`/voice`).
- **How it works**:
  - The client creates a WebRTC PeerConnection with microphone audio.
  - The backend securely exchanges the SDP offer with OpenAI's Realtime Calls API (`/v1/realtime/calls`).
  - WebRTC establishes direct audio streaming with **Server Voice Activity Detection (VAD)** so users can speak naturally and interrupt the companion seamlessly.
  - Voice personas can be switched on-the-fly:
    - 🌸 **Shimmer**: Soft, soothing, empathetic (default).
    - 🌿 **Sage**: Mindful, grounded, meditative.
    - ☀️ **Coral**: Encouraging and bright.
    - 🌊 **Alloy**: Balanced and friendly.
    - 🌲 **Verse & Echo**: Deep, calm, and reflective.

### 3. **OpenAI Whisper (`whisper-1`)**
- **Purpose**: Dedicated Speech-to-Text (STT) transcription for the **Daily Check-in & Mood Journal** (`/checkin`).
- **How it works**: When the user records voice notes for their journal, the audio is captured as high-quality Opus audio (`MediaRecorder`) and submitted to `/api/v1/voice/transcribe`. Whisper converts the audio into text with high punctuation and nuance accuracy.

### 4. **HuggingFace & Rule-Based Sentiment Analysis**
- **Purpose**: Fast token-level sentiment and emotional valence classification (joy, sadness, anxiety, anger, calm, fatigue) with confidence scoring.

---

## 🌟 How Each Feature Works

### 🧘 1. Voice Sanctuary (`/voice`)
- **Live Bidirectional Audio**: Talk out loud to your companion with near-zero latency.
- **Volume-Reactive Glowing Orb**: Animated central orb that dynamically responds to speaking volumes using the Web Audio API (`AnalyserNode`).
- **Live Subtitles & Conversation Transcripts**: Captures user speech via Whisper-1 data events and streams AI response transcript deltas in real-time.
- **One-Click Wellness Prompts**:
  - 🌬️ **4-4-4 / 4-7-8 Breathing Guide**: Guides visual pacing through breathing cycles.
  - 💛 **Anxiety & Grounding Relief**: Prompts gentle 5-4-3-2-1 sensory awareness.
  - 🌙 **Night Calm**: Soft wind-down thoughts before sleep.
  - ✨ **Gratitude Reflection**: Appreciating small daily moments.

### 📝 2. Daily Emotional Check-in (`/checkin`)
- **Interactive Mood Slider**: 1 to 10 visual scale with dynamic color grading (Rose $\rightarrow$ Amber $\rightarrow$ Emerald).
- **Dual-Input Reflection**: Type freely or use the microphone (powered by **Whisper STT**).
- **Instant Compassionate Feedback**: Analyzes emotional state and returns an empathetic response card with tailored activities.

### 🎯 3. Personalized Recommendation Engine (`/recommendations`)
- Dynamically categorizes and serves curated items across 6 modules:
  - 🎵 **Music**: Curated Lo-Fi beats, ambient rain, alpha brainwaves.
  - 🧘 **Meditation**: Guided body scans, box breathing, mindfulness audio.
  - 📱 **Reels & Video**: Calming nature visuals, short psychological insights.
  - 📖 **Mindful Reading**: Evidence-based anxiety and emotional regulation articles.
  - ✍️ **Journaling Prompts**: Targeted reflection questions.
  - 🎮 **Mini-Activities**: Focus grounding puzzles and breathing exercises.

### 📊 4. Mood Dashboard & Analytics (`/dashboard`)
- Interactive **Recharts** visualizations displaying 7-day and 30-day mood trends.
- Dominant emotion distribution bar charts and check-in streak counters.

### 🤝 5. Social Connect & Wellness Clubs (`/social`)
- Peer matching based on shared wellness interests (music, meditation, journaling).
- Community wellness clubs: *Mindful Morning Meditators*, *Lo-Fi & Study Sanctuary*, *Gratitude Circle*.

---

## 🗄️ Database Schema & Supabase

The database is built on **Supabase PostgreSQL** with automated fallback to local SQLite (`companionai.db`) for offline development.

### Core Tables:
| Table Name | Description |
|---|---|
| `users` | User accounts, profiles, hashed credentials, language preferences, interests. |
| `mood_logs` | Daily mood scores (1-10), user notes, detected emotions, voice input flags. |
| `ai_responses` | DeepSeek AI reflections, validation text, suggested activities. |
| `activities` | Wellness catalog (breathing, meditation, lo-fi, grounding exercises). |
| `user_activity_logs` | User participation logs, completion timestamps, feedback ratings. |
| `daily_goals` | User wellness goals, streaks, target dates, completion status. |
| `recommendations` | Dynamically ranked content recommendations with click analytics. |
| `user_connections` | Social peer-to-peer wellness connections and statuses. |
| `notification_preferences`| User reminder preferences (check-ins, motivational prompts). |
| `audit_logs` | Security and event tracking logs. |

---

## ⚙️ Prerequisites & Environment Configuration

### Prerequisites:
- **Node.js** v18+ and **npm** v9+
- **Python** 3.11+
- **API Keys**:
  - **OpenAI API Key** (for Realtime Voice & Whisper STT)
  - **DeepSeek API Key** (for empathetic conversational LLM)
  - **Supabase Account & Project** (URL and Anon Key)

---

### Backend `.env` (`companionai-backend/.env`):
```env
# Application
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a

# Supabase PostgreSQL
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/companionai

# DeepSeek LLM
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_MODEL=deepseek-chat

# OpenAI Realtime Voice & Whisper STT
OPENAI_API_KEY=your-openai-api-key
OPENAI_REALTIME_MODEL=gpt-realtime-2.1

# HuggingFace (NLP / Sentiment)
HUGGINGFACE_API_KEY=your-huggingface-key

# Redis
REDIS_URL=redis://localhost:6379/0
```

### Frontend `.env.local` (`companionai-frontend/.env.local`):
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ENABLE_VOICE=true
VITE_ENABLE_SOCIAL=true
VITE_ENABLE_ANALYTICS=true
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Clone the Repository
```bash
git clone -b saadahmed https://github.com/Isaadahmed2/AI-Companion.git
cd AI-Companion
```

### 2. Backend Setup
```bash
cd companionai-backend

# Create and activate virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*API will run on [http://localhost:8000](http://localhost:8000). Interactive Swagger docs available at [http://localhost:8000/docs](http://localhost:8000/docs).*

### 3. Frontend Setup
```bash
cd ../companionai-frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Web application will be accessible at [http://localhost:5173](http://localhost:5173).*

### 4. Running with Docker Compose
```bash
docker-compose up --build
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Live backend and Supabase connectivity status |
| `POST` | `/api/v1/auth/signup` | Register new user account |
| `POST` | `/api/v1/auth/login` | Authenticate user & issue JWT tokens |
| `GET` | `/api/v1/auth/me` | Fetch active user profile |
| `POST` | `/api/v1/moods/checkin` | Submit mood check-in & trigger DeepSeek AI analysis |
| `GET` | `/api/v1/moods/history` | Retrieve historical mood check-ins |
| `GET` | `/api/v1/moods/trends` | 7-day and 30-day emotion analytics & trends |
| `POST` | `/api/v1/voice/calls` | WebRTC SDP exchange for OpenAI Realtime Voice |
| `POST` | `/api/v1/voice/transcribe`| Transcribe voice audio recording via Whisper STT |
| `GET` | `/api/v1/voice/voices` | List available voice personas (`shimmer`, `sage`, etc.) |
| `GET` | `/api/v1/voice/session-config` | Fetch personalized empathetic voice instructions |
| `GET` | `/api/v1/recommendations/` | Get emotion-tailored wellness recommendations |
| `GET` | `/api/v1/activities/` | List all mindfulness & breathing exercises |
| `GET` | `/api/v1/social/matches` | Find matched peers with compatible wellness interests |

---

## 🧪 Testing & Quality Assurance

### Run Backend Tests (Pytest)
```bash
cd companionai-backend
pytest
```
*Runs all 13 unit & integration test suites covering authentication, mood tracking, DeepSeek LLM responses, emotion classifiers, and voice services.*

### Run Frontend Production Build
```bash
cd companionai-frontend
npm run build
```
*Executes TypeScript static type analysis (`tsc`) and Vite production bundle optimization.*

---

## 🔒 Security & Privacy
- **Zero-Storage Audio Streams**: Voice sanctuary audio is streamed ephemerally over encrypted WebRTC channels.
- **Protected Environment Credentials**: Secret keys are safeguarded through `.gitignore` and `.env.example` templates.
- **JWT Authentication**: Industry-standard HS256 JWT access and refresh tokens.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](file:///c:/Users/saada/Documents/saad_ahmed_saeed_working_space/AI-Companion/LICENSE) file for details.
