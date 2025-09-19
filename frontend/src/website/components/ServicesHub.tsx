import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/ServicesHub.module.css';

interface ServicesHubProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  resetKey?: number; // Force component reset when this changes
}

interface ServiceInfo {
  key: string;
  title: string;
  filename: string;
  gradient: string;
}

function ServicesHub({ 
  currentLanguage, 
  onLanguageChange,
  resetKey
}: ServicesHubProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Reset to services overview when component mounts or resetKey changes
  useEffect(() => {
    setSelectedService(null);
    setMarkdownContent('');
  }, [resetKey]);

  // Service configuration - 4 core offerings (MVP Development as key offering, others have frameworks)
  const services: ServiceInfo[] = [
    {
      key: 'mvp-development',
      title: 'MVP Development',
      filename: '', // No framework document yet - key offering only
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      key: 'strategic-project-acceleration',
      title: 'Strategic Project Acceleration',
      filename: 'strategic-project-acceleration.md',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      key: 'scalability-for-growth',
      title: 'Scalability Solutions',
      filename: 'scalability-for-growth.md',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      key: 'agile-ai-transformation',
      title: 'Agile AI Transformation',
      filename: 'agile-systems-for-rapid-innovation.md',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  // Load markdown content for a service
  const loadServiceContent = async (serviceName: string) => {
    setLoading(true);
    try {
      const service = services.find(s => s.key === serviceName);
      if (!service) {
        throw new Error(`Service not found: ${serviceName}`);
      }

      // Handle MVP Development without framework document
      if (!service.filename) {
        setMarkdownContent('# MVP Development\n\nComing soon - detailed framework documentation.\n\nFor now, contact us to discuss your 30-day AI-accelerated MVP development needs.');
        setSelectedService(serviceName);
        setLoading(false);
        return;
      }

      const response = await fetch(`/content/services/${service.filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${service.filename}`);
      }
      
      const markdown = await response.text();
      console.log('Loaded markdown content:', markdown.substring(0, 200) + '...');
      console.log('Setting markdown content for service:', serviceName);
      setMarkdownContent(markdown);
      setSelectedService(serviceName);
    } catch (error) {
      console.error('Error loading service content:', error);
      setMarkdownContent('# Error\n\nUnable to load service content. Please try again.');
      setSelectedService(serviceName);
    } finally {
      setLoading(false);
    }
  };

  // Handle service selection
  const handleServiceClick = (serviceKey: string) => {
    loadServiceContent(serviceKey);
  };

  // Handle back to services list
  const handleBackToServices = () => {
    setSelectedService(null);
    setMarkdownContent('');
  };

  // Show service detail view
  if (selectedService) {
    return (
      <div className={styles.servicesHub}>
        <div className={styles.container}>
          {/* Navigation */}
          <div className={styles.navigation}>
            <button 
              className={styles.backButton}
              onClick={handleBackToServices}
            >
              ← Back to Services
            </button>
          </div>

          {/* Service Content */}
          <div className={styles.serviceContent}>
            <div className={styles.contentWrapper}>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading service content...</p>
                </div>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2>Ready to Get Started?</h2>
              <p>
                Let's discuss how this framework can address your specific challenges 
                and accelerate your business growth.
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.primaryCta}>
                  Schedule Consultation
                </button>
                <button className={styles.secondaryCta}>
                  Download Framework Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show services list view
  return (
    <div className={styles.servicesHub}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Strategic Technology Partner for Early-Stage Startups in the AI Era
          </h1>
          <p className={styles.heroSubtitle}>
            Leverage 20+ years of industry experience to build 10X faster with AI while knowing exactly what and how to build. 
            We help early-stage startups navigate the new AI landscape where small teams can create big impact.
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

        {/* What We Do Section */}
        <section className={styles.whatWeDo}>
          <h2 className={styles.sectionTitle}>What We Do</h2>
          <p className={styles.sectionSubtitle}>
            We help early-stage startups navigate the new AI landscape where small teams can build enterprise-level products. 
            AI makes building 10X faster, but you still need industry experience to know what to build and how to build it right.
          </p>
          
          <div className={styles.approachGrid}>
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🧠</span>
              <h3 className={styles.approachTitle}>AI-Era Strategic Guidance</h3>
              <p className={styles.approachDescription}>
                Combine 20+ years industry experience with cutting-edge AI tools to make strategic decisions about what to build and how to build it efficiently.
              </p>
            </div>
            
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>⚡</span>
              <h3 className={styles.approachTitle}>10X Faster Development</h3>
              <p className={styles.approachDescription}>
                Leverage AI tools strategically to accelerate development while avoiding common pitfalls that come from moving too fast without experience.
              </p>
            </div>
            
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🤝</span>
              <h3 className={styles.approachTitle}>Strategic Partnership</h3>
              <p className={styles.approachDescription}>
                Not just delivery - ongoing guidance and support from founders building their own product, understanding startup challenges firsthand.
              </p>
            </div>
          </div>
        </section>

        {/* Why We're Doing This Section */}
        <section className={styles.whatWeDo}>
          <h2 className={styles.sectionTitle}>Why We're Doing This</h2>
          <p className={styles.sectionSubtitle}>
            The AI era has changed everything. Traditional development timelines are obsolete - small teams can now build enterprise-level products. 
            But there's a gap: startups can access AI tools but often lack the industry experience to use them strategically.
          </p>
          <div className={styles.approachGrid}>
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🚀</span>
              <h3 className={styles.approachTitle}>AI Era Reality</h3>
              <p className={styles.approachDescription}>
                Small teams can now accomplish what used to require large engineering departments, but strategic decisions matter more than ever.
              </p>
            </div>
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🎯</span>
              <h3 className={styles.approachTitle}>The Experience Gap</h3>
              <p className={styles.approachDescription}>
                AI tools are powerful but you still need to know what to build, how to build it, and when to pivot based on industry experience.
              </p>
            </div>
            <div className={styles.approachCard}>
              <span className={styles.approachIcon}>🤝</span>
              <h3 className={styles.approachTitle}>Founder Empathy</h3>
              <p className={styles.approachDescription}>
                We're building our own product (ElevateBusiness 360°), so we understand startup challenges and constraints firsthand.
              </p>
            </div>
          </div>
        </section>

        {/* Tier 1: MVP Development - Primary Offering */}
        <section className={styles.primaryOffering}>
          <h2 className={styles.sectionTitle}>Starting Your Startup Journey? Begin Here</h2>
          <p className={styles.sectionSubtitle}>
            For very early stage startups in MVP phase - get your product built in 30 days with AI acceleration and strategic guidance.
          </p>
          
          <div className={styles.mvpCard}>
            <div className={styles.mvpHeader} style={{ background: services[0].gradient }}>
              <span className={styles.mvpBadge}>Tier 1: Early Stage</span>
              <h3 className={styles.mvpTitle}>{services[0].title}</h3>
              <p className={styles.mvpDescription}>
                Build your MVP in 30 days with AI acceleration and strategic guidance from 20+ years of industry experience. 
                Perfect for pre-seed startups ready to validate their ideas quickly.
              </p>
              <div className={styles.mvpFeatures}>
                <span className={styles.feature}>✨ 30-Day Timeline</span>
                <span className={styles.feature}>🤖 AI-Accelerated Development</span>
                <span className={styles.feature}>🎯 Strategic Guidance</span>
              </div>
            </div>
            <div className={styles.mvpAction}>
              <button 
                className={styles.primaryActionButton}
                onClick={() => alert('Contact us for MVP Development consultation')}
              >
                Start Your MVP Journey →
              </button>
            </div>
          </div>
        </section>

        {/* Tier 2: Scale-Up Services */}
        <section className={styles.scaleUpServices}>
          <h2 className={styles.sectionTitle}>Already Have an MVP? Scale Up With These Frameworks</h2>
          <p className={styles.sectionSubtitle}>
            For startups in scale-up phase - structured frameworks to accelerate growth, fix challenges, and optimize performance.
          </p>
          
          <div className={styles.scaleUpGrid}>
            {services.slice(1).map((service, index) => (
              <div 
                key={service.key} 
                className={styles.scaleUpCard}
                onClick={() => handleServiceClick(service.key)}
              >
                <div className={styles.scaleUpHeader} style={{ background: service.gradient }}>
                  <span className={styles.scaleUpBadge}>Tier 2: Scale-Up</span>
                  <h3 className={styles.scaleUpTitle}>{service.title}</h3>
                  <p className={styles.scaleUpDescription}>
                    {service.key === 'strategic-project-acceleration' && 'Rescue stuck projects and get back on track with experienced guidance and AI-powered acceleration.'}
                    {service.key === 'scalability-for-growth' && 'Fix existing products struggling with scale using AI-powered solutions and strategic architecture guidance.'}
                    {service.key === 'agile-ai-transformation' && 'Help your team work 10X faster with AI-first development workflows and strategic implementation.'}
                  </p>
                </div>
                
                <div className={styles.scaleUpAction}>
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
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Build 10X Faster in the AI Era?</h2>
          <p className={styles.ctaSubtitle}>
            Let's discuss how 20+ years of industry experience combined with AI tools can accelerate 
            your startup's technology development while making strategic decisions that matter.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryCta}>
              Schedule Startup Assessment
            </button>
            <button className={styles.secondaryCta}>
              View Success Stories
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ServicesHub;