# Build stage
FROM mcr.microsoft.com/windows/servercore:ltsc2022 AS builder

# Install Chocolatey
RUN powershell -Command \
    Set-ExecutionPolicy Bypass -Scope Process -Force; \
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; \
    iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install Go using Chocolatey
RUN powershell -Command "choco install golang -y"

# Set up Go environment and work directory
WORKDIR C:\\app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application for Windows
RUN go build -o app.exe

# Use a smaller Windows image for runtime
FROM mcr.microsoft.com/windows/nanoserver:ltsc2022

WORKDIR C:\\app

# Copy binary and required files from build stage
COPY --from=builder C:\\app\\app.exe .
COPY --from=builder C:\\app\\farm.db .
COPY --from=builder C:\\app\\build .\\build

# Set environment variables
ENV PORT=8080
ENV JWT_SECRET=your_secret_here

# Expose the port
EXPOSE 8080

# Run the binary
CMD ["C:\\app\\app.exe"] 