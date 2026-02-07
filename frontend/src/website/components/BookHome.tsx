import React, { useState, useEffect } from 'react';
import SEO from '../../components/ui/SEO';
import styles from '../styles/BookHome.module.css';
import { 
  getAllChapters,
  getChaptersBySection,
  getBookSections,
  searchChapters,
  formatDate,
  getSectionIcon,
  BookChapter,
  BookSection 
} from '../../utils/bookUtils';

interface BookHomeProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onChapterClick?: (slug: string) => void;
}

function BookHome({ 
  currentLanguage, 
  onLanguageChange,
  onChapterClick
}: BookHomeProps) {
  const [activeSection, setActiveSection] = useState('all');
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [sections, setSections] = useState<BookSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load book data on component mount
  useEffect(() => {
    loadBookData();
  }, []);

  // Filter chapters by section and search
  useEffect(() => {
    const loadFilteredChapters = async () => {
      
      if (searchQuery.trim()) {
        setIsSearching(true);
        const searchResults = await searchChapters(searchQuery);
        setChapters(searchResults);
        setIsSearching(false);
      } else if (sections.length > 0) {
        const chapterResults = await getChaptersBySection(activeSection);
        setChapters(chapterResults);
        setIsSearching(false);
      }
    };
    
    loadFilteredChapters();
  }, [activeSection, sections, searchQuery]);

  const handleChapterClick = (slug: string) => {
    if (onChapterClick) {
      onChapterClick(slug);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setActiveSection('all');
  };

  const loadBookData = async () => {
    setLoading(true);
    try {
      const [chapterResults, sectionResults] = await Promise.all([
        getAllChapters(),
        getBookSections()
      ]);
      
      setChapters(chapterResults);
      setSections(sectionResults);
    } catch (error) {
      // Error loading book data
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Book - ElevateIdea"
        description="When Code Is No Longer the Bottleneck - A book about building future-ready engineering organizations in the AI era. Written in public, chapter by chapter."
        keywords="engineering leadership book, AI era engineering, future of engineering organizations, building engineering teams, technical leadership"
        canonical="/book"
      />
      <div className={styles.bookHome}>
        <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            When Code Is No Longer the Bottleneck
          </h1>
          <p className={styles.heroSubtitle}>
            A book about building future-ready engineering organizations in the AI era. 
            Written in public, chapter by chapter, based on 20+ years of engineering leadership experience.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>{chapters.length}</span>
              <span className={styles.statLabel}>Chapters Published</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>In Progress</span>
              <span className={styles.statLabel}>Book Status</span>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search chapters by title, content, or topics..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button onClick={handleSearchClear} className={styles.searchClear}>
                ✕ Clear
              </button>
            )}
          </div>
          {searchQuery && (
            <div className={styles.searchInfo}>
              {isSearching ? 'Searching...' : `Found ${chapters.length} chapters matching "${searchQuery}"`}
            </div>
          )}
        </section>

        {/* Sections */}
        <section className={styles.sections}>
          <div className={styles.sectionsHeader}>
            <h2 className={styles.sectionTitle}>Browse by Section</h2>
          </div>
          <div className={styles.sectionTabs}>
            {sections.map(section => (
              <button
                key={section.id}
                className={`${styles.sectionTab} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.name} ({section.count})
              </button>
            ))}
          </div>
        </section>

        {/* Chapters */}
        <section className={styles.chaptersSection}>
          <div className={styles.chaptersGrid}>
            {loading ? (
              <div className={styles.loading}>Loading chapters...</div>
            ) : chapters.length > 0 ? (
              chapters.map(chapter => (
                <div 
                  key={chapter.id} 
                  className={styles.chapterCard}
                  onClick={() => handleChapterClick(chapter.slug)}
                >
                  <div className={styles.chapterHeader}>
                    <div className={styles.chapterNumber}>Chapter {chapter.number}</div>
                    <div className={styles.chapterSection}>
                      {getSectionIcon(chapter.section)} {chapter.section}
                    </div>
                  </div>
                  <div className={styles.chapterContent}>
                    <h3 className={styles.chapterTitle}>{chapter.title}</h3>
                    {chapter.subtitle && (
                      <h4 className={styles.chapterSubtitle}>{chapter.subtitle}</h4>
                    )}
                    <p className={styles.chapterExcerpt}>
                      {chapter.excerpt.length > 120 ? 
                        `${chapter.excerpt.substring(0, 120)}...` : 
                        chapter.excerpt
                      }
                    </p>
                    <div className={styles.chapterMeta}>
                      <span className={styles.chapterDate}>{formatDate(chapter.publishedDate)}</span>
                      <span className={styles.readTime}>{chapter.readTime}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noChapters}>No chapters found in this section.</div>
            )}
          </div>
        </section>

        {/* About the Book */}
        <section className={styles.about}>
          <h2 className={styles.aboutTitle}>About This Book</h2>
          <p className={styles.aboutText}>
            This book is being written in public, chapter by chapter, as I explore what engineering organizations 
            need to look like in an AI-first world. It's based on 20+ years of experience across large enterprises, 
            startups, and multiple engineering program turnarounds.
          </p>
          <p className={styles.aboutText}>
            Follow along as each chapter is published, or jump in at any point. The ideas are evolving, 
            and I welcome discussion and alternative perspectives.
          </p>
          <a 
            href="https://linkedin.com/in/parthasarthi" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkedinButton}
          >
            Follow on LinkedIn for Updates
          </a>
        </section>
      </div>
      </div>
    </>
  );
}

export default BookHome;