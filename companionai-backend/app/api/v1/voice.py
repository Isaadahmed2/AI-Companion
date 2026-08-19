from fastapi import APIRouter, Depends, HTTPException, Request, Response
from app.services.voice_service import VoiceService
from app.security import get_current_user_id, get_optional_user_id
from app.database import get_db
from app.models.user import User
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter(prefix="/voice", tags=["Voice Interaction"])
voice_service = VoiceService()

class WebRTCCallRequest(BaseModel):
    sdp: str
    model: Optional[str] = None
    voice: Optional[str] = "shimmer"

class VoiceUploadRequest(BaseModel):
    audio_base64: str

@router.get("/voices")
async def get_voices():
    """Get list of available empathetic companion voice personas"""
    return {
        "voices": voice_service.get_available_voices(),
        "default": "shimmer"
    }

@router.get("/session-config")
async def get_session_config(
    user_id: Optional[str] = Depends(get_optional_user_id),
    db: Session = Depends(get_db)
):
    """Get customized empathetic wellness instructions and configuration"""
    user_name = None
    if user_id:
        from app.utils import to_uuid
        uid = to_uuid(user_id)
        user = db.query(User).filter(User.id == uid).first()
        if user:
            user_name = user.display_name

    instructions = voice_service.get_system_instructions(user_name=user_name)
    return {
        "model": voice_service.model,
        "instructions": instructions,
        "voices": voice_service.get_available_voices(),
        "default_voice": "shimmer"
    }

@router.post("/calls")
async def handle_webrtc_call(
    request: Request,
    user_id: Optional[str] = Depends(get_optional_user_id)
):
    """
    WebRTC SDP Exchange Endpoint.
    Accepts client SDP offer (either as raw text/plain or JSON body) and returns OpenAI SDP answer.
    """
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            body = await request.json()
            sdp_offer = body.get("sdp")
            model = body.get("model")
        else:
            raw_body = await request.body()
            sdp_offer = raw_body.decode("utf-8")
            model = None

        if not sdp_offer or not sdp_offer.strip():
            raise HTTPException(status_code=400, detail="Missing WebRTC SDP offer from microphone.")

        result = await voice_service.exchange_webrtc_sdp(sdp_offer=sdp_offer, model=model)
        
        # Return SDP answer directly as text/plain or application/sdp
        if "application/json" in content_type:
            return result
        else:
            return Response(content=result["sdp"], media_type="application/sdp")

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"WebRTC exchange failed: {e}", exc_info=True)
        raise HTTPException(status_code=502, detail=f"Voice connection failed: {str(e)}")

@router.post("/init-session")
async def init_voice_session(user_id: Optional[str] = Depends(get_current_user_id)):
    session_data = await voice_service.get_realtime_session_token()
    return session_data

@router.get("/stream-token")
async def get_stream_token(user_id: Optional[str] = Depends(get_current_user_id)):
    session_data = await voice_service.get_realtime_session_token()
    return session_data

@router.post("/upload")
async def upload_voice_recording(req: VoiceUploadRequest, user_id: Optional[str] = Depends(get_current_user_id)):
    return {
        "transcript": "I felt a bit overwhelmed with work today, but looking forward to resting.",
        "detected_emotion": "anxiety",
        "mood_level": 4
    }
