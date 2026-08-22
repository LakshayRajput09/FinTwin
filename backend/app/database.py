import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================
load_dotenv()

# ==========================================
# DATABASE URL (WITH RESILIENT FALLBACK)
# ==========================================
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Safe SQLite local fallback if PostgreSQL environment variable is not provided
    DATABASE_URL = "sqlite:///./fintwin.db"

# SQLAlchemy 2.0 requires postgresql:// instead of postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# ==========================================
# DATABASE ENGINE
# ==========================================
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True if not DATABASE_URL.startswith("sqlite") else False,
)

# ==========================================
# DATABASE SESSION
# ==========================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ==========================================
# BASE MODEL
# ==========================================
Base = declarative_base()

# ==========================================
# DATABASE DEPENDENCY
# ==========================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.models import (
        Business,
        Customer,
        Invoice,
        Payment,
        Expense,
        RecurringExpense,
    )
    Base.metadata.create_all(bind=engine)