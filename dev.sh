#!/bin/bash

# Get the absolute path to the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Start the API server first
echo "Starting API server..."
cd "$SCRIPT_DIR/spaced-repetition-api"
npm run dev &
API_PID=$!

# Wait for API to start
echo "Waiting for API to initialize..."
sleep 3

# Start the client
echo "Starting client..."
cd "$SCRIPT_DIR/spaced-repetition"
npm start &
CLIENT_PID=$!

echo ""
echo "✓ API server started (PID: $API_PID)"
echo "✓ Client started (PID: $CLIENT_PID)"
echo ""
echo "To stop both processes, press Ctrl+C"
echo ""

# Wait for both processes
wait $API_PID $CLIENT_PID
