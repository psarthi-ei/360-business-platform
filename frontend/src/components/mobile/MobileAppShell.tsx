import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FloatingVoiceAssistant from '../voice/FloatingVoiceAssistant';
import HeaderDropdown from '../ui/HeaderDropdown';
import GlobalSearch from '../search/GlobalSearch';
import { SearchDataSources, SearchNavigationHandlers } from '../search/useGlobalSearch';
import { ActionParams } from '../../services/nlp/types';
import { getSearchDataSources, getSearchNavigationHandlers } from '../../core/searchBusinessLogic';
import { getBusinessData, getCurrentProcessStage } from '../../core/businessDataLogic';
import { createUniversalActionHandler } from '../../core/voiceBusinessLogic';
import { createVoiceCommandRouter } from '../../services/voice/VoiceCommandRouter';
import logoImage from '../../assets/images/logo.png';
import BottomNavigation from './BottomNavigation';
import { companyName, tagline, logoAlt } from '../../config/brand';
import './MobileAppShell.css';

interface MobileAppShellProps {
  children: React.ReactNode;
  // Universal action handler for voice commands
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
  // Navigation Infrastructure Props (from ProductHeader)
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onHome?: () => void;
  onDashboard?: () => void;
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

// Universal search and voice functionality now integrated directly

const MobileAppShell: React.FC<MobileAppShellProps> = ({ 
  children, 
  onUniversalAction,
  // Navigation Infrastructure Props
  currentLanguage,
  onLanguageChange,
  onHome,
  onDashboard,
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
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug panel state for mobile header control
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  
  // Global Search Configuration for Mobile - using shared business logic
  const searchDataSources: SearchDataSources = getSearchDataSources();
  const searchNavigationHandlers: SearchNavigationHandlers = getSearchNavigationHandlers(navigate);

  // Search data sources and handlers for GlobalSearch component
  
  // Create VoiceCommandRouter instance for mobile
  const voiceCommandRouter = useMemo(() => 
    createVoiceCommandRouter(navigate), [navigate]
  );

  // Universal search handler - Will be handled by GlobalSearch component
  const handleUniversalSearch = useCallback((query: string) => {
    // eslint-disable-next-line no-console
    console.log('🔍 Voice search query:', query);
    
    // Note: Search will be handled by GlobalSearch component directly
  }, []);

  
  // Universal action handler using shared business logic - no fallback needed
  const handleUniversalAction = useMemo(() => 
    onUniversalAction || createUniversalActionHandler(navigate, voiceCommandRouter, handleUniversalSearch), 
    [onUniversalAction, navigate, voiceCommandRouter, handleUniversalSearch]
  );


  // Navigation is now handled by BottomNavigation component

  return (
    <div className="mobile-shell">
      {/* Mobile Header - V2 Professional: Two-Row Design */}
      <header className="mobile-header">
        {/* Navigation Row - Company Branding */}
        <div className="nav-row">
          <div 
            className="brand-section clickable" 
            onClick={() => onHome ? onHome() : navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <img src={logoImage} alt={logoAlt} className="brand-logo" />
            <div className="brand-info">
              <div className="brand-name">{companyName}</div>
              <div className="brand-tagline">{tagline}</div>
            </div>
          </div>
          
          <div className="nav-actions">
            <button className="notification-button" title="Notifications">
              🔔
            </button>
            <button 
              className={`debug-button ${showDebugPanel ? 'active' : ''}`}
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              title="Debug Console"
            >
              <span>&lt;/&gt;</span>
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
              showWebsiteNavigation={showWebsiteNavigation}
              onServicesHub={onServicesHub}
              onTurnaroundStories={onTurnaroundStories}
              onBlogHome={onBlogHome}
              onAbout={onAbout}
              onContact={onContact}
            />
          </div>
        </div>
        
        {/* Search Row - Unified GlobalSearch Component */}
        <div className="search-row">
          <GlobalSearch
            dataSources={searchDataSources}
            navigationHandlers={searchNavigationHandlers}
            className="mobile-search-integration"
          />
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="mobile-content">
        {children}
      </main>
      
      {/* Bottom Tab Navigation - Visual Design Specification */}
      <BottomNavigation />
      
      {/* Voice Assistant - Bottom Right Position (WhatsApp Style) */}
      <FloatingVoiceAssistant
        currentProcessStage={getCurrentProcessStage(location.pathname)}
        onUniversalAction={handleUniversalAction}
        onPerformSearch={handleUniversalSearch}
        businessData={getBusinessData()}
        externalDebugState={showDebugPanel}
        onDebugToggle={setShowDebugPanel}
      />
      
    </div>
  );
};

export default MobileAppShell;