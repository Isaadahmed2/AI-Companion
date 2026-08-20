from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, JSON, ForeignKey, Uuid
from datetime import datetime
import uuid
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    category = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    content_url = Column(Text, nullable=True)
    extra_data = Column("metadata", JSON, default=dict)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserActivityLog(Base):
    __tablename__ = "user_activity_logs"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False, index=True)
    activity_id = Column(Uuid, ForeignKey("activities.id"), nullable=False, index=True)
    completed = Column(Boolean, default=False, index=True)
    duration_minutes = Column(Integer, default=0)
    rating = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
