# Use a Windows Server Core image with Go installed
FROM mcr.microsoft.com/windows/servercore:ltsc2022 as builder

# Set working directory
WORKDIR C:\\app

# Install Chocolatey for package management
SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]
RUN Set-ExecutionPolicy Bypass -Scope Process -Force; \
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; \
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Go using Chocolatey
RUN choco install -y golang --version=1.22.0

# Add Go binaries to PATH
RUN $env:Path += ';C:\go\bin'; \
    [Environment]::SetEnvironmentVariable('Path', $env:Path, [EnvironmentVariableTarget]::Machine)

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Set environment variable for Go modules
ENV GO111MODULE=on

# Download dependencies
RUN go mod download

# Copy the backend code
COPY . .

# Build the app
RUN go build -o app.exe

# Use a smaller Windows image for the runtime
FROM mcr.microsoft.com/windows/nanoserver:ltsc2022

WORKDIR C:\\app

# Copy the executable and database
COPY --from=builder C:\\app\\app.exe .
COPY --from=builder C:\\app\\farm.db .

# Copy the frontend build
COPY --from=builder C:\\app\\build .\\build

# Set environment variables
ENV PORT=8080
ENV JWT_SECRET=your_secret_here

# Expose the port
EXPOSE 8080

# Set the entry point
ENTRYPOINT ["C:\\app\\app.exe"] 