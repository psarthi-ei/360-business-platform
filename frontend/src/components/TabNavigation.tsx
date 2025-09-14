import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/TabNavigation.module.css';

interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  action?: () => void;
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
  children
}: TabNavigationProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const handleTabClick = (tabId: string, action?: () => void) => {
    setActiveTab(tabId);
    if (action) {
      action();
    }
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
        <div className={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => handleTabClick(tab.id, tab.action)}
            >
              {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
              <span className={styles.tabLabel}>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={styles.tabCount}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Info Section */}
        <div className={styles.quickInfoSection}>
          {quickStats && (
            <div className={styles.quickStats}>
              <span className={styles.quickStatsIcon}>📊</span>
              <span className={styles.quickStatsText}>{quickStats}</span>
            </div>
          )}
          
          {nextAction && (
            <div className={styles.nextAction}>
              <span className={styles.nextActionIcon}>🎯</span>
              <span className={styles.nextActionText}>{nextAction}</span>
            </div>
          )}
          
          {voiceCommands.length > 0 && (
            <div className={styles.voiceCommands}>
              <span className={styles.voiceCommandsIcon}>📱</span>
              <span className={styles.voiceCommandsText}>
                {t('Voice Commands')}: {voiceCommands.slice(0, 2).map(cmd => `"${cmd}"`).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {children}
        </div>

        {/* Smart Links */}
        {smartLinks.length > 0 && (
          <div className={styles.smartLinksSection}>
            <div className={styles.smartLinksHeader}>
              <span className={styles.smartLinksIcon}>➤</span>
              <span className={styles.smartLinksTitle}>{t('Smart Actions')}</span>
            </div>
            <div className={styles.smartLinksList}>
              {smartLinks.map((link, index) => (
                <button
                  key={index}
                  className={styles.smartLinkButton}
                  onClick={link.action}
                >
                  <span className={styles.smartLinkText}>{link.text}</span>
                  <span className={styles.smartLinkArrow}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TabNavigation;