from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.database import Base


class AlertType(str, enum.Enum):
    """Enum for alert types."""
    PRICE_TARGET = "price_target"
    PERCENT_CHANGE = "percent_change"


class AlertCondition(str, enum.Enum):
    """Enum for alert conditions."""
    ABOVE = "above"
    BELOW = "below"


class PriceAlert(Base):
    """Price alert model for notifications."""

    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metal_type = Column(String, nullable=False)
    purity = Column(String, nullable=False)
    currency = Column(String, nullable=False)
    alert_type = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)  # Price or percentage
    condition = Column(String, nullable=False)  # "above" or "below"
    is_active = Column(Boolean, default=True)
    is_triggered = Column(Boolean, default=False)
    triggered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="price_alerts")
