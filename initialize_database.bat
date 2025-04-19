@echo off
echo Initializing Zahav database...
cd app\backend
python init_db.py
echo.
echo Database initialization complete.
echo.
echo Default login credentials:
echo Admin: username=admin, password=admin123
echo User: username=user, password=user123
echo Dealer: username=dealer, password=dealer123
echo.
pause
