from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.moods import router as moods_router
from app.api.v1.ai import router as ai_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.activities import router as activities_router
from app.api.v1.goals import router as goals_router
from app.api.v1.voice import router as voice_router
from app.api.v1.social import router as social_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.analytics import router as analytics_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(moods_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(recommendations_router)
api_v1_router.include_router(activities_router)
api_v1_router.include_router(goals_router)
api_v1_router.include_router(voice_router)
api_v1_router.include_router(social_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(analytics_router)
