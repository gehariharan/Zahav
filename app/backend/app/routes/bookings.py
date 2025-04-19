from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.utils.auth import get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
    responses={401: {"description": "Unauthorized"}},
)


class BookingBase(BaseModel):
    metal_type: str
    purity: str
    quantity: float
    unit: str
    price_per_unit: float
    currency: str
    total_amount: float
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


@router.post("/", response_model=BookingResponse, status_code=201)
async def create_booking(
    booking: BookingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Create a new booking."""
    new_booking = Booking(
        user_id=current_user.id,
        metal_type=booking.metal_type,
        purity=booking.purity,
        quantity=booking.quantity,
        unit=booking.unit,
        price_per_unit=booking.price_per_unit,
        currency=booking.currency,
        total_amount=booking.total_amount,
        notes=booking.notes,
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking


@router.get("/", response_model=List[BookingResponse])
async def get_user_bookings(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get bookings for the current user."""
    query = db.query(Booking).filter(Booking.user_id == current_user.id)
    
    if status:
        query = query.filter(Booking.status == status)
    
    bookings = query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()
    return bookings


@router.get("/all", response_model=List[BookingResponse], dependencies=[Depends(get_current_admin_user)])
async def get_all_bookings(
    status: Optional[str] = None,
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get all bookings (admin only)."""
    query = db.query(Booking)
    
    if status:
        query = query.filter(Booking.status == status)
    
    if user_id:
        query = query.filter(Booking.user_id == user_id)
    
    bookings = query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()
    return bookings


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int = Path(..., title="The ID of the booking to get"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get a specific booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if the booking belongs to the current user or user is admin
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to access this booking")
    
    return booking


@router.patch("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_update: BookingUpdate,
    booking_id: int = Path(..., title="The ID of the booking to update"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update a booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Regular users can only update their own bookings, and only if status is pending
    if not current_user.is_admin:
        if booking.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this booking")
        
        if booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=400, 
                detail="Booking cannot be updated because it's not in pending status"
            )
        
        # Regular users can only update notes
        if booking_update.status is not None:
            raise HTTPException(
                status_code=403, 
                detail="Regular users can only update booking notes"
            )
    
    # Update fields
    if booking_update.status is not None:
        booking.status = booking_update.status
    
    if booking_update.notes is not None:
        booking.notes = booking_update.notes
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    return booking


@router.delete("/{booking_id}", status_code=204)
async def cancel_booking(
    booking_id: int = Path(..., title="The ID of the booking to cancel"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Cancel a booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Regular users can only cancel their own bookings, and only if status is pending
    if not current_user.is_admin:
        if booking.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
        
        if booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=400, 
                detail="Booking cannot be cancelled because it's not in pending status"
            )
    
    # Update status to cancelled
    booking.status = BookingStatus.CANCELLED
    
    db.add(booking)
    db.commit()
    
    return None
