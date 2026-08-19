import uuid
from typing import Any, Optional

from app.utils.exceptions import (
    CompanionAPIException,
    AuthenticationError,
    ResourceNotFoundError,
    ValidationError,
    RateLimitExceededError,
    ExternalServiceError,
)
from app.utils.constants import *

def to_uuid(val: Any) -> Optional[uuid.UUID]:
    if val is None:
        return None
    if isinstance(val, uuid.UUID):
        return val
    try:
        return uuid.UUID(str(val))
    except Exception:
        return val

__all__ = [
    "CompanionAPIException",
    "AuthenticationError",
    "ResourceNotFoundError",
    "ValidationError",
    "RateLimitExceededError",
    "ExternalServiceError",
    "to_uuid",
]
