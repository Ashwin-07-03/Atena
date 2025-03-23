#!/bin/bash

# Create data directory if it doesn't exist
mkdir -p data

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    # Use Python 3.9-3.11 which is more compatible with our dependencies
    python3 -m pip install --upgrade pip
    python3 -m pip install setuptools distutils
    
    # Try to use Python 3.9 specifically if available
    if command -v python3.9 &> /dev/null; then
        python3.9 -m venv venv
    elif command -v python3.10 &> /dev/null; then
        python3.10 -m venv venv
    elif command -v python3.11 &> /dev/null; then
        python3.11 -m venv venv
    else
        python3 -m venv venv
    fi
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Start the microservice
echo "Starting ML microservice on port 5050..."
python server.py 