import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { scrollToTop } from '../../utils/scrollUtils';
import styles from '../styles/BlogPost.module.css';
import { 
  getBlogPost, 
  getAllBlogPosts,
  formatDate,
  getCategoryIcon,
  getNextBlogPost,
  getPreviousBlogPost,
  BlogPost as BlogPostType 
} from '../../utils/blogUtils';

interface BlogPostProps {
  slug: string;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onBackClick: () => void;
  onNavigateToPost?: (slug: string) => void;
}

function BlogPost({ 
  slug, 
  currentLanguage, 
  onLanguageChange,
  onBackClick,
  onNavigateToPost 
}: BlogPostProps) {
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [nextPost, setNextPost] = useState<BlogPostType | null>(null);
  const [previousPost, setPreviousPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const blogPost = await getBlogPost(slug);
        if (!blogPost) {
          setError('Blog post not found');
          return;
        }
        
        setPost(blogPost);
        
        // Load next and previous posts by day number
        const nextBlogPost = await getNextBlogPost(blogPost.day);
        const prevBlogPost = await getPreviousBlogPost(blogPost.day);
        setNextPost(nextBlogPost);
        setPreviousPost(prevBlogPost);
        
        // Load related posts (same category, excluding current post)
        const allPosts = await getAllBlogPosts();
        const related = allPosts
          .filter(p => 
            p.id !== blogPost.id && 
            p.primaryCategory === blogPost.primaryCategory
          )
          .slice(0, 3);
        
        setRelatedPosts(related);
        
        // Scroll to top when post loads
        setTimeout(() => scrollToTop({ behavior: 'smooth' }), 200);
      } catch (err) {
        setError('Error loading blog post');
        // Debug statement removed
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  const handleRelatedPostClick = (relatedSlug: string) => {
    if (onNavigateToPost) {
      onNavigateToPost(relatedSlug);
      setTimeout(() => scrollToTop({ behavior: 'smooth' }), 100);
    } else {
      window.location.href = `/blog/${relatedSlug}`;
    }
  };

  const handlePreviousPostClick = () => {
    if (onNavigateToPost && previousPost) {
      onNavigateToPost(previousPost.slug);
      setTimeout(() => scrollToTop({ behavior: 'smooth' }), 100);
    }
  };

  const handleNextPostClick = () => {
    if (onNavigateToPost && nextPost) {
      onNavigateToPost(nextPost.slug);
      setTimeout(() => scrollToTop({ behavior: 'smooth' }), 100);
    }
  };

  if (loading) {
    return (
      <div className={styles.blogPost}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading story...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.blogPost}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Story Not Found</h2>
            <p>{error || 'The requested story could not be found.'}</p>
            <button className={styles.backButton} onClick={onBackClick}>
              ← Back to Stories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post ? `${post.title} | ElevateIdea Blog` : "Blog Post | ElevateIdea Blog"}
        description={post ? `${post.excerpt || post.content.substring(0, 160)}...` : "Read the latest business insights and strategies from ElevateIdea."}
        keywords={post ? `ElevateIdea blog, ${post.title}, ${post.primaryCategory}, business insights, MSME growth` : "ElevateIdea blog, business insights, MSME growth strategies"}
        canonical={`/blog/${slug}`}
        type="article"
        author="ElevateIdea Technologies"
      />
      <div className={styles.blogPost}>
      <div className={styles.container}>
        
        {/* Header Navigation */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBackClick}>
            ← Back to Stories
          </button>
          <div className={styles.postMeta}>
            <span className={styles.category}>
              {getCategoryIcon(post.primaryCategory)} {post.primaryCategory}
            </span>
            <span className={styles.date}>{formatDate(post.publishedDate)}</span>
            <span className={styles.readTime}>{post.readTime}</span>
          </div>
        </div>

        {/* Post Header */}
        <header className={styles.postHeader}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <p className={styles.postExcerpt}>{post.excerpt}</p>
          
          {post.imagePath && (
            <div className={styles.featuredImage}>
              <img src={post.imagePath} alt={post.title} />
            </div>
          )}
        </header>

        {/* Post Content */}
        <article className={styles.postContent}>
          <ReactMarkdown className={styles.markdown}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Tags */}
        {post.hashtags.length > 0 && (
          <div className={styles.tags}>
            <h3>Tags</h3>
            <div className={styles.tagList}>
              {post.hashtags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className={styles.relatedPosts}>
            <h3>Related Stories</h3>
            <div className={styles.relatedGrid}>
              {relatedPosts.map(relatedPost => (
                <div 
                  key={relatedPost.id} 
                  className={styles.relatedCard}
                  onClick={() => handleRelatedPostClick(relatedPost.slug)}
                >
                  <div className={styles.relatedIcon}>
                    {getCategoryIcon(relatedPost.primaryCategory)}
                  </div>
                  <div className={styles.relatedContent}>
                    <h4>{relatedPost.title}</h4>
                    <p>{relatedPost.excerpt.substring(0, 100)}...</p>
                    <span className={styles.relatedMeta}>
                      {formatDate(relatedPost.publishedDate)} • {relatedPost.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Day-based Navigation */}
        <div className={styles.dayNavigation}>
          <div className={styles.navButtons}>
            {previousPost && (
              <button 
                className={styles.navButton}
                onClick={handlePreviousPostClick}
              >
                ← Day {previousPost.day}: {previousPost.title.substring(0, 40)}...
              </button>
            )}
            {nextPost && (
              <button 
                className={styles.navButton}
                onClick={handleNextPostClick}
              >
                Day {nextPost.day}: {nextPost.title.substring(0, 40)}... →
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button className={styles.navButton} onClick={onBackClick}>
            ← All Stories
          </button>
        </div>

      </div>
    </div>
    </>
  );
}

export default BlogPost;