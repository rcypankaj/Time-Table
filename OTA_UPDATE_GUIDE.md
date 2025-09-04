# OTA Update Guide

This guide explains how to use the Over-The-Air (OTA) update feature in your Task Reminder app.

## 🚀 What is OTA Update?

OTA updates allow you to push JavaScript and asset updates to your app without going through the App Store or Google Play Store. This means you can:

- Fix bugs quickly
- Add new features
- Update content
- Improve performance

All without waiting for app store approval!

## 📋 Prerequisites

1. **EAS CLI**: Install the Expo Application Services CLI

   ```bash
   npm install -g @expo/eas-cli
   ```

2. **EAS Account**: Log in to your EAS account

   ```bash
   eas login
   ```

3. **Project Setup**: Your project should already be configured with EAS (which it is).

## 🔧 How It Works

### Automatic Updates

- The app automatically checks for updates when it starts
- If an update is available, users see a beautiful update notification
- Users can choose to update now or later
- Updates are downloaded and applied seamlessly

### Manual Updates

- Users can manually check for updates in Settings
- Developers can publish updates using EAS CLI

## 📱 User Experience

### Update Notification

When an update is available, users see:

- A modal with update information
- List of improvements (bug fixes, new features, etc.)
- "Update Now" and "Later" buttons
- Progress indicators during download/installation

### Update Process

1. **Check**: App checks for updates on startup
2. **Download**: If available, update is downloaded in background
3. **Install**: User confirms installation
4. **Restart**: App restarts with new version

## 🛠️ Publishing Updates

### Using the Script (Recommended)

```bash
# Publish to production channel
./scripts/publish-update.sh production "Bug fixes and new features"

# Publish to preview channel
./scripts/publish-update.sh preview "Testing new features"

# Publish to development channel
./scripts/publish-update.sh development "Development updates"
```

### Using EAS CLI Directly

```bash
# Publish to production
eas update --channel production --message "Your update message"

# Publish to preview
eas update --channel preview --message "Your update message"

# Publish to development
eas update --channel development --message "Your update message"
```

## 📊 Update Channels

Your app is configured with three channels:

1. **Production** (`production`): For stable releases
2. **Preview** (`preview`): For testing before production
3. **Development** (`development`): For development builds

## 🔄 Update Flow

### For Developers:

1. Make changes to your code
2. Test locally
3. Publish update using script or EAS CLI
4. Users receive update automatically

### For Users:

1. App checks for updates on startup
2. If update available, notification appears
3. User can update now or later
4. Update downloads and installs
5. App restarts with new version

## ⚠️ Important Notes

### What Can Be Updated OTA:

- JavaScript code
- Images and assets
- Configuration files
- UI changes
- Bug fixes
- New features

### What Cannot Be Updated OTA:

- Native code changes
- New native dependencies
- App permissions
- App store metadata
- Native plugins

### Best Practices:

- Test updates on preview channel first
- Use descriptive update messages
- Don't publish breaking changes without warning
- Monitor update adoption rates

## 🐛 Troubleshooting

### Update Not Showing:

- Check if you're in development mode (updates disabled in dev)
- Verify the channel matches your build
- Check EAS project configuration

### Update Fails:

- Check network connection
- Verify update is compatible with current app version
- Check EAS logs for errors

### Manual Update Check:

- Go to Settings → Check for Updates
- This forces an immediate update check

## 📈 Monitoring Updates

You can monitor update status in:

- EAS Dashboard
- App analytics
- User feedback

## 🔐 Security

- Updates are signed and verified
- Only authorized developers can publish updates
- Updates are delivered over HTTPS
- Malicious updates are prevented

## 📞 Support

If you encounter issues:

1. Check EAS documentation
2. Review update logs
3. Test on different devices
4. Contact EAS support if needed

---

**Happy Updating! 🎉**

Your Task Reminder app now has powerful OTA update capabilities that will help you deliver better experiences to your users faster than ever before.
