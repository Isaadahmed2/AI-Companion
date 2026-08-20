from typing import Dict, Any, Optional, List
import httpx
import logging
import io
import base64
from app.config import settings

logger = logging.getLogger(__name__)

EMPATHETIC_SYSTEM_INSTRUCTIONS = """You are CompanionAI, a deeply empathetic, warm, soothing, and compassionate emotional wellness companion.
Your voice is calming, gentle, patient, and comforting.
Your primary mission is to help the user feel heard, emotionally regulated, comforted, and grounded.

Key conversational guidelines:
1. Speak in a soothing, reassuring, and gentle tone.
2. Validate feelings without judgment or toxic positivity.
3. Keep spoken replies natural, concise, and focused (1 to 3 sentences per turn) so it feels like a natural verbal dialogue.
4. If the user feels overwhelmed, anxious, or tired, gently invite them to take a slow, deep breath with you.
5. If the user asks for breathing exercises or relaxation, guide them through a gentle 4-4-4 or 4-7-8 breathing tempo.
6. Never lecture, output markdown code blocks, or read long bulleted lists over voice—speak warmly like a trusted, caring companion.
7. Celebrate little wins with genuine warmth."""

AVAILABLE_VOICES = [
    {
        "id": "shimmer",
        "name": "Shimmer",
        "gender": "Female",
        "vibe": "Gentle, soothing & empathetic (Recommended for Anxiety & Comfort)",
        "default": True
    },
    {
        "id": "sage",
        "name": "Sage",
        "gender": "Neutral",
        "vibe": "Calm, grounded & mindful (Recommended for Meditation & Focus)",
        "default": False
    },
    {
        "id": "alloy",
        "name": "Alloy",
        "gender": "Neutral",
        "vibe": "Warm, friendly & balanced",
        "default": False
    },
    {
        "id": "coral",
        "name": "Coral",
        "gender": "Female",
        "vibe": "Caring, bright & encouraging",
        "default": False
    },
    {
        "id": "verse",
        "name": "Verse",
        "gender": "Male",
        "vibe": "Reflective, steady & reassuring",
        "default": False
    },
    {
        "id": "echo",
        "name": "Echo",
        "gender": "Male",
        "vibe": "Deep, grounded & relaxing",
        "default": False
    }
]

CANDIDATE_MODELS = [
    "gpt-realtime-2.1",
    "gpt-realtime",
    "gpt-realtime-mini",
    "gpt-realtime-2.1-mini",
    "gpt-4o-realtime-preview-2024-12-17",
    "gpt-4o-mini-realtime-preview"
]

class VoiceService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_REALTIME_MODEL or "gpt-realtime-2.1"

    def get_available_voices(self) -> list:
        return AVAILABLE_VOICES

    def get_system_instructions(self, user_name: Optional[str] = None, current_mood: Optional[int] = None) -> str:
        instructions = EMPATHETIC_SYSTEM_INSTRUCTIONS
        if user_name:
            instructions += f"\nThe user's name is {user_name}. Use their name gently when appropriate."
        if current_mood:
            instructions += f"\nThe user's recent mood level is {current_mood}/10."
        return instructions

    async def exchange_webrtc_sdp(self, sdp_offer: str, model: Optional[str] = None) -> Dict[str, Any]:
        """
        Exchange WebRTC SDP offer with OpenAI Realtime API (/v1/realtime/calls)
        and return the SDP answer with smart model fallback.
        """
        if not self.api_key or self.api_key == "your-openai-api-key":
            raise ValueError("OPENAI_API_KEY is not configured in backend .env")

        # Build prioritized list of model candidates
        models_to_try: List[str] = []
        if model and model not in models_to_try:
            models_to_try.append(model)
        if self.model and self.model not in models_to_try:
            models_to_try.append(self.model)
        for m in CANDIDATE_MODELS:
            if m not in models_to_try:
                models_to_try.append(m)

        last_error = ""
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            for target_model in models_to_try:
                url = f"https://api.openai.com/v1/realtime/calls?model={target_model}"
                try:
                    logger.info(f"Connecting WebRTC SDP offer to OpenAI model: {target_model}")
                    response = await client.post(
                        url,
                        content=sdp_offer,
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/sdp"
                        }
                    )

                    if response.status_code in [200, 201]:
                        logger.info(f"WebRTC session established successfully with OpenAI model: {target_model}")
                        return {
                            "sdp": response.text,
                            "model": target_model,
                            "status": "connected"
                        }
                    
                    last_error = f"Model {target_model} returned {response.status_code}: {response.text}"
                    logger.warning(f"OpenAI Realtime WebRTC response: {last_error}")

                    # If model not found or forbidden, try next candidate model
                    if "model_not_found" in response.text or response.status_code in [404, 403]:
                        continue
                    else:
                        # Other error like invalid SDP
                        raise RuntimeError(f"OpenAI error: {response.text}")

                except httpx.RequestError as re:
                    last_error = str(re)
                    logger.error(f"Network error connecting to OpenAI Realtime: {re}")

        raise RuntimeError(f"Could not connect to OpenAI Realtime. Last error: {last_error}")

    async def transcribe_audio(self, audio_bytes: bytes, filename: str = "audio.webm", content_type: str = "audio/webm") -> Dict[str, Any]:
        """
        Transcribe voice audio using OpenAI Whisper Speech-to-Text model (whisper-1).
        """
        if not self.api_key or self.api_key == "your-openai-api-key":
            return {"transcript": "Microphone recording captured (STT API key required)."}

        url = "https://api.openai.com/v1/audio/transcriptions"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                files = {
                    "file": (filename, audio_bytes, content_type)
                }
                data = {
                    "model": "whisper-1",
                    "response_format": "verbose_json"
                }
                headers = {
                    "Authorization": f"Bearer {self.api_key}"
                }
                response = await client.post(url, headers=headers, files=files, data=data)
                if response.status_code == 200:
                    res_json = response.json()
                    transcript = res_json.get("text", "").strip()
                    language = res_json.get("language", "en")
                    duration = res_json.get("duration", 0)
                    return {
                        "transcript": transcript,
                        "language": language,
                        "duration": duration,
                        "model": "whisper-1"
                    }
                else:
                    logger.error(f"Whisper transcription failed ({response.status_code}): {response.text}")
                    # Try basic json response format fallback
                    data["response_format"] = "json"
                    retry_res = await client.post(url, headers=headers, files=files, data=data)
                    if retry_res.status_code == 200:
                        return {"transcript": retry_res.json().get("text", "").strip(), "model": "whisper-1"}
                    
                    return {"transcript": "", "error": f"STT failed: {response.text}"}

        except Exception as e:
            logger.error(f"Error during audio transcription: {e}")
            return {"transcript": "", "error": str(e)}

    async def get_realtime_session_token(self) -> Dict[str, Any]:
        """
        Return configuration metadata for Realtime voice session
        """
        return {
            "model": self.model,
            "voice": "shimmer",
            "instructions": EMPATHETIC_SYSTEM_INSTRUCTIONS,
            "voices": AVAILABLE_VOICES
        }
