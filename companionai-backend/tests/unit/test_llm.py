import pytest
from app.services.llm_service import LLMService

@pytest.mark.asyncio
async def test_llm_fallback_empathy():
    service = LLMService()
    # Test fallback method explicitly
    fallback = service._get_fallback_response(
        emotion="sadness",
        mood_level=3,
        user_message="I'm feeling down and lonely"
    )
    assert len(fallback) > 10
    assert "valid" in fallback or "here" in fallback or "grace" in fallback

    # Test generation pipeline
    response = await service.generate_empathetic_response(
        user_message="I'm feeling down and lonely",
        detected_emotion="sadness",
        mood_level=3
    )
    assert isinstance(response, str)
    assert len(response) > 10
