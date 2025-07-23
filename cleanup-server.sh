#!/bin/bash

# One-time cleanup script to kill all existing app processes on the server
# Run this once to clean up the multiple processes you found in htop

echo "=== Server Cleanup Script ==="
echo "This will kill all existing app processes on the deployment server"
echo ""

# Check if SSH credentials are provided
if [ -z "$SSH_HOST" ] || [ -z "$SSH_USERNAME" ] || [ -z "$SSH_PASSWORD" ] || [ -z "$SSH_PORT" ]; then
    echo "Please set the following environment variables:"
    echo "export SSH_HOST=your_server_ip"
    echo "export SSH_USERNAME=your_username"
    echo "export SSH_PASSWORD=your_password"
    echo "export SSH_PORT=your_ssh_port"
    echo ""
    echo "Then run: ./cleanup-server.sh"
    exit 1
fi

echo "Connecting to server $SSH_HOST:$SSH_PORT as $SSH_USERNAME..."
echo "This will kill ALL processes matching '/mnt/c/wsl-app/app' and free port 8080"
echo ""

# Kill all app processes
sshpass -p "$SSH_PASSWORD" ssh -p $SSH_PORT $SSH_USERNAME@$SSH_HOST "wsl bash -c \"
echo 'Current app processes:'
ps aux | grep -v grep | grep '/mnt/c/wsl-app/app' || echo 'No app processes found'
echo ''

echo 'Current processes using port 8080:'
lsof -ti:8080 2>/dev/null | xargs -I {} ps -p {} 2>/dev/null || echo 'No processes found using port 8080'
echo ''

echo 'Killing all app processes...'
pkill -KILL -f '/mnt/c/wsl-app/app' 2>/dev/null || echo 'No app processes to kill'

echo 'Killing all processes using port 8080...'
lsof -ti:8080 2>/dev/null | xargs -I {} kill -KILL {} 2>/dev/null || echo 'No processes using port 8080'

echo 'Cleaning up PID files...'
rm -f /mnt/c/wsl-app/app.pid

echo ''
echo 'Final check:'
echo 'App processes remaining:'
ps aux | grep -v grep | grep '/mnt/c/wsl-app/app' || echo 'No app processes found'
echo 'Port 8080 usage:'
lsof -ti:8080 2>/dev/null | xargs -I {} ps -p {} 2>/dev/null || echo 'Port 8080 is free'

echo ''
echo 'Cleanup complete!'
\""

echo ""
echo "Cleanup finished. You can now run a new deployment."
