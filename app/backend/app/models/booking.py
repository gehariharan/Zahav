from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base


class BookingStatus(str, enum.Enum):
    """Enum for booking status."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Booking(Base):
    """Booking model for gold/silver orders."""

    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metal_type = Column(String, nullable=False)
    purity = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)  # In grams or ounces
    unit = Column(String, nullable=False)  # "g", "oz", etc.
    price_per_unit = Column(Float, nullable=False)
    currency = Column(String, nullable=False)  # "INR", "USD", etc.
    total_amount = Column(Float, nullable=False)
    status = Column(String, default=BookingStatus.PENDING, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="bookings")
