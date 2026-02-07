import React from 'react';
import { openBetaSignup } from '../../utils/contactUtils';
import SEO from '../../components/ui/SEO';
import styles from '../styles/ElevateBusiness360.module.css';

interface ElevateBusiness360Props {
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

function ElevateBusiness360({ 
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
}: ElevateBusiness360Props) {
  // Note: Mobile menu functionality to be implemented when needed
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <SEO
        title="ElevateIdea"
        description="ElevateIdea empowers MSMEs with voice-first, multilingual business platform. 20+ years experience, 6 major turnarounds, $15M+ recovery value. Building ElevateBusiness 360° for textile manufacturers."
        keywords="ElevateIdea Technologies, 360° business platform, textile manufacturers India, MSME digitization, voice-first platform, multilingual business software, corporate turnaround expert"
        canonical="/"
        type="website"
        image="/social-preview.jpg"
        imageWidth={1200}
        imageHeight={630}
        imageAlt="ElevateIdea Technologies - 360° Business Platform for Indian Textile Manufacturers"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ElevateIdea Technologies Private Limited",
          "alternateName": "ElevateIdea",
          "url": "https://elevateidea.com",
          "logo": "https://elevateidea.com/logo192.png",
          "description": "Complete 360° Business Platform for India's Textile Manufacturers. Empowering MSMEs with voice-first, multilingual business solutions.",
          "foundingDate": "2023",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "India"
          },
          "founder": {
            "@type": "Person",
            "name": "Partha Sarthi",
            "jobTitle": "Founder & CEO",
            "description": "20+ years technology veteran with 6 major corporate turnarounds, $15M+ recovery value",
            "url": "https://www.linkedin.com/in/parthasarthi/"
          },
          "industry": "Software Technology",
          "numberOfEmployees": "1-10",
          "areaServed": "India",
          "knowsAbout": ["MSME Digitization", "Textile Manufacturing", "Business Platforms", "Corporate Turnarounds", "AI-Accelerated Development"],
          "sameAs": [
            "https://www.linkedin.com/in/parthasarthi/",
            "https://github.com/psarthi-ei"
          ]
        }}
      />
      <div className={styles.homePage}>
      {/* Hero Section - 360° Business View */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.purposeStatement}>
            <h1 className={styles.heroTitle}>
              Developing ElevateBusiness 360° - Complete Business Platform for Textile Manufacturers
            </h1>
            <p className={styles.heroSubtitle}>
              Voice-first, multilingual business platform under development to provide 360° visibility across textile manufacturing workflows. From leads to final payment - we're building intelligent automation for the textile industry. Launching soon in Gujarat for early access partners.
            </p>
          </div>
          
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
              Experience Platform 🚀
            </button>
            <button 
              className={styles.secondaryCta} 
              onClick={openBetaSignup}
            >
              Sign Up for Beta 📱
            </button>
          </div>
        </div>
      </section>

      {/* AI Development Story Section - PRIMARY ATTENTION GRABBER */}
      <section className={styles.aiStory}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            Building WITH AI - Our Development Journey
          </h2>
          <p className={styles.sectionSubtitle}>
            We're developing ElevateBusiness 360° with AI as our team member, demonstrating how modern businesses can leverage AI effectively. 
            This is our real-time development story - not replacing experience, but amplifying it to build 10X faster.
          </p>
          
          <div className={styles.aiStoryGrid}>
            <div className={styles.aiStoryCard}>
              <div className={styles.aiStoryIcon}>🤖</div>
              <h3 className={styles.aiStoryTitle}>AI as Team Member</h3>
              <p className={styles.aiStoryDescription}>
                We're developing ElevateBusiness 360° with AI as our "Aladdin ka chirag" - a powerful team member that helps us create 10X faster. 
                Haven't written a single line of code manually, yet developing enterprise-grade software.
              </p>
              <div className={styles.aiStoryProof}>
                <span className={styles.proofBadge}>PROOF</span>
                <span className={styles.proofText}>Haven't written single line of code, building 10X faster</span>
              </div>
            </div>

            <div className={styles.aiStoryCard}>
              <div className={styles.aiStoryIcon}>🧠</div>
              <h3 className={styles.aiStoryTitle}>Experience Guides AI</h3>
              <p className={styles.aiStoryDescription}>
                Our 20+ years of industry experience helps us guide AI in the right direction. 
                AI makes building faster, but you need deep business understanding to know what to build and how to build it right.
              </p>
              <div className={styles.aiStoryProof}>
                <span className={styles.proofBadge}>EDGE</span>
                <span className={styles.proofText}>20+ years industry experience guides strategic AI decisions</span>
              </div>
            </div>

            <div className={styles.aiStoryCard}>
              <div className={styles.aiStoryIcon}>🚀</div>
              <h3 className={styles.aiStoryTitle}>AI-Era Development</h3>
              <p className={styles.aiStoryDescription}>
                This is the new reality - small teams building enterprise-level products in weeks instead of years. 
                We're demonstrating how strategic AI implementation transforms business development through our own product journey.
              </p>
              <div className={styles.aiStoryProof}>
                <span className={styles.proofBadge}>RESULT</span>
                <span className={styles.proofText}>Enterprise platform development in months, not years</span>
              </div>
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
            </div>
          </div>

          {/* Platform Capabilities */}
          <div className={styles.testimonials}>
            <h3 className={styles.testimonialsTitle}>
              How ElevateBusiness 360° Works
            </h3>
            <div className={styles.testimonialsGrid}>
              <div className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  Complete factory management through voice commands in Gujarati - from your phone, on the production floor.
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Voice-First Interface</strong> - Mobile Factory Management
                </div>
              </div>
              <div className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  360° visibility from lead to final payment - never lose track of orders, payments, or customer communications.
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Complete Visibility</strong> - End-to-End Business View
                </div>
              </div>
              <div className={styles.testimonial}>
                <p className={styles.testimonialText}>
                  Intelligent automation that understands textile business - GSM tracking, fabric specifications, advance payments.
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Industry Intelligence</strong> - Built for Textile Manufacturing
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
            Be Among the First to Experience ElevateBusiness 360°
          </h2>
          <p className={styles.ctaSubtitle}>
            We're launching soon in Gujarat for early access partners. Join the development journey and help shape the future of textile business management.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta} onClick={onDemoMode}>
              Experience Platform 🚀
            </button>
            <button 
              className={styles.secondaryCta} 
              onClick={openBetaSignup}
            >
              Sign Up for Beta 📱
            </button>
          </div>
          <p className={styles.ctaNote}>
            Gujarat textile manufacturers • Early access program • Shape the product with us
          </p>
        </div>
      </section>
      </div>
    </>
  );
}

export default ElevateBusiness360;