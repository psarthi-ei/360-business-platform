import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/TabNavigation.module.css';

interface TabItem {
  id: string;
  label: string;
  icon?: string;
  purpose?: string;
  quickStats?: string;
  count?: number;
  action?: () => void;
  actions?: { label: string; action: () => void; primary?: boolean }[];
  disabled?: boolean;
}

interface TabNavigationProps {
  title: string;
  icon: string;
  tabs: TabItem[];
  quickStats?: string;
  nextAction?: string;
  voiceCommands?: string[];
  smartLinks?: { text: string; action: () => void }[];
  onClose: () => void;
  children?: React.ReactNode;
  activeTabContent?: string;
}

function TabNavigation({
  title,
  icon,
  tabs,
  quickStats,
  nextAction,
  voiceCommands = [],
  smartLinks = [],
  onClose,
  children,
  activeTabContent
}: TabNavigationProps) {
  const { t } = useTranslation();
  const tabBarRef = useRef<HTMLDivElement>(null);
  
  // Set active tab to first non-disabled tab
  const [activeTab, setActiveTab] = useState(() => {
    const firstEnabledTab = tabs.find(tab => !tab.disabled);
    return firstEnabledTab?.id || tabs[0]?.id || '';
  });

  // Scroll detection state
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  // Check scroll position and update gradient visibility
  const checkScrollGradients = () => {
    if (!tabBarRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = tabBarRef.current;
    
    // Show left gradient if scrolled right
    setShowLeftGradient(scrollLeft > 0);
    
    // Show right gradient if can scroll more to the right
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Auto-scroll active tab into view
  const scrollActiveTabIntoView = (tabId: string) => {
    if (!tabBarRef.current) return;
    
    const activeTabElement = tabBarRef.current.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement;
    if (activeTabElement) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const handleTabClick = (tabId: string, action?: () => void) => {
    setActiveTab(tabId);
    scrollActiveTabIntoView(tabId);
    // Don't execute action on tab click - only show tab content
    // Action will be executed only when the action button is clicked
  };

  // Set up scroll detection
  useEffect(() => {
    const tabBar = tabBarRef.current;
    if (!tabBar) return;

    const handleScroll = () => checkScrollGradients();
    const handleResize = () => {
      setTimeout(checkScrollGradients, 100); // Delay to ensure layout is updated
    };

    // Initial check
    checkScrollGradients();

    // Add event listeners
    tabBar.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      tabBar.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [tabs]);

  // Auto-scroll active tab when it changes
  useEffect(() => {
    scrollActiveTabIntoView(activeTab);
  }, [activeTab]);

  // Get specific action text for each module
  const getSpecificActionText = (tabId: string): string => {
    const actionTexts: { [key: string]: string } = {
      'leadManagement': 'View All Leads',
      'crmView': 'View Customer CRM',
      'customerList': 'Browse Customers',
      'quotationManagement': 'Create New Quote',
      'salesOrderManagement': 'View Active Orders',
      'advancePaymentManagement': 'Track Payments',
      'workOrderManagement': 'View Work Orders',
      'stockManagement': 'Check Stock Levels',
      'readyToShip': 'View Shipments',
      'businessReports': 'View Reports'
    };
    return actionTexts[tabId] || 'Open Module';
  };

  const renderTabContent = () => {
    if (children) {
      return children;
    }

    // Get current tab details
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    if (!currentTab) {
      return (
        <div className={styles.moduleContent}>
          <div className={styles.moduleHeader}>
            <div className={styles.moduleIcon}>📋</div>
            <h3 className={styles.moduleTitle}>Select a Module</h3>
          </div>
          <p>Choose from the available modules above to get started.</p>
        </div>
      );
    }

    // Unified Card Layout
    return (
      <div className={styles.moduleContent}>
        <div className={styles.unifiedCard}>
          {/* Purpose Section - No Header */}
          <div className={styles.purposeSection}>
            <p className={styles.sectionContent}>{currentTab.purpose || 'Purpose not defined'}</p>
          </div>
          
          {/* Stats Section */}
          <div className={styles.statsSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📊</span>
              <span className={styles.sectionTitle}>Key Stats</span>
            </div>
            <p className={styles.sectionContent}>{currentTab.quickStats || 'No statistics available'}</p>
          </div>
          
          {/* Actions Section */}
          <div className={styles.actionsSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🚀</span>
              <span className={styles.sectionTitle}>Quick Actions</span>
            </div>
            {currentTab.actions && currentTab.actions.length > 0 ? (
              <div className={styles.actionButtons}>
                {currentTab.actions.map((actionItem, index) => (
                  <button 
                    key={index}
                    className={`${styles.actionButton} ${actionItem.primary ? styles.primaryButton : styles.secondaryButton}`}
                    onClick={() => {
                      onClose();
                      actionItem.action();
                    }}
                  >
                    {actionItem.label}
                  </button>
                ))}
              </div>
            ) : currentTab.action ? (
              <button 
                className={styles.actionButton}
                onClick={() => {
                  onClose();
                  currentTab.action && currentTab.action();
                }}
              >
                {getSpecificActionText(currentTab.id)} →
              </button>
            ) : (
              <p className={styles.sectionContent}>No actions available</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.tabNavigationOverlay}>
      <div className={styles.tabNavigationContainer}>
        {/* Header */}
        <div className={styles.tabNavigationHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>{icon}</span>
            <h2 className={styles.headerTitle}>{title}</h2>
          </div>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab Bar */}
        <div className={styles.tabBarContainer}>
          <div 
            ref={tabBarRef}
            className={styles.tabBar}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Fade Gradients */}
          {showLeftGradient && (
            <div className={`${styles.fadeGradient} ${styles.fadeLeft}`}></div>
          )}
          {showRightGradient && (
            <div className={`${styles.fadeGradient} ${styles.fadeRight}`}></div>
          )}
        </div>


        {/* Content Area */}
        <div className={styles.contentArea}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default TabNavigation;