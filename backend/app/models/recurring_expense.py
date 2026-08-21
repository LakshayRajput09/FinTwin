from sqlalchemy import Column, String, Float, ForeignKey, Integer
from app.database import Base


class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"

    id = Column(String(50), primary_key=True)

    business_id = Column(
        String(50),
        ForeignKey("businesses.id"),
        nullable=False,
    )

    category = Column(String(100), nullable=False)

    description = Column(String(255), nullable=True)

    amount = Column(Float, nullable=False, default=0)

    frequency = Column(
        String(50),
        nullable=False,
        default="monthly",
    )

    day_of_month = Column(
        Integer,
        nullable=True,
    )

    source = Column(
        String(50),
        nullable=False,
        default="manual",
    )