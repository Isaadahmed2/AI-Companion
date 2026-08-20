from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.security import decode_token

class SupabaseAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = decode_token(token)
                request.state.user_id = payload.get("sub")
            except Exception:
                request.state.user_id = None
        else:
            request.state.user_id = None

        return await call_next(request)
