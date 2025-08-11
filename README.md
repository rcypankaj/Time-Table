# Task Reminder App 📱

A beautiful and intuitive mobile task management application built with React Native and Expo. Stay organized, track your progress, and never miss important tasks with smart reminders and notifications.

## ✨ Features

### 🎯 Core Functionality

- **Task Management**: Create, edit, and delete tasks with detailed information
- **Smart Reminders**: Get notified 15 minutes before task time and at the exact time
- **Priority Levels**: Organize tasks by priority (Low, Medium, High)
- **Categories**: Categorize tasks (Personal, Work, Health, Education, etc.)
- **Progress Tracking**: Visual progress indicators and completion statistics

### 📱 Beautiful UI/UX

- **Modern Design**: Clean, intuitive interface with gradient backgrounds
- **Smooth Animations**: Haptic feedback and smooth transitions
- **Responsive Layout**: Optimized for all screen sizes
- **Dark/Light Theme Support**: Adaptive to system preferences

### 📅 Calendar Integration

- **Calendar View**: Visual calendar with task indicators
- **Date Navigation**: Easy date selection and task filtering
- **Task Markers**: Color-coded dots for different task types

### 🔔 Smart Notifications

- **Push Notifications**: Real-time task reminders
- **Customizable Alerts**: 15-minute advance notice + exact time alerts
- **Permission Management**: Easy notification settings

### 📊 Analytics & Insights

- **Progress Statistics**: Track completion rates and productivity
- **Task Analytics**: View total, completed, and pending tasks
- **Success Metrics**: Monitor your productivity over time

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (latest version)
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-reminder-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**

   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android

   # For web
   npm run web
   ```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── TaskCard.tsx    # Task display component
│   └── FloatingActionButton.tsx
├── context/            # React Context for state management
│   ├── TaskContext.tsx # Task state and operations
│   └── NotificationContext.tsx # Notification management
├── screens/            # App screens
│   ├── HomeScreen.tsx  # Main dashboard
│   ├── AddTaskScreen.tsx # Task creation/editing
│   ├── TaskDetailScreen.tsx # Task details view
│   ├── CalendarScreen.tsx # Calendar view
│   └── SettingsScreen.tsx # App settings
└── types/              # TypeScript type definitions
```

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **Database**: SQLite (expo-sqlite)
- **Notifications**: Expo Notifications
- **UI Components**: Custom components with Linear Gradients
- **Icons**: Expo Vector Icons (Ionicons)
- **Date/Time**: Moment.js
- **Calendar**: react-native-calendars
- **Haptics**: Expo Haptics

## 📋 Key Features Explained

### Task Management

- Create tasks with title, description, date, time, priority, and category
- Edit existing tasks with full CRUD operations
- Mark tasks as complete/incomplete
- Delete tasks with confirmation

### Smart Reminders

- Automatic notification scheduling
- 15-minute advance reminders
- Exact time notifications
- Permission handling for notifications

### Calendar Integration

- Interactive calendar view
- Task indicators on dates
- Date-based task filtering
- Visual task completion tracking

### Data Persistence

- Local SQLite database
- Offline functionality
- Data persistence across app restarts
- Efficient data queries

## 🎨 Design System

### Colors

- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Neutral**: #6b7280 (Gray)

### Typography

- **Headers**: Bold, 24-28px
- **Body**: Regular, 16px
- **Captions**: Medium, 14px
- **Labels**: Semi-bold, 16px

### Components

- **Cards**: Rounded corners (16px), shadows, gradients
- **Buttons**: Rounded (12px), with hover states
- **Inputs**: Clean borders, focus states
- **Icons**: Consistent sizing, semantic colors

## 📱 Platform Support

- ✅ iOS (iPhone & iPad)
- ✅ Android
- ✅ Web (React Native Web)

## 🔧 Configuration

### Environment Setup

The app uses Expo's managed workflow, so most configuration is handled automatically. Key configurations:

- **App.json**: App metadata, permissions, and build settings
- **Babel.config.js**: Babel configuration for React Native
- **Tsconfig.json**: TypeScript configuration

### Permissions

- **Notifications**: Required for task reminders
- **Storage**: Required for local database
- **Haptics**: Optional for tactile feedback

## 🚀 Deployment

### Expo Build

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### App Store Deployment

1. Configure app.json with proper bundle identifiers
2. Build the app using Expo Build
3. Submit to App Store Connect (iOS) or Google Play Console (Android)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for excellent libraries
- Ionicons for beautiful icons
- All contributors and users

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Made with ❤️ for better productivity**
