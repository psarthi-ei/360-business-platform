import React, { useState, useEffect } from 'react';
import SEO from '../../components/ui/SEO';
import { scrollToTop } from '../../utils/scrollUtils';
import styles from '../styles/BookChapter.module.css';
import { 
  getChapter, 
  loadChapterContent,
  getNextChapter,
  getPreviousChapter,
  formatDate,
  getSectionIcon,
  clearBookMetadataCache,
  BookChapter as BookChapterType 
} from '../../utils/bookUtils';

interface BookChapterProps {
  slug: string;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onBackClick: () => void;
  onNavigateToChapter?: (slug: string) => void;
}

function BookChapter({ 
  slug, 
  currentLanguage, 
  onLanguageChange,
  onBackClick,
  onNavigateToChapter 
}: BookChapterProps) {
  const [chapter, setChapter] = useState<BookChapterType | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [nextChapter, setNextChapter] = useState<BookChapterType | null>(null);
  const [prevChapter, setPrevChapter] = useState<BookChapterType | null>(null);

  useEffect(() => {
    loadChapterData();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToTop({ behavior: 'smooth' });
  }, [chapter]);

  const loadChapterData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Clear cache to ensure fresh data
      clearBookMetadataCache();
      
      // Load chapter metadata
      const chapterData = await getChapter(slug);
      if (!chapterData) {
        setError('Chapter not found');
        return;
      }

      setChapter(chapterData);

      // Load chapter content, navigation chapters
      const [chapterContent, nextChap, prevChap] = await Promise.all([
        loadChapterContent(chapterData.filename),
        getNextChapter(chapterData.order),
        getPreviousChapter(chapterData.order)
      ]);

      setContent(chapterContent);
      setNextChapter(nextChap);
      setPrevChapter(prevChap);

    } catch (err) {
      setError('Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (targetSlug: string) => {
    if (onNavigateToChapter) {
      onNavigateToChapter(targetSlug);
    }
  };

  if (loading) {
    return (
      <div className={styles.bookChapter}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading chapter...</div>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <>
        <SEO
          title="Chapter Not Found - ElevateIdea"
          description="The requested chapter could not be found."
          canonical={`/book/${slug}`}
        />
        <div className={styles.bookChapter}>
          <div className={styles.container}>
            <button 
              className={styles.backButton}
              onClick={onBackClick}
            >
              ← Back to Book
            </button>
            <div className={styles.error}>
              <h1>Chapter Not Found</h1>
              <p>The chapter you're looking for doesn't exist or hasn't been published yet.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${chapter.title} - ElevateIdea`}
        description={chapter.excerpt}
        keywords={`book chapter, ${chapter.title}, engineering leadership, AI era engineering, ${chapter.section}`}
        canonical={`/book/${slug}`}
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": chapter.title,
          "description": chapter.excerpt,
          "author": {
            "@type": "Person",
            "name": "Partha Sarthi"
          },
          "datePublished": chapter.publishedDate,
          "isPartOf": {
            "@type": "Book",
            "name": "When Code Is No Longer the Bottleneck"
          }
        }}
      />
      <div className={styles.bookChapter}>
        <div className={styles.container}>
          
          {/* Navigation */}
          <div className={styles.navigation}>
            <button 
              className={styles.backButton}
              onClick={onBackClick}
            >
              ← Back to Book
            </button>
          </div>

          {/* Chapter Header */}
          <header className={styles.chapterHeader}>
            <div className={styles.chapterMeta}>
              <span className={styles.chapterNumber}>Chapter {chapter.number}</span>
              <span className={styles.chapterSection}>
                {getSectionIcon(chapter.section)} {chapter.section}
              </span>
            </div>
            
            <h1 className={styles.chapterTitle}>{chapter.title}</h1>
            
            {chapter.subtitle && (
              <h2 className={styles.chapterSubtitle}>{chapter.subtitle}</h2>
            )}
            
            <div className={styles.chapterInfo}>
              <span className={styles.publishedDate}>{formatDate(chapter.publishedDate)}</span>
              <span className={styles.readTime}>{chapter.readTime}</span>
            </div>
          </header>

          {/* Chapter Content */}
          <div 
            className={`${styles.chapterContent} book-html-content`}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Chapter Navigation */}
          <nav className={styles.chapterNavigation}>
            <div className={styles.navLinks}>
              {prevChapter ? (
                <button 
                  className={styles.navButton + ' ' + styles.prevButton}
                  onClick={() => handleNavigation(prevChapter.slug)}
                >
                  <span className={styles.navLabel}>← Previous Chapter</span>
                  <span className={styles.navTitle}>{prevChapter.title}</span>
                </button>
              ) : (
                <div className={styles.navSpacer}></div>
              )}
              
              {nextChapter ? (
                <button 
                  className={styles.navButton + ' ' + styles.nextButton}
                  onClick={() => handleNavigation(nextChapter.slug)}
                >
                  <span className={styles.navLabel}>Next Chapter →</span>
                  <span className={styles.navTitle}>{nextChapter.title}</span>
                </button>
              ) : (
                <div className={styles.navSpacer}></div>
              )}
            </div>
          </nav>

          {/* Back to Book */}
          <div className={styles.backToBook}>
            <button 
              className={styles.backToBookButton}
              onClick={onBackClick}
            >
              ← Back to All Chapters
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default BookChapter;