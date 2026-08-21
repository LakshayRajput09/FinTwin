from sqlalchemy import Column, String, Float, ForeignKey, Date
from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(50), primary_key=True)

    business_id = Column(
        String(50),
        ForeignKey("businesses.id"),
        nullable=False,
    )

    invoice_id = Column(
        String(50),
        nullable=True,
    )

    customer_id = Column(
        String(50),
        ForeignKey("customers.id"),
        nullable=True,
    )

    amount = Column(Float, nullable=False, default=0)

    expected_date = Column(Date, nullable=False)

    actual_date = Column(Date, nullable=False)

    days_delayed = Column(
        Float,
        nullable=False,
        default=0,
    )

    source = Column(
        String(50),
        nullable=False,
        default="manual",
    )