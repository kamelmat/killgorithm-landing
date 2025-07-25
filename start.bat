@echo off
REM KILLGORITHM Web Experience - Quick Start Script for Windows

echo 🎵 Starting KILLGORITHM Web Experience...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🚀 Starting server with Python...
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🚀 Starting server with Node.js...
    npx serve . -p 8000
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🚀 Starting server with PHP...
    php -S localhost:8000
    goto :end
)

echo ❌ Error: No suitable server found.
echo Please install Python, Node.js, or PHP to run a local server.
echo.
echo Alternative: Open index.html directly in your browser
echo (Note: Some features may not work without a local server)
pause
exit /b 1

:end
echo.
echo ✅ Server started!
echo 🌐 Open your browser and go to: http://localhost:8000
echo.
echo 🎮 Controls:
echo   - Space: Play/Pause
echo   - ←/→: Previous/Next song
echo   - V: Toggle video
echo   - Esc: Close video
echo.
echo Press Ctrl+C to stop the server
pause 