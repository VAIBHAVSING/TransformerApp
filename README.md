# Transformer App

A full-stack application with authentication functionality and transformer-related features.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

## Overview

This application consists of a React frontend built with Vite and a Node.js backend with Express. The app provides authentication functionality and transformer-related features.

## Project Structure

```
transformer-app/
├── docker-compose.yml           # Docker Compose configuration for the entire app
├── Frontend/                    # Frontend application (React + Vite)
│   ├── Dockerfile               # Frontend Dockerfile
│   ├── src/                     # React source code
│   ├── public/                  # Public assets
│   └── backend/                 # Backend application (Node.js + Express)
│       ├── Dockerfile           # Backend Dockerfile
│       ├── index.js             # Main entry point
│       ├── Controllers/         # API controllers
│       ├── Models/              # Database models
│       ├── Routes/              # API routes
│       ├── Middlewares/         # Express middlewares
│       └── Utils/               # Utility functions
```

## Setup Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerized deployment)

### Local Development Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Frontend/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/transformerApp
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```

5. The backend will run on [http://localhost:5000](http://localhost:5000)

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. The frontend will run on [http://localhost:5173](http://localhost:5173)

### Production Deployment

You can deploy the application using Docker Compose:

1. Make sure Docker and Docker Compose are installed on your system.

2. Create a `.env` file in the project root with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://mongo:27017/transformerApp
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=production
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. The application will be accessible at:
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)
   - Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

5. To stop the application:
   ```bash
   docker-compose down
   ```

#### Manual Deployment (without Docker)

1. Build the frontend:
   ```bash
   cd Frontend
   npm run build
   ```

2. Deploy the built files from `Frontend/dist` to a web server like Nginx or Apache.

3. Set up and start the backend on your server:
   ```bash
   cd Frontend/backend
   npm install --production
   npm start
   ```

4. Configure a reverse proxy to route API requests to the backend server.

## Environment Variables

### Backend Environment Variables

| Variable      | Description                            | Default Value                            |
|---------------|----------------------------------------|------------------------------------------|
| PORT          | Port for the backend server            | 5000                                     |
| MONGODB_URI   | MongoDB connection string              | mongodb://localhost:27017/transformerApp |
| JWT_SECRET    | Secret key for JWT token generation    | (Required)                               |
| NODE_ENV      | Environment mode                       | development                              |

## API Documentation

### Authentication Endpoints

- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile (requires authentication)
- `GET /api/health` - Health check endpoint

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Pipeline Overview

The CI/CD pipeline consists of four main jobs:

1. **Backend Testing**: Runs tests for the backend code
2. **Frontend Testing**: Builds and tests the frontend code
3. **Build and Push**: Builds Docker images and pushes them to Docker Hub
4. **Deployment**: Deploys the application to the production server

### GitHub Secrets Required

For the CI/CD pipeline to work, you need to set up these secrets in your GitHub repository:

- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_TOKEN`: A Docker Hub access token
- `DEPLOY_HOST`: The hostname or IP address of your production server
- `DEPLOY_USERNAME`: SSH username for the production server
- `DEPLOY_SSH_KEY`: Private SSH key for authentication

### Setting Up GitHub Actions

1. Make sure your code is pushed to a GitHub repository
2. Add the required secrets in your GitHub repository:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click on "New repository secret" and add each of the required secrets
3. The workflow will run automatically on pushes to main/master branches

### Manual Deployment

You can also trigger the workflow manually:
1. Go to the "Actions" tab in your GitHub repository
2. Select the "CI/CD Pipeline" workflow
3. Click "Run workflow"

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and accessible. Check your connection string in the environment variables.
- **CORS Errors**: In development, ensure the frontend URL is correctly set in the CORS configuration in the backend.
- **Docker Issues**: Make sure Docker and Docker Compose are properly installed and running on your system.