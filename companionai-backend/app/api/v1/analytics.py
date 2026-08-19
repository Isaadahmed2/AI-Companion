from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import get_current_user_id

router = APIRouter(prefix="/analytics", tags=["Analytics & Data Export"])

@router.get("/dashboard")
def get_dashboard_analytics(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return {
        "weekly_average_mood": 7.2,
        "mood_improvement_pct": "+18%",
        "active_days_streak": 7,
        "activities_completed_this_week": 6,
        "dominant_emotions": [
            {"emotion": "joy", "percentage": 45},
            {"emotion": "calm", "percentage": 30},
            {"emotion": "anxiety", "percentage": 15},
            {"emotion": "neutral", "percentage": 10}
        ]
    }

@router.get("/export/data")
def export_user_data(user_id: str = Depends(get_current_user_id)):
    return {
        "user_id": user_id,
        "status": "ready",
        "download_url": "/api/v1/export/download"
    }
