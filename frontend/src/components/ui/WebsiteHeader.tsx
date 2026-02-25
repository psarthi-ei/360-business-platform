import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderDropdown from './HeaderDropdown';
import styles from './WebsiteHeader.module.css';
import logoImage from '../../assets/images/logo.png';

interface WebsiteHeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onHome?: () => void;
  onDashboard?: () => void;
  showDashboardButton?: boolean;
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
  onLeadership?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
  onElevateBusiness360?: () => void;
  userName?: string;
}

function WebsiteHeader({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onHome,
  onDashboard,
  showDashboardButton = false,
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
  onLeadership,
  onAbout,
  onContact,
  onElevateBusiness360
}: WebsiteHeaderProps) {
  const location = useLocation();
  
  // Helper function for consistent active route detection
  const isActiveRoute = (routePath: string): boolean => {
    const currentPath = location.pathname;
    
    // Special case for leadership route
    if (routePath === '/leadership') {
      return currentPath === '/leadership';
    }
    
    // Exact match for other routes
    return currentPath === routePath;
  };
  
  return (
    <div className={styles.websiteHeader}>
      <div className={styles.headerContent}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logo} onClick={onHome}>
            <img src={logoImage} alt="ElevateIdea" className={styles.logoImage} />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>ElevateIdea</span>
              <span className={styles.logoTagline}>Scaling Business with Technology</span>
            </div>
          </div>
        </div>
        
        {/* Navigation Section - Hidden on mobile via CSS */}
        <div className={styles.navigationSection}>
          {showWebsiteNavigation && (
            <nav className={styles.websiteNavigation}>
              <button 
                onClick={onHome} 
                className={`${styles.navButton} ${location.pathname === '/' ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>Home</span>
              </button>
              
              <button 
                onClick={onServicesHub} 
                className={`${styles.navButton} ${isActiveRoute('/services') ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>Consulting</span>
              </button>
              
              <button 
                onClick={onLeadership} 
                className={`${styles.navButton} ${isActiveRoute('/leadership') ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>Leadership</span>
              </button>
              
              <button 
                onClick={onAbout} 
                className={`${styles.navButton} ${isActiveRoute('/about') ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>About</span>
              </button>
              
              <button 
                onClick={onContact} 
                className={`${styles.navButton} ${isActiveRoute('/contact') ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>Contact</span>
              </button>
            </nav>
          )}
        </div>
        
        {/* Controls Section - Responsive */}
        <div className={styles.controlsSection}>
          {/* Dashboard Button */}
          {showDashboardButton && onDashboard && (
            <button 
              className={styles.dashboardButton}
              onClick={onDashboard}
              title="Go to Dashboard"
            >
              Dashboard
            </button>
          )}
          
          <HeaderDropdown
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
            onNavigateHome={onHome}
            onDashboard={onDashboard}
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
            onLeadership={onLeadership}
            onAbout={onAbout}
            onContact={onContact}
            onElevateBusiness360={onElevateBusiness360}
            isPlatformPage={false}
          />
        </div>
      </div>
    </div>
  );
}

export default WebsiteHeader;