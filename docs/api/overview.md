# Zahav API Overview

This document provides an overview of the Zahav API, which allows you to interact with the Zahav Precious Metals Trading Platform programmatically.

## API Base URL

- Development: `http://localhost:8000/api`
- Production: `https://api.zahav.com/api` (example)

## Authentication

The Zahav API uses JWT (JSON Web Tokens) for authentication. To authenticate:

1. Obtain a token by sending credentials to `/api/auth/token`
2. Include the token in the Authorization header of subsequent requests:
   ```
   Authorization: Bearer <your_token>
   ```

Tokens expire after 24 hours, after which you'll need to request a new one.

## API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/token` | POST | Get authentication token |
| `/api/auth/refresh` | POST | Refresh authentication token |
| `/api/auth/register` | POST | Register a new user |

### Users

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/me` | GET | Get current user profile |
| `/api/users/me` | PUT | Update current user profile |
| `/api/users/{user_id}` | GET | Get user by ID (admin only) |

### Prices

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prices/current` | GET | Get current metal prices |
| `/api/prices/history` | GET | Get historical price data |
| `/api/prices/metals/{metal}` | GET | Get prices for specific metal |

### Bookings

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookings` | GET | List user's bookings |
| `/api/bookings` | POST | Create a new booking |
| `/api/bookings/{booking_id}` | GET | Get booking details |
| `/api/bookings/{booking_id}` | PUT | Update booking |
| `/api/bookings/{booking_id}` | DELETE | Cancel booking |

### Alerts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts` | GET | List user's price alerts |
| `/api/alerts` | POST | Create a new price alert |
| `/api/alerts/{alert_id}` | GET | Get alert details |
| `/api/alerts/{alert_id}` | PUT | Update alert |
| `/api/alerts/{alert_id}` | DELETE | Delete alert |

### Tracking

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tracking` | GET | List user's shipments |
| `/api/tracking/{tracking_id}` | GET | Get shipment tracking details |

## Request and Response Format

All API requests and responses use JSON format. Here's an example:

**Request:**
```http
POST /api/bookings HTTP/1.1
Host: api.zahav.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "metal": "gold",
  "purity": "999",
  "quantity": 100,
  "unit": "grams",
  "delivery_date": "2025-05-15"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "b12345",
  "metal": "gold",
  "purity": "999",
  "quantity": 100,
  "unit": "grams",
  "delivery_date": "2025-05-15",
  "status": "pending",
  "created_at": "2025-04-20T12:34:56Z"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate success or failure:

- 2xx: Success
- 4xx: Client error (invalid request)
- 5xx: Server error

Error responses include a JSON body with details:

```json
{
  "error": {
    "code": "invalid_input",
    "message": "Invalid quantity value",
    "details": {
      "quantity": "Must be greater than 0"
    }
  }
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per user. If you exceed this limit, you'll receive a 429 Too Many Requests response.

## Versioning

The API version is included in the URL path: `/api/v1/...`

When we make backwards-incompatible changes, we'll increment the version number.

## Further Documentation

For detailed information about specific endpoints, including request parameters and response schemas, see the individual API documentation files in this directory.
