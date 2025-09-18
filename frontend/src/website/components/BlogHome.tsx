import React, { useState } from 'react';
import styles from '../styles/BlogHome.module.css';

interface BlogHomeProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onHomePage: () => void;
}

function BlogHome({ 
  currentLanguage, 
  onLanguageChange, 
  onHomePage 
}: BlogHomeProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stories', count: 55 },
    { id: 'entrepreneurship', name: 'Entrepreneurship', count: 18 },
    { id: 'business-building', name: 'Business Building', count: 22 },
    { id: 'tech-leadership', name: 'Tech Leadership', count: 15 }
  ];

  // Sample blog posts - in real implementation, these would come from a CMS or API
  const featuredPost = {
    id: 1,
    title: "From Consulting to Product: The ElevateBusiness 360° Journey",
    excerpt: "How we transformed from a consulting company to building India's first voice-first, multilingual business platform for MSME textile manufacturers. A story of pivoting, learning, and building something that truly matters.",
    category: "entrepreneurship",
    categoryName: "Entrepreneurship",
    date: "2025-01-15",
    readTime: "8 min read",
    icon: "🚀"
  };

  const blogPosts = [
    {
      id: 2,
      title: "The Voice-First Revolution in Indian Manufacturing",
      excerpt: "Why voice commands in Gujarati and Hindi are changing how textile manufacturers manage their business. Real stories from Gujarat factories.",
      category: "tech-leadership",
      categoryName: "Tech Leadership",
      date: "2025-01-12",
      readTime: "5 min read",
      icon: "🎤"
    },
    {
      id: 3,
      title: "Understanding MSME Cash Flow: The 30% Advance Payment Strategy",
      excerpt: "How advance payment tracking can transform your textile business profitability. Lessons learned from 100+ customer conversations.",
      category: "business-building",
      categoryName: "Business Building",
      date: "2025-01-10",
      readTime: "6 min read",
      icon: "💰"
    },
    {
      id: 4,
      title: "Building for 500M+ Users: Technical Architecture Decisions",
      excerpt: "The engineering decisions behind scaling a platform for India's entire MSME ecosystem. React PWA to Flutter, GCP deployment strategies.",
      category: "tech-leadership",
      categoryName: "Tech Leadership",
      date: "2025-01-08",
      readTime: "10 min read",
      icon: "⚙️"
    },
    {
      id: 5,
      title: "365 Days of Learning: Why I Document Every Day",
      excerpt: "The discipline of daily learning and sharing. How 365 days of consistent content creation shaped our product strategy and market understanding.",
      category: "entrepreneurship",
      categoryName: "Entrepreneurship",
      date: "2025-01-05",
      readTime: "4 min read",
      icon: "📚"
    },
    {
      id: 6,
      title: "Customer Discovery in Gujarat: Textile Industry Insights",
      excerpt: "What we learned talking to 200+ textile manufacturers in Surat, Ahmedabad, and Vadodara. Real problems, real solutions.",
      category: "business-building",
      categoryName: "Business Building",
      date: "2025-01-03",
      readTime: "7 min read",
      icon: "🏭"
    },
    {
      id: 7,
      title: "The Multilingual Challenge: Building for Gujarati, Hindi, English",
      excerpt: "Technical and UX challenges in building truly multilingual software. How we handle voice commands, UI translation, and cultural nuances.",
      category: "tech-leadership",
      categoryName: "Tech Leadership",
      date: "2024-12-28",
      readTime: "8 min read",
      icon: "🌐"
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const handlePostClick = (postId: number) => {
    console.log('Navigate to blog post:', postId);
    // In future, this will navigate to individual blog post
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup');
    // Handle newsletter signup
  };

  return (
    <div className={styles.blogHome}>
      <div className={styles.container}>
        <button onClick={onHomePage} className={styles.backButton}>
          ← Back to Homepage
        </button>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            365 Days of Stories
          </h1>
          <p className={styles.heroSubtitle}>
            Daily insights from building India's first voice-first business platform. 
            Entrepreneurship lessons, technical deep-dives, and real stories from the journey 
            of transforming MSME textile manufacturing through technology.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>55+</span>
              <span className={styles.statLabel}>Stories Published</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>365</span>
              <span className={styles.statLabel}>Days of Writing</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Main Categories</span>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Story</h2>
          <div className={styles.featuredPost} onClick={() => handlePostClick(featuredPost.id)}>
            <div className={styles.featuredContent}>
              <div className={styles.featuredText}>
                <span className={styles.featuredCategory}>{featuredPost.categoryName}</span>
                <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                <div className={styles.featuredMeta}>
                  <span className={styles.postDate}>{featuredPost.date}</span> • <span className={styles.readTime}>{featuredPost.readTime}</span>
                </div>
              </div>
              <div className={styles.featuredImage}>
                {featuredPost.icon}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className={styles.categories}>
          <h2 className={styles.sectionTitle}>Browse by Category</h2>
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
            {filteredPosts.map(post => (
              <div 
                key={post.id} 
                className={styles.postCard}
                onClick={() => handlePostClick(post.id)}
              >
                <div className={styles.postImage}>
                  {post.icon}
                </div>
                <div className={styles.postContent}>
                  <span className={styles.postCategory}>{post.categoryName}</span>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.postMeta}>
                    <span className={styles.postDate}>{post.date}</span>
                    <span className={styles.readTime}>{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className={styles.newsletter}>
          <h2 className={styles.newsletterTitle}>Stay Updated</h2>
          <p className={styles.newsletterSubtitle}>
            Get the latest insights from our 365-day journey of building ElevateBusiness 360°. 
            Weekly updates on entrepreneurship, technology, and business building.
          </p>
          <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              className={styles.newsletterInput}
              required
            />
            <button type="submit" className={styles.newsletterButton}>
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default BlogHome;