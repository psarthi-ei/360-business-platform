import React from 'react';
import SEO from '../../components/ui/SEO';
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
    <>
      <SEO
        title="Contact - ElevateIdea"
        description="Get in touch with ElevateIdea Technologies for strategic technology partnership. Whether you're an early-stage startup founder, tech entrepreneur, or investor interested in AI-era development - let's connect."
        keywords="ElevateIdea contact, strategic technology partner, early-stage startup consulting, AI-era development, startup technology solutions, MVP development"
        canonical="/contact"
      />
      <div className={styles.contactPage}>
        <div className={styles.container}>

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>
              Ready to Build 10X Faster in the AI Era?
            </h1>
            <p className={styles.heroSubtitle}>
              Whether you're an early-stage startup founder ready for 30-day MVP development, 
              a tech entrepreneur seeking strategic guidance, or an investor interested in 
              AI-era development methodology - we'd love to hear from you.
            </p>
            <button className={styles.heroCta} onClick={handleConnectClick}>
              Start the Conversation
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
    </>
  );
}

export default ContactPage;