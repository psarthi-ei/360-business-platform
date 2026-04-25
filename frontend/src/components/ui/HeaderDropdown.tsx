import React, { useState, useRef, useEffect } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import styles from './HeaderDropdown.module.css';

interface HeaderDropdownProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateHome?: () => void;
  onDashboard?: () => void;
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
  // Page Context
  isPlatformPage?: boolean;
}

function HeaderDropdown({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateHome,
  onDashboard,
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
  onElevateBusiness360,
  // Page Context
  isPlatformPage = false
}: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();
  
  // Smart navigation visibility logic (Option 2):
  // - Platform pages: Always show navigation (no nav in platform header)
  // - Website pages: Show navigation ONLY on mobile (desktop gets quick actions only)
  const shouldShowWebsiteNavigation = isPlatformPage || (showWebsiteNavigation && isMobile);
  
  // Context-aware sections:
  // - Authentication: Only show on platform pages
  // - Language: Only show on platform pages  
  // - Website gets clean navigation-only menu
  const shouldShowAuthSection = isPlatformPage;
  const shouldShowLanguageSection = isPlatformPage;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  // Theme functionality removed for MVP simplicity

  // const handleNavigation = (action: () => void) => {
  //   action();
  //   setIsOpen(false);
  // };

  return (
    <div className={`${styles.headerDropdown} ${isPlatformPage ? styles.platformPage : ''}`} ref={dropdownRef}>
      <button 
        className={styles.dropdownTrigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Options Menu"
      >
        <span className={styles.triggerIcon}>☰</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>

          {/* Website Navigation Section - Smart Responsive Display */}
          {shouldShowWebsiteNavigation && (
            <div className={`${styles.menuSection} ${styles.websiteNavigationSection}`}>
              <div className={styles.sectionTitle}>Navigation</div>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onNavigateHome?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>🎯</span>
                <span className={styles.itemText}>Services</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onElevateBusiness360?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>🚀</span>
                <span className={styles.itemText}>Our Work</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onLeadership?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>🧠</span>
                <span className={styles.itemText}>Leadership</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onAbout?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>ℹ️</span>
                <span className={styles.itemText}>About</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onContact?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>📞</span>
                <span className={styles.itemText}>Contact</span>
              </button>
            </div>
          )}


          {/* Authentication Section - Only on Platform Pages */}
          {shouldShowAuthSection && (
          <div className={styles.menuSection}>
            <div className={styles.sectionTitle}>
              {isAuthenticated ? `Account: ${userMode === 'guest' ? '👤 Guest' : userMode === 'demo' ? '🎬 Demo User' : '👤 User'}` : 'Access'}
            </div>
            {!isAuthenticated && (
              <>
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    onLogin?.();
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.itemIcon}>🔑</span>
                  <span className={styles.itemText}>Sign In</span>
                </button>
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    onSignUp?.();
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.itemIcon}>📝</span>
                  <span className={styles.itemText}>Sign Up</span>
                </button>
                <div className={styles.sectionTitle} style={{ fontSize: '0.8em', marginTop: '8px' }}>Browse Modes</div>
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    onGuestMode?.();
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.itemIcon}>👤</span>
                  <span className={styles.itemText}>Guest Mode</span>
                </button>
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    onDemoMode?.();
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.itemIcon}>🎬</span>
                  <span className={styles.itemText}>Demo Mode</span>
                </button>
              </>
            )}
            {isAuthenticated && (
              <button
                className={styles.menuItem}
                onClick={() => {
                  onLogout?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>🚪</span>
                <span className={styles.itemText}>Sign Out</span>
              </button>
            )}
          </div>
          )}

          {/* Language Section - Only on Platform Pages */}
          {shouldShowLanguageSection && (
          <div className={styles.menuSection}>
            <div className={styles.sectionTitle}>
              Language: {currentLang?.flag} {currentLang?.name}
            </div>
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`${styles.menuItem} ${currentLanguage === lang.code ? styles.activeItem : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <span className={styles.itemIcon}>{lang.flag}</span>
                <span className={styles.itemText}>{lang.name}</span>
                {currentLanguage === lang.code && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
          )}


          {/* Theme Section removed for MVP simplicity */}
        </div>
      )}
    </div>
  );
}

export default HeaderDropdown;