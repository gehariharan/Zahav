from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, users, prices, bookings, alerts

app = FastAPI(
    title="Zahav API",
    description="Gold Booking System for Bullion Dealers with Refinery",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(prices.router)
app.include_router(bookings.router)
app.include_router(alerts.router)


@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "Welcome to Zahav API", "status": "operational"}
