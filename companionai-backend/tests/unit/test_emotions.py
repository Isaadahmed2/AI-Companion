import pytest
from app.services.emotion_service import EmotionDetectionService

@pytest.mark.asyncio
async def test_emotion_detection_anxiety():
    service = EmotionDetectionService()
    result = await service.detect_emotion("I feel anxious and overwhelmed by deadlines", mood_level=4)
    assert result["emotion"] == "anxiety"
    assert result["intensity"] >= 3

@pytest.mark.asyncio
async def test_emotion_detection_joy():
    service = EmotionDetectionService()
    result = await service.detect_emotion("I feel so joyful, happy and excited today!", mood_level=9)
    assert result["emotion"] == "joy"
    assert result["intensity"] >= 4

@pytest.mark.asyncio
async def test_topic_extraction():
    service = EmotionDetectionService()
    topics = await service.extract_topics("I have an important work meeting with my boss tomorrow")
    assert "work" in topics
