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
      {/* CSS Grid Layout - All Areas Always Present */}
      
      {/* Sidebar Area - Content conditional, area always exists */}
      <aside className={styles.sidebarArea}>
        {isPlatformPage(location.pathname) && !isMobile && (
          <LeftSidebarNavigation />
        )}
      </aside>
      
      {/* Header Area - Always rendered */}
      <header className={styles.headerArea}>
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
          // Desktop search integration
          showSearch={!isMobile && isPlatformPage(location.pathname)}
          globalSearchRef={globalSearchRef}
          searchScope={getSearchScope(currentScreen)}
          dataSources={getSearchDataSources()}
          navigationHandlers={getSearchNavigationHandlers(navigate)}
        />
      </header>
      
      {/* Search Area - Content conditional, area always exists */}
      <section className={styles.searchArea}>
        {isPlatformPage(location.pathname) && (
          <GlobalSearch
            ref={globalSearchRef}
            searchScope={getSearchScope(currentScreen)}
            dataSources={getSearchDataSources()}
            navigationHandlers={getSearchNavigationHandlers(navigate)}
          />
        )}
      </section>
      
      {/* Content Area - Always rendered */}
      <main className={styles.contentArea}>
        {children}
      </main>
      
      {/* Navigation Area - Content conditional, area always exists */}
      <nav className={styles.navigationArea}>
        {isPlatformPage(location.pathname) && isMobile && (
          <BottomNavigation />
        )}
      </nav>
      
      {/* Floating Elements - Outside Grid */}
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