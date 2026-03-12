@echo off
REM Start the API server first
echo Starting API server...
cd spaced-repetition-api
start "Lango API" npm run dev

REM Wait for API to initialize
echo Waiting for API to initialize...
timeout /t 3 /nobreak

REM Start the client
echo Starting client...
cd ..\spaced-repetition
start "Lango Client" npm start

echo.
echo API and client started in separate windows
echo.
pause
