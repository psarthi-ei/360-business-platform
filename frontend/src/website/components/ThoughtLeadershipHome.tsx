import React from 'react';
import SEO from '../../components/ui/SEO';
import styles from '../styles/ThoughtLeadershipHome.module.css';
import { scrollToTop } from '../../utils/scrollUtils';

interface ThoughtLeadershipHomeProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onEngineeringBook: () => void;
  onIntroduction: () => void;
  onChapter1: () => void;
  on365DaysReflections: () => void;
  onTurnaroundStories: () => void;
  onElevateBusiness360: () => void;
  onAbout: () => void;
  onContact: () => void;
}

function ThoughtLeadershipHome({ 
  currentLanguage, 
  onLanguageChange, 
  onEngineeringBook,
  onIntroduction,
  onChapter1,
  on365DaysReflections,
  onTurnaroundStories,
  onElevateBusiness360,
  onAbout,
  onContact
}: ThoughtLeadershipHomeProps) {

  // Wrapper functions to ensure scroll to top on navigation
  const handleElevateBusiness360Click = () => {
    scrollToTop({ behavior: 'auto' });
    setTimeout(() => {
      onElevateBusiness360();
    }, 100);
  };

  const handle365DaysReflectionsClick = () => {
    scrollToTop({ behavior: 'auto' });
    setTimeout(() => {
      on365DaysReflections();
    }, 100);
  };

  return (
    <>
      <SEO
        title="ElevateIdea"
        description="20+ years engineering leadership experience with 6 engineering program turnarounds worth $15M+ recovery. Author of engineering leadership insights and strategic advisor for engineering organizations."
        keywords="engineering leadership, engineering program turnaround, technical leadership, engineering advisor, engineering organization transformation, engineering team recovery"
        canonical="/"
        type="website"
        image="/social-preview.jpg"
        imageWidth={1200}
        imageHeight={630}
        imageAlt="Partha Sarthi - Engineering Leadership & Engineering Program Turnaround Expert"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Partha Sarthi",
          "jobTitle": "Engineering Leadership & Engineering Program Turnaround Expert",
          "url": "https://elevateidea.com",
          "image": "https://elevateidea.com/logo192.png",
          "description": "20+ years engineering leadership experience with 6 engineering program turnarounds worth $15M+ recovery value. Author and engineering advisor.",
          "knowsAbout": ["Engineering Leadership", "Engineering Program Turnarounds", "Technical Team Recovery", "Engineering Organization Transformation", "AI-Enabled Development"],
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Engineering Leadership Expert",
            "description": "Specializes in engineering program turnarounds and engineering organization transformation"
          },
          "sameAs": [
            "https://www.linkedin.com/in/parthasarthi/",
            "https://github.com/psarthi-ei"
          ]
        }}
      />
      <div className={styles.thoughtLeadershipHome}>
        
        {/* Hero Section - AI Disruption Narrative */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              When Code Is No Longer the Bottleneck
            </h1>
            <p className={styles.heroSubtitle}>
              For the first time in software history, the activity that consumed most engineering effort — writing code — is no longer the primary bottleneck. The way we organize, lead, and measure engineering teams must change too.
            </p>
            <p className={styles.heroMission}>
              So I'm attempting to figure it out in public, based on 20 years of lived experience, failures, and turnarounds.
            </p>
            
            <div className={styles.authorIntro}>
              <h2 className={styles.authorName}>Partha Sarthi</h2>
              <p className={styles.authorCredentials}>
                Technology Leader | Product Builder | Program Turnaround Specialist | 2X Entrepreneur
              </p>
            </div>
          </div>
        </section>

        {/* Latest Book Chapters - Primary Focus */}
        <section className={styles.latestChapters}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              Figuring It Out in Public
            </h2>
            <p className={styles.sectionSubtitle}>
              Latest insights on building future-ready engineering organizations in the AI era
            </p>
            
            <div className={styles.chaptersGrid}>
              {/* Why This Book Preview */}
              <div className={styles.chapterCard}>
                <div className={styles.chapterMeta}>
                  <span className={styles.chapterNumber}>Introduction</span>
                  <span className={styles.chapterDate}>Published Feb 6, 2026</span>
                </div>
                <h3 className={styles.chapterTitle}>Why This Book</h3>
                <p className={styles.chapterExcerpt}>
                  "I am writing this book because I believe we have reached the end of a long chapter in the history of software development — and the beginning of another for which we do not yet have a playbook."
                </p>
                <div className={styles.chapterStats}>
                  <span className={styles.readTime}>8 min read</span>
                  <span className={styles.chapterTags}>#AI-Era #SoftwareDevelopment #BookIntro</span>
                </div>
                <button className={styles.chapterCta} onClick={onIntroduction}>Continue Reading →</button>
              </div>

              {/* Chapter 1 Preview */}
              <div className={styles.chapterCard}>
                <div className={styles.chapterMeta}>
                  <span className={styles.chapterNumber}>Chapter 1</span>
                  <span className={styles.chapterDate}>Published Feb 7, 2026</span>
                </div>
                <h3 className={styles.chapterTitle}>The Two Engineering Organizations Most of Us Actually Work In</h3>
                <p className={styles.chapterExcerpt}>
                  "Most engineering organizations fall into two categories: traditional engineering orgs, and reasonably mature (but imperfect) agile organizations. Understanding where we are is crucial before we can evolve."
                </p>
                <div className={styles.chapterStats}>
                  <span className={styles.readTime}>12 min read</span>
                  <span className={styles.chapterTags}>#EngineeringOrganizations #TeamStructure</span>
                </div>
                <button className={styles.chapterCta} onClick={onChapter1}>Continue Reading →</button>
              </div>

              {/* Chapter 2 Preview */}
              <div className={styles.chapterCard}>
                <div className={styles.chapterMeta}>
                  <span className={styles.chapterNumber}>Chapter 2</span>
                  <span className={styles.chapterDate}>Coming Soon</span>
                </div>
                <h3 className={styles.chapterTitle}>Why These Models Worked for a Long Time</h3>
                <p className={styles.chapterExcerpt}>
                  "Human-written code was the core bottleneck, and specialization with handoffs made perfect sense. Understanding why these models worked helps us see why they're breaking down now."
                </p>
                <div className={styles.chapterStats}>
                  <span className={styles.readTime}>Coming Soon</span>
                  <span className={styles.chapterTags}>#EngineeringHistory #Specialization</span>
                </div>
                <button className={styles.chapterCta} disabled>Coming Soon</button>
              </div>
            </div>
            
            <div className={styles.sectionCta}>
              <button className={styles.allChaptersCta} onClick={onEngineeringBook}>
                Read All Chapters
              </button>
              <p className={styles.ctaNote}>
                <a href="https://www.linkedin.com/in/parthasarthi/" target="_blank" rel="noopener noreferrer" className={styles.linkedinLink}>
                  Follow on LinkedIn for latest insights
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ElevateBusiness 360° Portfolio Showcase */}
        <section className={styles.portfolio}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              Proof of AI-First Engineering
            </h2>
            <p className={styles.sectionSubtitle}>
              AI-enabled B2B platform showcasing modern engineering leadership principles and intelligent automation for textile manufacturing workflows
            </p>
            
            <div className={styles.portfolioShowcase} onClick={handleElevateBusiness360Click}>
              <div className={styles.portfolioContent}>
                <h3 className={styles.portfolioTitle}>ElevateBusiness 360°</h3>
                <p className={styles.portfolioSubtitle}>AI-Enabled Enterprise Platform</p>
                <p className={styles.portfolioDescription}>
                  Engineering excellence demonstration built by a solo founder using AI-first development methodology. 
                  Complete enterprise-grade business platform with zero manual coding, showcasing rapid solo development with AI assistance and intelligent automation.
                </p>
                
                <div className={styles.portfolioHighlights}>
                  <div className={styles.highlight}>
                    <span className={styles.highlightNumber}>78</span>
                    <span className={styles.highlightLabel}>Days</span>
                  </div>
                  <div className={styles.highlight}>
                    <span className={styles.highlightNumber}>61,664</span>
                    <span className={styles.highlightLabel}>Lines of Code</span>
                  </div>
                  <div className={styles.highlight}>
                    <span className={styles.highlightNumber}>8</span>
                    <span className={styles.highlightLabel}>Business Modules</span>
                  </div>
                  <div className={styles.highlight}>
                    <span className={styles.highlightNumber}>Zero</span>
                    <span className={styles.highlightLabel}>Manual Code</span>
                  </div>
                </div>
                
                <button className={styles.portfolioCta}>Learn About Our Product →</button>
              </div>
            </div>
          </div>
        </section>

        {/* Stories Section - Two Categories */}
        <section className={styles.storiesSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>
              Engineering Leadership in Action
            </h2>
            <p className={styles.sectionSubtitle}>
              Real case studies and personal insights from 20+ years of technology leadership
            </p>
            
            <div className={styles.storiesCategories}>
              {/* Case Studies Category */}
              <div className={styles.storyCategory}>
                <div className={styles.categoryHeader}>
                  <h3 className={styles.categoryTitle}>Case Studies</h3>
                  <p className={styles.categoryDescription}>
                    How I rescued failing engineering programs and turned around technical disasters
                  </p>
                </div>
                
                <div className={styles.categoryStories}>
                  <div className={styles.storyCard}>
                    <h4 className={styles.storyTitle}>Government Project: $15M Crisis Recovery</h4>
                    <p className={styles.storyExcerpt}>
                      "High-profile government project with $35M annual revenue faced two quarters of halted payments. $15M in suspended payments threatened 150-person team and strategic technology initiative."
                    </p>
                    <div className={styles.storyOutcome}>Recovery Value: $15M</div>
                  </div>
                </div>
                
                <div className={styles.categoryCta}>
                  <button className={styles.categoryButton} onClick={onTurnaroundStories}>
                    View Case Studies
                  </button>
                </div>
              </div>

              {/* Personal Stories Category */}
              <div className={styles.storyCategory}>
                <div className={styles.categoryHeader}>
                  <h3 className={styles.categoryTitle}>Personal Stories</h3>
                  <p className={styles.categoryDescription}>
                    Lessons learned from entrepreneurship journey and leadership experiences
                  </p>
                </div>
                
                <div className={styles.categoryStories}>
                  <div className={styles.storyCard}>
                    <h4 className={styles.storyTitle}>The Brutal Truth About AI-Human Development</h4>
                    <p className={styles.storyExcerpt}>
                      "What 36 Days of Building with AI Really Looks Like (Spoiler: It's Not What You Think). From honeymoon phase to breaking point to partnership - the real story of building enterprise software with AI assistance."
                    </p>
                    <div className={styles.storyOutcome}>Day 58 • Featured Story</div>
                  </div>
                </div>
                
                <div className={styles.categoryCta}>
                  <button className={styles.categoryButton} onClick={handle365DaysReflectionsClick}>
                    Read Personal Stories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ThoughtLeadershipHome;