from sqlalchemy import Column, String, Boolean, DateTime, JSON, Uuid
from datetime import datetime
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    display_name = Column(String(255), nullable=True)
    avatar_url = Column(String, nullable=True)
    language_preference = Column(String(10), default="en")
    interests = Column(JSON, default=list)
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class NotificationPreference(Base):
    __tablename__ = "notification_preferences"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False, index=True)
    daily_checkin = Column(Boolean, default=True)
    motivational_messages = Column(Boolean, default=True)
    activity_reminders = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserConnection(Base):
    __tablename__ = "user_connections"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False, index=True)
    connected_user_id = Column(Uuid, nullable=False, index=True)
    shared_interests = Column(JSON, default=list)
    status = Column(String(20), default="connected")
    connected_at = Column(DateTime, default=datetime.utcnow)
