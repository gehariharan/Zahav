"""
Script to initialize the database with sample data
"""
import asyncio
import os
import sys
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

# Add the parent directory to sys.path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.price import PriceRecord, CurrencyRate
from app.models.booking import Booking, BookingStatus
from app.models.alert import PriceAlert, AlertType, AlertCondition
from app.utils.auth import get_password_hash


def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Add sample users if they don't exist
        if db.query(User).count() == 0:
            print("Creating sample users...")
            users = [
                User(
                    email="admin@zahav.com",
                    username="admin",
                    hashed_password=get_password_hash("admin123"),
                    company_name="Zahav Refinery",
                    is_active=True,
                    is_admin=True,
                ),
                User(
                    email="dealer@example.com",
                    username="dealer",
                    hashed_password=get_password_hash("dealer123"),
                    company_name="Example Bullion Traders",
                    is_active=True,
                ),
                User(
                    email="user@example.com",
                    username="user",
                    hashed_password=get_password_hash("user123"),
                    company_name="Sample Jewelry",
                    is_active=True,
                ),
            ]
            db.add_all(users)
            db.commit()
            print("Sample users created.")
        else:
            print("Users already exist, skipping...")
        
        # Add sample price data if it doesn't exist
        if db.query(PriceRecord).count() == 0:
            print("Creating sample price data...")
            now = datetime.utcnow()
            price_data = []
            
            # Gold prices
            price_data.append(
                PriceRecord(
                    metal_type="gold",
                    purity="999",
                    currency="INR",
                    bid_price=62425.0,
                    ask_price=62625.0,
                    day_high=62850.0,
                    day_low=62300.0,
                    timestamp=now,
                )
            )
            price_data.append(
                PriceRecord(
                    metal_type="gold",
                    purity="999",
                    currency="USD",
                    bid_price=2425.80,
                    ask_price=2428.50,
                    day_high=2435.20,
                    day_low=2415.50,
                    timestamp=now,
                )
            )
            
            # Silver prices
            price_data.append(
                PriceRecord(
                    metal_type="silver",
                    purity="999",
                    currency="INR",
                    bid_price=78250.0,
                    ask_price=78450.0,
                    day_high=78800.0,
                    day_low=78100.0,
                    timestamp=now,
                )
            )
            price_data.append(
                PriceRecord(
                    metal_type="silver",
                    purity="999",
                    currency="USD",
                    bid_price=30.25,
                    ask_price=30.45,
                    day_high=30.75,
                    day_low=30.15,
                    timestamp=now,
                )
            )
            
            # Previous day prices for history
            yesterday = now - timedelta(days=1)
            price_data.append(
                PriceRecord(
                    metal_type="gold",
                    purity="999",
                    currency="INR",
                    bid_price=62100.0,
                    ask_price=62300.0,
                    day_high=62500.0,
                    day_low=61900.0,
                    timestamp=yesterday,
                )
            )
            price_data.append(
                PriceRecord(
                    metal_type="gold",
                    purity="999",
                    currency="USD",
                    bid_price=2415.30,
                    ask_price=2418.10,
                    day_high=2425.00,
                    day_low=2410.20,
                    timestamp=yesterday,
                )
            )
            
            db.add_all(price_data)
            db.commit()
            print("Sample price data created.")
        else:
            print("Price data already exists, skipping...")
        
        # Add sample currency rates if they don't exist
        if db.query(CurrencyRate).count() == 0:
            print("Creating sample currency rates...")
            now = datetime.utcnow()
            currency_rates = [
                CurrencyRate(
                    from_currency="USD",
                    to_currency="INR",
                    rate=81.45,
                    timestamp=now,
                ),
                CurrencyRate(
                    from_currency="EUR",
                    to_currency="INR",
                    rate=88.25,
                    timestamp=now,
                ),
                CurrencyRate(
                    from_currency="GBP",
                    to_currency="INR",
                    rate=104.30,
                    timestamp=now,
                ),
                CurrencyRate(
                    from_currency="JPY",
                    to_currency="INR",
                    rate=0.61,
                    timestamp=now,
                ),
            ]
            db.add_all(currency_rates)
            db.commit()
            print("Sample currency rates created.")
        else:
            print("Currency rates already exist, skipping...")
        
        # Add sample bookings if they don't exist
        if db.query(Booking).count() == 0:
            print("Creating sample bookings...")
            user_id = db.query(User).filter(User.username == "dealer").first().id
            now = datetime.utcnow()
            yesterday = now - timedelta(days=1)
            
            bookings = [
                Booking(
                    user_id=user_id,
                    metal_type="gold",
                    purity="999",
                    quantity=100.0,
                    unit="g",
                    price_per_unit=62425.0,
                    currency="INR",
                    total_amount=6242500.0,
                    status=BookingStatus.COMPLETED,
                    notes="Standard delivery",
                    created_at=yesterday,
                ),
                Booking(
                    user_id=user_id,
                    metal_type="silver",
                    purity="999",
                    quantity=5.0,
                    unit="kg",
                    price_per_unit=78250.0,
                    currency="INR",
                    total_amount=391250.0,
                    status=BookingStatus.PENDING,
                    notes="Express delivery requested",
                    created_at=now,
                ),
            ]
            db.add_all(bookings)
            db.commit()
            print("Sample bookings created.")
        else:
            print("Bookings already exist, skipping...")
        
        # Add sample alerts if they don't exist
        if db.query(PriceAlert).count() == 0:
            print("Creating sample alerts...")
            user_id = db.query(User).filter(User.username == "dealer").first().id
            
            alerts = [
                PriceAlert(
                    user_id=user_id,
                    metal_type="gold",
                    purity="999",
                    currency="USD",
                    alert_type=AlertType.PRICE_TARGET,
                    target_value=2450.0,
                    condition=AlertCondition.ABOVE,
                    is_active=True,
                ),
                PriceAlert(
                    user_id=user_id,
                    metal_type="silver",
                    purity="999",
                    currency="USD",
                    alert_type=AlertType.PRICE_TARGET,
                    target_value=29.5,
                    condition=AlertCondition.BELOW,
                    is_active=True,
                ),
            ]
            db.add_all(alerts)
            db.commit()
            print("Sample alerts created.")
        else:
            print("Alerts already exist, skipping...")
        
        print("Database initialization completed successfully!")
    
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
