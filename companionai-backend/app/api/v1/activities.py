from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List
import uuid

from app.database import get_db
from app.models.activity import Activity, UserActivityLog
from app.models.schema import ActivityCreate, ActivityLogCreate
from app.security import get_current_user_id

router = APIRouter(prefix="/activities", tags=["Activities"])

SAMPLE_ACTIVITIES = [
    {"id": "act-1", "category": "music", "title": "Lo-Fi Beats for Peaceful Focus", "description": "Chill lofi study and relaxation.", "content_url": "https://www.youtube.com/watch?v=jfKfPfyJRdk", "active": True},
    {"id": "act-2", "category": "music", "title": "Uplifting Acoustic Sunshine", "description": "Bright acoustic melodies to uplift your day.", "content_url": "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0", "active": True},
    {"id": "act-3", "category": "game", "title": "Mindful Color Zen Puzzle", "description": "Gentle color matching relaxation.", "content_url": "#puzzle", "active": True},
    {"id": "act-4", "category": "game", "title": "Daily Word Association", "description": "Quick cognitive puzzle for mindful alertness.", "content_url": "#wordgame", "active": True},
    {"id": "act-5", "category": "comedy", "title": "Wholesome Funny Reels", "description": "Lighthearted comedy and animal fun.", "content_url": "#comedy", "active": True},
    {"id": "act-6", "category": "motivation", "title": "5-Minute Grounding Technique", "description": "Mindful breathing and resetting.", "content_url": "#meditation", "active": True},
]

@router.get("/")
def get_all_activities(category: Optional[str] = None):
    if category:
        return [a for a in SAMPLE_ACTIVITIES if a["category"].lower() == category.lower()]
    return SAMPLE_ACTIVITIES

@router.get("/category/{category}")
def get_activities_by_category(category: str):
    return [a for a in SAMPLE_ACTIVITIES if a["category"].lower() == category.lower()]

@router.get("/{id}")
def get_activity_details(id: str):
    act = next((a for a in SAMPLE_ACTIVITIES if a["id"] == id), None)
    return act or SAMPLE_ACTIVITIES[0]

@router.post("/{id}/start")
def start_activity(id: str, user_id: str = Depends(get_current_user_id)):
    return {"message": "Activity started", "activity_id": id}

@router.post("/{id}/complete")
def complete_activity(id: str, user_id: str = Depends(get_current_user_id)):
    return {"message": "Activity completed", "activity_id": id, "points_earned": 50}

@router.post("/{id}/rating")
def rate_activity(id: str, log: ActivityLogCreate, user_id: str = Depends(get_current_user_id)):
    return {"message": "Rating saved", "rating": log.rating}

@router.get("/completed")
def get_completed_activities(user_id: str = Depends(get_current_user_id)):
    return [
        {"id": "act-1", "title": "Lo-Fi Beats for Peaceful Focus", "completed_at": "2026-08-18T14:30:00Z"},
        {"id": "act-6", "title": "5-Minute Grounding Technique", "completed_at": "2026-08-19T09:15:00Z"}
    ]
