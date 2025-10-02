import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { scrollToTop } from '../../utils/scrollUtils';
import SEO from '../../components/ui/SEO';
import styles from '../styles/TurnaroundStories.module.css';

interface TurnaroundStoriesProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  resetKey?: number;
}

interface StoryInfo {
  key: string;
  title: string;
  filename: string;
  industry: string;
  impactType: string;
  metrics: string;
  timeline: string;
  gradient: string;
}

function TurnaroundStories({ 
  currentLanguage, 
  onLanguageChange,
  resetKey
}: TurnaroundStoriesProps) {
  const { story } = useParams<{ story: string }>();
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Reset to stories overview when component mounts or resetKey changes
  useEffect(() => {
    setSelectedStory(null);
    setMarkdownContent('');
  }, [resetKey]);

  // Scroll to top when component initially mounts
  useEffect(() => {
    setTimeout(() => scrollToTop({ behavior: 'smooth' }), 200);
  }, []);

  // Turnaround stories configuration
  const stories: StoryInfo[] = [
    {
      key: 'government-project-revival',
      title: 'Government Project: $15M Crisis Recovery',
      filename: 'aadhaar-project-revival.md',
      industry: 'Government',
      impactType: 'Payment Recovery',
      metrics: '$15M unlocked',
      timeline: '2 quarters',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)'
    },
    {
      key: 'major-bank-transformation',
      title: 'Major Bank: High-Stakes Transformation',
      filename: 'major-bank-transformation.md',
      industry: 'Banking',
      impactType: 'Strategic Turnaround',
      metrics: 'Multi-million partnership saved',
      timeline: '12 months',
      gradient: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)'
    },
    {
      key: 'international-bank-expansion',
      title: 'Global Banking: One Month Crisis Resolution',
      filename: 'global-banking-expansion.md',
      industry: 'Banking',
      impactType: 'Crisis Prevention',
      metrics: 'Global expansion secured',
      timeline: '1 month ultimatum',
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
    },
    {
      key: 'international-bank-turnaround',
      title: 'International Bank: 40% to 100% in 4 Months',
      filename: 'international-bank-crisis-turnaround.md',
      industry: 'Banking',
      impactType: 'Crisis Recovery',
      metrics: '40% → 100% delivery',
      timeline: '4 months',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
    },
    {
      key: 'startup-company-unification',
      title: 'Growing Startup: Product Unification Strategy',
      filename: 'startup-product-unification.md',
      industry: 'Startup',
      impactType: 'Platform Transformation',
      metrics: '3 products → 1 platform',
      timeline: '8 months',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    },
    {
      key: 'major-retailer-engineering',
      title: 'Major Retailer: Engineering Effectiveness Revolution',
      filename: 'major-retailer-transformation.md',
      industry: 'Retail',
      impactType: 'Operational Transformation',
      metrics: 'Engineering effectiveness boost',
      timeline: '6 months',
      gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
    }
  ];

  // Story URL mapping (story1 -> actual story key)
  const storyMapping: { [key: string]: string } = {
    'story1': 'government-project-revival',
    'story2': 'international-bank-expansion', 
    'story3': 'international-bank-turnaround',
    'story4': 'major-bank-transformation',
    'story5': 'major-retailer-engineering',
    'story6': 'startup-company-unification'
  };

  // Reverse mapping (actual story key -> story1, story2, etc.)
  const reverseStoryMapping: { [key: string]: string } = {
    'government-project-revival': 'story1',
    'international-bank-expansion': 'story2',
    'international-bank-turnaround': 'story3',
    'major-bank-transformation': 'story4',
    'major-retailer-engineering': 'story5',
    'startup-company-unification': 'story6'
  };

  // Load specific story when URL parameter is present
  useEffect(() => {
    // Add small delay to ensure component is fully mounted in development
    const timer = setTimeout(() => {
      if (story && storyMapping[story]) {
        const actualStoryKey = storyMapping[story];
        const storyInfo = stories.find(s => s.key === actualStoryKey);
        if (storyInfo) {
          setSelectedStory(actualStoryKey);
          loadStoryContent(storyInfo.filename);
        }
      } else if (story && !storyMapping[story]) {
        // Invalid story parameter, reset to overview
        setSelectedStory(null);
        setMarkdownContent('');
      } else if (!story) {
        // No story parameter, show overview
        setSelectedStory(null);
        setMarkdownContent('');
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story]);

  const loadStoryContent = async function(filename: string) {
    setLoading(true);
    try {
      // Add cache busting parameter to prevent caching issues
      const timestamp = new Date().getTime();
      const url = `/content/turnaround-stories/${filename}?v=${timestamp}`;
      
      const response = await fetch(url, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      
      if (response.ok) {
        const content = await response.text();
        setMarkdownContent(content);
        
        // Scroll to top after content loads
        setTimeout(() => scrollToTop({ behavior: 'smooth' }), 200);
      } else {
        // Debug statement removed
        setMarkdownContent('# Story content not found\n\nThis turnaround story is currently being prepared.');
        
        // Scroll to top even on error
        setTimeout(() => scrollToTop({ behavior: 'smooth' }), 200);
      }
    } catch (error) {
      // Debug statement removed
      setMarkdownContent('# Error loading story\n\nPlease try again later.');
      
      // Scroll to top even on error
      setTimeout(() => scrollToTop({ behavior: 'smooth' }), 200);
    } finally {
      setLoading(false);
    }
  };

  function handleStorySelect(storyKey: string) {
    // Navigate to the story URL instead of loading content directly
    const storyNumber = reverseStoryMapping[storyKey];
    if (storyNumber) {
      navigate(`/turnaround-stories/${storyNumber}`);
    }
  }

  function handleBackToOverview() {
    // Navigate back to stories overview
    navigate('/turnaround-stories');
  }



  if (selectedStory && markdownContent) {
    return (
      <>
        <SEO
          title="ElevateIdea Founder's Corporate Turnaround Story"
          description="Real corporate turnaround experience from ElevateIdea founder. Detailed case study from 20+ years experience across banks, government, startups, retailers."
          keywords="ElevateIdea founder, corporate turnaround, business transformation, crisis management, turnaround specialist India"
          canonical="/turnaround-stories"
          type="article"
        />
        <div className={styles.turnaroundStoriesContainer}>
        <div className={styles.storyContent}>
          <button 
            className={styles.backButton}
            onClick={handleBackToOverview}
            aria-label="Return to turnaround stories overview"
            tabIndex={0}
          >
            ← Back to Turnaround Stories
          </button>
          {loading ? (
            <div className={styles.loading}>Loading story content...</div>
          ) : (
            <article className={styles.markdownContent} role="main" aria-label="Turnaround story content">
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            </article>
          )}
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="ElevateIdea Founder's Corporate Turnaround Stories - 6 Major Turnarounds, $15M+ Recovery"
        description="Real corporate turnaround experiences from ElevateIdea founder. 20+ years experience across banks, government projects, startups, retailers. 6 major turnarounds, $15M+ recovery value."
        keywords="ElevateIdea founder turnaround stories, corporate turnaround expert India, business crisis management, $15M recovery, transformation specialist, 6 major turnarounds"
        canonical="/turnaround-stories"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Partha Sarthi",
          "jobTitle": "Founder & CEO, ElevateIdea Technologies",
          "description": "Corporate turnaround specialist with 20+ years experience. Led 6 major turnarounds with $15M+ recovery value across banks, government projects, startups, and retailers.",
          "url": "https://elevateidea.com/turnaround-stories",
          "image": "https://elevateidea.com/logo192.png",
          "worksFor": {
            "@type": "Organization",
            "name": "ElevateIdea Technologies Private Limited",
            "url": "https://elevateidea.com"
          },
          "knowsAbout": [
            "Corporate Turnarounds",
            "Business Crisis Management", 
            "Technology Transformation",
            "MSME Digitization",
            "Strategic Project Recovery",
            "Banking Technology",
            "Government Project Management"
          ],
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Professional Experience",
            "description": "6 major corporate turnarounds with $15M+ recovery value (2016-2023)"
          },
          "alumniOf": [
            "IBM",
            "Aadhaar UIDAI Government of India"
          ],
          "sameAs": [
            "https://www.linkedin.com/in/parthasarthi/"
          ]
        }}
      />
      <div className={styles.turnaroundStoriesContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>🔄 Turnaround Stories</h1>
        <p className={styles.subtitle}>
          Sharing my corporate turnaround experiences that are helping me build ElevateIdea - hoping these real stories and lessons may help other entrepreneurs and businesses as well.
        </p>
        <p className={styles.contextText}>
          During 8 years of corporate turnaround experience (2016-2023) within my 20+ year career, I've led major turnarounds across large banks, growing startups, government projects, and major retailers. 
          These experiences taught me how to identify failing systems, rally teams under pressure, and deliver results when everything is on the line.
        </p>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>6</div>
            <div className={styles.statLabel}>Major Turnarounds</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>$15M+</div>
            <div className={styles.statLabel}>Recovery Value</div>
          </div>
        </div>
      </div>


      {/* Stories Grid */}
      <div className={styles.storiesGrid}>
        {stories.map(story => (
          <div
            key={story.key}
            className={styles.storyCard}
            onClick={() => handleStorySelect(story.key)}
            role="button"
            tabIndex={0}
            aria-label={`Read full story: ${story.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStorySelect(story.key);
              }
            }}
          >
            <div className={styles.storyCardContent}>
              <div className={styles.industryBadge}>{story.industry}</div>
              <h3 className={styles.storyTitle}>{story.title}</h3>
              
              <div className={styles.storyPreview}>
                {story.key === 'government-project-revival' && 'High-profile government project with $35M annual revenue faced two quarters of halted payments. $15M in suspended payments threatened 150-person team and strategic technology initiative.'}
                {story.key === 'major-bank-transformation' && 'Multi-million dollar banking partnership hanging in balance due to complex stakeholder conflicts and performance crisis. 12-month intensive transformation requiring political navigation and operational excellence.'}
                {story.key === 'international-bank-expansion' && 'One-year delivery delay triggered 30-day ultimatum from major international banking group. Global expansion across multiple countries dependent on crisis resolution within impossible timeline.'}
                {story.key === 'international-bank-turnaround' && 'Catastrophic 40% underperformance with contract termination threat. Customer demanded impossible 60% quarterly delivery. Four months to transform crisis into 100% success and rebuild strategic partnership.'}
                {story.key === 'startup-company-unification' && 'Fast-growing startup with three fragmented product variants limiting scalability and new customer acquisition. Strategic platform unification enabling rapid market expansion across new sectors.'}
                {story.key === 'major-retailer-engineering' && 'Engineering effectiveness bottlenecks threatening competitive position of leading international retail giant. Six-month comprehensive transformation of engineering practices and operational efficiency.'}
              </div>

              <div className={styles.keyMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{story.metrics}</span>
                  <span className={styles.metricLabel}>Achievement</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{story.timeline}</span>
                  <span className={styles.metricLabel}>Timeline</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{story.impactType}</span>
                  <span className={styles.metricLabel}>Impact Type</span>
                </div>
              </div>

              <div className={styles.readMore}>
                Read Full Story →
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
    </>
  );
}

export default TurnaroundStories;