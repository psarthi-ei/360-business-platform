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
        title="Contact Partha Sarthi - Fractional CTO - ElevateIdea"
        description="Get in touch with Fractional CTO for startup technology guidance. Previously at Aadhaar, IBM, and Thoughtworks. I help early-stage startups with technology direction, engineering execution, and AI-accelerated development practices."
        keywords="Contact Partha Sarthi, technology direction, engineering execution, startup technology guidance, Former Head of Technology Aadhaar, Fractional CTO contact, consulting CTO, early-stage startup technology leadership"
        canonical="/contact"
      />
      <div className={styles.contactPage}>
        <div className={styles.container}>

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>
              Let's Discuss Your Startup's Technology Challenges
            </h1>
            <p className={styles.heroSubtitle}>
              Whether you're building your MVP, scaling your product, or improving engineering execution — 
              I can help you make better technology decisions and move faster with AI-native practices.
            </p>
            
            <div className={styles.engagementOptions}>
              <h2 className={styles.engagementTitle}>How I Can Help</h2>
              <div className={styles.engagementGrid}>
                <div className={styles.engagementCard}>
                  <h3 className={styles.engagementName}>Fractional CTO</h3>
                  <p className={styles.engagementDescription}>
                    Ongoing strategic technology guidance for early-stage startups
                  </p>
                </div>
                
                <div className={styles.engagementCard}>
                  <h3 className={styles.engagementName}>Product Acceleration</h3>
                  <p className={styles.engagementDescription}>
                    Focused engagement to help accelerate MVP or product delivery
                  </p>
                </div>
                
                <div className={styles.engagementCard}>
                  <h3 className={styles.engagementName}>Technical Advisory</h3>
                  <p className={styles.engagementDescription}>
                    Short-term guidance for architecture, scalability, and execution challenges
                  </p>
                </div>
              </div>
            </div>
            
            <button className={styles.heroCta} onClick={handleConnectClick}>
              Book a Startup Technology Discussion
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