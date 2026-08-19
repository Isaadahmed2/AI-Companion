from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class MoodLog(Base):
    __tablename__ = "mood_logs"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False, index=True)
    mood_level = Column(Integer, nullable=False)
    emotion = Column(String(50), nullable=True)
    intensity = Column(Integer, default=3)
    message = Column(Text, nullable=True)
    detected_topics = Column(JSON, default=list)
    detected_sentiment = Column(JSON, default=dict)
    voice_input = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    ai_responses = relationship("AIResponse", back_populates="mood_log", cascade="all, delete-orphan")

class AIResponse(Base):
    __tablename__ = "ai_responses"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    mood_log_id = Column(Uuid, ForeignKey("mood_logs.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Uuid, nullable=False, index=True)
    response_text = Column(Text, nullable=False)
    llm_model = Column(String(50), default="deepseek")
    confidence_score = Column(Float, default=0.9)
    emotion_addressed = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mood_log = relationship("MoodLog", back_populates="ai_responses")
