import pytest
from app.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_token,
)

def test_password_hashing():
    plain = "WellnessSecret2026!"
    hashed = get_password_hash(plain)
    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_flow():
    user_id = "test-user-12345"
    token = create_access_token(user_id)
    assert token is not None
    
    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["type"] == "access"
