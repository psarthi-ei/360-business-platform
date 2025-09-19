import React from 'react';
import styles from '../styles/AboutPage.module.css';

interface AboutPageProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function AboutPage({ 
  currentLanguage, 
  onLanguageChange
}: AboutPageProps) {
  const companyTimeline = [
    {
      year: "2020",
      title: "Consulting Foundation",
      description: "Started with technology consulting, helping businesses solve complex technical challenges. Built expertise in Java, enterprise architecture, and system optimization across multiple industries."
    },
    {
      year: "2023",
      title: "Market Discovery",
      description: "Identified a critical gap in the MSME textile manufacturing sector. After interviewing 200+ manufacturers in Gujarat, discovered the need for voice-first, multilingual business platforms."
    },
    {
      year: "2024",
      title: "Product Pivot",
      description: "Made the strategic decision to transition from consulting to product development. Began building ElevateBusiness 360° specifically for India's textile MSME ecosystem."
    },
    {
      year: "2025",
      title: "Platform Launch",
      description: "Launching ElevateBusiness 360° as India's first voice-first, multilingual business platform. Targeting 500M+ MSME users with Gujarat as our initial market for validation and growth."
    }
  ];

  const coreValues = [
    {
      icon: "🎯",
      title: "Customer-Centric",
      description: "Every feature is built based on real conversations with MSME manufacturers. We solve real problems, not imaginary ones."
    },
    {
      icon: "🗣️",
      title: "Voice-First",
      description: "Understanding that voice commands in native languages are crucial for factory environments and non-technical users."
    },
    {
      icon: "🌐",
      title: "Truly Multilingual",
      description: "Not just translated UI, but culturally adapted experiences for Gujarati, Hindi, and English speakers."
    },
    {
      icon: "📈",
      title: "Growth-Focused",
      description: "Every feature is designed to directly impact business growth, profitability, and operational efficiency."
    },
    {
      icon: "🔧",
      title: "Pragmatic Innovation",
      description: "We use proven technologies to solve real problems, not bleeding-edge tech for its own sake."
    },
    {
      icon: "🤝",
      title: "Partnership Mindset",
      description: "We're not just a software provider - we're partners in our customers' business success and growth journey."
    }
  ];

  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            From Consulting to Product Innovation
          </h1>
          <p className={styles.heroSubtitle}>
            The story of how deep industry expertise and 365 days of continuous learning 
            led to building India's first voice-first, multilingual business platform 
            for MSME textile manufacturers.
          </p>
          <div className={styles.heroFounder}>
            <div className={styles.founderAvatar}>
              PS
            </div>
            <div className={styles.founderInfo}>
              <h3>Partha Sarthi</h3>
              <p>Founder & CEO, ElevateIdea Technologies</p>
            </div>
          </div>
        </section>

        {/* Company Story Timeline */}
        <section className={styles.companyStory}>
          <h2 className={styles.sectionTitle}>Our Journey</h2>
          <p className={styles.sectionSubtitle}>
            From technology consulting to building a platform that will transform 
            how 50+ million MSME textile manufacturers run their businesses.
          </p>
          
          <div className={styles.storyTimeline}>
            {companyTimeline.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className={styles.missionVision}>
          <h2 className={styles.sectionTitle}>Mission & Vision</h2>
          <div className={styles.missionVisionGrid}>
            <div className={styles.missionCard}>
              <span className={styles.cardIcon}>🎯</span>
              <h3 className={styles.cardTitle}>Our Mission</h3>
              <p className={styles.cardDescription}>
                To empower India's 50+ million MSME textile manufacturers with voice-first, 
                multilingual technology that transforms their business operations, improves cash flow, 
                and drives sustainable growth through complete 360° business visibility.
              </p>
            </div>
            
            <div className={styles.visionCard}>
              <span className={styles.cardIcon}>🌟</span>
              <h3 className={styles.cardTitle}>Our Vision</h3>
              <p className={styles.cardDescription}>
                To become the foundational business platform for India's entire MSME ecosystem, 
                starting with textile manufacturing and expanding to all sectors, enabling 
                500 million+ businesses to scale with technology.
              </p>
            </div>
          </div>
        </section>

        {/* Journey Metrics */}
        <section className={styles.journeyMetrics}>
          <h2 className={styles.metricsTitle}>Our Impact Journey</h2>
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>200+</span>
              <span className={styles.metricLabel}>Customer Interviews</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>365</span>
              <span className={styles.metricLabel}>Days of Learning</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>50M+</span>
              <span className={styles.metricLabel}>Target MSME Users</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>3</span>
              <span className={styles.metricLabel}>Languages Supported</span>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className={styles.values}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <p className={styles.sectionSubtitle}>
            The principles that guide everything we build and every decision we make.
          </p>
          
          <div className={styles.valuesGrid}>
            {coreValues.map((value, index) => (
              <div key={index} className={styles.valueCard}>
                <span className={styles.valueIcon}>{value.icon}</span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
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
            <button className={styles.primaryCta}>
              Get Started with Platform
            </button>
            <button className={styles.secondaryCta}>
              Connect with Founder
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;