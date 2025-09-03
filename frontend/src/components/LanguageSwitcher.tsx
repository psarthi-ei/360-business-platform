import React from 'react';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function LanguageSwitcher(props: LanguageSwitcherProps) {
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;

  return (
    <div className="language-switcher">
      <button 
        className={currentLanguage === 'en' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => onLanguageChange('en')}
      >
        English
      </button>
      <button 
        className={currentLanguage === 'gu' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => onLanguageChange('gu')}
      >
        ગુજરાતી
      </button>
      <button 
        className={currentLanguage === 'hi' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => onLanguageChange('hi')}
      >
        हिंदी
      </button>
    </div>
  );
}

export default LanguageSwitcher;