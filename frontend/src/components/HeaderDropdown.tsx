import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/HeaderDropdown.module.css';

interface HeaderDropdownProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateHome?: () => void;
  showThemeSelector?: boolean;
}

function HeaderDropdown({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateHome,
  showThemeSelector = true
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
        <span className={styles.triggerIcon}>⚙️</span>
        <span className={styles.triggerText}>Menu</span>
        <span className={styles.dropdownArrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>

          {/* Language Section */}
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