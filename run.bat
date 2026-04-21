@echo off
REM SalaryIQ - Quick Start Script

echo =============================================
echo    SalaryIQ - Salary Prediction Frontend
echo =============================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created!
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt

REM Start Flask app
echo.
echo =============================================
echo    Starting SalaryIQ...
echo =============================================
echo.
echo Open your browser and go to:
echo http://localhost:5000
echo.
echo Press CTRL+C to stop the server
echo =============================================
echo.

python app.py

pause
