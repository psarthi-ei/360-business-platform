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
        title="About Us - ElevateIdea"
        description="Strategic technology partner for early-stage startups in the AI era. 20+ years enterprise experience, helping founders focus on business problems while we handle technology complexity. AI-accelerated development with strategic guidance."
        keywords="About ElevateIdea Technologies, strategic technology partner, early-stage startup consulting, AI-era development, startup technology solutions, business problem solving"
        canonical="/about"
        type="website"
      />
      <div className={styles.aboutPage}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Our Vision</h1>
          <p className={styles.heroVision}>
            To help early-stage startups focus on solving business problems while we handle 
            the technology complexity, enabling founders to build faster and smarter in the AI era.
          </p>
          <div className={styles.heroMissionSection}>
            <h2 className={styles.heroMissionTitle}>Our Mission</h2>
            <p className={styles.heroMission}>
              We partner with startup founders in the AI era, providing strategic technology 
              guidance and rapid development so they can focus on what matters most — 
              their customers and business model.
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className={styles.problemSection}>
          <div className={styles.problemContent}>
            <h2 className={styles.sectionTitle}>The Technology Burden That's Slowing Down Startup Innovation</h2>
            <p className={styles.problemIntro}>
              In the AI era, technology should accelerate innovation, not slow it down. Yet early-stage 
              startups are still spending months building technology instead of validating business models 
              and serving customers.
            </p>
            
            <div className={styles.problemGrid}>
              <div className={styles.problemCard}>
                <span className={styles.problemIcon}>⏰</span>
                <h3>Resource Drain</h3>
                <p>
                  Early-stage startups waste months building technology instead of validating 
                  business models. Time spent on technical complexity should be spent on customers, 
                  product-market fit, and business development.
                </p>
              </div>
              <div className={styles.problemCard}>
                <span className={styles.problemIcon}>🧠</span>
                <h3>Expertise Gap</h3>
                <p>
                  Founders need strategic technology decisions but lack industry experience 
                  to know what to build, how to build it efficiently, and when to pivot 
                  based on real-world constraints.
                </p>
              </div>
              <div className={styles.problemCard}>
                <span className={styles.problemIcon}>🤖</span>
                <h3>AI Era Confusion</h3>
                <p>
                  Powerful AI tools are available but most startups don't know how to use 
                  them strategically. Moving fast with AI requires experience to avoid 
                  costly mistakes and technical debt.
                </p>
              </div>
            </div>
            
            <div className={styles.currentReality}>
              <h3>The Current Reality</h3>
              <p>
                Most early-stage startups spend 70% of their time and resources on technology 
                challenges instead of solving customer problems. This slows innovation and 
                prevents founders from focusing on what drives business success.
              </p>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className={styles.solutionSection}>
          <h2 className={styles.sectionTitle}>Our Solution: Strategic Technology Partnership for the AI Era</h2>
          <p className={styles.solutionIntro}>
            We combine 20+ years of industry experience with cutting-edge AI tools to help startups 
            build 10X faster while making strategic decisions that matter. Let founders focus on business 
            problems while we handle technology complexity.
          </p>
          
          <div className={styles.solutionFlow}>
            <h3>AI-Accelerated Development with Strategic Guidance</h3>
            <p>
              From MVP development to scaling challenges → strategic architecture to AI implementation → 
              rapid prototyping to production deployment. Strategic partnership that grows with your startup.
            </p>
          </div>
          
          <div className={styles.solutionGrid}>
            <div className={styles.solutionCard}>
              <span className={styles.solutionIcon}>⚡</span>
              <h3>AI-Accelerated Development</h3>
              <p>
                Build 10X faster with strategic AI implementation. We know how to leverage 
                AI tools effectively while avoiding common pitfalls that come from moving 
                too fast without experience.
              </p>
            </div>
            
            <div className={styles.solutionCard}>
              <span className={styles.solutionIcon}>🎯</span>
              <h3>Strategic Guidance</h3>
              <p>
                20+ years of industry experience helps guide strategic technology decisions. 
                Know what to build, how to build it efficiently, and when to pivot based 
                on real-world constraints.
              </p>
            </div>
            
            <div className={styles.solutionCard}>
              <span className={styles.solutionIcon}>🤝</span>
              <h3>Startup Partnership</h3>
              <p>
                Not just delivery — ongoing strategic support from founders building their 
                own product. We understand startup challenges and constraints firsthand.
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
                  A strategic technology partner with over 20 years of experience helping organizations 
                  navigate complex technology decisions across enterprise, startup, and national-scale environments. 
                  His expertise spans strategic architecture, AI-era development, and turning around failing 
                  technology projects.
                </p>
                
                <p>
                  He has rescued major technology initiatives, including <strong>$15M+ in recovery value across 6 turnarounds</strong>, 
                  and served as <strong>Head of Technology for Aadhaar (UIDAI)</strong>, contributing to one of the world's 
                  largest digital identity platforms. His experience includes leading complex platform consolidation 
                  and scaling initiatives for enterprise clients.
                </p>
                
                <p>
                  Through ElevateIdea, he helps early-stage startups build 10X faster in the AI era while making 
                  strategic decisions that matter. Built ElevateBusiness 360° as a proof-of-concept with AI acceleration, 
                  demonstrating how strategic AI implementation can accelerate startup development without sacrificing quality.
                </p>
              </div>
            </div>
          </div>
        </section>




        {/* Call to Action */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Focus on Your Business Instead of Technology?</h2>
          <p className={styles.ctaSubtitle}>
            Let's discuss how 20+ years of industry experience combined with AI-era development 
            can help your startup build faster, make strategic decisions, and focus on what matters most — 
            your customers and business success.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta} onClick={handleConnectClick}>
              Schedule Startup Assessment
            </button>
            <button className={styles.secondaryCta} onClick={() => window.open('/elevatebusiness-360', '_blank')}>
              See Our Work
            </button>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}

export default AboutPage;