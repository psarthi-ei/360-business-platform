import React, { useState, useEffect } from 'react';
import styles from '../styles/HomePage.module.css';

interface HomePageProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onGetStarted: () => void;
  onSeeDemo: () => void;
  onNavigateDashboard?: () => void;
  translations: any;
}

function HomePage({ 
  currentLanguage, 
  onLanguageChange, 
  onGetStarted,
  onSeeDemo,
  onNavigateDashboard,
  translations: t 
}: HomePageProps) {
  const [animatedStats, setAnimatedStats] = useState({
    timeSaved: 0,
    accuracy: 0,
    efficiency: 0,
    satisfaction: 0
  });

  // Animate statistics on component mount
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, key: string) => {
      const increment = (end - start) / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 16);
    };

    // Start animations after a short delay
    setTimeout(() => {
      animateValue(0, 3, 1500, 'timeSaved');
      animateValue(0, 95, 1500, 'accuracy');
      animateValue(0, 70, 1500, 'efficiency');
      animateValue(0, 98, 1500, 'satisfaction');
    }, 500);
  }, []);

  // Circular business cycle - complete end-to-end flow (10 steps)
  const businessCycle = [
    { icon: '🎯', key: 'leadGen', title: 'Leads', color: '#ff4757', angle: 0 },
    { icon: '📈', key: 'sales', title: 'Sales', color: '#ffa502', angle: 36 },
    { icon: '💳', key: 'advancePayment', title: 'Advance', color: '#3742fa', angle: 72 },
    { icon: '🛒', key: 'procurement', title: 'Procurement', color: '#2ed573', angle: 108 },
    { icon: '⚙️', key: 'manufacturing', title: 'Manufacturing', color: '#5352ed', angle: 144 },
    { icon: '🚚', key: 'delivery', title: 'Delivery', color: '#ff6348', angle: 180 },
    { icon: '📋', key: 'invoicing', title: 'Invoicing', color: '#7bed9f', angle: 216 },
    { icon: '💰', key: 'payment', title: 'Payment', color: '#70a1ff', angle: 252 },
    { icon: '❤️', key: 'loyalty', title: 'Loyalty', color: '#ff9ff3', angle: 288 },
    { icon: '🔄', key: 'repeatOrder', title: 'Repeat', color: '#54a0ff', angle: 324 }
  ];

  // Key benefits for textile manufacturers
  const benefits = [
    {
      icon: '🎤',
      titleKey: 'voiceBenefitTitle',
      descKey: 'voiceBenefitDesc',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '🌐',
      titleKey: 'multilingualBenefitTitle',
      descKey: 'multilingualBenefitDesc',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '📱',
      titleKey: 'mobileBenefitTitle',
      descKey: 'mobileBenefitDesc',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '⚡',
      titleKey: 'speedBenefitTitle',
      descKey: 'speedBenefitDesc',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];


  return (
    <div className={styles.homePage}>
      {/* Hero Section - 360° Business View */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.purposeStatement}>
            <h1 className={styles.heroTitle}>
              {t.transformationTitle || "360° Business Visibility Drives Results"}
            </h1>
            <p className={styles.heroSubtitle}>
              {t.transformationSubtitle || "Complete visibility across your entire business cycle improves efficiency, saves costs, enhances customer satisfaction, and grows revenue"}
            </p>
          
          {/* Circular Business Flow Visualization */}
          <div className={styles.storyFlowContainer}>
            <div className={styles.storyCenter}>
              <div className={styles.storyCenterContent}>
                <h3 className={styles.storyCenterTitle}>{t.businessVisibility || "Complete Business"}</h3>
                <h4 className={styles.storyCenterTitle}>{t.visibility || "Visibility"}</h4>
                <p className={styles.storyCenterSubtitle}>{t.drivesResults || "Drives Results"}</p>
              </div>
            </div>
            {(() => {
              // Responsive sizing based on screen width
              const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
              const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
              
              const radius = isSmallMobile ? 100 : isMobile ? 120 : 140;
              const containerSize = isSmallMobile ? 280 : isMobile ? 320 : 450;
              const centerX = containerSize / 2;
              const centerY = containerSize / 2;

              return (
                <>
                  {businessCycle.map((step, index) => {
                    const angleRad = (step.angle * Math.PI) / 180;
                    const x = centerX + radius * Math.cos(angleRad) - 30;
                    const y = centerY + radius * Math.sin(angleRad) - 30;
                    
                    // Calculate label position (outside the circle)
                    const labelRadius = isSmallMobile ? 125 : isMobile ? 145 : 205;
                    const labelX = centerX + labelRadius * Math.cos(angleRad);
                    const labelY = centerY + labelRadius * Math.sin(angleRad);
                    
                    return (
                      <React.Fragment key={step.key}>
                        <div
                          className={styles.storyFlowStep}
                          style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            backgroundColor: step.color
                          }}
                          title={step.title}
                        >
                          <span className={styles.storyStepIcon}>{step.icon}</span>
                          <span className={styles.storyStepNumber}>{index + 1}</span>
                        </div>
                        
                        {/* Always visible step label */}
                        <div
                          className={styles.storyStepLabel}
                          style={{
                            left: `${labelX - (isSmallMobile ? 20 : isMobile ? 25 : 30)}px`,
                            top: `${labelY - 8}px`,
                          }}
                        >
                          <span className={styles.storyStepLabelText}>{step.title}</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
            
                  {/* Circular connecting lines */}
                  <svg className={styles.storyConnections} width={containerSize} height={containerSize}>
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={radius}
                      fill="none"
                      stroke="rgba(102, 126, 234, 0.4)"
                      strokeWidth="2"
                      strokeDasharray="8,4"
                    />
                    {/* Direction arrows */}
                    {businessCycle.map((_, index) => {
                      const angle = (index * 36 + 18) * Math.PI / 180;
                      const arrowRadius1 = radius - 15;
                      const arrowRadius2 = radius + 15;
                      const x1 = centerX + arrowRadius1 * Math.cos(angle);
                      const y1 = centerY + arrowRadius1 * Math.sin(angle);
                      const x2 = centerX + arrowRadius2 * Math.cos(angle);
                      const y2 = centerY + arrowRadius2 * Math.sin(angle);
                      
                      return (
                        <line
                          key={index}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="rgba(102, 126, 234, 0.6)"
                          strokeWidth="2"
                          markerEnd="url(#storyArrowhead)"
                        />
                      );
                    })}
                    <defs>
                      <marker
                        id="storyArrowhead"
                        markerWidth="8"
                        markerHeight="6"
                        refX="7"
                        refY="3"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 8 3, 0 6"
                          fill="rgba(102, 126, 234, 0.6)"
                        />
                      </marker>
                    </defs>
                  </svg>
                </>
              );
            })()}
          </div>
          
          {/* Hero CTA */}
          <div className={styles.heroCta}>
            <button className={styles.watchDemoBtn} onClick={onSeeDemo}>
              {t.watchDemo || "Watch Demo"} 📹
            </button>
          </div>
          </div>
        </div>
      </section>

      {/* Business Benefits - Detailed Impact */}
      <section className={styles.impactSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            {t.heroTitle || "Business Benefits"}
          </h2>
          
          <div className={styles.businessBenefits}>
            <div className={styles.benefitCard}>
              <h4>⚡ {t.efficiencyBenefit || "Improved Efficiency"}</h4>
              <p>{t.efficiencyDetail || "360° visibility eliminates manual tracking and duplicate work"}</p>
            </div>
            <div className={styles.benefitCard}>
              <h4>₹ {t.costBenefit || "Reduced Costs"}</h4>
              <p>{t.costDetail || "Complete visibility prevents waste and optimizes resources"}</p>
            </div>
            <div className={styles.benefitCard}>
              <h4>😊 {t.satisfactionBenefit || "Higher Customer Satisfaction"}</h4>
              <p>{t.satisfactionDetail || "End-to-end visibility ensures on-time delivery and quality"}</p>
            </div>
            <div className={styles.benefitCard}>
              <h4>📈 {t.revenueBenefit || "Increased Revenue"}</h4>
              <p>{t.revenueDetail || "360° insights help identify opportunities and optimize pricing"}</p>
            </div>
          </div>

          {/* Impact Statistics */}
          <div className={styles.statsContainer}>
            <h3 className={styles.statsTitle}>
              {t.impactTitle || "Real Business Impact"}
            </h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{animatedStats.timeSaved}+</div>
                <div className={styles.statLabel}>{t.hoursDaily || "Hours Saved Daily"}</div>
                <div className={styles.statDesc}>{t.hoursDesc || "Automate manual tasks"}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{animatedStats.accuracy}%</div>
                <div className={styles.statLabel}>{t.voiceAccuracy || "Voice Accuracy"}</div>
                <div className={styles.statDesc}>{t.accuracyDesc || "In Gujarati & Hindi"}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{animatedStats.efficiency}%</div>
                <div className={styles.statLabel}>{t.efficiency || "Efficiency Gain"}</div>
                <div className={styles.statDesc}>{t.efficiencyDesc || "Faster order processing"}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{animatedStats.satisfaction}%</div>
                <div className={styles.statLabel}>{t.satisfaction || "User Satisfaction"}</div>
                <div className={styles.statDesc}>{t.satisfactionDesc || "Love the simplicity"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className={styles.benefits}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            {t.benefitsTitle || "Built for Indian MSME Textile Manufacturers"}
          </h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <div 
                key={benefit.titleKey} 
                className={styles.benefitCard}
                style={{ background: benefit.gradient }}
              >
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <h3 className={styles.benefitTitle}>
                  {t[benefit.titleKey] || benefit.titleKey}
                </h3>
                <p className={styles.benefitDesc}>
                  {t[benefit.descKey] || benefit.descKey}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            {t.ctaTitle || "Ready for 360° View of Your Business?"}
          </h2>
          <p className={styles.ctaSubtitle}>
            {t.ctaSubtitle || "Join MSME textile manufacturers who improved efficiency, saved costs, and grew revenue with complete business visibility"}
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta} onClick={onGetStarted}>
              {t.startFreeTrial || "Start Free Trial"} →
            </button>
            <button className={styles.secondaryCta} onClick={onSeeDemo}>
              {t.watchDemo || "Watch Demo"} 📹
            </button>
          </div>
          <p className={styles.ctaNote}>
            {t.ctaNote || "No credit card required • Free 30-day trial • Full support in Gujarati"}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>ElevateIdea</h4>
            <p>{t.footerTagline || "360° Business Platform for MSME Textile Manufacturers"}</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t.contactTitle || "Contact"}</h4>
            <p>📧 support@elevateidea.com</p>
            <p>📱 +91 98765 43210</p>
            <p>📍 Bangalore, India</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t.linkedinTitle || "Connect"}</h4>
            <p>💼 Connect with us on LinkedIn</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 ElevateIdea Technologies Private Limited. {t.allRights || "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;