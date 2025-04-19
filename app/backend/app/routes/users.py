from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.user import User
from app.utils.auth import get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={401: {"description": "Unauthorized"}},
)


class UserBase(BaseModel):
    email: str
    username: str
    company_name: Optional[str] = None
    is_active: bool = True


class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user profile."""
    return current_user


@router.get("/", response_model=List[UserResponse], dependencies=[Depends(get_current_admin_user)])
async def read_users(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Get all users (admin only)."""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_admin_user)])
async def read_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


class UserUpdate(BaseModel):
    email: Optional[str] = None
    company_name: Optional[str] = None


@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update current user profile."""
    # Update fields if provided
    if user_update.email is not None:
        # Check if email already exists
        existing_email = db.query(User).filter(User.email == user_update.email).first()
        if existing_email and existing_email.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        current_user.email = user_update.email
    
    if user_update.company_name is not None:
        current_user.company_name = user_update.company_name

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user
