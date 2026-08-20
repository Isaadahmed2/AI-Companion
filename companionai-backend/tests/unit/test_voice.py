import pytest
from app.services.voice_service import VoiceService

def test_voice_service_voices():
    svc = VoiceService()
    voices = svc.get_available_voices()
    assert len(voices) >= 6
    voice_ids = [v["id"] for v in voices]
    assert "shimmer" in voice_ids
    assert "sage" in voice_ids

def test_voice_service_instructions():
    svc = VoiceService()
    instructions = svc.get_system_instructions(user_name="Saad", current_mood=8)
    assert "CompanionAI" in instructions
    assert "Saad" in instructions
    assert "8/10" in instructions
