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
    allow_origins=[
        # Local development
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Production domains with Cloudflare
        "https://shastha.online",
        "http://shastha.online",

        # If using www subdomain
        "https://www.shastha.online",
        "http://www.shastha.online",

        # If using API subdomain
        "https://api.shastha.online",
        "http://api.shastha.online",

        # EC2 direct access (if needed for testing)
        # Replace with your actual EC2 public IP or DNS
        # "http://ec2-xx-xx-xx-xx.compute-1.amazonaws.com"
    ],
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
