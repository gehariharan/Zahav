import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.database import Base, get_db
from app.models.user import User
from app.utils.auth import get_password_hash

# Test database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create test database engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Create test session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override dependencies
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db():
    """Get a fresh database session for testing."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client():
    """Get a test client for the app."""
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="function")
def test_user(db):
    """Create a test user."""
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("password123"),
        company_name="Test Company",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def admin_user(db):
    """Create an admin user."""
    user = User(
        email="admin@example.com",
        username="adminuser",
        hashed_password=get_password_hash("admin123"),
        company_name="Admin Company",
        is_admin=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_user_token(client, test_user):
    """Get a token for the test user."""
    response = client.post(
        "/auth/token",
        data={"username": test_user.username, "password": "password123"},
    )
    return response.json()["access_token"]


@pytest.fixture(scope="function")
def admin_token(client, admin_user):
    """Get a token for the admin user."""
    response = client.post(
        "/auth/token",
        data={"username": admin_user.username, "password": "admin123"},
    )
    return response.json()["access_token"]
