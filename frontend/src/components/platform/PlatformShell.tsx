import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformHeader from '../ui/PlatformHeader';
import GlobalSearch, { GlobalSearchRef } from '../search/GlobalSearch';
import GlobalVoice, { VoiceControlRef } from '../voice/GlobalVoice';
import BottomNavigation from './BottomNavigation';
import LeftSidebarNavigation from './LeftSidebarNavigation';
import { useResponsive } from '../../hooks/useResponsive';
import { getSearchScope } from '../../core/scopeResolver';
import { getSearchDataSources, getSearchNavigationHandlers } from '../../core/searchBusinessLogic';
import { getBusinessData } from '../../core/businessDataLogic';
import { ActionParams } from '../../services/nlp/types';
import styles from './PlatformShell.module.css';

// Note: isPlatformPage checks removed - PlatformShell now only renders for platform routes via layout routing

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
  // Website navigation props
  onServicesHub?: () => void;
  onLeadership?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
  // Page context
  isPlatformPage?: boolean;
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
  children,
  // Website navigation props
  onServicesHub,
  onLeadership,
  onAbout,
  onContact,
  // Page context
  isPlatformPage = true
}: PlatformShellProps) {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const desktopSearchRef = useRef<GlobalSearchRef>(null);
  const mobileSearchRef = useRef<GlobalSearchRef>(null);
  const voiceControlRef = useRef<VoiceControlRef>(null);
  
  // Voice state management with proper useState
  const [voiceState, setVoiceState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR'>('IDLE');
  
  // Debug voice state changes
  // eslint-disable-next-line no-console
  console.log('🎙️ PlatformShell voiceState:', voiceState);

  // Voice search handler - connects voice icon to universal voice system
  const handleVoiceSearch = () => {
    voiceControlRef.current?.startVoiceRecognition();
  };

  // Voice-to-search handler - connects voice recognition results to search input
  const handleVoiceToSearch = (query: string) => {
    // Route to correct search instance based on device
    const targetSearchRef = isMobile ? mobileSearchRef : desktopSearchRef;
    targetSearchRef.current?.performSearch(query);
  };

  // Voice hover handler - triggers voice suggestions panel
  const handleVoiceHover = (buttonPosition: { x: number; y: number; width: number; height: number }) => {
    // Forward hover event to GlobalVoice to show suggestions
    voiceControlRef.current?.showVoiceSuggestions?.(buttonPosition);
  };

  return (
    <div className={styles.platformShell}>
      {/* CSS Grid Layout - All Areas Always Present */}
      
      {/* Sidebar Area - Desktop only */}
      <aside className={styles.sidebarArea}>
        {!isMobile && (
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
          showSearch={!isMobile}
          globalSearchRef={desktopSearchRef}
          searchScope={getSearchScope(currentScreen)}
          dataSources={getSearchDataSources()}
          navigationHandlers={getSearchNavigationHandlers(navigate)}
          onVoiceSearch={handleVoiceSearch}
          onVoiceHover={handleVoiceHover}
          voiceState={voiceState}
          // Website navigation integration
          onServicesHub={onServicesHub}
          onLeadership={onLeadership}
          onAbout={onAbout}
          onContact={onContact}
          isPlatformPage={isPlatformPage}
        />
      </header>
      
      {/* Search Area - Always rendered for platform */}
      <section className={styles.searchArea}>
        <GlobalSearch
          ref={mobileSearchRef}
          searchScope={getSearchScope(currentScreen)}
          dataSources={getSearchDataSources()}
          navigationHandlers={getSearchNavigationHandlers(navigate)}
          onVoiceSearch={handleVoiceSearch}
          onVoiceHover={handleVoiceHover}
          voiceState={voiceState}
        />
      </section>
      
      {/* Content Area - Always rendered */}
      <main className={styles.contentArea}>
        {children}
      </main>
      
      {/* Navigation Area - Mobile only */}
      <nav className={styles.navigationArea}>
        {isMobile && (
          <BottomNavigation />
        )}
      </nav>
      
      {/* GlobalVoice - Universal voice component for voice recognition */}
      <GlobalVoice
        ref={voiceControlRef}
        currentProcessStage={currentScreen}
        onUniversalAction={onUniversalAction}
        onPerformSearch={handleVoiceToSearch}
        businessData={getBusinessData()}
        onVoiceStateChange={setVoiceState}
      />
    </div>
  );
}

export default PlatformShell;