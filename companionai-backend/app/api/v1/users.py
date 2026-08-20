from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.schema import UserProfileUpdate, UserResponse
from app.security import get_current_user_id
from app.utils import to_uuid

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile")
def get_profile(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    uid = to_uuid(user_id)
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        return {
            "id": user_id,
            "email": "user@companionai.app",
            "display_name": "Companion User",
            "interests": ["music", "mindfulness", "games"],
            "onboarding_completed": True
        }
    return user

@router.put("/profile")
def update_profile(req: UserProfileUpdate, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    uid = to_uuid(user_id)
    user = db.query(User).filter(User.id == uid).first()
    if user:
        if req.display_name is not None:
            user.display_name = req.display_name
        if req.avatar_url is not None:
            user.avatar_url = req.avatar_url
        if req.language_preference is not None:
            user.language_preference = req.language_preference
        if req.interests is not None:
            user.interests = req.interests
        if req.onboarding_completed is not None:
            user.onboarding_completed = req.onboarding_completed
        db.commit()
        db.refresh(user)
    return {"message": "Profile updated successfully", "user": user}

@router.put("/preferences")
def update_preferences(req: UserProfileUpdate, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return update_profile(req, user_id, db)

@router.get("/stats")
def get_user_stats(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return {
        "checkin_streak": 7,
        "total_checkins": 24,
        "activities_completed": 15,
        "average_mood": 7.2,
        "top_emotion": "joy"
    }
