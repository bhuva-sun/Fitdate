import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export default function SignUpScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, isOnline } = useAuth();
  const router = useRouter();

  const validateForm = (): string | null => {
    if (!displayName || !email || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }
    if (displayName.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address';
    }
    if (!PASSWORD_REGEX.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one letter and one number';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSignUp = async () => {
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
      const user = await signup(email, password, displayName);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Signup error details:', error.code, error);
      let errorMessage = 'Failed to create account';
      
      if (error.message === 'No internet connection. Please check your network and try again.') {
        errorMessage = error.message;
      } else if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection';
            break;
          default:
            errorMessage = error.message || 'Unknown error occurred';
        }
      }
      Alert.alert('Sign-up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome name="heartbeat" size={60} color="#FF4B4B" />
          <Text style={styles.title}>Create Account</Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={50}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete="new-password"
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/(auth)/sign-in">
              <Text style={styles.link}>Sign In</Text>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 50,
    borderWidth: 1,
    borderColor: '#FFE4E1',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#4A4A4A',
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#FFB4B4',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#FFF',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  link: {
    color: '#FFD93D',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
});