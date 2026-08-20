import pytest
from fastapi.testclient import TestClient

def test_submit_mood_checkin(client: TestClient, auth_headers: dict):
    payload = {
        "mood_level": 7,
        "message": "Had a wonderful morning walk and feeling very calm",
        "voice_input": False
    }
    response = client.post("/api/v1/moods/checkin", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert "mood_log_id" in data
    assert data["mood_level"] == 7
    assert data["detected_emotion"] in ["joy", "calm", "neutral"]
    assert "ai_response" in data
    assert "recommendations" in data

def test_get_mood_trends(client: TestClient, auth_headers: dict):
    response = client.get("/api/v1/moods/trends", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_recommendations(client: TestClient, auth_headers: dict):
    response = client.get("/api/v1/recommendations/?emotion=anxiety", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
