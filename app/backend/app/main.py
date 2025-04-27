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

# To this:
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(prices.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")

# Also add a root endpoint for /api
@app.get("/api")
async def api_root():
    """API root endpoint for health check."""
    return {"message": "Welcome to Zahav API", "status": "operational"}
