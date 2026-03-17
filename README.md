# FitTrack - Fitness App with Firebase Authentication

A comprehensive fitness tracking application built with React Native, Expo, and Firebase. This app provides workout planning, nutrition tracking, activity monitoring, and progress visualization, all secured with Firebase authentication.

## Features

### Authentication System
- User registration with email and password
- Secure sign-in functionality
- Protected routes for authenticated users
- Persistent sessions with Firebase Auth

### Fitness Tracking
- **Dashboard**: Overview of fitness metrics, recent workouts, and progress
- **Workouts**: Create, browse, and follow workout plans
- **Nutrition**: Track meals, calories, and macronutrients
- **Activity**: Monitor steps, exercise sessions, and sleep patterns
- **Profile**: Manage personal details and fitness goals

## Project Structure

```
├── app/
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.tsx          # Auth navigation structure  
│   │   ├── sign-in.tsx          # Sign-in screen
│   │   └── sign-up.tsx          # Sign-up screen
│   ├── (tabs)/                  # Main app screens
│   │   ├── _layout.tsx          # Tab navigation
│   │   ├── index.tsx            # Dashboard tab
│   │   ├── workouts.tsx         # Workouts tab
│   │   ├── nutrition.tsx        # Nutrition tab  
│   │   ├── activity.tsx         # Activity tab
│   │   └── profile.tsx          # Profile tab
│   └── _layout.tsx              # Root navigation with auth routing
├── components/                  # Reusable components
├── context/
│   └── AuthContext.js           # Authentication state management
├── constants/                   # App constants and themes
└── firebaseConfig.js            # Firebase connection configuration
```

