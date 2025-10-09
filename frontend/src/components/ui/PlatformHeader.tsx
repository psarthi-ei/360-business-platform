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
      <div className={styles.headerContent}>
        {/* Desktop Logo Section */}
        <div className={styles.logoSection}>
          <div className={`${styles.logo} ${styles.desktopOnly}`} onClick={onHome}>
            <img src={logoImage} alt={logoAlt} className={styles.logoImage} />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>{companyName}</span>
              <span className={styles.logoTagline}>{tagline}</span>
            </div>
          </div>
        </div>
        
        {/* Mobile Header - Outside logoSection */}
        <div className={styles.mobileHeader}>
          {/* Left: Logo + Company Name + Tagline */}
          <div className={styles.brandSection} onClick={onHome}>
            <img src={logoImage} alt={logoAlt} className={styles.brandLogo} />
            <div className={styles.brandInfo}>
              <div className={styles.brandName}>{companyName}</div>
              <div className={styles.brandTagline}>{tagline}</div>
            </div>
          </div>
          
          {/* Right: Notification + Debug + Hamburger */}
          <div className={styles.navActions}>
            <button className={styles.notificationButton} title="Notifications">🔔</button>
            <button className={styles.debugButton} title="Debug">&lt;/&gt;</button>
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
        
        {/* Platform Context - User and Business Info */}
        <div className={styles.platformContext}>
          <div className={styles.businessInfo}>
            <span className={styles.businessName}>Gujarat Textiles Ltd.</span>
            <span className={styles.businessStatus}>Production Active</span>
          </div>
        </div>
        
        {/* Controls Section - Desktop Only */}
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