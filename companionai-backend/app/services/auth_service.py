from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.user import User, NotificationPreference
from app.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.database import supabase
import uuid

class AuthService:
    def create_user(self, db: Session, email: str, password: Optional[str] = None, display_name: Optional[str] = None, interests: list = None) -> User:
        user = User(
            id=uuid.uuid4(),
            email=email.lower().strip(),
            password_hash=get_password_hash(password) if password else None,
            display_name=display_name or email.split("@")[0],
            interests=interests or []
        )
        db.add(user)
        # Add default notification preferences
        pref = NotificationPreference(
            user_id=user.id,
            daily_checkin=True,
            motivational_messages=True,
            activity_reminders=True
        )
        db.add(pref)
        db.commit()
        db.refresh(user)
        return user

    def authenticate(self, db: Session, email: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.email == email.lower().strip()).first()
        if not user or not user.password_hash:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    def generate_auth_tokens(self, user: User) -> Dict[str, Any]:
        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "display_name": user.display_name,
                "interests": user.interests or [],
                "onboarding_completed": user.onboarding_completed
            }
        }
