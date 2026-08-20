from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from app.config import settings
from supabase import create_client, Client
import logging

logger = logging.getLogger(__name__)

# SQLAlchemy setup
try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True
    )
    with engine.connect() as conn:
        pass
    logger.info("Connected to PostgreSQL database successfully.")
except Exception as e:
    logger.warning(f"PostgreSQL connection unavailable ({e}). Using local SQLite fallback.")
    engine = create_engine("sqlite:///./companionai.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Supabase Client
supabase = None
try:
    from supabase import create_client, Client
    if settings.SUPABASE_URL and settings.SUPABASE_KEY and "your-project" not in settings.SUPABASE_URL:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
except Exception as e:
    logger.warning(f"Supabase client not initialized: {e}")
