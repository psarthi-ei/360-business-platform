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
  // Website Navigation Props
  showWebsiteNavigation?: boolean;
  onServicesHub?: () => void;
  onBlogHome?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
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
  userMode = 'guest',
  // Website Navigation Props
  showWebsiteNavigation = false,
  onServicesHub,
  onBlogHome,
  onAbout,
  onContact
}: ProductHeaderProps) {
  return (
    <div className={styles.productHeader}>
      <div className={styles.headerContent}>
        {/* Logo Section - Always visible */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <img src={logoImage} alt="ElevateIdea" className={styles.logoImage} />
            <span className={styles.logoText}>ElevateIdea</span>
          </div>
        </div>
        
        {/* Navigation Section - Website Navigation or Empty for center spacing */}
        <div className={styles.navigationSection}>
          {showWebsiteNavigation && (
            <nav className={styles.websiteNavigation}>
              <button onClick={onDemoMode} className={styles.navButton}>
                <span className={styles.navLabel}>ElevateBusiness 360°</span>
              </button>
              
              <button onClick={onServicesHub} className={styles.navButton}>
                <span className={styles.navLabel}>Consulting Services</span>
              </button>
              
              <button onClick={onBlogHome} className={styles.navButton}>
                <span className={styles.navLabel}>365 Days Blog</span>
              </button>
              
              <button onClick={onAbout} className={styles.navButton}>
                <span className={styles.navLabel}>About Us</span>
              </button>
              
              <button onClick={onContact} className={styles.navButton}>
                <span className={styles.navLabel}>Contact</span>
              </button>
            </nav>
          )}
        </div>
        
        {/* Controls Section - Context Navigation and User Menu */}
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
            showWebsiteNavigation={showWebsiteNavigation}
            onServicesHub={onServicesHub}
            onBlogHome={onBlogHome}
            onAbout={onAbout}
            onContact={onContact}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductHeader;