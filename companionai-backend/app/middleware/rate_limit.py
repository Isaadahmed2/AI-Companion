import time
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.config import settings

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 120, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.client_records = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Exclude docs and health checks from rate limiting
        if request.url.path in ["/", "/health", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean up timestamps outside window
        window_start = now - self.window_seconds
        self.client_records[client_ip] = [
            ts for ts in self.client_records[client_ip] if ts > window_start
        ]

        if len(self.client_records[client_ip]) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Rate limit exceeded. Please wait before making more requests.",
                    "retry_after_seconds": self.window_seconds
                },
                headers={"Retry-After": str(self.window_seconds)}
            )

        self.client_records[client_ip].append(now)
        return await call_next(request)
