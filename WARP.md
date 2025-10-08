# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

FitTrack is a comprehensive React Native fitness application built with Expo, featuring Firebase authentication, Firestore for data storage, and Firebase Data Connect with PostgreSQL. The app follows a tab-based navigation structure with protected authentication flows.

## Technology Stack

- **Framework**: React Native with Expo (~52.0.46)
- **Navigation**: Expo Router with file-based routing
- **Authentication**: Firebase Auth (v11.6.0) with multiple providers (email/password, phone, Google)
- **Database**: Firebase Firestore + Firebase Data Connect with PostgreSQL
- **State Management**: React Context (AuthContext) + TanStack React Query
- **UI**: Custom components with gradient backgrounds and themed styling
- **TypeScript**: Full TypeScript support with strict mode enabled

## Development Commands

### Primary Development
```powershell
# Start development server (all platforms)
npm start

# Platform-specific development
npm run web          # Web development
npm run android      # Android development  
npm run ios          # iOS development

# Testing
npm test            # Run tests with Jest
```

### Build & Deployment
```powershell
# EAS Build commands
eas build --platform android --profile development    # Development build
eas build --platform android --profile preview        # Preview APK
eas build --platform android --profile production     # Production build

# Firebase commands
firebase emulators:start --only dataconnect          # Start Data Connect emulator
firebase dataconnect:codegen                         # Generate Data Connect types
```

## Architecture Overview

### Authentication Flow
The app implements a sophisticated authentication system with protected routing:

- **AuthContext** (`context/AuthContext.tsx`): Centralized auth state management with Firebase Auth
- **Protected Routes**: Root layout (`app/_layout.tsx`) handles auth-based navigation redirects
- **Auth Screens**: Located in `app/(auth)/` for sign-in/sign-up flows
- **Multi-provider Support**: Email/password, phone number with OTP, and Google Sign-In

### Navigation Structure
File-based routing with Expo Router:
- `app/_layout.tsx`: Root layout with auth protection logic
- `app/(auth)/`: Authentication screens (sign-in, sign-up)  
- `app/(tabs)/`: Main application tabs (dashboard, workouts, nutrition, activity, profile)
- Tab navigation with custom styling and FontAwesome icons

### Data Layer
- **Firebase Integration**: `firebaseConfig.ts` handles Firebase app initialization
- **Firestore**: User data and app content storage
- **Firebase Data Connect**: PostgreSQL integration for complex relational data
- **TanStack React Query**: Client-side caching and data synchronization
- **Network Status**: Built-in network connectivity monitoring

### Component Architecture
- **Reusable Components**: Located in `components/` directory
- **Themed Components**: Color scheme-aware components with dark/light mode support
- **Gradient Backgrounds**: Custom gradient wrapper component
- **Network Status**: Real-time connectivity status display

## Key Architectural Patterns

### Authentication State Management
The app uses a provider pattern with React Context where the root layout subscribes to auth state changes and automatically redirects users between authenticated and unauthenticated routes.

### Firebase Configuration
Complex Firebase setup supporting multiple services (Auth, Firestore, Data Connect) with custom provider implementations for Data Connect integration.

### Type Safety
Comprehensive TypeScript implementation with strict mode, path aliases (`@/*`), and generated types from Firebase Data Connect.

## Development Guidelines

### Firebase Configuration
- Production Firebase config is committed (standard practice for client-side config)
- Firebase emulators available for local development via `firebase.json`
- Data Connect uses PostgreSQL with Cloud SQL instance

### Authentication Testing
- Use Firebase Auth emulator for local testing
- Phone auth requires additional setup for production
- Google Sign-In configured for both platforms

### Data Connect Development
The project uses Firebase Data Connect for complex relational queries:
- Schema defined in `dataconnect/schema/`
- Connectors in `dataconnect/connector/`
- Auto-generated TypeScript clients in `dataconnect-generated/`

### Platform Considerations
- EAS Build profiles configured for different deployment targets
- Google Services file included for Android
- New Architecture enabled in Expo configuration