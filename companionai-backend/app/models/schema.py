from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid

# Auth Schemas
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    display_name: Optional[str] = None
    interests: Optional[List[str]] = []
    language_preference: Optional[str] = "en"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    id_token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    user: Dict[str, Any]

# User Schemas
class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    language_preference: Optional[str] = None
    interests: Optional[List[str]] = None
    onboarding_completed: Optional[bool] = None

class UserResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    language_preference: Optional[str] = "en"
    interests: List[str] = []
    onboarding_completed: bool = False
    created_at: Optional[datetime] = None

# Mood Schemas
class MoodCheckinRequest(BaseModel):
    mood_level: int = Field(ge=1, le=10, description="Scale from 1 (very sad) to 10 (very happy)")
    message: Optional[str] = None
    voice_input: Optional[bool] = False

class MoodCheckinResponse(BaseModel):
    mood_log_id: str
    user_id: str
    mood_level: int
    detected_emotion: str
    intensity: int
    confidence: float
    detected_topics: List[str]
    ai_response: str
    recommendations: List[Dict[str, Any]]
    goal_suggestions: List[str]
    created_at: datetime

# Recommendation Schemas
class RecommendationFeedback(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback: Optional[str] = None

# Activity Schemas
class ActivityCreate(BaseModel):
    category: str
    title: str
    description: Optional[str] = None
    content_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}

class ActivityLogCreate(BaseModel):
    activity_id: str
    completed: bool = False
    duration_minutes: Optional[int] = 0
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback: Optional[str] = None

# Goal Schemas
class GoalCreate(BaseModel):
    goal_text: str
    category: Optional[str] = "general"

class GoalUpdate(BaseModel):
    goal_text: Optional[str] = None
    completed: Optional[bool] = None

# Notification Schemas
class NotificationPreferenceUpdate(BaseModel):
    daily_checkin: Optional[bool] = None
    motivational_messages: Optional[bool] = None
    activity_reminders: Optional[bool] = None
