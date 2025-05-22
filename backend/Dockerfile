FROM golang:1.22-alpine AS builder

# Install required build dependencies
RUN apk add --no-cache gcc musl-dev

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -o app

# Use a smaller alpine image for the final image
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/app .
COPY --from=builder /app/farm.db .

# Copy the frontend build from the builder stage
COPY --from=builder /app/build ./build

# Set environment variables
ENV PORT=8080
ENV JWT_SECRET=your_secret_here

# Expose the port
EXPOSE 8080

# Run the binary
CMD ["./app"] 