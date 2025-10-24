#!/bin/bash

# Check if we're in Railway runtime (npm might not be available)
if ! command -v npm &> /dev/null; then
    echo "npm not available, assuming Docker build completed"
    cd backend
    exec npm start
fi

# Check if frontend build already exists
if [ -d "frontend/build" ]; then
    echo "Frontend already built, copying to backend..."
    cp -r frontend/build backend/public/
    cd backend
    exec npm start
fi

# Build frontend if needed
echo "Building frontend..."
cd frontend
npm install
npm run build

# Copy frontend build to backend public folder
echo "Copying frontend build to backend..."
cp -r build ../backend/public/

# Start backend
echo "Starting backend..."
cd ../backend
npm install
exec npm start
