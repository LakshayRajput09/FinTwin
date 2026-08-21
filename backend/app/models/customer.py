from sqlalchemy import Column, String, ForeignKey
from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(50), primary_key=True)

    business_id = Column(
        String(50),
        ForeignKey("businesses.id"),
        nullable=False,
    )

    name = Column(String(255), nullable=False)

    industry = Column(String(100), nullable=True)