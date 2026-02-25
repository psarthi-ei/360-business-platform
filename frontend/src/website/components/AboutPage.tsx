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

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/parthasarthi/', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO
        title="About Us - ElevateIdea"
        description="ElevateIdea's vision: empower small & medium businesses to scale and innovate. Founded by 20+ year technology veteran with 6 major turnarounds. Digitizing Manufacturing MSMEs with 360° Business Platform."
        keywords="About ElevateIdea Technologies, MSME empowerment, small business technology, manufacturing digitization, 20+ years experience, technology veteran India"
        canonical="/about"
        type="website"
      />
      <div className={styles.aboutPage}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Our Vision</h1>
          <p className={styles.heroVision}>
            To empower small & medium businesses to scale, innovate, and reach their full 
            potential by leveraging technology as a catalyst for growth and success.
          </p>
          <div className={styles.heroMissionSection}>
            <h2 className={styles.heroMissionTitle}>Our Mission</h2>
            <p className={styles.heroMission}>
              We're on a mission to power India's next wave of growth — by digitizing 
              Manufacturing MSMEs with a 360° Business Platform that's mobile-first, 
              vernacular-ready, and simple to use.
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className={styles.problemSection}>
          <div className={styles.problemContent}>
            <h2 className={styles.sectionTitle}>The Technology Gap That's Holding Back India's Backbone</h2>
            <p className={styles.problemIntro}>
              Technology can elevate everyone's life significantly. But from factories in Coimbatore 
              to workshops in Rajkot, India's 6 crore+ MSMEs — the backbone of our economy — are 
              still running on broken systems.
            </p>
            
            <div className={styles.problemGrid}>
              <div className={styles.problemCard}>
                <span className={styles.problemIcon}>💰</span>
                <h3>Cost Barriers</h3>
                <p>
                  MSMEs don't have money to invest in expensive enterprise technology. 
                  Most CRM, ERP, and CXM solutions are priced for large companies, 
                  not small manufacturers trying to grow.
                </p>
              </div>
              <div className={styles.problemCard}>
                <span className={styles.problemIcon}>🛠️</span>
                <h3>Complexity Barriers</h3>
                <p>
                  Enterprise products require significant IT awareness to use effectively. 
                  Small manufacturers don't have dedicated IT teams — they need solutions 
                  as simple as WhatsApp.
                </p>
              </div>
              <div className={styles.problemCard}>
                <span className={styles.problemIcon}>🔧</span>
                <h3>Broken Workflows</h3>
                <p>
                  Sales tracked in diaries. Inventory in someone's head. Procurement over calls. 
                  Invoices delayed. Payments missed. No visibility, no integration, no control.
                </p>
              </div>
            </div>
            
            <div className={styles.currentReality}>
              <h3>The Current Reality</h3>
              <p>
                Most MSMEs juggle pen and paper, Excel sheets, WhatsApp groups, and disconnected 
                silo tools. There's no single system that understands their language, their 
                workflows, or their cost constraints.
              </p>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className={styles.solutionSection}>
          <h2 className={styles.sectionTitle}>Our Solution: A New Kind of 360° Business Platform</h2>
          <p className={styles.solutionIntro}>
            In this new world of AI where product development costs are minimizing and SaaS platforms 
            are rising, we can build genuine solutions with economy of scale. That's why we're building 
            ElevateBusiness 360° — a complete end-to-end solution as easy as WhatsApp.
          </p>
          
          <div className={styles.solutionFlow}>
            <h3>Complete Business Flow in One Platform</h3>
            <p>
              From leads to quotes → advance payments to procurement → manufacturing to dispatch → 
              invoicing to collections → customer experience to loyalty. All in one clean flow.
            </p>
          </div>
          
          <div className={styles.solutionGrid}>
            <div className={styles.solutionCard}>
              <span className={styles.solutionIcon}>📱</span>
              <h3>Mobile-First & Simple</h3>
              <p>
                No IT team needed. No juggling five tools. Built for the real hustle of 
                Indian business — as intuitive as WhatsApp, powerful as enterprise software.
              </p>
            </div>
            
            <div className={styles.solutionCard}>
              <span className={styles.solutionIcon}>🗣️</span>
              <h3>Vernacular-Ready</h3>
              <p>
                Understands your language, your workflows, your business practices. 
                Works in Gujarati, Hindi, and English — technology that adapts to you.
              </p>
            </div>
            
            <div className={styles.solutionCard}>
              <span className={styles.solutionIcon}>💡</span>
              <h3>Built for MSMEs</h3>
              <p>
                Affordable pricing through economy of scale. Designed specifically for 
                small manufacturers, not enterprise features you'll never use.
              </p>
            </div>
          </div>
        </section>

        {/* About the Founder Section */}
        <section className={styles.founderProfile}>
          <h2 className={styles.sectionTitle}>About the Founder</h2>
          <div className={styles.founderContent}>
            <div className={styles.founderBio}>
              <h3 className={styles.founderName}>Partha Sarthi</h3>
              
              <div className={styles.bioSection}>
                <p>
                  An engineering leader with over 20 years of experience building and stabilizing 
                  complex technology systems across enterprise, startup, and national-scale environments. His work 
                  spans distributed systems, enterprise platform architecture, infrastructure reliability, and 
                  engineering organization leadership.
                </p>
                
                <p>
                  He has led large engineering teams, including serving as <strong>Head of Technology for Aadhaar (UIDAI)</strong>, 
                  contributing to one of the world's largest digital identity platforms. At Reward360, he led 
                  platform consolidation and engineering scale initiatives across enterprise banking clients, 
                  strengthening system resilience and execution discipline.
                </p>
                
                <p>
                  Through ElevateIdea, he focuses on building AI-native engineering platforms designed to address 
                  under-digitized industries. His approach combines deep systems thinking with business clarity — 
                  solving real operational problems through disciplined architecture, scalable design, and strong execution.
                </p>
              </div>
            </div>
          </div>
        </section>




        {/* Call to Action */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Join Our Journey</h2>
          <p className={styles.ctaSubtitle}>
            We're building something that will transform Indian manufacturing. 
            Whether you're a textile manufacturer, investor, or potential team member, 
            we'd love to connect.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta} onClick={handleConnectClick}>
              Connect with Founder
            </button>
            <button className={styles.secondaryCta} onClick={handleLinkedInClick}>
              Founder LinkedIn
            </button>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}

export default AboutPage;