# Deployment Guide

This project uses GitHub Actions to automatically build and deploy both the React frontend and Go backend to a Windows SSH server.

## GitHub Secrets Setup

You need to add the following secrets to your GitHub repository:

- `SSH_HOST`: The hostname or IP address of your Windows server
- `SSH_USERNAME`: SSH username for authentication
- `SSH_PASSWORD`: SSH password for authentication (for Windows deployment)
- `SSH_PORT`: SSH port (usually 22)
- `DEPLOY_PATH`: The path on the server where the application will be deployed (use Windows path format)
- `PORT`: The port on which the backend will run
- `JWT_SECRET`: Secret key for JWT token generation and validation

## How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" then "Actions"
4. Click on "New repository secret"
5. Add each of the secrets listed above

## Windows Server Prerequisites

The Windows server should have:

- OpenSSH Server enabled and running
- If possible, NSSM (Non-Sucking Service Manager) installed for running the app as a service
- Proper firewall settings to allow connections to the specified port

## Windows SSH Server Setup

1. Enable OpenSSH Server on Windows:

   - Go to Settings > Apps > Optional Features
   - Add "OpenSSH Server"
   - Start the service via PowerShell: `Start-Service sshd`
   - Set it to start automatically: `Set-Service -Name sshd -StartupType 'Automatic'`

2. Ensure password authentication is enabled in the SSH server config:
   - Edit `C:\ProgramData\ssh\sshd_config`
   - Make sure `PasswordAuthentication yes` is set
   - Restart the service: `Restart-Service sshd`

## Workflow Details

The GitHub workflow:

1. Builds the React frontend using Vite
2. Builds the Go backend with GOOS=windows for Windows compatibility
3. Copies the frontend build to the backend/build directory
4. Creates a Windows batch file to run the application
5. Deploys all files to the Windows server using SFTP
6. Sets up the application as a Windows service or runs it directly

The workflow runs on pushes to the main/master branch and can also be triggered manually from the GitHub Actions tab.

## What Gets Deployed

The deployment includes:

- The compiled Go backend Windows executable (`app.exe`)
- The frontend build files (in the `build` directory)
- SQLite database file (`farm.db`)
- A batch file to run the application (`start-app.bat`)

## Running as a Windows Service

The workflow attempts to set up the application as a Windows service using NSSM (Non-Sucking Service Manager). If NSSM is not available, it falls back to running the batch file directly.

### Installing NSSM (Recommended)

1. Download NSSM from https://nssm.cc/download
2. Extract to `C:\Program Files\nssm`
3. Add the directory to your system PATH

## Manual Deployment

If you need to deploy manually:

1. Build the frontend:

   ```
   npm run build
   ```

2. Build the Go backend for Windows:

   ```
   cd backend
   set GOOS=windows
   set GOARCH=amd64
   go build -o app.exe
   mkdir build
   xcopy ..\dist build\ /E
   ```

3. Create a batch file `start-app.bat`:

   ```
   @echo off
   set PORT=your_port
   set JWT_SECRET=your_jwt_secret
   app.exe
   ```

4. Copy the following to your Windows server:

   - `app.exe` (Go binary)
   - `build/` directory (frontend files)
   - `farm.db` (SQLite database)
   - `start-app.bat` (batch file)

5. On the Windows server, you can:
   - Run the app directly with `start-app.bat`
   - OR set up as a service with NSSM:
     ```
     nssm install GoAppService "[PATH]\app.exe"
     nssm set GoAppService AppDirectory "[PATH]"
     nssm set GoAppService AppEnvironmentExtra "PORT=your_port" "JWT_SECRET=your_jwt_secret"
     nssm start GoAppService
     ```

## Application Structure

- The Go backend serves both the API endpoints and the static frontend files
- API endpoints are available at `/api/v1/*`
- Frontend static assets are served from `/assets/*`
- For other routes, the backend serves the frontend's index.html to support SPA routing
