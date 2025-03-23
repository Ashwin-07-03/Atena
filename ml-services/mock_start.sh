#!/bin/bash

# Create data directory if it doesn't exist
mkdir -p data

# Make the mock server executable
chmod +x mock_server.py

# Simple check to verify Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH"
    exit 1
fi

# Print Python version for debugging
python3 --version

# Start the mock server in the background
echo "Starting Mock ML microservice on port 5050..."
python3 mock_server.py &

# Wait a moment to let the server start
sleep 2

# Verify the service is running
echo "Checking if service is running..."
if curl -s http://localhost:5050/health > /dev/null; then
    echo "✅ Mock ML service is running!"
    echo "API available at http://localhost:5050"
else
    echo "⚠️ Service may not be running properly. Check for errors above."
fi

# Keep the parent shell alive
echo "Press Ctrl+C to stop the service"
wait 