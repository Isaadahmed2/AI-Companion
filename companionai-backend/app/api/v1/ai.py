from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.llm_service import LLMService
from app.security import get_current_user_id
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI Responses"])
llm_service = LLMService()

class DirectAIQuery(BaseModel):
    message: str
    emotion: str = "neutral"
    mood_level: int = 5

@router.post("/respond")
async def get_ai_response(req: DirectAIQuery, user_id: str = Depends(get_current_user_id)):
    response = await llm_service.generate_empathetic_response(
        user_message=req.message,
        detected_emotion=req.emotion,
        mood_level=req.mood_level
    )
    return {
        "response": response,
        "emotion_addressed": req.emotion,
        "model": "deepseek-chat"
    }

@router.get("/responses")
def get_response_history(user_id: str = Depends(get_current_user_id)):
    return []
