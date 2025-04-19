# Zahav - Gold Booking System

Zahav is a comprehensive platform for gold and bullion dealers with refinery capabilities. This application provides real-time price tracking, booking management, rate alerts, and various dealer tools.

## Project Structure

This project consists of:

1. **Backend**: FastAPI application with SQLite database
2. **Frontend**: React application

## Backend Features

- User authentication and authorization
- Real-time gold and silver price management
- Booking system for metal purchases
- Customizable rate alerts
- RESTful API design

### Backend Technology Stack

- FastAPI
- SQLAlchemy ORM
- SQLite database
- Poetry for dependency management
- Pytest for testing

## Frontend Features

- Responsive design for desktop and mobile
- Real-time price dashboard
- Intuitive booking flow
- Rate alert configuration
- Multiple dealer tools (TDS calculator, etc.)
- Secure user authentication

### Frontend Technology Stack

- React.js
- React Router for navigation
- Axios for API communication
- Chart.js for data visualization
- CSS for styling (no Tailwind)
- Playwright for end-to-end testing

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd app/backend
   ```

2. Install dependencies with Poetry:
   ```
   poetry install
   ```

3. Activate the virtual environment:
   ```
   poetry shell
   ```

4. Run the development server:
   ```
   uvicorn app.main:app --reload
   ```

5. Access the Swagger documentation at `http://localhost:8000/docs`

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

4. Access the application at `http://localhost:3000`

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

## Project Roadmap

- [ ] Implement real-time price updates
- [ ] Add comprehensive dealer tools
- [ ] Integrate market news feed
- [ ] Build mobile app version
- [ ] Implement multi-language support

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
