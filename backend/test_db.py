import sys
from app.database import SessionLocal
from app.models.business import Business
try:
    db = SessionLocal()
    b = db.query(Business).first()
    print("Success:", b)
except Exception as e:
    print("Error:", e)
