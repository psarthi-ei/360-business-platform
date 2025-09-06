import React from 'react';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className={styles.languageSwitcher}>
      <button 
        className={`${styles.langBtn} ${currentLanguage === 'en' ? styles.active : ''}`}
        onClick={() => onLanguageChange('en')}
      >
        English
      </button>
      <button 
        className={`${styles.langBtn} ${currentLanguage === 'gu' ? styles.active : ''}`}
        onClick={() => onLanguageChange('gu')}
      >
        ગુજરાતી
      </button>
      <button 
        className={`${styles.langBtn} ${currentLanguage === 'hi' ? styles.active : ''}`}
        onClick={() => onLanguageChange('hi')}
      >
        हिंदी
      </button>
    </div>
  );
}

export default LanguageSwitcher;