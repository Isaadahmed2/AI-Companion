import pytest
from fastapi.testclient import TestClient

def test_signup_and_login_flow(client: TestClient):
    # Test Signup
    signup_payload = {
        "email": "test_wellness_user@example.com",
        "password": "SecurePassword123!",
        "display_name": "Taylor Green",
        "interests": ["mindfulness", "lo-fi"]
    }
    signup_res = client.post("/api/v1/auth/signup", json=signup_payload)
    assert signup_res.status_code in [200, 201, 400]  # 400 if user exists from prior run

    # Test Login
    login_payload = {
        "email": "test_wellness_user@example.com",
        "password": "SecurePassword123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_health_check_endpoint(client: TestClient):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
