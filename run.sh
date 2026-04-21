#!/bin/bash

# SalaryIQ - Quick Start Script for macOS/Linux

echo "============================================="
echo "   SalaryIQ - Salary Prediction Frontend"
echo "============================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Virtual environment created!"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Start Flask app
echo ""
echo "============================================="
echo "    Starting SalaryIQ..."
echo "============================================="
echo ""
echo "Open your browser and go to:"
echo "http://localhost:5000"
echo ""
echo "Press CTRL+C to stop the server"
echo "============================================="
echo ""

python app.py
