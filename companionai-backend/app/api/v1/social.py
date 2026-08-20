from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.social_service import SocialService
from app.security import get_current_user_id

router = APIRouter(prefix="/social", tags=["Social Connection"])
social_service = SocialService()

@router.get("/matches")
def get_social_matches(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return social_service.get_matched_users(db, user_id)

@router.get("/clubs")
def get_clubs():
    return social_service.get_clubs()

@router.post("/clubs/{id}/join")
def join_club(id: str, user_id: str = Depends(get_current_user_id)):
    return {"message": f"Successfully joined club {id}", "club_id": id}

@router.get("/connections")
def get_connections(user_id: str = Depends(get_current_user_id)):
    return [
        {"id": "conn-1", "display_name": "Maya R.", "shared_interests": ["mindfulness", "lo-fi"], "connected_since": "2026-08-10"}
    ]

@router.post("/connect/{user_id}")
def send_connection_request(user_id: str, current_user: str = Depends(get_current_user_id)):
    return {"message": f"Connection request sent to user {user_id}", "status": "pending"}
