from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.user import User, UserConnection
from app.utils import to_uuid

class SocialService:
    def get_matched_users(self, db: Session, user_id: str) -> List[Dict[str, Any]]:
        uid = to_uuid(user_id)
        # Fetch current user
        user = db.query(User).filter(User.id == uid).first()
        user_interests = set(user.interests or []) if user else set()

        other_users = db.query(User).filter(User.id != uid).limit(10).all()
        matches = []
        for other in other_users:
            other_interests = set(other.interests or [])
            shared = list(user_interests.intersection(other_interests))
            matches.append({
                "user_id": str(other.id),
                "display_name": other.display_name or "Wellness Explorer",
                "avatar_url": other.avatar_url,
                "shared_interests": shared,
                "compatibility_score": round(len(shared) / max(len(user_interests | other_interests), 1), 2)
            })
        return matches

    def get_clubs(self) -> List[Dict[str, Any]]:
        return [
            {"id": "club-1", "name": "Mindful Morning Meditators", "category": "mindfulness", "members_count": 142},
            {"id": "club-2", "name": "Lo-Fi & Study Sanctuary", "category": "music", "members_count": 310},
            {"id": "club-3", "name": "Gratitude & Positivity Circle", "category": "inspiration", "members_count": 215},
            {"id": "club-4", "name": "Creative Journalers Club", "category": "journaling", "members_count": 98}
        ]
