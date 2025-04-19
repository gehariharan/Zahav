# Zahav Architecture Overview

This document provides a high-level overview of the Zahav platform architecture, designed to help developers understand the system structure and components.

## System Architecture

Zahav follows a modern, microservices-inspired architecture with a clear separation between frontend and backend components.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Web Frontend   │◄───►│  Backend API    │◄───►│   Database      │
│  (React)        │     │  (FastAPI)      │     │   (SQLite/      │
│                 │     │                 │     │    PostgreSQL)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              │
                              ▼
                        ┌─────────────────┐
                        │                 │
                        │  External APIs  │
                        │  (Price Data,   │
                        │   Shipping, etc)│
                        │                 │
                        └─────────────────┘
```

## Key Components

### Frontend (React)

The frontend is a single-page application built with React, providing a responsive and interactive user interface.

**Key Technologies:**
- React for UI components
- React Router for navigation
- Context API for state management
- Axios for API communication
- Chart.js for data visualization

**Main Components:**
- Authentication system
- Dashboard views
- Booking system
- Rate alerts
- Tracking system
- Dealer tools
- User profile management

### Backend API (FastAPI)

The backend is a RESTful API built with FastAPI, providing data and business logic services to the frontend.

**Key Technologies:**
- FastAPI for API endpoints
- SQLAlchemy for ORM
- Pydantic for data validation
- JWT for authentication
- Alembic for database migrations

**Main Components:**
- Authentication and authorization
- User management
- Price data management
- Booking system
- Alert system
- Tracking system
- Dealer tools

### Database

The system uses a relational database to store all application data.

**Development:** SQLite
**Production:** PostgreSQL

**Main Entities:**
- Users
- Prices
- Bookings
- Alerts
- Shipments
- Transactions

### External Integrations

The system integrates with several external services:

- **Price Data Providers**: Real-time and historical metal prices
- **Shipping APIs**: Tracking information for shipments
- **Payment Gateways**: Processing transactions
- **Notification Services**: Email, SMS, and push notifications

## Data Flow

### Authentication Flow

1. User submits credentials
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token
5. Frontend includes token in subsequent requests

### Booking Flow

1. User creates booking request
2. Frontend sends request to backend
3. Backend validates request
4. Backend creates booking record
5. Backend returns booking confirmation
6. Frontend displays confirmation to user

### Price Alert Flow

1. User creates price alert
2. Backend stores alert parameters
3. Backend periodically checks current prices
4. When price condition is met, backend triggers notification
5. User receives notification via selected channels

## Security Architecture

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Token expiration and refresh mechanism

### API Security

- HTTPS encryption
- CORS configuration
- Rate limiting
- Input validation

### Data Protection

- Sensitive data encryption
- Database access controls
- Regular security audits

## Deployment Architecture

### Development Environment

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Frontend       │◄───►│  Backend        │
│  (localhost:3000)│     │ (localhost:8000)│
│                 │     │                 │
└─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │                 │
                        │  SQLite DB      │
                        │                 │
                        └─────────────────┘
```

### Production Environment

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Load Balancer  │◄───►│  Web Servers    │◄───►│  API Servers    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                       │
                                                       ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │  PostgreSQL DB  │
                                                │                 │
                                                └─────────────────┘
```

## Performance Considerations

- Frontend bundle optimization
- API response caching
- Database query optimization
- Connection pooling
- Horizontal scaling capability

## Monitoring and Logging

- Application logs
- Performance metrics
- Error tracking
- User activity monitoring
- System health checks

## Future Architecture Considerations

- Microservices architecture
- Event-driven communication
- Real-time updates with WebSockets
- Mobile application integration
- Advanced analytics and reporting

## Diagrams

For detailed architecture diagrams, please refer to the following files:

- [System Context Diagram](./context-diagram.md)
- [Component Diagram](./component-diagram.md)
- [Data Model Diagram](./data-model.md)
- [Deployment Diagram](./deployment-diagram.md)

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [JWT Authentication](https://jwt.io/introduction/)
