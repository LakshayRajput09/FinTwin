from sqlalchemy import Column, String, Float
from app.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id = Column(String(50), primary_key=True)

    name = Column(String(255), nullable=False)

    industry = Column(String(100), nullable=True)

    gstin = Column(String(50), nullable=True)

    currency = Column(String(10), nullable=False, default="INR")

    opening_cash = Column(Float, nullable=False, default=0)

    monthly_revenue = Column(Float, nullable=False, default=0)

    monthly_expenses = Column(Float, nullable=False, default=0)