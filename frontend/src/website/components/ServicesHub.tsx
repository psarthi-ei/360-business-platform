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
        title="Fractional CTO for Early-Stage Startups - ElevateIdea"
        description="I help early-stage startups make better technology decisions, accelerate product development, and build scalable systems using AI-native engineering practices. 20+ years experience."
        keywords="Fractional CTO, consulting CTO, early-stage startups, AI-native engineering, startup technology leadership, MVP development India"
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
          "description": "Fractional CTO for early-stage startups. Former Head of Technology for Aadhaar (UIDAI). 20+ years experience at IBM, Thoughtworks, helping startups make better technology decisions and move faster with AI-native engineering.",
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
            Fractional CTO for Early-Stage Startups
          </h1>
          <p className={styles.heroSubtitle}>
            I help early-stage startups make better technology decisions, accelerate product development, 
            and build scalable systems using AI-native engineering practices. <span className={styles.credentialHighlight}>Former Head of Technology for Aadhaar (UIDAI)</span>.
          </p>
          <p className={styles.heroDescription}>
            Whether you're building your MVP, struggling with execution, or preparing to scale — I bring 
            20+ years of experience across startups and enterprise systems to help you move faster with 
            clarity and confidence.
          </p>
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

        {/* Who I Work With Section */}
        <section className={styles.whatWeDo}>
          <h2 className={styles.sectionTitle}>Who I Work With</h2>
          <p className={styles.sectionSubtitle}>
            I work with early-stage startups that need senior technology leadership but are not ready for a full-time CTO.
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
              <h3 className={styles.criteriaTitle}>Typical Startup Stage:</h3>
              <ul className={styles.criteriaList}>
                <li>Pre-seed to Series A</li>
                <li>5-20 employee companies</li>
                <li>0-10 engineering team size</li>
                <li>Product-focused startups with complexity</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Common Problems Section */}
        <section className={styles.problemsSection}>
          <h2 className={styles.sectionTitle}>Common Challenges I Help Solve</h2>
          <p className={styles.sectionSubtitle}>
            What engineering or product challenges are slowing you down right now?
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
                Head of Technology for Aadhaar (UIDAI), plus enterprise experience at IBM and Thoughtworks
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
            Whether you're building your MVP, scaling your product, or trying to improve engineering execution, 
            I can help you move faster with the right technical direction.
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