from fastapi import APIRouter, Depends, HTTPException, Request, Response, UploadFile, File
from app.services.voice_service import VoiceService
from app.security import get_current_user_id, get_optional_user_id
from app.database import get_db
from app.models.user import User
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging
import base64

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/voice", tags=["Voice Interaction"])
voice_service = VoiceService()

class WebRTCCallRequest(BaseModel):
    sdp: str
    model: Optional[str] = None
    voice: Optional[str] = "shimmer"

class VoiceUploadRequest(BaseModel):
    audio_base64: str
    filename: Optional[str] = "recording.webm"
    content_type: Optional[str] = "audio/webm"

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

@router.post("/transcribe")
async def transcribe_voice_audio(
    file: UploadFile = File(...),
    user_id: Optional[str] = Depends(get_optional_user_id)
):
    """
    Speech-to-Text Endpoint.
    Transcribes uploaded audio files (WebM, WAV, MP3, M4A) into text using OpenAI Whisper STT model.
    """
    try:
        audio_bytes = await file.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Audio file is empty.")
        
        content_type = file.content_type or "audio/webm"
        filename = file.filename or "recording.webm"
        
        result = await voice_service.transcribe_audio(
            audio_bytes=audio_bytes,
            filename=filename,
            content_type=content_type
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Transcription error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Speech transcription failed: {str(e)}")

@router.post("/upload")
async def upload_voice_recording(
    req: VoiceUploadRequest,
    user_id: Optional[str] = Depends(get_optional_user_id)
):
    """
    Base64 Voice Upload & Speech-to-Text Transcription.
    Decodes base64 voice audio from microphone and runs Whisper Speech-to-Text model.
    """
    try:
        # Strip data URL prefix if present (e.g., 'data:audio/webm;base64,...')
        b64_data = req.audio_base64
        if "," in b64_data:
            b64_data = b64_data.split(",", 1)[1]
            
        audio_bytes = base64.b64decode(b64_data)
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Decoded audio data is empty.")
            
        result = await voice_service.transcribe_audio(
            audio_bytes=audio_bytes,
            filename=req.filename or "recording.webm",
            content_type=req.content_type or "audio/webm"
        )
        return result
    except Exception as e:
        logger.error(f"Upload and transcribe error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Audio processing failed: {str(e)}")

@router.post("/init-session")
async def init_voice_session(user_id: Optional[str] = Depends(get_optional_user_id)):
    session_data = await voice_service.get_realtime_session_token()
    return session_data

@router.get("/stream-token")
async def get_stream_token(user_id: Optional[str] = Depends(get_optional_user_id)):
    session_data = await voice_service.get_realtime_session_token()
    return session_data
