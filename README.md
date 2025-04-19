# Zahav - Precious Metals Trading Platform

![Zahav Logo](pitch/assets/logo.png)

Zahav is a comprehensive platform for gold and bullion dealers with refinery capabilities. This application provides real-time price tracking, booking management, rate alerts, and various dealer tools to streamline precious metals trading operations.

## Features

### Dashboard
- Real-time price monitoring for gold, silver, platinum, and palladium
- Overview of recent bookings and active alerts
- Market news and updates

### Price Dashboard
- Detailed price cards for all precious metals
- Historical price charts and trends
- Currency conversion options

### Booking System
- Streamlined metal booking process
- Customizable order specifications
- Order tracking and management

### Rate Alerts
- Customizable price alerts for all metals
- Multiple notification methods (email, SMS, push)
- Alert history and management

### Tracking System
- Real-time shipment tracking
- Detailed timeline of order status
- Shipment history and reporting

### Dealer Tools
- Metal value calculator
- Premium calculator
- Margin analysis tools
- Current market spreads

### User Management
- Secure authentication system
- Customizable user profiles
- Activity logging and security features

## Project Structure

```
zahav/
├── app/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── db/           # Database configuration
│   │   │   ├── models/       # SQLAlchemy models
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── utils/        # Utility functions
│   │   │   └── main.py       # Application entry point
│   │   ├── migrations/       # Alembic migrations
│   │   ├── tests/            # Backend tests
│   │   ├── Dockerfile        # Docker configuration
│   │   ├── pyproject.toml    # Poetry dependencies
│   │   └── init_db.py        # Database initialization script
│   │
│   ├── frontend/
│   │   ├── public/           # Static assets
│   │   ├── src/
│   │   │   ├── assets/       # Images and other assets
│   │   │   ├── components/   # Reusable React components
│   │   │   ├── context/      # React context providers
│   │   │   ├── pages/        # Page components
│   │   │   ├── services/     # API service functions
│   │   │   ├── styles/       # CSS styles
│   │   │   ├── utils/        # Utility functions
│   │   │   └── App.js        # Main application component
│   │   ├── tests/            # Frontend tests
│   │   ├── Dockerfile        # Docker configuration
│   │   └── package.json      # npm dependencies
│   │
│   ├── docker-compose.yml    # Docker Compose configuration
│   └── README.md             # Project documentation
│
├── docs/                     # Project documentation
│   ├── api/                  # API documentation
│   ├── guides/               # User and developer guides
│   ├── architecture/         # System architecture diagrams
│   └── tutorials/            # Step-by-step tutorials
│
└── pitch/                    # Project pitch materials
```

## Technology Stack

### Backend
- FastAPI - High-performance web framework
- SQLAlchemy - ORM for database interactions
- SQLite/PostgreSQL - Database options
- JWT - Authentication mechanism
- Poetry - Dependency management

### Frontend
- React - UI library
- React Router - Navigation
- Axios - API communication
- Chart.js - Data visualization
- CSS - Custom styling

## Getting Started

### Quick Start

For Windows users, we provide batch scripts to quickly set up and run the application:

1. Initialize the database (first time only):
   ```
   initialize_database.bat
   ```

2. Start the application (both backend and frontend):
   ```
   start_app.bat
   ```

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
   This creates all necessary tables and adds sample users, prices, and other data.

6. Run the development server:
   ```
   python -m uvicorn app.main:app --reload
   ```

7. Access the API documentation at http://localhost:8000/docs

> **Important**: If you encounter database errors like `no such table: users`, make sure to run the database initialization script first.

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

## Documentation

The project includes comprehensive documentation in the `docs/` directory:

- **API Documentation**: Detailed information about API endpoints, request/response formats, and authentication
- **User & Developer Guides**: Instructions for using and extending the application
- **Architecture Diagrams**: Visual representations of the system architecture
- **Tutorials**: Step-by-step guides for common tasks and workflows

To view the documentation:

```
# If you have a documentation server installed (like MkDocs)
cd docs
mkdocs serve

# Or simply open the markdown files in your browser or editor
```

## Testing

### Backend Tests

```
cd app/backend
poetry run pytest
```

### Frontend Tests

```
cd app/frontend
npm test
```

For end-to-end tests:
```
npm run test:e2e
```

## Development Roadmap

- [ ] Implement real-time price updates with WebSockets
- [ ] Add comprehensive dealer tools
- [ ] Integrate market news feed
- [ ] Build mobile app version
- [ ] Implement multi-language support
- [ ] Add two-factor authentication
- [ ] Enhance reporting and analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Backend Issues

- **Database errors:** Ensure SQLite file permissions are correct
- **JWT issues:** Check the SECRET_KEY configuration
- **CORS errors:** Verify the frontend URL is in the allowed origins

### Common Frontend Issues

- **API connection errors:** Check the REACT_APP_API_URL environment variable
- **Authentication issues:** Clear localStorage and try logging in again
- **Build errors:** Ensure Node.js version is compatible (v16+)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For questions or support, please contact the development team.
