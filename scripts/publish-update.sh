#!/bin/bash

# Script to publish OTA updates using EAS Update
# Usage: ./scripts/publish-update.sh [channel] [message]

set -e

# Default values
CHANNEL=${1:-"production"}
MESSAGE=${2:-"Bug fixes and improvements"}

echo "🚀 Publishing OTA update..."
echo "Channel: $CHANNEL"
echo "Message: $MESSAGE"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed. Please install it first:"
    echo "npm install -g @expo/eas-cli"
    exit 1
fi

# Check if user is logged in
if ! eas whoami &> /dev/null; then
    echo "❌ Please log in to EAS first:"
    echo "eas login"
    exit 1
fi

# Publish the update
echo "📦 Publishing update to channel '$CHANNEL'..."
eas update --channel $CHANNEL --message "$MESSAGE"

echo ""
echo "✅ Update published successfully!"
echo "📱 Users will receive the update automatically on their next app launch."
echo ""
echo "💡 To test the update:"
echo "1. Build and install the app on a device"
echo "2. Make changes to your code"
echo "3. Run this script again"
echo "4. Restart the app to see the changes"
