#!/bin/bash

# Build frontend
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
npm start
