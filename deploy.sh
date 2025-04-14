#!/bin/bash

# Exit on error
set -e

echo "Pulling latest Docker images..."
docker-compose pull

echo "Starting containers..."
docker-compose up -d --force-recreate

echo "Cleaning up old images..."
docker system prune -f

echo "Deployment completed successfully!"