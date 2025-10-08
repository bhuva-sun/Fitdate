import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Animated, AccessibilityInfo } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export function NetworkStatus() {
  const { isOnline } = useAuth();
  const translateY = React.useRef(new Animated.Value(-50)).current;

  const animateBar = useCallback(() => {
    Animated.timing(translateY, {
      toValue: isOnline ? -50 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (!isOnline) {
      AccessibilityInfo.announceForAccessibility('No internet connection available');
    }
  }, [isOnline, translateY]);

  React.useEffect(() => {
    animateBar();
  }, [isOnline, animateBar]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }] }
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    padding: 12,
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
});