import React from 'react';
import HeaderDropdown from './HeaderDropdown';
import styles from './ProductHeader.module.css';
import logoImage from '../../assets/images/logo.png';

interface ProductHeaderProps {
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
  currentScreen?: string;
  onServicesHub?: () => void;
  onTurnaroundStories?: () => void;
  onBlogHome?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
}

function ProductHeader({
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
  currentScreen = '',
  onServicesHub,
  onTurnaroundStories,
  onBlogHome,
  onAbout,
  onContact
}: ProductHeaderProps) {
  return (
    <div className={styles.productHeader}>
      <div className={styles.headerContent}>
        {/* Logo Section - Always visible and clickable */}
        <div className={styles.logoSection}>
          <div className={styles.logo} onClick={onHome}>
            <img src={logoImage} alt="ElevateIdea" className={styles.logoImage} />
            <div className={styles.logoTextContainer}>
              <span className={styles.logoText}>ElevateIdea</span>
              <span className={styles.logoTagline}>Scaling Business with Technology</span>
            </div>
          </div>
        </div>
        
        {/* Navigation Section - Website Navigation or Empty for center spacing */}
        <div className={styles.navigationSection}>
          {showWebsiteNavigation && (
            <nav className={styles.websiteNavigation}>
              <button 
                onClick={isAuthenticated || userMode !== 'guest' ? onDashboard : onDemoMode} 
                className={`${styles.navButton} ${['dashboard', 'leads', 'quotations', 'salesorders', 'advancepayment', 'invoices', 'customerprofile', 'customerlist', 'inventory', 'fulfillment', 'analytics'].includes(currentScreen) ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>ElevateBusiness 360°</span>
              </button>
              
              <button 
                onClick={onServicesHub} 
                className={`${styles.navButton} ${currentScreen === 'services-hub' ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>Consulting Services</span>
              </button>
              
              <button 
                onClick={onAbout} 
                className={`${styles.navButton} ${currentScreen === 'about' ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>About Us</span>
              </button>
              
              <button 
                onClick={onTurnaroundStories} 
                className={`${styles.navButton} ${currentScreen === 'turnaround-stories' ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>Turnaround Stories</span>
              </button>
              
              <button 
                onClick={onBlogHome} 
                className={`${styles.navButton} ${currentScreen === 'blog-home' || currentScreen === 'blog-post' ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>365 Days of Stories</span>
              </button>
              
              <button 
                onClick={onContact} 
                className={`${styles.navButton} ${currentScreen === 'contact' ? styles.activeNavButton : ''}`}
              >
                <span className={styles.navLabel}>Contact</span>
              </button>
            </nav>
          )}
        </div>
        
        {/* Controls Section - Dashboard Button and User Menu */}
        <div className={styles.controlsSection}>
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
            onTurnaroundStories={onTurnaroundStories}
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