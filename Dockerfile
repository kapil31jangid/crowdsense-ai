# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Build with static export (requires next.config.ts output: 'export')
RUN npm run build

# Stage 2: Build the backend and integrate frontend
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies if needed (e.g., for certain python libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/*.py ./
# Copy any other necessary backend files (e.g., service account)
COPY backend/service-account.json ./ 
# Copy .env if needed (though secrets should be handled by Cloud Run)
COPY backend/.env ./ 

# Create static directory and copy frontend build from Stage 1
RUN mkdir -p static
COPY --from=frontend-builder /frontend/out ./static/

# Set environment variables
ENV PYTHONUNBUFFERED=TRUE
ENV PORT=8080

# Cloud Run defaults to PORT 8080
EXPOSE 8080

CMD ["python", "main.py"]
