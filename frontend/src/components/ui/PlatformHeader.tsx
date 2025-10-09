import React from 'react';
import HeaderDropdown from './HeaderDropdown';
import styles from './PlatformHeader.module.css';
import logoImage from '../../assets/images/logo.png';

interface PlatformHeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onHome?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  onGuestMode?: () => void;
  onDemoMode?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userMode?: string;
  userName?: string;
}

function PlatformHeader({
  currentLanguage,
  onLanguageChange,
  onHome,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  isAuthenticated = false,
  userMode = 'guest',
  userName
}: PlatformHeaderProps) {
  return (
    <div className={styles.platformHeader}>
      <div className={styles.headerContent}>
        {/* Logo Section - Responsive for both mobile and desktop */}
        <div className={styles.logoSection}>
          {/* Desktop Logo */}
          <div className={`${styles.logo} ${styles.desktopOnly}`} onClick={onHome}>
            <img src={logoImage} alt="ElevateBusiness" className={styles.logoImage} />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>ElevateBusiness 360°</span>
              <span className={styles.logoTagline}>Complete Business Management</span>
            </div>
          </div>
          
          {/* Mobile Greeting - Visual Design Specification */}
          <div className={styles.mobileGreeting}>
            <button className={styles.backButton} onClick={onHome} title="Go back">
              ←
            </button>
            <span className={styles.greetingText}>Good morning, Ramesh 👋</span>
          </div>
        </div>
        
        {/* Platform Context - User and Business Info */}
        <div className={styles.platformContext}>
          <div className={styles.businessInfo}>
            <span className={styles.businessName}>Gujarat Textiles Ltd.</span>
            <span className={styles.businessStatus}>Production Active</span>
          </div>
        </div>
        
        {/* Controls Section - Responsive for both mobile and desktop */}
        <div className={styles.controlsSection}>
          {/* Mobile Notification Icon */}
          <button className={styles.notificationButton} title="Notifications">
            🔔
          </button>
          
          <HeaderDropdown
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            showThemeSelector={false}
            onLogin={onLogin}
            onSignUp={onSignUp}
            onGuestMode={onGuestMode}
            onDemoMode={onDemoMode}
            onLogout={onLogout}
            isAuthenticated={isAuthenticated}
            userMode={userMode}
            showWebsiteNavigation={false}
          />
        </div>
      </div>
    </div>
  );
}

export default PlatformHeader;