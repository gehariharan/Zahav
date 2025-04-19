@echo off
echo Starting Zahav Application...

echo Initializing database...
cd app\backend
python init_db.py

echo Starting backend server...
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

echo Starting frontend...
cd ..\frontend
start npm start

echo Zahav application is now starting.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Default login credentials:
echo Admin: username=admin, password=admin123
echo User: username=user, password=user123
echo Dealer: username=dealer, password=dealer123
