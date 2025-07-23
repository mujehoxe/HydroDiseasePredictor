#!/bin/bash
cd /mnt/c/wsl-app
for i in {1..10}; do
  echo "Startup check attempt $i..."
  if [ -f app.pid ]; then
    PID=$(cat app.pid)
    if ps -p "$PID" > /dev/null; then
      echo "SUCCESS: Application is running with PID $PID"
      if nc -z localhost 8080; then
        echo 'SUCCESS: Application is responding on port 8080'
        break
      else
        echo 'Application process running but not responding on port 8080 yet...'
      fi
    else
      echo 'PID file exists but process not running'
    fi
  else
    echo 'PID file not found yet...'
  fi
  if [ $i -eq 10 ]; then
    echo 'ERROR: Application failed to start properly after 30 seconds'
    echo 'Current processes:'
    ps aux | grep -v grep | grep app || echo 'No app processes found'
    echo 'Application logs:'
    tail -n 20 app.log 2>/dev/null || echo 'No logs found'
  else
    sleep 3
  fi
done
