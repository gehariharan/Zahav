from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.alert import PriceAlert, AlertType, AlertCondition
from app.models.user import User
from app.utils.auth import get_current_active_user

router = APIRouter(
    prefix="/alerts",
    tags=["alerts"],
    responses={401: {"description": "Unauthorized"}},
)


class AlertBase(BaseModel):
    metal_type: str
    purity: str
    currency: str
    alert_type: str  # "price_target" or "percent_change"
    target_value: float  # Price or percentage
    condition: str  # "above" or "below"


class AlertCreate(AlertBase):
    pass


class AlertUpdate(BaseModel):
    target_value: Optional[float] = None
    condition: Optional[str] = None
    is_active: Optional[bool] = None


class AlertResponse(AlertBase):
    id: int
    user_id: int
    is_active: bool
    is_triggered: bool
    triggered_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


@router.post("/", response_model=AlertResponse, status_code=201)
async def create_alert(
    alert: AlertCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Create a new price alert."""
    # Validate alert_type
    if alert.alert_type not in [at.value for at in AlertType]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid alert type. Must be one of: {', '.join([at.value for at in AlertType])}"
        )

    # Validate condition
    if alert.condition not in [ac.value for ac in AlertCondition]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid condition. Must be one of: {', '.join([ac.value for ac in AlertCondition])}"
        )

    new_alert = PriceAlert(
        user_id=current_user.id,
        metal_type=alert.metal_type,
        purity=alert.purity,
        currency=alert.currency,
        alert_type=alert.alert_type,
        target_value=alert.target_value,
        condition=alert.condition,
    )

    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    return new_alert


@router.get("/", response_model=List[AlertResponse])
async def get_user_alerts(
    is_active: Optional[bool] = None,
    is_triggered: Optional[bool] = None,
    metal_type: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get alerts for the current user."""
    query = db.query(PriceAlert).filter(PriceAlert.user_id == current_user.id)

    if is_active is not None:
        query = query.filter(PriceAlert.is_active == is_active)

    if is_triggered is not None:
        query = query.filter(PriceAlert.is_triggered == is_triggered)

    if metal_type:
        query = query.filter(PriceAlert.metal_type == metal_type)

    alerts = query.order_by(PriceAlert.created_at.desc()).all()
    return alerts


@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(
    alert_id: int = Path(..., title="The ID of the alert to get"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get a specific price alert."""
    alert = db.query(PriceAlert).filter(PriceAlert.id == alert_id).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    # Check if the alert belongs to the current user
    if alert.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this alert")

    return alert


@router.patch("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_update: AlertUpdate,
    alert_id: int = Path(..., title="The ID of the alert to update"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update a price alert."""
    alert = db.query(PriceAlert).filter(PriceAlert.id == alert_id).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    # Check if the alert belongs to the current user
    if alert.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this alert")

    # Validate condition if provided
    if alert_update.condition is not None:
        if alert_update.condition not in [ac.value for ac in AlertCondition]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid condition. Must be one of: {', '.join([ac.value for ac in AlertCondition])}"
            )

    # Update fields if provided
    if alert_update.target_value is not None:
        alert.target_value = alert_update.target_value

    if alert_update.condition is not None:
        alert.condition = alert_update.condition

    if alert_update.is_active is not None:
        alert.is_active = alert_update.is_active

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


@router.delete("/{alert_id}", status_code=204)
async def delete_alert(
    alert_id: int = Path(..., title="The ID of the alert to delete"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Delete a price alert."""
    alert = db.query(PriceAlert).filter(PriceAlert.id == alert_id).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    # Check if the alert belongs to the current user
    if alert.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this alert")

    db.delete(alert)
    db.commit()

    return None
