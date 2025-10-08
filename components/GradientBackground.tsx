import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

export default function GradientBackground({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'light' 
    ? ['#FF6B6B', '#FFD93D'] as const  // Light mode gradient
    : ['#8B0000', '#8B4513'] as const; // Dark mode gradient

  return (
    <LinearGradient
      colors={colors}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
  },
});