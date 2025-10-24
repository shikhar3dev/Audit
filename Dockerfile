# Build frontend
FROM node:18 AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm ci
RUN npm run build

# Build backend
FROM node:18 AS backend-build
WORKDIR /app
COPY backend/package*.json ./backend/
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm ci

# Production image
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend /app/backend

# Copy frontend build into backend static folder
COPY --from=frontend-build /app/frontend/build /app/backend/public

# Install only production dependencies for backend
WORKDIR /app/backend
RUN npm ci --only=production

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3004

# Start the application
CMD ["npm", "start"]
