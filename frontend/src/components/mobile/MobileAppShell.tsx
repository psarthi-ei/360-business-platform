import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FloatingVoiceAssistant from '../voice/FloatingVoiceAssistant';
import HeaderDropdown from '../ui/HeaderDropdown';
import SearchResults from '../search/SearchResults';
import { useGlobalSearch, SearchDataSources, SearchNavigationHandlers } from '../search/useGlobalSearch';
import { ActionParams } from '../../services/nlp/types';
import { getSearchDataSources, getSearchNavigationHandlers } from '../../core/searchBusinessLogic';
import { getBusinessData, getCurrentProcessStage } from '../../core/businessDataLogic';
import { createUniversalActionHandler } from '../../core/voiceBusinessLogic';
import { createVoiceCommandRouter } from '../../services/voice/VoiceCommandRouter';
import logoImage from '../../assets/images/logo.png';
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

  // Search state and handlers using the useGlobalSearch hook
  const {
    searchQuery,
    searchResults,
    showSearchResults,
    handleSearchChange,
    closeSearchResults,
    clearSearch,
    performGlobalSearch
  } = useGlobalSearch(searchDataSources, searchNavigationHandlers);
  
  // Create VoiceCommandRouter instance for mobile
  const voiceCommandRouter = useMemo(() => 
    createVoiceCommandRouter(navigate), [navigate]
  );

  // Universal search handler - Connected to search logic
  const handleUniversalSearch = useCallback((query: string) => {
    // eslint-disable-next-line no-console
    console.log('🔍 Voice search query:', query);
    
    // Trigger search using the performGlobalSearch function
    performGlobalSearch(query);
  }, [performGlobalSearch]);

  // Handle keyboard events in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      closeSearchResults();
      (e.target as HTMLInputElement).blur();
    }
    // TODO: Add arrow key navigation for search results
  };
  
  // Universal action handler using shared business logic - no fallback needed
  const handleUniversalAction = useMemo(() => 
    onUniversalAction || createUniversalActionHandler(navigate, voiceCommandRouter, handleUniversalSearch), 
    [onUniversalAction, navigate, voiceCommandRouter, handleUniversalSearch]
  );


  // V2 Workflow-Based Navigation (4 tabs instead of 8)
  const tabs = [
    { 
      path: '/dashboard', 
      icon: '🏠', 
      label: 'Home',
      description: 'Business Intelligence Dashboard'
    },
    { 
      path: '/leads', 
      icon: '⚡', 
      label: 'Pipeline',
      description: 'Leads → Quotes → Orders'
    },
    { 
      path: '/operations', 
      icon: '🏭', 
      label: 'Operations',
      description: 'Production → Inventory → Fulfillment'
    },
    { 
      path: '/customers', 
      icon: '👥', 
      label: 'Customers',
      description: 'CRM & Customer Management'
    }
  ];

  const isActiveTab = (path: string) => {
    // Enhanced logic for workflow-based navigation
    const currentPath = location.pathname;
    
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }
    
    if (path === '/pipeline') {
      return ['/leads', '/quotes', '/orders', '/payments', '/pipeline'].includes(currentPath);
    }
    
    if (path === '/operations') {
      return ['/production', '/inventory', '/shipping', '/fulfillment', '/operations'].includes(currentPath);
    }
    
    if (path === '/customers') {
      return ['/crm', '/customers', '/customer-profile'].includes(currentPath);
    }
    
    return currentPath === path;
  };

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
            <img src={logoImage} alt="ElevateIdea" className="brand-logo" />
            <div className="brand-info">
              <div className="brand-name">ElevateIdea</div>
              <div className="brand-tagline">Scaling Business with Technology</div>
            </div>
          </div>
          
          <div className="nav-actions">
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
        
        {/* Search Row - Original Style with Functional Logic */}
        <div className="search-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search leads, customers, orders..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button 
                className="clear-search-button" 
                onClick={clearSearch}
                type="button"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            
            {/* Search Results - Positioned relative to search input */}
            {showSearchResults && (
              <SearchResults
                results={searchResults}
                searchQuery={searchQuery}
                onClose={closeSearchResults}
              />
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="mobile-content">
        {children}
      </main>
      
      {/* Bottom Tab Navigation - V2 Workflow Design */}
      <nav className="bottom-tabs">
        {tabs.map((tab, index) => {
          const workflowNames = ['home', 'pipeline', 'operations', 'customers'];
          return (
            <button 
              key={tab.path}
              className={`tab-button ${isActiveTab(tab.path) ? 'active' : ''}`}
              data-workflow={workflowNames[index]}
              onClick={() => navigate(tab.path)}
              title={tab.description}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      
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