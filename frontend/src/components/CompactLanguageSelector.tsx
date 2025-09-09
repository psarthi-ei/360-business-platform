import React, { useState } from 'react';
import styles from '../styles/CompactLanguageSelector.module.css';

interface CompactLanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  displayName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', displayName: 'English' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', displayName: 'ગુજરાતી' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', displayName: 'हिंदी' }
];

function CompactLanguageSelector({ currentLanguage, onLanguageChange }: CompactLanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);


  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSelector}>
      <button 
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language"
      >
        🌐
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            <div className={styles.header}>
              <h4>Select Language</h4>
              <button 
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.languageList}>
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`${styles.languageOption} ${
                    currentLanguage === language.code ? styles.active : ''
                  }`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <span className={styles.flag}>{language.flag}</span>
                  <div className={styles.languageInfo}>
                    <span className={styles.languageName}>{language.name}</span>
                    <span className={styles.languageDisplay}>{language.displayName}</span>
                  </div>
                  {currentLanguage === language.code && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <p>🌍 Language saves automatically</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CompactLanguageSelector;