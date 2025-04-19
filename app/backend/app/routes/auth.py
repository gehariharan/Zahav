from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.utils.auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from pydantic import BaseModel

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={401: {"description": "Unauthorized"}},
)


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    company_name: Optional[str] = None


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Login and get JWT token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_create.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if username already exists
    existing_username = db.query(User).filter(User.username == user_create.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create new user
    hashed_password = get_password_hash(user_create.password)
    user = User(
        email=user_create.email,
        username=user_create.username,
        hashed_password=hashed_password,
        company_name=user_create.company_name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}
