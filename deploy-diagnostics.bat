@echo on
echo ============================================
echo           APPLICATION DIAGNOSTICS
echo ============================================
echo.
echo === APPLICATION STATUS ===
echo.
echo Checking if app is running:
tasklist | findstr app.exe
echo.
echo Checking if port 8080 is open:
netstat -ano | findstr :8080
echo.
echo === ENVIRONMENT VARIABLES ===
echo PORT=%PORT%
echo JWT_SECRET=%JWT_SECRET%
echo.
echo === DIRECTORY CONTENTS ===
dir
echo.
echo === DATABASE FILE CHECK ===
if exist farm.db (
  echo Database file exists
  echo Size: 
  for %%I in (farm.db) do echo %%~zI bytes
) else (
  echo WARNING: Database file is missing!
)
echo.

:menu
echo === OPTIONS ===
echo 1. View last 20 lines of log
echo 2. View complete log
echo 3. Run application directly (with console output)
echo 4. Restart application as background service
echo 5. Exit
echo.
choice /C 12345 /N /M "Choose an option:"

if errorlevel 5 goto end
if errorlevel 4 goto restart
if errorlevel 3 goto directrun
if errorlevel 2 goto fulllog
if errorlevel 1 goto partlog

:partlog
echo.
echo === LAST 20 LINES OF LOG ===
powershell -Command "if (Test-Path app.log) { Get-Content app.log -Tail 20 } else { echo \"Log file not found\" }"
echo.
pause
goto menu

:fulllog
echo.
echo === COMPLETE LOG FILE ===
powershell -Command "if (Test-Path app.log) { Get-Content app.log } else { echo \"Log file not found\" }"
echo.
pause
goto menu

:directrun
echo.
echo === RUNNING APPLICATION DIRECTLY ===
echo Application will start with console output. 
echo Press Ctrl+C to stop it when done.
echo.
pause
call direct-run.bat
goto menu

:restart
echo.
echo === RESTARTING APPLICATION ===
call restart-service.bat
echo.
echo Waiting 5 seconds for application to start...
timeout /t 5 > nul
echo.
echo Checking if application is running:
netstat -ano | findstr :8080
if errorlevel 1 (
  echo WARNING: Application doesn't appear to be running on port 8080!
) else (
  echo Application is now running on port 8080
)
echo.
pause
goto menu

:end
exit 