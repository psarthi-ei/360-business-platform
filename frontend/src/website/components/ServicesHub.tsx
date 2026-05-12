import React, { useEffect } from 'react';
import { scrollToTop } from '../../utils/scrollUtils';
import { openConsultationForm } from '../../utils/contactUtils';
import SEO from '../../components/ui/SEO';
import styles from '../styles/ServicesHub.module.css';

interface ServicesHubProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  resetKey?: number; // Force component reset when this changes
  onAbout?: () => void;
}

function ServicesHub({ 
  currentLanguage, 
  onLanguageChange,
  resetKey,
  onAbout
}: ServicesHubProps) {
  // Scroll to top when component initially mounts
  useEffect(() => {
    setTimeout(() => scrollToTop({ behavior: 'smooth' }), 200);
  }, []);

  // Reset effect when resetKey changes
  useEffect(() => {
    // Component reset logic if needed
  }, [resetKey]);


  // Single page view - no service portfolio complexity
  return (
    <>
      <SEO
        title="Technology Direction for Startups - ElevateIdea"
        description="Many early-stage startups struggle with technology direction and engineering execution. As a Fractional CTO with experience at Aadhaar, IBM, and Thoughtworks, I help startups navigate these challenges using AI-accelerated development practices."
        keywords="technology direction, engineering execution, startup technology problems, technical leadership, startup CTO guidance, Fractional CTO, consulting CTO, early-stage startups, AI-native engineering, startup technology leadership, MVP development India"
        canonical="/"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Partha Sarthi",
          "jobTitle": "Fractional CTO",
          "worksFor": {
            "@type": "Organization",
            "name": "ElevateIdea Technologies Private Limited",
            "url": "https://elevateidea.com"
          },
          "description": "Fractional CTO for early-stage startups with 20+ years experience at Aadhaar, IBM, and Thoughtworks, helping startups make better technology decisions and move faster with AI-native engineering.",
          "areaServed": "India",
          "offers": {
            "@type": "Service",
            "name": "Fractional CTO Services",
            "description": "Technology leadership for early-stage startups including MVP development, engineering guidance, and AI-native development practices"
          }
        }}
      />
      <div className={styles.servicesHub}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Struggling with Technology Direction for Your Startup?
          </h1>
          <p className={styles.heroSubtitle}>
            Many early-stage startups struggle to move product development fast enough, make the right architecture decisions, or build strong engineering foundations. I help startups navigate these challenges as a Fractional CTO using AI-accelerated development practices and 20+ years of experience across startups and enterprise systems.
          </p>
          
          <div className={styles.authorIntro}>
            <h2 className={styles.authorName}>Partha Sarthi</h2>
            <p className={styles.authorCredentials}>
              Former Head of Technology, Aadhaar (UIDAI) | Previously at IBM, Thoughtworks
            </p>
          </div>
          
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>20+</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>10X</span>
              <span className={styles.statLabel}>Faster with AI</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>30</span>
              <span className={styles.statLabel}>Day MVP Delivery</span>
            </div>
          </div>
        </section>

        {/* Common Problems Section - Moved up for better psychological flow */}
        <section className={styles.problemsSection}>
          <h2 className={styles.sectionTitle}>Startups Typically Reach Out When...</h2>
          <p className={styles.sectionSubtitle}>
            Common technology challenges that bring startup founders to us:
          </p>
          
          <div className={styles.problemsGrid}>
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>"We need senior technical leadership."</h3>
              <p className={styles.problemDescription}>
                Gain strategic CTO-level guidance without hiring a full-time senior executive.
              </p>
            </div>
            
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>"We are unsure about technical direction."</h3>
              <p className={styles.problemDescription}>
                Get clarity on architecture, technology choices, scalability, and engineering strategy.
              </p>
            </div>
            
            <div className={styles.problemCard}>
              <h3 className={styles.problemTitle}>"We need to build faster."</h3>
              <p className={styles.problemDescription}>
                Move from idea to product quickly using pragmatic architecture and AI-assisted development workflows.
              </p>
            </div>
          </div>
        </section>

        {/* How I Help Section */}
        <section className={styles.howIHelp}>
          <h2 className={styles.sectionTitle}>How I Help</h2>
          <p className={styles.sectionSubtitle}>
            Depending on your needs, I help with various aspects of technology leadership and execution.
          </p>
          
          <div className={styles.helpGrid}>
            <div className={styles.helpCard}>
              <h3 className={styles.helpTitle}>Engineering Leadership</h3>
              <p className={styles.helpDescription}>
                Provide strategic direction across architecture, execution, engineering process, and team structure.
              </p>
            </div>
            
            <div className={styles.helpCard}>
              <h3 className={styles.helpTitle}>MVP & Product Development</h3>
              <p className={styles.helpDescription}>
                Help founders turn ideas into working products with practical engineering guidance and fast execution.
              </p>
            </div>
            
            <div className={styles.helpCard}>
              <h3 className={styles.helpTitle}>AI-Native Engineering</h3>
              <p className={styles.helpDescription}>
                Leverage modern AI-assisted development workflows to improve engineering speed and productivity.
              </p>
            </div>
          </div>
        </section>

        {/* Who I Work With Section - Moved below How I Help */}
        <section className={styles.whatWeDo}>
          <h2 className={styles.sectionTitle}>I Typically Work With</h2>
          <p className={styles.sectionSubtitle}>
            Early-stage startups that need senior technical leadership but are not ready for a full-time CTO.
          </p>
          
          <div className={styles.customerCriteria}>
            <div className={styles.criteriaCard}>
              <h3 className={styles.criteriaTitle}>Early-stage startups that:</h3>
              <ul className={styles.criteriaList}>
                <li>Need technical leadership but are not ready for a full-time CTO</li>
                <li>Want to move faster without compromising technical foundations</li>
                <li>Are struggling with product execution or engineering direction</li>
                <li>Need help building and scaling engineering teams and systems</li>
              </ul>
            </div>
            
            <div className={styles.criteriaCard}>
              <h3 className={styles.criteriaTitle}>Typical engagement:</h3>
              <ul className={styles.criteriaList}>
                <li>Pre-seed to Series A startups</li>
                <li>Small to medium engineering teams</li>
                <li>Product-focused companies with technical complexity</li>
                <li>Founders who want to build with AI acceleration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Trust Me Section */}
        <section className={styles.whyTrustMe}>
          <h2 className={styles.sectionTitle}>Why Founders Work With Me</h2>
          <div className={styles.credibilityGrid}>
            <div className={styles.credibilityCard}>
              <span className={styles.credibilityIcon}>⭐</span>
              <h3 className={styles.credibilityTitle}>20+ years of experience</h3>
              <p className={styles.credibilityDescription}>
                Across startups and large-scale technology systems
              </p>
            </div>
            
            <div className={styles.credibilityCard}>
              <span className={styles.credibilityIcon}>🏢</span>
              <h3 className={styles.credibilityTitle}>Leadership at scale</h3>
              <p className={styles.credibilityDescription}>
                Senior technology leadership experience at Aadhaar, IBM, and Thoughtworks
              </p>
            </div>
            
            <div className={styles.credibilityCard}>
              <span className={styles.credibilityIcon}>🎯</span>
              <h3 className={styles.credibilityTitle}>Practical approach</h3>
              <p className={styles.credibilityDescription}>
                Execution-focused, understanding both startup speed and engineering fundamentals
              </p>
            </div>
            
            <div className={styles.credibilityCard}>
              <span className={styles.credibilityIcon}>🤝</span>
              <h3 className={styles.credibilityTitle}>Founder empathy</h3>
              <p className={styles.credibilityDescription}>
                Built my own startup and understand the challenges and constraints firsthand
              </p>
            </div>
          </div>
        </section>

        {/* Engagement Models Section */}
        <section className={styles.engagementModels}>
          <h2 className={styles.sectionTitle}>How Engagement Works</h2>
          <div className={styles.engagementGrid}>
            <div className={styles.engagementCard}>
              <h3 className={styles.engagementTitle}>Fractional CTO</h3>
              <p className={styles.engagementDescription}>
                Ongoing strategic technology guidance for early-stage startups
              </p>
            </div>
            
            <div className={styles.engagementCard}>
              <h3 className={styles.engagementTitle}>Product Acceleration</h3>
              <p className={styles.engagementDescription}>
                Focused engagement to help accelerate MVP or product delivery
              </p>
            </div>
            
            <div className={styles.engagementCard}>
              <h3 className={styles.engagementTitle}>Technical Advisory</h3>
              <p className={styles.engagementDescription}>
                Short-term guidance for architecture, scalability, and engineering execution challenges
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Need Senior Technology Guidance for Your Startup?</h2>
          <p className={styles.ctaSubtitle}>
            Whether you're building an MVP, improving engineering execution, or scaling your product, 
            I can help you navigate technology decisions with practical, hands-on guidance.
          </p>
          <div className={styles.ctaButtons}>
            <button 
              className={styles.primaryCta}
              onClick={openConsultationForm}
            >
              Book a Startup Technology Discussion
            </button>
            <button 
              className={styles.secondaryCta}
              onClick={() => onAbout?.()}
            >
              Learn More About My Experience
            </button>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}

export default ServicesHub;