const primaryColor = '#FF6B6B'; // Softer red
const secondaryColor = '#FFD93D'; // Soft yellow
const accentColor = '#FF9999'; // Light coral

export default {
  light: {
    text: '#4A4A4A', // Softer than pure black
    background: 'linear-gradient(135deg, #FF6B6B, #FFD93D)', // Red to yellow gradient
    tint: primaryColor,
    tabIconDefault: '#BBBBBB',
    tabIconSelected: primaryColor,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    surface: '#FFF5F5', // Very light pink
    card: '#FFFAF0', // Soft cream
    border: '#FFE4E1', // Misty rose
    success: '#98D8AA', // Soft green
    warning: '#FFB84C', // Soft orange
    error: '#FF8080', // Soft red
    lightGray: '#F8F8F8',
    mediumGray: '#BBBBBB',
    darkGray: '#888888',
  },
  dark: {
    text: '#F0F0F0', // Softer than pure white
    background: 'linear-gradient(135deg, #8B0000, #8B4513)', // Darker red to brown gradient
    tint: primaryColor,
    tabIconDefault: '#888888',
    tabIconSelected: primaryColor,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    surface: '#2A1F1F', // Dark warm gray
    card: '#352828', // Dark warm brown
    border: '#443333', // Dark warm border
    success: '#98D8AA',
    warning: '#FFB84C',
    error: '#FF8080',
    lightGray: '#443333',
    mediumGray: '#665555',
    darkGray: '#887777',
  },
};
