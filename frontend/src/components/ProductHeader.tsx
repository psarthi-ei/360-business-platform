import React from 'react';
import HeaderDropdown from './HeaderDropdown';
import styles from '../styles/ProductHeader.module.css';
import logoImage from '../assets/images/logo.png';

interface ProductHeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onContextNavigation?: () => void;
  contextNavigationText?: string;
  contextNavigationIcon?: string;
  showContextNavigation?: boolean;
  showThemeSelector?: boolean;
  onLogin?: () => void;
  onSignUp?: () => void;
  onGuestMode?: () => void;
  onDemoMode?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userMode?: string;
}

function ProductHeader({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onContextNavigation,
  contextNavigationText = "Home",
  contextNavigationIcon = "🏠",
  showContextNavigation = false,
  showThemeSelector = true,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  isAuthenticated = false,
  userMode = 'guest'
}: ProductHeaderProps) {
  return (
    <div className={styles.productHeader}>
      {/* Logo Section - Always visible */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <img src={logoImage} alt="ElevateIdea" className={styles.logoImage} />
          <span className={styles.logoText}>ElevateIdea</span>
        </div>
      </div>
      
      {/* Navigation Section - Empty for center spacing */}
      <div className={styles.navigationSection}>
      </div>
      
      {/* Controls Section - Context Navigation and Options Dropdown */}
      <div className={styles.controlsSection}>
        {showContextNavigation && onContextNavigation && (
          <button 
            className={styles.contextButton}
            onClick={onContextNavigation}
            title={`Go to ${contextNavigationText}`}
          >
            {contextNavigationIcon}
          </button>
        )}
        
        <HeaderDropdown
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          showThemeSelector={showThemeSelector}
          onLogin={onLogin}
          onSignUp={onSignUp}
          onGuestMode={onGuestMode}
          onDemoMode={onDemoMode}
          onLogout={onLogout}
          isAuthenticated={isAuthenticated}
          userMode={userMode}
        />
      </div>
    </div>
  );
}

export default ProductHeader;