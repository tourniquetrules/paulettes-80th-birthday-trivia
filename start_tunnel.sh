#!/bin/bash
echo "🎂 Starting Paulette's Birthday Trivia Game with Cloudflare Tunnel"
echo "================================================================="
echo ""

# Change to the game directory
cd "$(dirname "$0")"

# Start the game server in background
echo "🎮 Starting trivia game server..."
python3 server.py 8080 &
GAME_PID=$!

# Wait a moment for server to start
sleep 3

# Start the cloudflare tunnel
echo "🌐 Starting Cloudflare tunnel..."
echo "Game will be available at: https://paulette.haydd.com"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

cloudflared tunnel run paulette-trivia

# Clean up when script exits
echo ""
echo "🛑 Stopping services..."
kill $GAME_PID 2>/dev/null
echo "✅ Services stopped"
