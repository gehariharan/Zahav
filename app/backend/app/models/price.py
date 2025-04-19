from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class MetalType(str, enum.Enum):
    """Enum for metal types."""
    GOLD = "gold"
    SILVER = "silver"
    PLATINUM = "platinum"
    PALLADIUM = "palladium"


class PriceRecord(Base):
    """Price record model for storing historical prices."""

    __tablename__ = "price_records"

    id = Column(Integer, primary_key=True, index=True)
    metal_type = Column(String, nullable=False)
    purity = Column(String, nullable=False)  # e.g., "999", "995"
    currency = Column(String, nullable=False)  # e.g., "INR", "USD"
    bid_price = Column(Float, nullable=False)
    ask_price = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Optional fields for tracking daily ranges
    day_high = Column(Float, nullable=True)
    day_low = Column(Float, nullable=True)


class CurrencyRate(Base):
    """Currency rate model for storing exchange rates."""

    __tablename__ = "currency_rates"

    id = Column(Integer, primary_key=True, index=True)
    from_currency = Column(String, nullable=False)
    to_currency = Column(String, nullable=False)
    rate = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
