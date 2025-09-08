import React from 'react';
import styles from '../styles/LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }
  ];

  // const currentLanguageData = languageOptions.find(lang => lang.code === currentLanguage) || languageOptions[0];

  return (
    <div className={styles.languageSwitcher}>
      <select 
        className={styles.langSelect}
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSwitcher;