import React from 'react';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});