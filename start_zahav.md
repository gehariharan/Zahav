# Zahav Application Startup Guide

This document provides step-by-step instructions for starting the Zahav application's backend and frontend components.

## Prerequisites

- Python 3.9+ installed
- Node.js 16+ installed
- Nginx configured (for production)
- PM2 installed (recommended for production)

## Starting the Backend

### Option 1: Direct Start (Development)

1. Navigate to the backend directory:
   ```bash
   cd /home/ec2-user/Zahav/app/backend
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. Start the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. The backend will be available at http://localhost:8000

### Option 2: Using PM2 (Recommended for Production)

1. Make sure PM2 is installed:
   ```bash
   npm install -g pm2
   ```

2. Start the backend with PM2:
   ```bash
   pm2 start "cd /home/ec2-user/Zahav/app/backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000" --name zahav-backend
   ```

3. Set PM2 to start on system boot (run once):
   ```bash
   pm2 startup
   pm2 save
   ```

4. Useful PM2 commands:
   ```bash
   # Check status
   pm2 status

   # View logs
   pm2 logs zahav-backend

   # Restart the backend
   pm2 restart zahav-backend

   # Stop the backend
   pm2 stop zahav-backend

   # Start the backend (if stopped)
   pm2 start zahav-backend
   ```

## Starting the Frontend

### Option 1: Development Mode

1. Navigate to the frontend directory:
   ```bash
   cd /home/ec2-user/Zahav/app/frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will be available at http://localhost:3000

### Option 2: Production Mode with Nginx

1. Build the frontend:
   ```bash
   cd /home/ec2-user/Zahav/app/frontend
   npm run build
   ```

2. Make sure Nginx is configured to serve the frontend build directory:
   ```bash
   # Check Nginx configuration
   sudo cat /etc/nginx/conf.d/zahav.conf
   # OR
   sudo cat /etc/nginx/sites-available/default
   ```

3. Ensure Nginx is running:
   ```bash
   sudo systemctl status nginx
   # If not running
   sudo systemctl start nginx
   ```

4. The frontend will be available at your domain (e.g., https://shastha.online)

## Troubleshooting

### Backend Issues

1. **Port already in use**:
   ```bash
   # Find the process using port 8000
   sudo lsof -i :8000
   # Kill the process
   sudo kill <PID>
   ```

2. **Database issues**:
   ```bash
   # Initialize the database
   cd /home/ec2-user/Zahav/app/backend
   source venv/bin/activate
   python init_db.py
   ```

3. **Check backend logs**:
   ```bash
   # If running with PM2
   pm2 logs zahav-backend
   ```

### Frontend Issues

1. **API connection errors**:
   - Check that the backend is running
   - Verify the API URL in `.env` or `.env.production`
   - Test API endpoints with curl:
     ```bash
     curl http://localhost:8000/api
     curl -X POST http://localhost:8000/api/auth/token -d "username=admin&password=admin123" -H "Content-Type: application/x-www-form-urlencoded"
     ```

2. **Nginx issues**:
   ```bash
   # Check Nginx status
   sudo systemctl status nginx

   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log

   # Test Nginx configuration
   sudo nginx -t

   # Reload Nginx after configuration changes
   sudo systemctl reload nginx
   ```

## Complete Restart Procedure

If you need to completely restart the application:

1. Stop all components:
   ```bash
   # Stop backend (if using PM2)
   pm2 stop zahav-backend

   # Stop Nginx
   sudo systemctl stop nginx
   ```

2. Start all components:
   ```bash
   # Start backend (if using PM2)
   pm2 start zahav-backend

   # Start Nginx
   sudo systemctl start nginx
   ```

## Testing the Application

### Testing the Backend

1. Check if the backend is running:
   ```bash
   # If using PM2
   pm2 status

   # Check if the port is in use
   sudo lsof -i :8000
   ```

2. Test the backend API:
   ```bash
   # Test the root API endpoint
   curl http://localhost:8000/api
   # Expected response: {"message":"Welcome to Zahav API"}

   # Test with domain (if configured)
   curl https://shastha.online/api
   # Expected response: {"message":"Welcome to Zahav API"}
   ```

3. Test authentication with login credentials:
   ```bash
   # Test login with default admin credentials
   curl -X POST http://localhost:8000/api/auth/token \
     -d "username=admin&password=admin123" \
     -H "Content-Type: application/x-www-form-urlencoded"

   # Expected response:
   # {"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "token_type":"bearer"}

   # Test login with domain (if configured)
   curl -X POST https://shastha.online/api/auth/token \
     -d "username=admin&password=admin123" \
     -H "Content-Type: application/x-www-form-urlencoded"
   ```

4. Test a protected endpoint with the token:
   ```bash
   # Replace YOUR_TOKEN with the access_token from the previous step
   export TOKEN="YOUR_TOKEN"

   # Test accessing a protected endpoint
   curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/users/me

   # With domain (if configured)
   curl -H "Authorization: Bearer $TOKEN" https://shastha.online/api/users/me
   ```

### Testing the Frontend

1. Check if Nginx is serving the frontend:
   ```bash
   # Check Nginx status
   sudo systemctl status nginx
   ```

2. Test if the frontend is accessible:
   ```bash
   # Test with HTTP headers only
   curl -I https://shastha.online
   # Expected response should include "HTTP/1.1 200 OK"

   # Test with full response
   curl https://shastha.online
   # Should return HTML content of the frontend
   ```

3. Open in browser:
   ```bash
   # On a machine with a browser
   xdg-open https://shastha.online  # Linux
   open https://shastha.online      # macOS
   start https://shastha.online     # Windows
   ```

4. Test browser console for errors:
   - Open your browser's developer tools (F12 or right-click > Inspect)
   - Go to the Console tab
   - Check for any error messages related to API connections

### End-to-End Test

1. Open the frontend in a browser
2. Try to log in with the default credentials:
   - Username: admin
   - Password: admin123
3. If login is successful, you should be redirected to the dashboard or home page
4. If login fails, check the browser console for error messages
