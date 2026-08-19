from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.api.v1 import api_v1_router
from app.database import Base, engine
from app.middleware import (
    StructuredLoggingMiddleware,
    RateLimitMiddleware,
    SupabaseAuthMiddleware
)
from app.utils.exceptions import CompanionAPIException

# Initialize database schema
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    logging.warning(f"Database init warning: {e}")

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("companionai")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
# CompanionAI Backend API

Production-ready backend for the CompanionAI Emotional Wellness Companion platform.

## Features
- **Empathetic Emotional Analysis**: Real-time sentiment, emotion categorization, and intensity scoring.
- **LangGraph Wellness Orchestrator**: Multi-step conversational reasoning with DeepSeek LLM.
- **Personalized Recommendations**: Emotion-aligned content across 6 wellness modules.
- **Supabase Integration**: Robust authentication and PostgreSQL persistence.
- **OpenAI Realtime Voice**: Ephemeral session initialization for real-time speech interaction.
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# 1. Structured Logging Middleware (Captures timing & request IDs)
app.add_middleware(StructuredLoggingMiddleware)

# 2. Rate Limiting Middleware (120 requests/minute)
app.add_middleware(
    RateLimitMiddleware,
    max_requests=settings.RATE_LIMIT_REQUESTS,
    window_seconds=settings.RATE_LIMIT_PERIOD
)

# 3. Supabase Auth State Extractor
app.add_middleware(SupabaseAuthMiddleware)

# 4. CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_v1_router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["Health Check"])
def health():
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.exception_handler(CompanionAPIException)
async def domain_exception_handler(request: Request, exc: CompanionAPIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred. Our engineering team has been notified."}
    )
