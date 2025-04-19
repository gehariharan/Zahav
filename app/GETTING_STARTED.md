# Zahav Gold Booking System - Getting Started

## Introduction

Zahav is a comprehensive platform for gold and bullion dealers with refinery capabilities. This document provides a guide for setting up and extending the application.

## Project Overview

The Zahav application consists of:

1. **Backend API** - A FastAPI application that provides data and business logic
2. **Frontend UI** - A React application that provides the user interface

## Features Implemented

### Backend
- User authentication (JWT-based)
- Database models for users, prices, bookings, and alerts
- API endpoints for core functionality
- SQLite database with sample data initialization

### Frontend
- Authentication flow (login/register)
- Dashboard with price cards
- Price dashboard with real-time updates
- Responsive UI design

## Directory Structure

```
zahav/
├── backend/
│   ├── app/
│   │   ├── db/           # Database configuration
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routes/       # API endpoints
│   │   ├── utils/        # Utility functions
│   │   └── main.py       # Application entry point
│   ├── migrations/       # Alembic migrations
│   ├── tests/            # Backend tests
│   ├── Dockerfile        # Docker configuration
│   ├── pyproject.toml    # Poetry dependencies
│   └── init_db.py        # Database initialization script
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── assets/       # Images and other assets
│   │   ├── components/   # Reusable React components
│   │   ├── context/      # React context providers
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service functions
│   │   ├── styles/       # CSS styles
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main application component
│   ├── tests/            # Frontend tests
│   ├── Dockerfile        # Docker configuration
│   └── package.json      # npm dependencies
│
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # Project documentation
```

## Setting Up for Development

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn
- Docker and Docker Compose (optional)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd app/backend
   ```

2. Install Poetry if you don't have it:
   ```
   pip install poetry
   ```

3. Install dependencies:
   ```
   poetry install
   ```

4. Activate the virtual environment:
   ```
   poetry shell
   ```

5. Initialize the database with sample data:
   ```
   python init_db.py
   ```

6. Run the development server:
   ```
   python run.py
   ```
   or
   ```
   uvicorn app.main:app --reload
   ```

7. Access the API documentation at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Access the application at http://localhost:3000

### Docker Setup (Alternative)

For a complete containerized environment:

1. Navigate to the project root:
   ```
   cd app
   ```

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. Initialize the database (first time only):
   ```
   docker-compose exec backend python init_db.py
   ```

4. Access the frontend at http://localhost:3000 and the API at http://localhost:8000

## Default User Accounts

After initializing the database, the following user accounts are available:

1. **Admin User**
   - Username: `admin`
   - Password: `admin123`
   - Role: Administrator

2. **Dealer User**
   - Username: `dealer`
   - Password: `dealer123`
   - Role: Regular user (dealer)

3. **Standard User**
   - Username: `user`
   - Password: `user123`
   - Role: Regular user

## Next Steps for Development

### Backend Tasks

1. **Complete unimplemented API endpoints:**
   - Implement booking confirmation and tracking
   - Add rate alert notification system
   - Create dealer tools APIs (calculators, converters)

2. **Extend authentication:**
   - Add password reset functionality
   - Implement email verification
   - Add two-factor authentication

3. **Performance and security:**
   - Add rate limiting
   - Implement caching for price data
   - Set up proper CORS configuration for production

### Frontend Tasks

1. **Implement remaining pages:**
   - Complete the booking system UI
   - Build rate alerts management page
   - Create dealer tools interfaces

2. **Enhance user experience:**
   - Add real-time price updates using WebSockets
   - Implement charting for historical prices
   - Create responsive mobile views

3. **QA and testing:**
   - Set up Playwright tests for critical flows
   - Implement accessibility features
   - Perform cross-browser testing

## Deployment Preparation

1. **Backend:**
   - Replace SQLite with PostgreSQL for production
   - Set up environment variables for sensitive data
   - Configure proper logging

2. **Frontend:**
   - Create production build with `npm run build`
   - Set up environment-specific configuration
   - Optimize assets for production

3. **Infrastructure:**
   - Set up CI/CD pipeline
   - Configure SSL certificates
   - Plan for database backups

## Troubleshooting

### Common Backend Issues

- **Database errors:** Ensure SQLite file permissions are correct
- **JWT issues:** Check the SECRET_KEY configuration
- **CORS errors:** Verify the frontend URL is in the allowed origins

### Common Frontend Issues

- **API connection errors:** Check the REACT_APP_API_URL environment variable
- **Authentication issues:** Clear localStorage and try logging in again
- **Build errors:** Ensure Node.js version is compatible (v16+)

## Support

For questions or support, please contact the development team.

Happy coding!
