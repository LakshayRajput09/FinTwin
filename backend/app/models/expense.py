from sqlalchemy import Column, String, Float, Boolean, ForeignKey, Date
from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String(50), primary_key=True)

    business_id = Column(
        String(50),
        ForeignKey("businesses.id"),
        nullable=False,
    )

    category = Column(String(100), nullable=False)

    description = Column(String(255), nullable=True)

    amount = Column(Float, nullable=False, default=0)

    date = Column(Date, nullable=False)

    recurring = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    source = Column(
        String(50),
        nullable=False,
        default="manual",
    )