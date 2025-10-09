import React from 'react';
import HeaderDropdown from './HeaderDropdown';
import styles from './PlatformHeader.module.css';
import logoImage from '../../assets/images/logo.png';
import { companyName, tagline, logoAlt } from '../../config/brand';

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
      {/* Unified Header Content - Mobile and Desktop */}
      <div className={styles.headerContent}>
        {/* Left: Logo Section */}
        <div className={styles.logoSection} onClick={onHome}>
          <img src={logoImage} alt={logoAlt} className={styles.logoImage} />
          <div className={styles.logoTextContainer}>
            <span className={styles.logoText}>{companyName}</span>
            <span className={styles.logoTagline}>{tagline}</span>
          </div>
        </div>
        
        {/* Center: Platform Context - Desktop Only */}
        <div className={styles.platformContext}>
          <div className={styles.businessInfo}>
            <span className={styles.businessName}>Gujarat Textiles Ltd.</span>
            <span className={styles.businessStatus}>Production Active</span>
          </div>
        </div>
        
        {/* Right: Single HeaderDropdown - Responsive Design */}
        <div className={styles.controlsSection}>
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