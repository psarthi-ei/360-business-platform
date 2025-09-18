import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import styles from '../styles/HomePage.module.css';

interface HomePageProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onLogin: () => void;
  onSignUp: () => void;
  onGuestMode: () => void;
  onDemoMode: () => void;
  onServicesHub: () => void;
  onBlogHome: () => void;
  onAbout: () => void;
  onContact: () => void;
}

function HomePage({ 
  currentLanguage, 
  onLanguageChange, 
  onLogin,
  onSignUp,
  onGuestMode,
  onDemoMode,
  onServicesHub,
  onBlogHome,
  onAbout,
  onContact
}: HomePageProps) {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  // Removed unused benefits array


  return (
    <div className={styles.homePage}>
      {/* Hero Section - 360° Business View */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.purposeStatement}>
            <h1 className={styles.heroTitle}>
              ElevateBusiness 360° - Complete Business Platform for Textile Manufacturers
            </h1>
            <p className={styles.heroSubtitle}>
              Voice-first, multilingual business platform providing 360° visibility across your entire textile manufacturing workflow. From leads to final payment - streamline every step with intelligent automation. Gujarat textile manufacturers are already seeing 30% profit increases.
            </p>
          
          {/* Circular Business Flow Visualization */}
          <div className={styles.storyFlowContainer}>
            <div className={styles.storyCenter}>
              <div className={styles.storyCenterContent}>
                <h3 className={styles.storyCenterTitle}>ElevateBusiness</h3>
                <h4 className={styles.storyCenterTitle}>360°</h4>
                <p className={styles.storyCenterSubtitle}>Textile Manufacturing</p>
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
            <button className={styles.primaryCta} onClick={onDemoMode}>
              Start Demo 🚀
            </button>
            <button className={styles.secondaryCta} onClick={onGuestMode}>
              Try as Guest 📱
            </button>
          </div>
          
          </div>
        </div>
      </section>

      {/* Detailed Textile Workflow Section */}
      <section className={styles.workflowSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            Complete Textile Manufacturing Workflow
          </h2>
          <p className={styles.sectionSubtitle}>
            Every step of your textile business process - from first inquiry to final payment and customer satisfaction
          </p>

          <div className={styles.workflowCardsGrid}>
            {[
              {
                id: 'leads',
                icon: '🎯',
                title: 'Lead Capture',
                description: 'Multi-source lead tracking',
                gujaratiTitle: 'લીડ કેપ્ચર'
              },
              {
                id: 'quotes',
                icon: '📋',
                title: 'Quotations',
                description: 'Professional fabric quotes',
                gujaratiTitle: 'ભાવ પત્રક'
              },
              {
                id: 'advance',
                icon: '💳',
                title: 'Advance Payment',
                description: 'Secure cash flow protection',
                gujaratiTitle: 'એડવાન્સ પેમેન્ટ'
              },
              {
                id: 'production',
                icon: '🏭',
                title: 'Production',
                description: 'Real-time tracking',
                gujaratiTitle: 'ઉત્પાદન ટ્રેકિંગ'
              },
              {
                id: 'delivery',
                icon: '🚚',
                title: 'Delivery',
                description: 'On-time completion',
                gujaratiTitle: 'ડિલિવરી'
              }
            ].map((step, index) => (
              <div key={step.id} className={styles.workflowCard}>
                <div className={styles.cardNumber}>{index + 1}</div>
                <div className={styles.cardIcon}>{step.icon}</div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>{step.title}</h4>
                  <p className={styles.cardTitleGujarati}>{step.gujaratiTitle}</p>
                  <p className={styles.cardDescription}>{step.description}</p>
                </div>
                {index < 4 && (
                  <div className={styles.cardConnector}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section - 13 Modules Overview */}
      <section className={styles.productShowcase}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            Why Textile Manufacturers Choose ElevateBusiness 360°
          </h2>
          <p className={styles.sectionSubtitle}>
            Stop losing money on orders. Start growing your textile business with complete visibility and control. Join Gujarat manufacturers who are already transforming their operations.
          </p>
          
          {/* 3 Core Business Benefits */}
          <div className={styles.businessBenefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIconLarge}>👁️</div>
              <h3 className={styles.benefitTitle}>Complete Visibility</h3>
              <p className={styles.benefitDescription}>
                See your entire business at a glance. Know exactly where every order is, how much money you're making, and what needs attention.
              </p>
              <div className={styles.benefitFeatures}>
                <span className={styles.feature}>✓ Real-time order tracking</span>
                <span className={styles.feature}>✓ Live profit & loss</span>
                <span className={styles.feature}>✓ Customer payment status</span>
                <span className={styles.feature}>✓ Production progress</span>
              </div>
              <div className={styles.customerPain}>
                <strong>"પહેલાં મને ખબર જ નહોતી કે મારા બિઝનેસમાં શું ચાલે છે"</strong>
                <br />- Ramesh Patel, Surat Cotton Mills
              </div>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconLarge}>🎤</div>
              <h3 className={styles.benefitTitle}>Effortless Management</h3>
              <p className={styles.benefitDescription}>
                Run your entire textile business from your phone. Speak in Gujarati, Hindi, or English to update orders, check inventory, and manage customers.
              </p>
              <div className={styles.benefitFeatures}>
                <span className={styles.feature}>✓ Voice commands in Gujarati</span>
                <span className={styles.feature}>✓ Mobile-first design</span>
                <span className={styles.feature}>✓ No complicated software</span>
                <span className={styles.feature}>✓ Works in noisy factories</span>
              </div>
              <div className={styles.customerPain}>
                <strong>"હવે કારખાનામાં ફોન પરથી બધું મેનેજ કરી શકું છું"</strong>
                <br />- Priya Shah, Ahmedabad Textiles
              </div>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconLarge}>📈</div>
              <h3 className={styles.benefitTitle}>Guaranteed Growth</h3>
              <p className={styles.benefitDescription}>
                Never lose money on orders again. Always deliver on time. Keep customers happy and grow your business with confidence.
              </p>
              <div className={styles.benefitFeatures}>
                <span className={styles.feature}>✓ Advance payment tracking</span>
                <span className={styles.feature}>✓ On-time delivery alerts</span>
                <span className={styles.feature}>✓ Customer satisfaction tracking</span>
                <span className={styles.feature}>✓ Profit optimization</span>
              </div>
              <div className={styles.customerPain}>
                <strong>"મારો પ્રોફિટ 30% વધ્યો અને કસ્ટમર ખુશ રહે છે"</strong>
                <br />- Kiran Modi, Vadodara Fabrics
              </div>
            </div>
          </div>

          {/* Success Metrics Display */}
          <div className={styles.metricsShowcase}>
            <h3 className={styles.metricsTitle}>
              Real Business Impact
            </h3>
            <div className={styles.metricsRow}>
              <div className={styles.metric}>
                <span className={styles.metricNumber}>30%</span>
                <span className={styles.metricLabel}>Profit Increase</span>
                <span className={styles.metricCustomer}>Kiran Modi, Vadodara</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricNumber}>3</span>
                <span className={styles.metricLabel}>Hours Saved Daily</span>
                <span className={styles.metricCustomer}>Ramesh Patel, Surat</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricNumber}>95%</span>
                <span className={styles.metricLabel}>On-Time Delivery</span>
                <span className={styles.metricCustomer}>Priya Shah, Ahmedabad</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricNumber}>₹2L+</span>
                <span className={styles.metricLabel}>Monthly Revenue Growth</span>
                <span className={styles.metricCustomer}>Hitesh Joshi, Rajkot</span>
              </div>
            </div>
          </div>

          {/* Customer Testimonials */}
          <div className={styles.testimonials}>
            <h3 className={styles.testimonialsTitle}>
              Textile Manufacturers Are Already Transforming Their Business
            </h3>
            <div className={styles.testimonialsGrid}>
              <div className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  "અમારા કારખાનામાં આવો સિસ્ટમ જોઈતો હતો. હવે બધું ફોનમાં જ મેનેજ થાય છે."
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Ramesh Patel</strong> - Surat Cotton Mills
                </div>
              </div>
              <div className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  "From lead to payment, everything is visible. No more confusion about orders and deliveries."
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Priya Shah</strong> - Ahmedabad Textiles
                </div>
              </div>
              <div className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  "Voice commands work perfectly in Gujarati. My workers can update production status easily."
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Kiran Modi</strong> - Vadodara Fabrics
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Ready for 360° View of Your Business?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join MSME textile manufacturers who improved efficiency, saved costs, and grew revenue with complete business visibility
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta} onClick={onDemoMode}>
              Start Demo 🎬
            </button>
            <button className={styles.secondaryCta} onClick={onGuestMode}>
              Try as Guest 👤
            </button>
          </div>
          <p className={styles.ctaNote}>
            Rich demo data included • No sign-up required • Full Gujarat textile business showcase
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>ElevateIdea</h4>
            <p>{t('footerTagline') || "360° Business Platform for MSME Textile Manufacturers"}</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t('contactTitle') || "Contact"}</h4>
            <p>📧 support@elevateidea.com</p>
            <p>📱 +91 98765 43210</p>
            <p>📍 Bangalore, India</p>
          </div>
          <div className={styles.footerSection}>
            <h4>{t('linkedinTitle') || "Connect"}</h4>
            <p>💼 Connect with us on LinkedIn</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 ElevateIdea Technologies Private Limited. {t('allRights') || "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;