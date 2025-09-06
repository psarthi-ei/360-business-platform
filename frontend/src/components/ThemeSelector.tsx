import React, { useState } from 'react';
import { themes, themesList, applyTheme } from '../styles/themes';
import styles from '../styles/ThemeSelector.module.css';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeName: string) => void;
}

function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (themeName: string) => {
    onThemeChange(themeName);
    applyTheme(themes[themeName]);
    setIsOpen(false);
  };


  return (
    <div className={styles.themeSelector}>
      <button 
        className={styles.themeButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme"
      >
        🎨 Theme
      </button>

      {isOpen && (
        <>
          <div className={styles.themeBackdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.themeDropdown}>
          <div className={styles.themeHeader}>
            <h4>Choose Your Style</h4>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className={styles.themeGrid}>
            {themesList.map((theme) => (
              <div
                key={theme.name}
                className={`${styles.themeCard} ${
                  currentTheme === theme.name ? styles.active : ''
                }`}
                onClick={() => handleThemeSelect(theme.name)}
              >
                {/* Theme Preview */}
                <div 
                  className={styles.themePreview}
                  style={{
                    background: theme.gradients.background,
                  }}
                >
                  <div 
                    className={styles.previewCard}
                    style={{
                      background: theme.gradients.card,
                      borderRadius: theme.borderRadius.medium,
                      border: `1px solid ${theme.colors.primary}`
                    }}
                  >
                    <div 
                      className={styles.previewButton}
                      style={{
                        background: theme.gradients.button,
                        borderRadius: theme.borderRadius.small,
                        color: theme.name === 'minimalist' ? '#2d3436' : '#ffffff'
                      }}
                    >
                      Sample
                    </div>
                  </div>
                </div>

                {/* Theme Info */}
                <div className={styles.themeInfo}>
                  <h5>{theme.displayName}</h5>
                  <div className={styles.colorPalette}>
                    <span 
                      className={styles.colorDot}
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span 
                      className={styles.colorDot}
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    <span 
                      className={styles.colorDot}
                      style={{ backgroundColor: theme.colors.success }}
                    />
                  </div>
                  {currentTheme === theme.name && (
                    <span className={styles.activeBadge}>Current</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.themeFooter}>
            <p>✨ Themes save automatically</p>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default ThemeSelector;