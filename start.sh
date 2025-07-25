#!/bin/bash

# KILLGORITHM Web Experience - Quick Start Script

echo "🎵 Starting KILLGORITHM Web Experience..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "🚀 Starting server with Python 3..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🚀 Starting server with Python..."
    python -m http.server 8000
elif command -v node &> /dev/null; then
    echo "🚀 Starting server with Node.js..."
    npx serve . -p 8000
elif command -v php &> /dev/null; then
    echo "🚀 Starting server with PHP..."
    php -S localhost:8000
else
    echo "❌ Error: No suitable server found."
    echo "Please install Python, Node.js, or PHP to run a local server."
    echo ""
    echo "Alternative: Open index.html directly in your browser"
    echo "(Note: Some features may not work without a local server)"
    exit 1
fi

echo ""
echo "✅ Server started!"
echo "🌐 Open your browser and go to: http://localhost:8000"
echo ""
echo "🎮 Controls:"
echo "  - Space: Play/Pause"
echo "  - ←/→: Previous/Next song"
echo "  - V: Toggle video"
echo "  - Esc: Close video"
echo ""
echo "Press Ctrl+C to stop the server" 