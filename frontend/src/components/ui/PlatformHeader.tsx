import React from 'react';
import HeaderDropdown from './HeaderDropdown';
import GlobalSearch, { GlobalSearchRef } from '../search/GlobalSearch';
import { SearchDataSources, SearchNavigationHandlers } from '../search/useGlobalSearch';
import styles from './PlatformHeader.module.css';
import logoImage from '../../assets/images/logo.png';
import { platformName, tagline, logoAlt } from '../../config/brand';

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
  // Search props for desktop integration
  globalSearchRef?: React.RefObject<GlobalSearchRef | null>;
  searchScope?: string[];
  dataSources?: SearchDataSources;
  navigationHandlers?: SearchNavigationHandlers;
  showSearch?: boolean;
  onVoiceSearch?: () => void;
  onVoiceHover?: (buttonPosition: { x: number; y: number; width: number; height: number }) => void;
  onNotificationClick?: () => void;
  voiceState?: 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';
  // Website navigation props
  onServicesHub?: () => void;
  onLeadership?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
  // Page context
  isPlatformPage?: boolean;
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
  userName,
  globalSearchRef,
  searchScope,
  dataSources,
  navigationHandlers,
  showSearch = false,
  onVoiceSearch,
  onVoiceHover,
  onNotificationClick,
  voiceState = 'IDLE',
  // Website navigation props
  onServicesHub,
  onLeadership,
  onAbout,
  onContact,
  // Page context
  isPlatformPage = false
}: PlatformHeaderProps) {
  return (
    <div className={styles.platformHeader}>
      {/* Unified Header Content - Mobile and Desktop */}
      <div className={styles.headerContent}>
        {/* Left: Logo Section */}
        <div className={styles.logoSection}>
          <img src={logoImage} alt={logoAlt} className={styles.logoImage} />
          <div className={styles.logoTextContainer}>
            <span className={styles.logoText}>{platformName}</span>
            <span className={styles.logoTagline}>{tagline}</span>
          </div>
        </div>
        
        {/* Center: Integrated Search - Desktop Only */}
        {showSearch && dataSources && navigationHandlers && (
          <div className={styles.searchSection}>
            <GlobalSearch
              ref={globalSearchRef}
              searchScope={searchScope}
              dataSources={dataSources}
              navigationHandlers={navigationHandlers}
              onVoiceSearch={onVoiceSearch}
              onVoiceHover={onVoiceHover}
              voiceState={voiceState}
              className={styles.integratedSearch}
            />
          </div>
        )}
        
        {/* Right: Controls Section - Notification + Dropdown */}
        <div className={styles.controlsSection}>
          <button 
            className={styles.notificationButton}
            onClick={onNotificationClick}
            title="Notifications"
            aria-label="View notifications"
            type="button"
          >
            🔔
          </button>
          <HeaderDropdown
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            showThemeSelector={false}
            onNavigateHome={onHome}
            onLogin={onLogin}
            onSignUp={onSignUp}
            onGuestMode={onGuestMode}
            onDemoMode={onDemoMode}
            onLogout={onLogout}
            isAuthenticated={isAuthenticated}
            userMode={userMode}
            showWebsiteNavigation={true}
            onServicesHub={onServicesHub}
            onLeadership={onLeadership}
            onAbout={onAbout}
            onContact={onContact}
            isPlatformPage={isPlatformPage}
          />
        </div>
      </div>
    </div>
  );
}

export default PlatformHeader;