import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import { AUTH_CONFIG } from '@/config/auth';

WebBrowser.maybeCompleteAuthSession();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, isOnline } = useAuth();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest(AUTH_CONFIG.googleAuth);

  const validateForm = (): string | null => {
    if (!email || !password) {
      return 'Please fill in all fields';
    }
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleGoogleSignInSuccess = useCallback(async (token: string | undefined) => {
    if (!token) {
      Alert.alert('Error', 'Google sign-in failed');
      return;
    }

    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        router.replace('/(tabs)');
      } else {
        throw new Error('Failed to sign in with Google');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, router]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignInSuccess(authentication?.accessToken);
    }
  }, [response, handleGoogleSignInSuccess]);

  const handleSignIn = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    if (!isOnline) {
      Alert.alert('No Connection', 'Please check your internet connection and try again');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to sign in';
      
      if (error.message === 'No internet connection. Please check your network and try again.') {
        errorMessage = error.message;
      } else if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection';
            break;
          default:
            errorMessage = error.message || 'Failed to sign in';
        }
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <FontAwesome name="heartbeat" size={80} color="#FF4B4B" />
        <Text style={styles.appName}>FitDate</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>
        
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            autoComplete="current-password"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.googleButton}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <FontAwesome name="google" size={20} color="white" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/sign-up">
            <Text style={styles.linkText}>Sign Up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FFF', // White text for better contrast on gradient
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#4A4A4A', // Softer text color
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#FFE4E1', // Soft pink border
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
    color: '#FF6B6B', // Matching primary color
  },
  input: {
    flex: 1,
    height: 50,
    color: '#4A4A4A', // Softer text color
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF6B6B', // Updated to match new primary color
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#FFB4B4',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD93D', // Using our secondary color
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#4A4A4A', // Dark text for contrast on yellow
    fontWeight: '600',
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#FFF', // White text for better contrast on gradient
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  linkText: {
    color: '#FFD93D', // Using secondary color
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
});