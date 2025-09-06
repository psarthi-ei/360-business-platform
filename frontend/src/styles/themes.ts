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

// 1. Classic Business (Current Style - Glass Morphism)
export const classicTheme: Theme = {
  name: 'classic',
  displayName: '🏢 Classic Business',
  colors: {
    primary: '#ffd700',
    secondary: '#2c3e50',
    accent: '#3498db',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    hot: '#ff4757',
    warm: '#ffa502',
    cold: '#5352ed'
  },
  gradients: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    card: 'rgba(255, 255, 255, 0.1)',
    button: 'linear-gradient(45deg, #ffd700, #ffed4e)'
  },
  shadows: {
    small: '0 2px 10px rgba(0,0,0,0.1)',
    medium: '0 4px 20px rgba(0,0,0,0.15)',
    large: '0 8px 30px rgba(0,0,0,0.2)'
  },
  borderRadius: {
    small: '6px',
    medium: '10px',
    large: '15px'
  }
};

// 2. Professional Dark
export const professionalTheme: Theme = {
  name: 'professional',
  displayName: '🌙 Professional Dark',
  colors: {
    primary: '#00d2ff',
    secondary: '#1a1a1a',
    accent: '#ff6b6b',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    surface: 'rgba(30, 30, 30, 0.9)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    success: '#4ecdc4',
    warning: '#ffe66d',
    error: '#ff6b6b',
    hot: '#ff4757',
    warm: '#ffa502',
    cold: '#74b9ff'
  },
  gradients: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    card: 'rgba(30, 30, 30, 0.9)',
    button: 'linear-gradient(45deg, #00d2ff, #3a7bd5)'
  },
  shadows: {
    small: '0 2px 15px rgba(0,0,0,0.3)',
    medium: '0 4px 25px rgba(0,0,0,0.4)',
    large: '0 8px 40px rgba(0,0,0,0.5)'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px'
  }
};

// 3. Textile Traditional (Warm Earth Tones)
export const traditionalTheme: Theme = {
  name: 'traditional',
  displayName: '🧶 Textile Traditional',
  colors: {
    primary: '#d4a574',
    secondary: '#8b4513',
    accent: '#cd853f',
    background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)',
    surface: 'rgba(139, 69, 19, 0.2)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    success: '#228b22',
    warning: '#daa520',
    error: '#dc143c',
    hot: '#b22222',
    warm: '#ff8c00',
    cold: '#4682b4'
  },
  gradients: {
    background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)',
    card: 'rgba(139, 69, 19, 0.2)',
    button: 'linear-gradient(45deg, #d4a574, #daa520)'
  },
  shadows: {
    small: '0 2px 12px rgba(139, 69, 19, 0.3)',
    medium: '0 4px 20px rgba(139, 69, 19, 0.4)',
    large: '0 8px 35px rgba(139, 69, 19, 0.5)'
  },
  borderRadius: {
    small: '6px',
    medium: '10px',
    large: '15px'
  }
};

// 4. Modern Minimalist (Light & Clean)
export const minimalistTheme: Theme = {
  name: 'minimalist',
  displayName: '🤍 Modern Minimalist',
  colors: {
    primary: '#6c5ce7',
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
    button: 'linear-gradient(45deg, #6c5ce7, #a29bfe)'
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

// 5. Vibrant Energy (Colorful & Dynamic)
export const vibrantTheme: Theme = {
  name: 'vibrant',
  displayName: '🌈 Vibrant Energy',
  colors: {
    primary: '#ff3838',
    secondary: '#2f3542',
    accent: '#ff6b81',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    surface: 'rgba(255, 255, 255, 0.25)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    success: '#7bed9f',
    warning: '#fffa65',
    error: '#ff5252',
    hot: '#ff4757',
    warm: '#ffa502',
    cold: '#3742fa'
  },
  gradients: {
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    card: 'rgba(255, 255, 255, 0.25)',
    button: 'linear-gradient(45deg, #ff3838, #ff6b81)'
  },
  shadows: {
    small: '0 2px 15px rgba(255, 56, 56, 0.2)',
    medium: '0 4px 25px rgba(255, 56, 56, 0.3)',
    large: '0 8px 40px rgba(255, 56, 56, 0.4)'
  },
  borderRadius: {
    small: '8px',
    medium: '15px',
    large: '25px'
  }
};

// Theme Registry
export const themes: Record<string, Theme> = {
  classic: classicTheme,
  professional: professionalTheme,
  traditional: traditionalTheme,
  minimalist: minimalistTheme,
  vibrant: vibrantTheme
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