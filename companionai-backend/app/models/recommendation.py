from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey, Uuid
from datetime import datetime
import uuid
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False, index=True)
    mood_log_id = Column(Uuid, nullable=True)
    activity_id = Column(Uuid, ForeignKey("activities.id"), nullable=False)
    reason = Column(Text, nullable=True)
    relevance_score = Column(Float, default=1.0)
    clicked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
