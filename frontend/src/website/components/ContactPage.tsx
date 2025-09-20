import React from 'react';
import styles from '../styles/ContactPage.module.css';
import { openConsultationForm } from '../../utils/contactUtils';

interface ContactPageProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function ContactPage({ 
  currentLanguage, 
  onLanguageChange
}: ContactPageProps) {

  const handleConnectClick = () => {
    openConsultationForm();
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Let's Connect
          </h1>
          <p className={styles.heroSubtitle}>
            Whether you're a textile manufacturer ready to transform your business, 
            an enterprise seeking consulting services, or an investor interested in 
            India's MSME technology revolution - we'd love to hear from you.
          </p>
          <button className={styles.heroCta} onClick={handleConnectClick}>
            Connect with Us
          </button>
        </section>

        {/* Contact Information */}
        <section className={styles.contactSection}>
          <div className={styles.contactDetails}>
            <div className={styles.addressBlock}>
              <p>ElevateIdea Technologies Private Limited</p>
              <p>Electronic City, Bangalore</p>
              <p>Karnataka, India - 560100</p>
            </div>
            
            <div className={styles.contactBlock}>
              <div className={styles.contactItem}>
                <p><a href="mailto:partha.sarthi@elevateidea.com">partha.sarthi@elevateidea.com</a></p>
              </div>
              <div className={styles.contactItem}>
                <p><a href="tel:+918123110011">+91 8123110011</a></p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default ContactPage;