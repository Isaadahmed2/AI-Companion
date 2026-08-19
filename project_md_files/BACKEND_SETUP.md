# CompanionAI Backend Setup Guide

## Project Structure

```
companionai-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration & env variables
│   ├── database.py             # Supabase connection & ORM setup
│   ├── security.py             # JWT & auth utilities
│   ├── models/                 # Pydantic models & SQLAlchemy ORM
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── mood.py
│   │   ├── activity.py
│   │   ├── recommendation.py
│   │   ├── goal.py
│   │   └── schema.py           # Pydantic request/response schemas
│   ├── api/                    # API route handlers
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   ├── users.py        # User profile endpoints
│   │   │   ├── moods.py        # Mood check-in endpoints
│   │   │   ├── ai.py           # AI response endpoints
│   │   │   ├── recommendations.py
│   │   │   ├── activities.py
│   │   │   ├── goals.py
│   │   │   ├── voice.py        # OpenAI Realtime integration
│   │   │   ├── social.py       # Social connection endpoints
│   │   │   ├── notifications.py
│   │   │   └── analytics.py
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── emotion_service.py  # NLP & sentiment analysis
│   │   ├── llm_service.py      # DeepSeek integration
│   │   ├── recommendation_service.py
│   │   ├── voice_service.py    # OpenAI Realtime handling
│   │   ├── notification_service.py
│   │   └── social_service.py
│   ├── agents/                 # LangGraph workflows
│   │   ├── __init__.py
│   │   ├── wellness_agent.py   # Main companion agent
│   │   ├── recommendation_agent.py
│   │   └── health_coach_agent.py (future)
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth.py             # JWT verification
│   │   ├── rate_limit.py       # Rate limiting
│   │   └── logging.py          # Request/response logging
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── decorators.py       # Common decorators
│   │   ├── validators.py       # Data validation helpers
│   │   ├── constants.py        # App constants
│   │   └── exceptions.py       # Custom exceptions
│   └── tasks/                  # Celery async tasks
│       ├── __init__.py
│       ├── scheduled.py        # Scheduled jobs (daily checkins, etc)
│       └── notifications.py    # Notification tasks
├── migrations/                 # Database migrations
│   ├── versions/
│   └── env.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Pytest fixtures
│   ├── unit/
│   │   ├── test_auth.py
│   │   ├── test_emotions.py
│   │   ├── test_llm.py
│   │   └── ...
│   └── integration/
│       ├── test_api_auth.py
│       ├── test_api_moods.py
│       └── ...
├── requirements.txt
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## Installation & Setup

### 1. Prerequisites

```bash
# Python 3.10+
python --version

# Git
git --version

# Docker & Docker Compose (optional, for local development)
docker --version
docker-compose --version
```

### 2. Clone Repository

```bash
git clone https://github.com/your-org/companionai-backend.git
cd companionai-backend
```

### 3. Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Environment Configuration

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your configuration
# See Environment Variables section below
```

### 6. Database Setup

```bash
# Create tables in Supabase (via migrations)
alembic upgrade head

# Or manually run SQL from migrations/init.sql
```

### 7. Run Application

```bash
# Development with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

---

## Environment Variables (.env)

```bash
# FastAPI
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=your-super-secret-key-change-in-production

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/companionai

# DeepSeek API
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# OpenAI (for voice)
OPENAI_API_KEY=your-openai-api-key
OPENAI_REALTIME_MODEL=gpt-4-realtime-preview

# HuggingFace (for NLP models)
HUGGINGFACE_API_KEY=your-hf-key

# Redis (for caching & Celery)
REDIS_URL=redis://localhost:6379/0

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# JWT
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
REFRESH_TOKEN_EXPIRATION_DAYS=30

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Sentry (error tracking)
SENTRY_DSN=your-sentry-dsn

# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-email-password

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60  # seconds

# Logging
LOG_LEVEL=INFO
```

---

## Key Dependencies

### requirements.txt

```
# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
gunicorn==21.2.0
python-multipart==0.0.6

# Database & ORM
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9
supabase==2.3.2

# Authentication & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic==2.5.0
pydantic-settings==2.1.0

# LLM & AI
langchain==0.1.4
langgraph==0.0.20
openai==1.3.8
httpx==0.25.2

# NLP & Sentiment Analysis
transformers==4.35.2
torch==2.1.1
scikit-learn==1.3.2
nltk==3.8.1

# Task Queue
celery==5.3.4
redis==5.0.1

# Async
aioredis==2.0.1
asyncio-contextmanager==1.0.0

# Monitoring & Logging
sentry-sdk==1.38.0
python-json-logger==2.0.7

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2  # For test client

# Utilities
python-dotenv==1.0.0
email-validator==2.1.0
```

---

## Core Service Implementation Examples

### 1. Emotion Detection Service

```python
# app/services/emotion_service.py

from transformers import pipeline
from typing import Dict, List
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

class EmotionDetectionService:
    def __init__(self):
        # Load HuggingFace emotion model
        self.emotion_pipeline = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base"
        )
        # Sentiment analysis
        self.sia = SentimentIntensityAnalyzer()
        
    async def detect_emotion(self, text: str) -> Dict:
        """
        Detect emotion from user message
        Returns: {emotion, confidence, intensity}
        """
        # Emotion detection
        emotion_result = self.emotion_pipeline(text)[0]
        
        # Sentiment scores
        sentiment = self.sia.polarity_scores(text)
        
        # Determine intensity (1-5)
        intensity = self._calculate_intensity(sentiment['compound'])
        
        return {
            "emotion": emotion_result['label'],
            "confidence": emotion_result['score'],
            "sentiment_scores": sentiment,
            "intensity": intensity
        }
    
    async def extract_topics(self, text: str) -> List[str]:
        """Extract key topics/keywords from message"""
        # Using simple NLP or keyword extraction
        # Can be enhanced with more sophisticated NER
        keywords = []
        # Implementation
        return keywords
    
    def _calculate_intensity(self, compound_score: float) -> int:
        """Convert sentiment score to intensity 1-5"""
        if compound_score >= 0.5:
            return 5
        elif compound_score >= 0.25:
            return 4
        elif compound_score >= 0:
            return 3
        elif compound_score >= -0.25:
            return 2
        else:
            return 1
```

### 2. LLM Service (DeepSeek)

```python
# app/services/llm_service.py

import httpx
from typing import Optional
from app.config import settings

class LLMService:
    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.api_base = settings.DEEPSEEK_API_BASE
        self.model = settings.DEEPSEEK_MODEL
        self.client = httpx.AsyncClient()
    
    async def generate_empathetic_response(
        self,
        user_message: str,
        detected_emotion: str,
        mood_history: Optional[list] = None
    ) -> str:
        """
        Generate empathetic AI response using DeepSeek
        """
        
        # Build context-aware prompt
        system_prompt = self._build_system_prompt(detected_emotion)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        # Add historical context if available
        if mood_history:
            # Summarize user's recent moods for context
            pass
        
        try:
            response = await self.client.post(
                f"{self.api_base}/chat/completions",
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 500,
                },
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=30.0
            )
            
            result = response.json()
            return result['choices'][0]['message']['content']
            
        except Exception as e:
            # Log error and return fallback response
            print(f"LLM error: {e}")
            return self._get_fallback_response(detected_emotion)
    
    def _build_system_prompt(self, emotion: str) -> str:
        """Build context-aware system prompt based on detected emotion"""
        base_prompt = """You are CompanionAI, an empathetic emotional wellness companion. 
Your role is to:
1. Validate the user's feelings
2. Show genuine empathy and understanding
3. Provide supportive responses
4. Never dismiss or minimize their emotions
5. Suggest constructive activities when appropriate
6. Be conversational and warm, not clinical

Remember: You are here to listen, understand, and support."""
        
        emotion_guidance = {
            "sadness": "Acknowledge their pain. Be gentle and supportive.",
            "anxiety": "Help them feel safe. Suggest grounding techniques.",
            "joy": "Celebrate with them and encourage them to share more.",
            "anger": "Validate their frustration. Help them process it constructively.",
            "neutral": "Be friendly and encouraging. Gently explore how they're feeling."
        }
        
        return base_prompt + f"\n\nUser is experiencing: {emotion}\n{emotion_guidance.get(emotion, '')}"
    
    def _get_fallback_response(self, emotion: str) -> str:
        """Fallback response if API fails"""
        responses = {
            "sadness": "I'm here for you. It's okay to feel sad sometimes. Would you like to talk about it?",
            "anxiety": "I can sense you're feeling anxious. Let's take a moment. I'm here to help.",
            "joy": "That sounds wonderful! I'm happy for you.",
            "anger": "I understand you're frustrated. Your feelings are valid.",
        }
        return responses.get(emotion, "I'm here to listen and support you.")
```

### 3. Voice Service (OpenAI Realtime)

```python
# app/services/voice_service.py

import json
import base64
from app.config import settings

class VoiceService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_REALTIME_MODEL
    
    async def get_realtime_session_token(self) -> Dict:
        """
        Get ephemeral token for WebSocket connection to OpenAI Realtime API
        """
        import httpx
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/realtime/sessions",
                json={
                    "model": self.model,
                    "voice": "alloy"
                },
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
            )
            return response.json()
    
    async def process_voice_input(self, audio_base64: str) -> str:
        """
        Process voice input and return transcribed text
        """
        # This would be handled client-side with OpenAI Realtime API
        # This method is for fallback/batch processing if needed
        pass
```

---

## LangGraph Wellness Agent Implementation

```python
# app/agents/wellness_agent.py

from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from app.services.emotion_service import EmotionDetectionService
from app.services.llm_service import LLMService
from app.services.recommendation_service import RecommendationService

class CompanionState(TypedDict):
    user_id: str
    user_message: str
    mood_level: int
    detected_emotion: str
    confidence: float
    detected_topics: List[str]
    ai_response: str
    recommendations: List[Dict[str, Any]]
    goal_suggestions: List[str]
    next_action: str

class WellnessAgent:
    def __init__(self):
        self.emotion_service = EmotionDetectionService()
        self.llm_service = LLMService()
        self.recommendation_service = RecommendationService()
        self.workflow = self._build_workflow()
    
    def _build_workflow(self):
        """Build LangGraph workflow"""
        workflow = StateGraph(CompanionState)
        
        # Add nodes
        workflow.add_node("emotion_detection", self.emotion_detection_node)
        workflow.add_node("llm_response", self.llm_response_node)
        workflow.add_node("recommendations", self.recommendation_node)
        workflow.add_node("goal_setting", self.goal_setting_node)
        
        # Add edges
        workflow.add_edge("START", "emotion_detection")
        workflow.add_edge("emotion_detection", "llm_response")
        workflow.add_edge("llm_response", "recommendations")
        workflow.add_edge("recommendations", "goal_setting")
        workflow.add_edge("goal_setting", END)
        
        return workflow.compile()
    
    async def emotion_detection_node(self, state: CompanionState) -> CompanionState:
        """Detect emotion from user message"""
        emotion_data = await self.emotion_service.detect_emotion(state["user_message"])
        topics = await self.emotion_service.extract_topics(state["user_message"])
        
        state["detected_emotion"] = emotion_data["emotion"]
        state["confidence"] = emotion_data["confidence"]
        state["detected_topics"] = topics
        
        return state
    
    async def llm_response_node(self, state: CompanionState) -> CompanionState:
        """Generate AI response"""
        response = await self.llm_service.generate_empathetic_response(
            user_message=state["user_message"],
            detected_emotion=state["detected_emotion"]
        )
        
        state["ai_response"] = response
        return state
    
    async def recommendation_node(self, state: CompanionState) -> CompanionState:
        """Generate personalized recommendations"""
        recommendations = await self.recommendation_service.generate_recommendations(
            user_id=state["user_id"],
            emotion=state["detected_emotion"],
            topics=state["detected_topics"]
        )
        
        state["recommendations"] = recommendations
        return state
    
    async def goal_setting_node(self, state: CompanionState) -> CompanionState:
        """Suggest daily goals"""
        goals = self.recommendation_service.suggest_daily_goals(
            emotion=state["detected_emotion"],
            recommendations=state["recommendations"]
        )
        
        state["goal_suggestions"] = goals
        return state
    
    async def run(self, user_id: str, user_message: str, mood_level: int):
        """Run the wellness agent"""
        initial_state = CompanionState(
            user_id=user_id,
            user_message=user_message,
            mood_level=mood_level,
            detected_emotion="",
            confidence=0.0,
            detected_topics=[],
            ai_response="",
            recommendations=[],
            goal_suggestions=[],
            next_action=""
        )
        
        result = await self.workflow.ainvoke(initial_state)
        return result
```

---

## Database Models (SQLAlchemy)

```python
# app/models/user.py

from sqlalchemy import Column, String, Boolean, DateTime, JSON, UUID
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    display_name = Column(String(255), nullable=True)
    avatar_url = Column(String, nullable=True)
    language_preference = Column(String(10), default="en")
    interests = Column(JSON, default=list)
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

## Testing Example

```python
# tests/test_api_moods.py

import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_submit_mood_checkin(client: AsyncClient, auth_token: str):
    """Test submitting a mood check-in"""
    
    response = await client.post(
        "/api/v1/moods/checkin",
        json={
            "mood_level": 6,
            "message": "Had a good day, feeling positive"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert "mood_log_id" in data
    assert data["detected_emotion"] in ["joy", "neutral", "happiness"]
    assert "ai_response" in data
    assert "recommendations" in data
```

---

## Running with Docker

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/companionai
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - .:/app

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: companionai
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

Run with: `docker-compose up -d`

---

## Deployment Checklist

- [ ] Environment variables configured in production
- [ ] Database migrations applied
- [ ] JWT secrets rotated
- [ ] CORS origins configured correctly
- [ ] Rate limiting enabled
- [ ] Error tracking (Sentry) configured
- [ ] Health check endpoint tested
- [ ] Database backups scheduled
- [ ] Monitoring and alerts set up
- [ ] API documentation deployed
- [ ] SSL/TLS certificates installed

