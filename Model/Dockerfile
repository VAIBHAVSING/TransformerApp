# Build stage
FROM python:3.10-slim AS build

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Install dependencies needed for building packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install requirements
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# Final stage
FROM python:3.10-slim

WORKDIR /app

# Copy wheels from build stage and install
COPY --from=build /build/wheels /wheels
RUN pip install --no-cache-dir /wheels/* gunicorn==21.2.0

# Copy the application code
COPY . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production \
    CORS_ORIGIN=* \
    PORT=8080

# Expose the port - serverless platforms often use 8080
EXPOSE ${PORT}

# Use a more serverless-friendly startup command
# The PORT variable is automatically set by many serverless platforms
# Use fewer workers but more threads for better cold start performance
CMD exec gunicorn --bind 0.0.0.0:${PORT:-8080} \
    --workers 1 \
    --threads 8 \
    --timeout 0 \
    --preload \
    --access-logfile - \
    --error-logfile - \
    app:app
