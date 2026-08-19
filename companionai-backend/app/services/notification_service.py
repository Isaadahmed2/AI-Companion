from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.user import NotificationPreference

class NotificationService:
    def get_preferences(self, db: Session, user_id: str) -> Dict[str, Any]:
        pref = db.query(NotificationPreference).filter(NotificationPreference.user_id == user_id).first()
        if not pref:
            return {"daily_checkin": True, "motivational_messages": True, "activity_reminders": True}
        return {
            "daily_checkin": pref.daily_checkin,
            "motivational_messages": pref.motivational_messages,
            "activity_reminders": pref.activity_reminders
        }

    def update_preferences(self, db: Session, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        pref = db.query(NotificationPreference).filter(NotificationPreference.user_id == user_id).first()
        if not pref:
            pref = NotificationPreference(user_id=user_id)
            db.add(pref)
        for k, v in updates.items():
            if v is not None and hasattr(pref, k):
                setattr(pref, k, v)
        db.commit()
        return self.get_preferences(db, user_id)
