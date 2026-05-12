import React from 'react';
import styles from '../styles/AboutPage.module.css';
import { openConsultationForm } from '../../utils/contactUtils';
import SEO from '../../components/ui/SEO';

interface AboutPageProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function AboutPage({ 
  currentLanguage, 
  onLanguageChange
}: AboutPageProps) {

  const handleConnectClick = () => {
    openConsultationForm();
  };


  return (
    <>
      <SEO
        title="About Partha Sarthi - Fractional CTO - ElevateIdea"
        description="Fractional CTO for early-stage startups. Previously at Aadhaar, IBM, and Thoughtworks. I help startups with technology direction and engineering execution using AI-accelerated development practices."
        keywords="Partha Sarthi, technology direction, engineering execution, Aadhaar UIDAI, IBM, Thoughtworks, Former Head of Technology, Fractional CTO, consulting CTO, early-stage startups, startup technology leadership"
        canonical="/about"
        type="website"
      />
      <div className={styles.aboutPage}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Vision</h1>
          <p className={styles.heroVision}>
            To build a premier boutique technology firm that empowers startups through 
            strategic consulting and breakthrough technology solutions.
          </p>
          <div className={styles.heroMissionSection}>
            <h2 className={styles.heroMissionTitle}>Mission</h2>
            <p className={styles.heroMission}>
              To partner with early-stage startup founders as their Fractional CTO, enabling 
              them to focus on their core business while we handle technology complexity 
              and accelerate product development.
            </p>
          </div>
        </section>



        {/* About Me Section */}
        <section className={styles.founderProfile}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          <div className={styles.founderContent}>
            <div className={styles.founderPhoto}>
              <img 
                src="/photo/Informal Dress Photo.png" 
                alt="Partha Sarthi - Fractional CTO"
                className={styles.photoImage}
              />
            </div>
            <div className={styles.founderBio}>
              <h3 className={styles.founderName}>Partha Sarthi</h3>
              
              <div className={styles.bioSection}>
                <p>
                  I'm a Fractional CTO with over 20 years of experience across startups, enterprise platforms, and national-scale technology systems.
                </p>
                
                <p>
                  Previously, I served as <strong>Head of Technology for Aadhaar (UIDAI)</strong>, contributing to one of the world's largest digital identity platforms. My experience also includes leadership roles at IBM and Thoughtworks, where I worked on large-scale engineering, architecture, and platform modernization initiatives.
                </p>
                
                <p>
                  Over the years, I've helped organizations navigate complex engineering challenges — from scaling platforms and improving execution to stabilizing high-risk technology initiatives and aligning engineering teams around clear technical direction.
                </p>
                
                <p>
                  Today, through ElevateIdea, I work closely with early-stage startups as a Fractional CTO and technology partner. I help founders accelerate product development, make pragmatic architecture decisions, improve engineering execution, and build scalable technical foundations without needing a full-time senior technology leader.
                </p>
                
                <p>
                  I'm particularly interested in how AI is changing software engineering and product development — not just by making coding faster, but by fundamentally changing how startups build, scale, and operate engineering teams.
                </p>
                
                <div className={styles.socialLinks}>
                  <a 
                    href="https://linkedin.com/in/parthasarthi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.linkedinLink}
                    aria-label="Connect with Partha Sarthi on LinkedIn"
                  >
                    <svg className={styles.linkedinIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>




        {/* Call to Action */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Focus on Your Business Instead of Technology?</h2>
          <p className={styles.ctaSubtitle}>
            Let's discuss how my 20+ years of industry experience combined with AI-era development 
            can help your startup build faster, make strategic decisions, and focus on what matters most — 
            your customers and business success.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta} onClick={handleConnectClick}>
              Book a Startup Technology Discussion
            </button>
            <button className={styles.secondaryCta} onClick={() => window.open('/elevatebusiness-360', '_blank')}>
              See My Work
            </button>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}

export default AboutPage;