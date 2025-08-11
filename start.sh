#!/bin/bash

echo "🚀 Starting Task Reminder App..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the Expo development server
echo "🔥 Starting Expo development server..."
echo ""
echo "📱 You can now:"
echo "   • Press 'i' to open iOS simulator"
echo "   • Press 'a' to open Android emulator"
echo "   • Press 'w' to open in web browser"
echo "   • Scan QR code with Expo Go app on your phone"
echo ""

npm start
