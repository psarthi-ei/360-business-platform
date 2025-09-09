import React from 'react';
import HeaderDropdown from './HeaderDropdown';
import styles from '../styles/ProductHeader.module.css';
import logoImage from '../assets/images/logo.png';

interface ProductHeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateHome?: () => void;
  onNavigateBack?: () => void;
  backButtonText?: string;
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
  onNavigateHome,
  onNavigateBack,
  backButtonText = "Dashboard",
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
      
      {/* Controls Section - Dashboard, Home and Options Dropdown */}
      <div className={styles.controlsSection}>
        {onNavigateBack && (
          <button 
            className={styles.backButton}
            onClick={onNavigateBack}
            title="Back to Dashboard"
          >
            📊
          </button>
        )}
        {onNavigateHome && (
          <button 
            className={styles.homeButton}
            onClick={onNavigateHome}
            title="Go to Home"
          >
            🏠
          </button>
        )}
        
        <HeaderDropdown
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          onNavigateHome={onNavigateHome}
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