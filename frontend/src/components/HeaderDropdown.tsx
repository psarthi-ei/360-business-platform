import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/HeaderDropdown.module.css';

interface HeaderDropdownProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateHome?: () => void;
  showThemeSelector?: boolean;
  onLogin?: () => void;
  onSignUp?: () => void;
  onGuestMode?: () => void;
  onDemoMode?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userMode?: string;
  // Mobile Navigation Props (only for mobile)
  isMobile?: boolean;
  onServicesHub?: () => void;
  onBlogHome?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
}

function HeaderDropdown({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateHome,
  showThemeSelector = true,
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onLogout,
  isAuthenticated = false,
  userMode = 'guest',
  // Mobile Navigation Props
  isMobile = false,
  onServicesHub,
  onBlogHome,
  onAbout,
  onContact
}: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);
  const currentThemeData = themes.find(theme => theme.id === currentTheme);

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  const handleThemeSelect = (themeId: string) => {
    if (onThemeChange) {
      onThemeChange(themeId);
    }
    setIsOpen(false);
  };

  // const handleNavigation = (action: () => void) => {
  //   action();
  //   setIsOpen(false);
  // };

  return (
    <div className={styles.headerDropdown} ref={dropdownRef}>
      <button 
        className={styles.dropdownTrigger}
        onClick={() => setIsOpen(!isOpen)}
        title="Options Menu"
      >
        <span className={styles.triggerIcon}>☰</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>

          {/* Authentication Section - Top Priority */}
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

          {/* Mobile Navigation Section */}
          {isMobile && (
            <div className={styles.menuSection}>
              <div className={styles.sectionTitle}>Navigation</div>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onDemoMode?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>⚡</span>
                <span className={styles.itemText}>ElevateBusiness 360°</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onServicesHub?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>🎯</span>
                <span className={styles.itemText}>Consulting Services</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onBlogHome?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>📝</span>
                <span className={styles.itemText}>365 Days Blog</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => {
                  onAbout?.();
                  setIsOpen(false);
                }}
              >
                <span className={styles.itemIcon}>ℹ️</span>
                <span className={styles.itemText}>About Us</span>
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

          {/* Language Section - Mobile Only */}
          {isMobile && (
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


          {/* Theme Section */}
          {currentTheme && onThemeChange && (
            <div className={styles.menuSection}>
              <div className={styles.sectionTitle}>
                Theme: {currentThemeData?.icon} {currentThemeData?.name}
              </div>
              {themes.map(theme => (
                <button
                  key={theme.id}
                  className={`${styles.menuItem} ${currentTheme === theme.id ? styles.activeItem : ''}`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <span className={styles.itemIcon}>{theme.icon}</span>
                  <span className={styles.itemText}>{theme.name}</span>
                  {currentTheme === theme.id && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderDropdown;