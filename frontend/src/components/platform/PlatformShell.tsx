import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlatformHeader from '../ui/PlatformHeader';
import GlobalSearch, { GlobalSearchRef } from '../search/GlobalSearch';
import FloatingVoiceAssistant from '../voice/FloatingVoiceAssistant';
import BottomNavigation from './BottomNavigation';
import LeftSidebarNavigation from './LeftSidebarNavigation';
import { useResponsive } from '../../hooks/useResponsive';
import { getSearchScope } from '../../core/scopeResolver';
import { getSearchDataSources, getSearchNavigationHandlers } from '../../core/searchBusinessLogic';
import { getBusinessData, getCurrentProcessStage } from '../../core/businessDataLogic';
import { ActionParams } from '../../services/nlp/types';
import styles from './PlatformShell.module.css';

// Helper function to determine if current path is a platform page
function isPlatformPage(pathname: string): boolean {
  return pathname.startsWith('/platform');
}

interface PlatformShellProps {
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
  currentScreen: string;
  onUniversalAction: (actionType: string, params?: ActionParams) => void;
  onPerformSearch: (query: string) => void;
  children: React.ReactNode;
}

function PlatformShell({
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
  currentScreen,
  onUniversalAction,
  onPerformSearch,
  children
}: PlatformShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const globalSearchRef = useRef<GlobalSearchRef>(null);

  return (
    <div className={styles.platformShell}>
      {/* Platform Header - Responsive for both mobile and desktop */}
      <PlatformHeader
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        onHome={onHome}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onGuestMode={onGuestMode}
        onDemoMode={onDemoMode}
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
        userMode={userMode}
        userName={userName}
      />
      
      {/* Desktop Left Sidebar Navigation - Only on Platform Pages */}
      {isPlatformPage(location.pathname) && !isMobile && (
        <LeftSidebarNavigation />
      )}
      
      {/* Universal Search Bar - Only on Platform Pages */}
      {isPlatformPage(location.pathname) && (
        <GlobalSearch
          ref={globalSearchRef}
          searchScope={getSearchScope(currentScreen)}
          dataSources={getSearchDataSources()}
          navigationHandlers={getSearchNavigationHandlers(navigate)}
        />
      )}
      
      {/* Platform Content */}
      <main className={isMobile ? styles.platformContentMobile : styles.platformContentDesktop}>
        {children}
      </main>
      
      {/* Mobile Bottom Navigation - Only on Platform Pages */}
      {isPlatformPage(location.pathname) && isMobile && (
        <BottomNavigation />
      )}
      
      {/* Universal Voice Assistant - Only on Platform Pages (Desktop) */}
      {isPlatformPage(location.pathname) && !isMobile && (
        <FloatingVoiceAssistant
          currentProcessStage={getCurrentProcessStage(location.pathname)}
          onUniversalAction={onUniversalAction}
          onPerformSearch={onPerformSearch}
          businessData={getBusinessData()}
        />
      )}
    </div>
  );
}

export default PlatformShell;