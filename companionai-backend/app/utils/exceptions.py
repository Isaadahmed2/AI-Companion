from fastapi import HTTPException, status
from typing import Optional, Any, Dict

class CompanionAPIException(HTTPException):
    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail: str = "An unexpected error occurred",
        headers: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)

class AuthenticationError(CompanionAPIException):
    def __init__(self, detail: str = "Invalid authentication credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"}
        )

class ResourceNotFoundError(CompanionAPIException):
    def __init__(self, resource: str = "Resource", identifier: Optional[str] = None):
        msg = f"{resource} not found" if not identifier else f"{resource} with id '{identifier}' not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=msg)

class ValidationError(CompanionAPIException):
    def __init__(self, detail: str = "Invalid input data provided"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

class RateLimitExceededError(CompanionAPIException):
    def __init__(self, detail: str = "Too many requests. Please slow down."):
        super().__init__(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)

class ExternalServiceError(CompanionAPIException):
    def __init__(self, service_name: str, detail: Optional[str] = None):
        msg = f"External service failure: {service_name}" if not detail else f"{service_name}: {detail}"
        super().__init__(status_code=status.HTTP_502_BAD_GATEWAY, detail=msg)
