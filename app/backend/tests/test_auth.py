import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User


def test_register_user(client: TestClient, db: Session):
    """Test user registration."""
    response = client.post(
        "/auth/register",
        json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "newpassword123",
            "company_name": "New Company",
        },
    )
    assert response.status_code == 201
    assert response.json() == {"message": "User registered successfully"}
    
    # Check that user was created in the database
    user = db.query(User).filter(User.username == "newuser").first()
    assert user is not None
    assert user.email == "newuser@example.com"
    assert user.company_name == "New Company"
    assert user.is_active is True
    assert user.is_admin is False


def test_register_duplicate_username(client: TestClient, test_user: User):
    """Test registration with duplicate username."""
    response = client.post(
        "/auth/register",
        json={
            "email": "another@example.com",
            "username": test_user.username,  # Duplicate username
            "password": "password123",
            "company_name": "Another Company",
        },
    )
    assert response.status_code == 400
    assert "Username already taken" in response.json()["detail"]


def test_register_duplicate_email(client: TestClient, test_user: User):
    """Test registration with duplicate email."""
    response = client.post(
        "/auth/register",
        json={
            "email": test_user.email,  # Duplicate email
            "username": "uniqueuser",
            "password": "password123",
            "company_name": "Another Company",
        },
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_login_success(client: TestClient, test_user: User):
    """Test successful login."""
    response = client.post(
        "/auth/token",
        data={"username": test_user.username, "password": "password123"},
    )
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"


def test_login_invalid_credentials(client: TestClient, test_user: User):
    """Test login with invalid credentials."""
    response = client.post(
        "/auth/token",
        data={"username": test_user.username, "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    """Test login with nonexistent user."""
    response = client.post(
        "/auth/token",
        data={"username": "nonexistentuser", "password": "password123"},
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]
