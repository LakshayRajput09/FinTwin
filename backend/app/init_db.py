from app.database import Base, engine

# Import all models so SQLAlchemy knows about them
from app.models import (
    Business,
    Customer,
    Invoice,
    Payment,
    Expense,
    RecurringExpense,
)


def init_database():
    print("Creating FinTwin database tables...")

    Base.metadata.create_all(bind=engine)

    print("Database tables created successfully.")


if __name__ == "__main__":
    init_database()