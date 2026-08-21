from sqlalchemy import Column, String, Float, ForeignKey, Date
from app.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(50), primary_key=True)

    business_id = Column(
        String(50),
        ForeignKey("businesses.id"),
        nullable=False,
    )

    customer_id = Column(
        String(50),
        ForeignKey("customers.id"),
        nullable=False,
    )

    customer = Column(String(255), nullable=True)

    amount = Column(Float, nullable=False, default=0)

    invoice_date = Column(Date, nullable=False)

    due_date = Column(Date, nullable=False)

    status = Column(
        String(50),
        nullable=False,
        default="Pending",
    )

    payment_date = Column(Date, nullable=True)

    source = Column(
        String(50),
        nullable=False,
        default="manual",
    )