import React from 'react';
import styles from '../styles/PlatformShowcase.module.css';

interface PlatformShowcaseProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onDemoMode: () => void;
  onGuestMode: () => void;
}

function PlatformShowcase({ 
  currentLanguage, 
  onLanguageChange, 
  onDemoMode, 
  onGuestMode 
}: PlatformShowcaseProps) {
  // Removed unused translation and state variables

  // Complete textile business workflow
  const businessWorkflow = [
    {
      id: 'leads',
      icon: '🎯',
      title: 'Lead Capture',
      description: 'Capture leads from multiple sources - WhatsApp, calls, walk-ins, referrals',
      benefits: ['Never lose a potential customer', 'Track lead sources', 'Automated follow-ups'],
      gujaratiTitle: 'લીડ કેપ્ચર'
    },
    {
      id: 'quotes',
      icon: '📋',
      title: 'Quotations',
      description: 'Generate professional quotes with fabric specifications, pricing, delivery terms',
      benefits: ['Professional quotations in minutes', 'Material cost calculations', 'Terms & conditions'],
      gujaratiTitle: 'ભાવ પત્રક'
    },
    {
      id: 'advance',
      icon: '💳',
      title: 'Advance Payment',
      description: 'Secure advance payments before starting production - critical for cash flow',
      benefits: ['Guarantee payment before production', 'Cash flow protection', 'Payment tracking'],
      gujaratiTitle: 'એડવાન્સ પેમેન્ટ'
    },
    {
      id: 'production',
      icon: '🏭',
      title: 'Production Tracking',
      description: 'Monitor every stage of textile production from yarn to finished goods',
      benefits: ['Real-time production status', 'Quality checkpoints', 'Delivery scheduling'],
      gujaratiTitle: 'ઉત્પાદન ટ્રેકિંગ'
    },
    {
      id: 'delivery',
      icon: '🚚',
      title: 'Delivery & Payment',
      description: 'Coordinate delivery and collect final payments with customer satisfaction tracking',
      benefits: ['On-time delivery alerts', 'Final payment collection', 'Customer feedback'],
      gujaratiTitle: 'ડિલિવરી અને પેમેન્ટ'
    }
  ];

  // Key platform features
  const platformFeatures = [
    {
      title: 'Voice Commands in Gujarati',
      description: 'Update orders, check status, and manage business using voice commands in your language',
      icon: '🎤',
      demo: '"ઓર્ડર 1234 ની સ્થિતિ શું છે?"'
    },
    {
      title: '360° Business Visibility',
      description: 'See everything happening in your business from one dashboard',
      icon: '👁️',
      demo: 'Real-time dashboard showing orders, payments, production'
    },
    {
      title: 'Mobile-First Design',
      description: 'Works perfectly on your phone - manage business from anywhere',
      icon: '📱',
      demo: 'Touch-friendly interface optimized for factory environments'
    },
    {
      title: 'WhatsApp Integration',
      description: 'Customers can place orders, check status, and communicate via WhatsApp',
      icon: '💬',
      demo: 'Automated WhatsApp responses and order updates'
    }
  ];

  // Success metrics from real textile manufacturers
  const successMetrics = [
    {
      metric: '30%',
      label: 'Profit Increase',
      description: 'Better visibility leads to better pricing and cost control',
      customer: 'Kiran Modi, Vadodara Fabrics'
    },
    {
      metric: '3 Hours',
      label: 'Daily Time Saved',
      description: 'Automated tracking eliminates manual paperwork',
      customer: 'Ramesh Patel, Surat Cotton Mills'
    },
    {
      metric: '95%',
      label: 'On-Time Delivery',
      description: 'Real-time tracking ensures timely delivery',
      customer: 'Priya Shah, Ahmedabad Textiles'
    },
    {
      metric: '₹2L+',
      label: 'Monthly Revenue Growth',
      description: 'Better customer management leads to more repeat orders',
      customer: 'Hitesh Joshi, Rajkot Weavers'
    }
  ];

  return (
    <div className={styles.platformShowcase}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>ElevateBusiness 360°</h1>
          <p className={styles.subtitle}>
            Complete Business Platform for Gujarat Textile Manufacturers
          </p>
          
          <div className={styles.headerControls}>
            <select 
              value={currentLanguage} 
              onChange={(e) => onLanguageChange(e.target.value)}
              className={styles.languageSelector}
            >
              <option value="en">English</option>
              <option value="gu">ગુજરાતી</option>
              <option value="hi">हिंदी</option>
            </select>
            
            <button className={styles.demoButton} onClick={onDemoMode}>
              Live Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            From Lead to Payment - Complete 360° Business Management
          </h2>
          <p className={styles.heroDescription}>
            Built specifically for Gujarat textile manufacturers. Speak in Gujarati, manage from your phone, 
            see your entire business at a glance.
          </p>
          
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton} onClick={onDemoMode}>
              Start Free Demo
            </button>
            <button className={styles.secondaryButton} onClick={onGuestMode}>
              Try as Guest
            </button>
          </div>
        </div>
      </section>

      {/* Business Workflow Section */}
      <section className={styles.workflowSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            Complete Textile Business Workflow
          </h2>
          <p className={styles.sectionDescription}>
            Every step of your textile manufacturing business - from first inquiry to final payment
          </p>

          <div className={styles.workflowSteps}>
            {businessWorkflow.map((step, index) => (
              <div key={step.id} className={styles.workflowStep}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepTitleGujarati}>{step.gujaratiTitle}</p>
                  <p className={styles.stepDescription}>{step.description}</p>
                  
                  <div className={styles.stepBenefits}>
                    {step.benefits.map((benefit, idx) => (
                      <span key={idx} className={styles.benefit}>
                        ✓ {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                
                {index < businessWorkflow.length - 1 && (
                  <div className={styles.stepConnector}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            Why Gujarat Textile Manufacturers Choose ElevateBusiness 360°
          </h2>
          
          <div className={styles.featuresGrid}>
            {platformFeatures.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <div className={styles.featureDemo}>
                  <em>"{feature.demo}"</em>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className={styles.successSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            Real Results from Gujarat Textile Manufacturers
          </h2>
          
          <div className={styles.metricsGrid}>
            {successMetrics.map((metric, index) => (
              <div key={index} className={styles.metricCard}>
                <div className={styles.metricValue}>{metric.metric}</div>
                <div className={styles.metricLabel}>{metric.label}</div>
                <p className={styles.metricDescription}>{metric.description}</p>
                <div className={styles.metricCustomer}>- {metric.customer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready to Transform Your Textile Business?
          </h2>
          <p className={styles.ctaDescription}>
            Join 100+ Gujarat textile manufacturers already using ElevateBusiness 360°
          </p>
          
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton} onClick={onDemoMode}>
              Start Your Free Demo
            </button>
            <button className={styles.secondaryButton} onClick={onGuestMode}>
              Explore as Guest
            </button>
          </div>
          
          <p className={styles.ctaNote}>
            ✓ No credit card required ✓ Authentic Gujarat textile data ✓ Full platform access
          </p>
        </div>
      </section>
    </div>
  );
}

export default PlatformShowcase;