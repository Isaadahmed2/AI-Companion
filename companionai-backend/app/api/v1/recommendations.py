from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.services.recommendation_service import RecommendationService
from app.security import get_current_user_id
from app.models.schema import RecommendationFeedback

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])
rec_service = RecommendationService()

@router.get("/")
async def get_recommendations(
    emotion: Optional[str] = Query("calm", description="Current emotion to tailor recommendations"),
    user_id: str = Depends(get_current_user_id)
):
    items = await rec_service.generate_recommendations(user_id=user_id, emotion=emotion, limit=6)
    return items

@router.get("/trending")
async def get_trending_recommendations(user_id: str = Depends(get_current_user_id)):
    items = await rec_service.generate_recommendations(user_id=user_id, emotion="joy", limit=4)
    return items

@router.get("/{id}")
def get_recommendation_details(id: str, user_id: str = Depends(get_current_user_id)):
    return {
        "id": id,
        "title": "Mindful Lo-Fi & Relaxation Session",
        "category": "music",
        "description": "Recommended for soothing stress and enhancing relaxation."
    }

@router.post("/{id}/click")
def track_recommendation_click(id: str, user_id: str = Depends(get_current_user_id)):
    return {"status": "success", "message": "Click recorded"}

@router.post("/{id}/feedback")
def submit_recommendation_feedback(id: str, fb: RecommendationFeedback, user_id: str = Depends(get_current_user_id)):
    return {"status": "success", "message": "Feedback received"}
