import React, { useEffect, useState } from 'react';
import { loadServiceContent } from '../../utils/contentLoader';
import styles from '../styles/ServicesHub.module.css';

interface ServicesHubProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onHomePage: () => void;
}

function ServicesHub({ 
  currentLanguage, 
  onLanguageChange, 
  onHomePage 
}: ServicesHubProps) {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const loadAllServices = async () => {
      const serviceKeys = [
        'strategic-project-acceleration',
        'scalability-for-growth', 
        'agile-systems-for-rapid-innovation'
      ];
      
      const loadedServices = await Promise.all(
        serviceKeys.map(async (key) => {
          const content = await loadServiceContent(key);
          return { key, ...content };
        })
      );
      
      setServices(loadedServices.filter(service => service.title));
    };

    loadAllServices();
  }, []);

  const handleServiceClick = (serviceKey: string) => {
    // For now, we'll just log the service key
    // In future, this will navigate to individual service page
    console.log('Navigate to service:', serviceKey);
  };

  return (
    <div className={styles.servicesHub}>
      <div className={styles.container}>
        <button onClick={onHomePage} className={styles.backButton}>
          ← Back to Homepage
        </button>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Technology Consulting & Transformation
          </h1>
          <p className={styles.heroSubtitle}>
            Empowering businesses through strategic technology initiatives, scalable systems, and agile methodologies. 
            We turn technology challenges into competitive advantages that drive sustainable growth and innovation.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>25+</span>
              <span className={styles.statLabel}>Projects Delivered</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>85%</span>
              <span className={styles.statLabel}>Success Rate</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>300%</span>
              <span className={styles.statLabel}>Avg ROI Improvement</span>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className={styles.whatWeDo}>
          <h2 className={styles.sectionTitle}>What We Do</h2>
          <p className={styles.sectionSubtitle}>
            We specialize in strategic technology consulting, helping businesses overcome complex challenges 
            and achieve scalable growth through proven frameworks and methodologies.
          </p>
          
          <div className={styles.approachGrid}>
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🎯</span>
              <h3 className={styles.approachTitle}>Strategic Alignment</h3>
              <p className={styles.approachDescription}>
                We align your technology initiatives with business objectives, ensuring every project drives measurable value and supports long-term growth.
              </p>
            </div>
            
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🔧</span>
              <h3 className={styles.approachTitle}>Proven Methodologies</h3>
              <p className={styles.approachDescription}>
                Our structured frameworks have been refined through 25+ successful implementations, delivering consistent results across industries.
              </p>
            </div>
            
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🚀</span>
              <h3 className={styles.approachTitle}>Accelerated Delivery</h3>
              <p className={styles.approachDescription}>
                We focus on rapid implementation and tangible outcomes, helping you see results quickly while building sustainable foundations.
              </p>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className={styles.ourServices}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <p className={styles.sectionSubtitle}>
            Three specialized frameworks designed to address the most critical technology challenges 
            facing growing businesses today.
          </p>
          
          <div className={styles.servicesGrid}>
            {services.map((service, index) => {
              const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              ];
              
              return (
                <div 
                  key={service.key} 
                  className={styles.serviceCard}
                  onClick={() => handleServiceClick(service.key)}
                >
                  <div className={styles.serviceHeader} style={{ background: gradients[index] }}>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDescription}>
                      {service.description.substring(0, 120)}...
                    </p>
                  </div>
                  
                  <div className={styles.serviceContent}>
                    <div className={styles.servicePhases}>
                      {service.phases?.slice(0, 4).map((phase: any, phaseIndex: number) => (
                        <div key={phaseIndex} className={styles.phaseItem}>
                          <span className={styles.phaseIcon}>{phase.icon}</span>
                          <span>{phase.title}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.serviceMetrics}>
                      {service.metrics?.slice(0, 2).map((metric: any, metricIndex: number) => (
                        <div key={metricIndex} className={styles.metricItem}>
                          <span className={styles.metricValue}>{metric.value}</span>
                          <span className={styles.metricLabel}>{metric.label}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.serviceAction}>
                      <button 
                        className={styles.learnMoreButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(service.key);
                        }}
                      >
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Technology?</h2>
          <p className={styles.ctaSubtitle}>
            Let's discuss how our proven frameworks can accelerate your business growth and 
            turn technology challenges into competitive advantages.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta}>
              Schedule Consultation
            </button>
            <button className={styles.secondaryCta}>
              Download Case Studies
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ServicesHub;