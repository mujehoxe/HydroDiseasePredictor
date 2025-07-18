#!/bin/bash
cd /mnt/c/wsl-app
echo 'Checking for existing app processes...'
APP_PIDS=$(pgrep -f '/mnt/c/wsl-app/app' 2>/dev/null || echo '')
if [ -n "$APP_PIDS" ]; then
  echo "Found running app processes with PIDs: $APP_PIDS"
  echo 'Attempting graceful shutdown of all instances...'
  pkill -TERM -f '/mnt/c/wsl-app/app'
  sleep 5
  REMAINING_PIDS=$(pgrep -f '/mnt/c/wsl-app/app' 2>/dev/null || echo '')
  if [ -n "$REMAINING_PIDS" ]; then
    echo "Some processes still running (PIDs: $REMAINING_PIDS), forcing kill..."
    pkill -KILL -f '/mnt/c/wsl-app/app'
    sleep 2
  fi
  FINAL_CHECK=$(pgrep -f '/mnt/c/wsl-app/app' 2>/dev/null || echo '')
  if [ -n "$FINAL_CHECK" ]; then
    echo "ERROR: Some processes still running after force kill: $FINAL_CHECK"
    ps aux | grep -v grep | grep '/mnt/c/wsl-app/app' || echo 'No processes found in ps output'
  else
    echo 'SUCCESS: All app processes stopped'
  fi
else
  echo 'No app processes found running'
fi
rm -f app.pid
PORT_PROCS=$(lsof -ti:8080 2>/dev/null || echo '')
if [ -n "$PORT_PROCS" ]; then
  echo "Found processes using port 8080: $PORT_PROCS"
  kill -TERM $PORT_PROCS 2>/dev/null || echo 'Failed to send TERM signal'
  sleep 3
  PORT_PROCS_AFTER=$(lsof -ti:8080 2>/dev/null || echo '')
  if [ -n "$PORT_PROCS_AFTER" ]; then
    echo 'Force killing remaining processes on port 8080...'
    kill -KILL $PORT_PROCS_AFTER 2>/dev/null || echo 'Failed to send KILL signal'
    sleep 1
  fi
else
  echo 'No processes found using port 8080'
fi
echo 'Final verification:'
FINAL_APP_PROCS=$(pgrep -f '/mnt/c/wsl-app/app' 2>/dev/null || echo '')
FINAL_PORT_PROCS=$(lsof -ti:8080 2>/dev/null || echo '')
if [ -n "$FINAL_APP_PROCS" ]; then
  echo "WARNING: App processes still running: $FINAL_APP_PROCS"
else
  echo 'CONFIRMED: No app processes running'
fi
if [ -n "$FINAL_PORT_PROCS" ]; then
  echo "WARNING: Port 8080 still in use by: $FINAL_PORT_PROCS"
else
  echo 'CONFIRMED: Port 8080 is free'
fi
