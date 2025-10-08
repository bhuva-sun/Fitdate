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

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Expo CLI: `npm install -g expo-cli`
- Firebase account (for authentication and data storage)

### Firebase Configuration
1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add a Web app to your Firebase project
3. Enable Authentication in Firebase (Email/Password method)
4. Create a Firestore database with appropriate security rules
5. Copy your Firebase configuration from Project Settings
6. Update the `firebaseConfig.js` file with your credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run web`

## Authentication Flow

The app implements a complete authentication flow:

1. Unauthenticated users are directed to sign-in screen
2. New users can create accounts through the sign-up screen
3. Upon successful authentication, users are redirected to the main app
4. Authentication state is maintained across app sessions
5. Protected routing prevents access to fitness features without authentication

### Implementation Details

- **AuthContext.js**: React Context that manages authentication state throughout the app
- **app/_layout.tsx**: Implements conditional navigation based on auth state
- **app/(auth)/_layout.tsx**: Manages authentication screen structure
- **app/(auth)/sign-in.tsx**: Sign-in screen with email/password authentication
- **app/(auth)/sign-up.tsx**: Registration screen for new users

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

## Testing the Authentication System

1. Start the application with `npm run web`
2. You'll be directed to the sign-in screen
3. Click "Sign Up" to create a new account
4. Enter your details and register
5. Upon successful registration, you'll be redirected to the Dashboard
6. Sign out and sign back in to verify the authentication flow
7. Refresh the page to confirm that authentication state persists

## Development Notes

- Firebase emulators can be used for local development
- Add `useEmulator` calls in firebaseConfig.js if using emulators
- The app uses TypeScript for type safety
- Expo Router manages navigation with file-based routing