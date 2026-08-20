from sqlalchemy import Column, String, Boolean, Date, DateTime, Text, ForeignKey, Uuid
from datetime import datetime, date
import uuid
from app.database import Base

class DailyGoal(Base):
    __tablename__ = "daily_goals"
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, nullable=False, index=True)
    goal_text = Column(Text, nullable=False)
    category = Column(String(50), default="general")
    completed = Column(Boolean, default=False)
    created_at = Column(Date, default=date.today)
    completed_at = Column(DateTime, nullable=True)
