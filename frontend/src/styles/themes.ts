// Theme System for 360° Business Platform
export interface Theme {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    hot: string;
    warm: string;
    cold: string;
  };
  gradients: {
    background: string;
    card: string;
    button: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

// Light Theme
export const lightTheme: Theme = {
  name: 'light',
  displayName: '☀️ Light',
  colors: {
    primary: '#667eea',
    secondary: '#2d3436',
    accent: '#fd79a8',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#2d3436',
    textSecondary: 'rgba(45, 52, 54, 0.7)',
    success: '#00b894',
    warning: '#fdcb6e',
    error: '#e84393',
    hot: '#e17055',
    warm: '#fdcb6e',
    cold: '#74b9ff'
  },
  gradients: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    card: 'rgba(255, 255, 255, 0.95)',
    button: 'linear-gradient(45deg, #667eea, #764ba2)'
  },
  shadows: {
    small: '0 2px 10px rgba(0,0,0,0.08)',
    medium: '0 4px 20px rgba(0,0,0,0.12)',
    large: '0 8px 30px rgba(0,0,0,0.16)'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  }
};

// Dark Theme
export const darkTheme: Theme = {
  name: 'dark',
  displayName: '🌙 Dark',
  colors: {
    primary: '#667eea',
    secondary: '#000000',
    accent: '#fd79a8',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    surface: 'rgba(45, 45, 45, 0.95)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    success: '#00b894',
    warning: '#fdcb6e',
    error: '#ff6b6b',
    hot: '#ff4757',
    warm: '#ffa502',
    cold: '#74b9ff'
  },
  gradients: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    card: 'rgba(45, 45, 45, 0.95)',
    button: 'linear-gradient(45deg, #667eea, #764ba2)'
  },
  shadows: {
    small: '0 2px 15px rgba(0,0,0,0.3)',
    medium: '0 4px 25px rgba(0,0,0,0.4)',
    large: '0 8px 40px rgba(0,0,0,0.5)'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  }
};

// Theme Registry
export const themes: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme
};

export const themesList = Object.values(themes);

// Helper function to apply theme to CSS variables
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply gradient variables
  Object.entries(theme.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--gradient-${key}`, value);
  });
  
  // Apply shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
  
  // Apply border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
  
  // Debug logging
  console.log(`Applied theme: ${theme.name}`);
  console.log(`--color-text set to: ${theme.colors.text}`);
  console.log(`--color-textSecondary set to: ${theme.colors.textSecondary}`);
};