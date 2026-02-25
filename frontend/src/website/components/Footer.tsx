import React from 'react';
import styles from '../styles/Footer.module.css';

interface FooterProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onAbout: () => void;
  onContact: () => void;
}

function Footer({ currentLanguage, onLanguageChange, onAbout, onContact }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/company/elevate-idea/', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          <div className={styles.companyInfo}>
            <span className={styles.companyName}>ElevateIdea Technologies Private Limited</span>
            <span className={styles.separator}>•</span>
            <span className={styles.location}>Electronic City, Bangalore</span>
          </div>
          
          <div className={styles.footerLinks}>
            <button className={styles.footerLink} onClick={onAbout}>About</button>
            <span className={styles.linkSeparator}>|</span>
            <button className={styles.footerLink} onClick={onContact}>Contact</button>
            <span className={styles.linkSeparator}>|</span>
            <button className={styles.footerLink} onClick={handleLinkedInClick}>LinkedIn</button>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>© {currentYear} ElevateIdea Technologies. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;