# Deployment Guide

This project uses GitHub Actions to automatically build and deploy the application to an SSH server.

## GitHub Secrets Setup

You need to add the following secrets to your GitHub repository:

- `SSH_HOST`: The hostname or IP address of your SSH server
- `SSH_USERNAME`: SSH username for authentication
- `SSH_PRIVATE_KEY`: Private SSH key for authentication
- `SSH_PORT`: SSH port (usually 22)
- `DEPLOY_PATH`: The path on the server where the application will be deployed
- `PORT`: The port on which the backend will run
- `MONGO_URI`: MongoDB connection string

## How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" then "Actions"
4. Click on "New repository secret"
5. Add each of the secrets listed above

## Server Prerequisites

The server should have:

- Node.js v16+ installed
- npm or yarn installed
- MongoDB installed or accessible

## Manual Deployment

If you need to deploy manually:

1. Build the frontend:

   ```
   npm run build
   ```

2. Copy the following files to your server:

   - `dist/` directory (frontend build)
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `src/models/` directory

3. Create a `.env` file with:

   ```
   PORT=your_port
   MONGO_URI=your_mongodb_uri
   NODE_ENV=production
   ```

4. Install dependencies:

   ```
   npm ci --omit=dev
   ```

5. Install PM2 globally (if not already installed):

   ```
   npm install -g pm2
   ```

6. Start the application:
   ```
   pm2 start server.js --name app
   pm2 save
   ```

## Workflow Details

The GitHub workflow:

1. Builds the frontend using Vite
2. Prepares deployment files including backend and frontend
3. Copies files to the server using SCP
4. Starts the application on the server using PM2

The workflow runs on pushes to the main/master branch and can also be triggered manually from the GitHub Actions tab.
