from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.notification_service import NotificationService
from app.models.schema import NotificationPreferenceUpdate
from app.security import get_current_user_id

router = APIRouter(prefix="/notifications", tags=["Notifications"])
notif_service = NotificationService()

@router.get("/")
def get_notifications(user_id: str = Depends(get_current_user_id)):
    return [
        {"id": "notif-1", "title": "Time for your afternoon check-in", "body": "How is your energy level right now?", "read": False, "created_at": "2026-08-19T14:00:00Z"},
        {"id": "notif-2", "title": "New Recommendation", "body": "A relaxing nature track was added for you.", "read": True, "created_at": "2026-08-18T18:30:00Z"}
    ]

@router.post("/{id}/read")
def mark_read(id: str, user_id: str = Depends(get_current_user_id)):
    return {"message": "Notification marked as read", "notification_id": id}

@router.get("/preferences")
def get_preferences(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return notif_service.get_preferences(db, user_id)

@router.put("/preferences")
def update_preferences(req: NotificationPreferenceUpdate, user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return notif_service.update_preferences(db, user_id, req.dict(exclude_unset=True))
