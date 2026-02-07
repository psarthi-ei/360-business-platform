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
  const founderTimeline = [
    {
      year: "2003-15",
      title: "Building Foundation",
      description: "Building foundation with corporates like IBM, learning enterprise software development and gaining experience across different technology domains."
    },
    {
      year: "2015",
      title: "First Entrepreneurship Venture",
      description: "Ventured into entrepreneurship trying to solve traffic problem which we all face globally. Learned valuable lessons about customer acquisition and market challenges."
    },
    {
      year: "2016-18",
      title: "Head of Technology, Aadhaar (UIDAI)",
      description: "Served as Head of Technology at Aadhaar, Government of India, contributing to the world's largest digital identity program.",
      isHighlighted: true
    },
    {
      year: "2016-23",
      title: "Turnaround Specialist",
      description: "Turned around many technology initiatives across government, large enterprise, growing startups."
    },
    {
      year: "2023",
      title: "ElevateIdea Technologies",
      description: "Established ElevateIdea Technologies, applying decades of technology and business transformation experience."
    }
  ];

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
              <p className={styles.founderTitle}>Founder, ElevateIdea Technologies</p>
              
              <div className={styles.bioSection}>
                <p>
                  I am an accomplished technology leader with over 20 years of experience, specializing in 
                  turning around crisis projects and driving strategic technology transformation initiatives. 
                  Renowned for rescuing struggling projects and delivering impactful results, I excel in 
                  strategic leadership, effective execution, and aligning technology with business objectives 
                  to achieve measurable outcomes.
                </p>
                
                <p>
                  I have successfully led large-scale transformation efforts, managing high-value accounts 
                  and delivering end-to-end solutions across diverse industries. My expertise extends to 
                  navigating complex challenges, driving innovation, and enabling scalability.
                </p>
              </div>

              <div className={styles.notableRoles}>
                <p>
                  Notable leadership roles include <strong>Head of Technology at Aadhaar (Govt. of India)</strong>, where I contributed to 
                  the world's largest digital identity program, and <strong>Head of Engineering at Reward360</strong>, 
                  where I led key technology initiatives to enhance scalability, drive innovation, and transform 
                  underperforming accounts into growth opportunities.
                </p>
                
                <p>
                  In addition to my corporate leadership experience, I have ventured into entrepreneurship twice 
                  by founding <strong>ElevateIdea</strong>, focused on scaling SMBs with technology, and <strong>Parift</strong>, 
                  an innovative mobility solution aimed at solving traffic problems. 
                  These experiences, along with working with multiple startups and helping them scale, have 
                  honed my ability to navigate the complexities of building an organization.
                </p>
                
                <p>
                  With deep expertise in Loyalty & Rewards Programs within the banking sector, I have driven 
                  initiatives that enhanced customer engagement and retention. Guided by a strategic vision 
                  and a results-oriented approach, I am committed to driving business growth and advancing 
                  organizational success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Story Timeline */}
        <section className={styles.companyStory}>
          <h2 className={styles.sectionTitle}>Founder's Journey</h2>
          <p className={styles.sectionSubtitle}>
            From corporate to entrepreneurship learning to turning around many large scale initiatives, everything shaped the vision of ElevateIdea.
          </p>
          
          <div className={styles.storyTimeline}>
            {founderTimeline.map((item, index) => (
              <div key={index} className={`${styles.timelineItem} ${item.isHighlighted ? styles.highlightedTimelineItem : ''}`}>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Entrepreneurship Journey */}
        <section className={styles.entrepreneurshipJourney}>
          <h2 className={styles.sectionTitle}>From Corporate to Entrepreneurship: A Journey of Passion, Purpose, and Freedom</h2>
          <div className={styles.journeyContent}>
            <div className={styles.journeyText}>
              <p>
                The concept of "passion" used to puzzle me for years. I often questioned what I truly cared 
                about until I realized it's about doing what I love and excel at, so much so that time becomes 
                irrelevant. With 10-12 hours of our day spent at work, finding joy in what we do isn't just 
                important—it's essential. Happiness, after all, relies on both physical health and mental well-being.
              </p>
              
              <p>
                For me, mental happiness comes from immersing myself in activities I love. This realization 
                became the catalyst for my second entrepreneurial journey. Though I learned a lot from the 
                corporate world, I always felt constrained. I knew I could do more, solve great problems, 
                and make my life more exciting. You have to weigh the pros and cons of easy money against 
                the constraints of a job. That's when I decided to follow my heart—to pursue freedom and 
                happiness by tackling challenges that inspire and excite me.
              </p>
              
              <p>
                In my first venture, I set out to solve the problem of traffic congestion with a carpooling 
                solution. While I addressed challenges like privacy and convenience, customer acquisition 
                proved to be a formidable hurdle, ultimately leading to the closure of the venture. However, 
                the lessons I gained from that experience have been invaluable, shaping my approach at ElevateIdea.
              </p>
              
              <p>
                As I continue on this journey, I am inspired by India's rapidly evolving landscape—where 
                entrepreneurs thrive and technology drives transformation. I remain dedicated to helping 
                businesses unlock their full potential by overcoming technology barriers and driving 
                meaningful growth through innovation.
              </p>
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