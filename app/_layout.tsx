import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GradientBackground from '@/components/GradientBackground';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NetworkStatus } from '@/components/NetworkStatus';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

// Auth-aware component to handle protected routes
function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Skip this effect on first render
    if (!segments.length) return;

    const inAuthGroup = segments[0] === '(auth)' as any;
    
    if (!currentUser && !inAuthGroup && !isRedirecting) {
      setIsRedirecting(true);
      // Redirect to sign-in if not logged in and not in auth group
      router.replace('/(auth)/sign-in' as any);
    } else if (currentUser && inAuthGroup && !isRedirecting) {
      setIsRedirecting(true);
      // Redirect to home if logged in and in auth group
      router.replace('/(tabs)');
    }
  }, [currentUser, segments, isRedirecting]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthContextProvider>
          <GradientBackground>
            <NetworkStatus />
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </GradientBackground>
        </AuthContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
