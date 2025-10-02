import React, { useState, useEffect } from 'react';
import SEO from '../../components/ui/SEO';
import styles from '../styles/BlogHome.module.css';
import BlogCategoryManager from './BlogCategoryManager';
import { useUser } from '../../contexts/UserContext';
import { 
  getBlogPostsByDayNumber,
  getBlogPostsByCategoryDayOrder,
  getBlogCategories, 
  getFeaturedPost,
  searchBlogPosts,
  formatDate,
  getCategoryIcon,
  BlogPost,
  BlogCategory 
} from '../../utils/blogUtils';

interface BlogHomeProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onBlogPostClick?: (day: number) => void;
}

function BlogHome({ 
  currentLanguage, 
  onLanguageChange,
  onBlogPostClick
}: BlogHomeProps) {
  const { isAdmin } = useUser();
  const [activeCategory, setActiveCategory] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Load blog data on component mount
  useEffect(() => {
    loadBlogData();
  }, []);

  // Filter posts by category and search
  useEffect(() => {
    const loadFilteredPosts = async () => {
      
      if (searchQuery.trim()) {
        
        setIsSearching(true);
        const searchResults = await searchBlogPosts(searchQuery);
        
        // Sort search results by day number (latest first)
        const sortedResults = searchResults.sort((a, b) => b.day - a.day);
        setBlogPosts(sortedResults);
        setIsSearching(false);
      } else if (categories.length > 0) {
        
        const posts = await getBlogPostsByCategoryDayOrder(activeCategory);
        
        setBlogPosts(posts);
        setIsSearching(false);
      }
    };
    
    loadFilteredPosts();
  }, [activeCategory, categories, searchQuery]);

  // Filter posts for display
  const filteredPosts = blogPosts;

  const handlePostClick = (day: number) => {
    if (onBlogPostClick) {
      onBlogPostClick(day);
    } else {
      
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };


  const handleCategoryUpdated = () => {
    // Reload data when categories are updated
    loadBlogData();
  };

  const loadBlogData = async () => {
    setLoading(true);
    try {
      const [posts, cats, featured] = await Promise.all([
        getBlogPostsByDayNumber(),
        getBlogCategories(),
        getFeaturedPost()
      ]);
      
      setBlogPosts(posts);
      setCategories(cats);
      setFeaturedPost(featured);
    } catch (error) {
      // Debug statement removed
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="ElevateIdea Blog - AI-Era Business Insights & MSME Growth Strategies"
        description="Discover AI-powered business insights, MSME growth strategies, and technology transformation tips from ElevateIdea. Expert perspectives on scaling textile manufacturing businesses."
        keywords="ElevateIdea blog, MSME growth strategies, AI business insights, textile manufacturing technology, business transformation"
        canonical="/blog"
      />
      <div className={styles.blogHome}>
        <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            365 Days of Stories
          </h1>
          <p className={styles.heroSubtitle}>
            My complete entrepreneurship evolution - sharing 365 raw stories from corporate life, 
            personal reflections, first startup venture, and my current second entrepreneurial stint. 
            Authentic stories of struggle, failure, learning, and growth across multiple chapters.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>{blogPosts.length}</span>
              <span className={styles.statLabel}>Stories Published</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>365</span>
              <span className={styles.statLabel}>Target Stories</span>
            </div>
          </div>
        </section>

        {/* Featured Story */}
        {featuredPost && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionTitle}>Featured Story</h2>
            <div className={styles.featuredPostContainer}>
              <div 
                className={styles.featuredPost}
                onClick={() => handlePostClick(featuredPost.day)}
              >
                <div className={styles.featuredContent}>
                  <div className={styles.featuredText}>
                    <span className={styles.featuredCategory}>
                      ⭐ {featuredPost.primaryCategory}
                    </span>
                    <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
                    <p className={styles.featuredExcerpt}>
                      {featuredPost.content ? 
                        featuredPost.content
                          .split('\n')
                          .filter(line => !line.includes('365 Days of Stories') && !line.includes('💔') && line.trim().length > 0)
                          .slice(0, 15)
                          .join(' ')
                          .replace(/[💔🚀🤯⚡🏗️❤️❌✅👉💬🎨💻⚙️🧪🛡️📐💡🧭]/g, '')
                          .substring(0, 800) + '...' 
                        : featuredPost.excerpt
                      }
                    </p>
                    <div className={styles.featuredMeta}>
                      <span className={styles.postDate}>{formatDate(featuredPost.publishedDate)}</span> • <span className={styles.readTime}>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <div className={styles.featuredImage}>
                    {featuredPost.imagePath ? (
                      <img src={featuredPost.imagePath} alt={featuredPost.title} className={styles.featuredImageImg} />
                    ) : (
                      <div className={styles.featuredImageFallback}>
                        {getCategoryIcon(featuredPost.primaryCategory)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search stories by title, content, or hashtags..."
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
              {isSearching ? 'Searching...' : `Found ${filteredPosts.length} stories matching "${searchQuery}"`}
            </div>
          )}
        </section>

        {/* Categories */}
        <section className={styles.categories}>
          <div className={styles.categoriesHeader}>
            <h2 className={styles.sectionTitle}>Browse by Category</h2>
            {isAdmin && (
              <button 
                onClick={() => setShowCategoryManager(true)}
                className={styles.manageButton}
                title="Manage Categories"
              >
                ⚙️ Manage Categories
              </button>
            )}
          </div>
          <div className={styles.categoryTabs}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryTab} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts */}
        <section className={styles.postsSection}>
          <div className={styles.postsGrid}>
            {loading ? (
              <div className={styles.loading}>Loading stories...</div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className={styles.postCard}
                  onClick={() => handlePostClick(post.day)}
                >
                  <div className={styles.postImage}>
                    {post.imagePath ? (
                      <img src={post.imagePath} alt={post.title} className={styles.postImageImg} />
                    ) : (
                      getCategoryIcon(post.primaryCategory)
                    )}
                  </div>
                  <div className={styles.postContent}>
                    <span className={styles.postCategory}>{post.primaryCategory}</span>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postExcerpt}>
                      {post.excerpt.length > 120 ? 
                        `${post.excerpt.substring(0, 120)}...` : 
                        post.excerpt
                      }
                    </p>
                    <div className={styles.postMeta}>
                      <span className={styles.postDate}>{formatDate(post.publishedDate)}</span>
                      <span className={styles.readTime}>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noPosts}>No stories found in this category.</div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className={styles.newsletter}>
          <h2 className={styles.newsletterTitle}>Stay Updated</h2>
          <p className={styles.newsletterSubtitle}>
            Follow my ongoing entrepreneurship journey! From corporate to first venture to current startup experiments - 
            raw, authentic stories as I navigate my second entrepreneurial stint. Real experiences and lessons I'm learning along the way.
          </p>
          <div className={styles.comingSoonContainer}>
            <p className={styles.comingSoonText}>
              📧 Newsletter coming soon - follow my LinkedIn for real-time updates on this entrepreneurship journey
            </p>
            <a 
              href="https://linkedin.com/in/parthasarthi" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.linkedinButton}
            >
              Follow on LinkedIn
            </a>
          </div>
        </section>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <BlogCategoryManager
          onClose={() => setShowCategoryManager(false)}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}
      </div>
    </>
  );
}

export default BlogHome;