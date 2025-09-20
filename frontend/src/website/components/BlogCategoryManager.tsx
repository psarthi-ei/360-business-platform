import React, { useState, useEffect } from 'react';
import styles from '../styles/BlogCategoryManager.module.css';
import { 
  getAllBlogPosts,
  getBlogCategories,
  BlogPost,
  BlogCategory 
} from '../../utils/blogUtils';
import { updatePostCategories as updateCategoriesAPI, markPostAsFeatured, unmarkFeaturedPost } from '../../utils/categoryApi';

interface BlogCategoryManagerProps {
  onClose: () => void;
  onCategoryUpdated: () => void;
}

function BlogCategoryManager({ onClose, onCategoryUpdated }: BlogCategoryManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFeaturedUpdating, setIsFeaturedUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const postsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allPosts, allCategories] = await Promise.all([
        getAllBlogPosts(),
        getBlogCategories()
      ]);
      setPosts(allPosts.sort((a, b) => b.day - a.day));
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateCategoryName = (categoryName: string): { valid: boolean; error?: string } => {
    if (!categoryName.trim()) {
      return { valid: false, error: 'Category name cannot be empty' };
    }
    
    if (categoryName.length < 2) {
      return { valid: false, error: 'Category name must be at least 2 characters' };
    }
    
    if (categoryName.length > 50) {
      return { valid: false, error: 'Category name must be less than 50 characters' };
    }
    
    if (!/^[a-zA-Z0-9\s\-&']+$/.test(categoryName)) {
      return { valid: false, error: 'Category name contains invalid characters' };
    }
    
    return { valid: true };
  };

  const handleUpdateCategories = async () => {
    if (!newCategory.trim() || selectedPosts.length === 0) {
      alert('Please select posts and enter a category name');
      return;
    }

    // Validate category name
    const validation = validateCategoryName(newCategory);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateCategoriesAPI({
        postIds: selectedPosts,
        newCategory: newCategory.trim()
      });

      if (result.success) {
        setSuccessMessage(result.message);
        setSelectedPosts([]);
        setNewCategory('');
        
        // Refresh data
        await loadData();
        onCategoryUpdated();
        
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error updating categories:', error);
      alert('Error updating categories. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.primaryCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const displayedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const selectAllDisplayed = () => {
    const allDisplayedIds = displayedPosts.map(post => post.id);
    setSelectedPosts(prev => {
      const combined = [...prev, ...allDisplayedIds];
      const uniqueIds = combined.filter((id, index) => combined.indexOf(id) === index);
      return uniqueIds;
    });
  };

  const clearSelection = () => {
    setSelectedPosts([]);
  };

  const handleMarkAsFeatured = async (postId: string) => {
    setIsFeaturedUpdating(true);
    try {
      const result = await markPostAsFeatured(postId, 1);
      
      if (result.success) {
        setSuccessMessage(result.message);
        await loadData(); // Refresh data
        onCategoryUpdated();
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error marking post as featured:', error);
      alert('Error marking post as featured. Please try again.');
    } finally {
      setIsFeaturedUpdating(false);
    }
  };

  const handleUnmarkFeatured = async (postId: string) => {
    setIsFeaturedUpdating(true);
    try {
      const result = await unmarkFeaturedPost(postId);
      
      if (result.success) {
        setSuccessMessage(result.message);
        await loadData(); // Refresh data
        onCategoryUpdated();
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error removing featured status:', error);
      alert('Error removing featured status. Please try again.');
    } finally {
      setIsFeaturedUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.loading}>Loading blog posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>📝 Blog Category Manager</h2>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>
            ✅ {successMessage}
          </div>
        )}

        <div className={styles.content}>
          {/* Current Categories Overview */}
          <div className={styles.categoriesOverview}>
            <h3>Current Categories</h3>
            <div className={styles.categoryList}>
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <span key={category.id} className={styles.categoryBadge}>
                  {category.name} ({category.count})
                </span>
              ))}
            </div>
          </div>

          {/* Featured Post Overview */}
          <div className={styles.featuredOverview}>
            <h3>Featured Post</h3>
            {posts.find(post => post.featured) ? (
              <div className={styles.featuredInfo}>
                <span className={styles.featuredBadge}>⭐ FEATURED</span>
                <span className={styles.featuredTitle}>
                  Day {posts.find(post => post.featured)?.day}: {posts.find(post => post.featured)?.title}
                </span>
              </div>
            ) : (
              <p className={styles.noFeatured}>No featured post selected. Click the ☆ button next to any post to mark it as featured.</p>
            )}
          </div>

          {/* Search and Controls */}
          <div className={styles.controls}>
            <div className={styles.searchSection}>
              <input
                type="text"
                placeholder="Search posts by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.selectionControls}>
              <span className={styles.selectionCount}>
                {selectedPosts.length} posts selected
              </span>
              <button onClick={selectAllDisplayed} className={styles.selectButton}>
                Select All on Page
              </button>
              <button onClick={clearSelection} className={styles.selectButton}>
                Clear Selection
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className={styles.postsList}>
            {displayedPosts.map(post => (
              <div 
                key={post.id} 
                className={`${styles.postItem} ${selectedPosts.includes(post.id) ? styles.selected : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={() => togglePostSelection(post.id)}
                  className={styles.checkbox}
                />
                <div className={styles.postInfo}>
                  <div className={styles.postTitle}>
                    {post.featured && <span className={styles.featuredBadge}>⭐ FEATURED</span>}
                    Day {post.day}: {post.title.substring(0, 80)}...
                  </div>
                  <div className={styles.postMeta}>
                    Current category: <span className={styles.currentCategory}>{post.primaryCategory}</span>
                  </div>
                </div>
                <div className={styles.postActions}>
                  {post.featured ? (
                    <button
                      onClick={() => handleUnmarkFeatured(post.id)}
                      disabled={isFeaturedUpdating}
                      className={styles.unfeaturedButton}
                      title="Remove from featured"
                    >
                      {isFeaturedUpdating ? '...' : '⭐'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsFeatured(post.id)}
                      disabled={isFeaturedUpdating}
                      className={styles.featuredButton}
                      title="Mark as featured"
                    >
                      {isFeaturedUpdating ? '...' : '☆'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}

          {/* Category Update Section */}
          <div className={styles.updateSection}>
            <h3>Update Selected Posts</h3>
            <div className={styles.updateControls}>
              <input
                type="text"
                placeholder="Enter new category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={styles.categoryInput}
              />
              <button 
                onClick={handleUpdateCategories}
                disabled={isUpdating || selectedPosts.length === 0 || !newCategory.trim()}
                className={styles.updateButton}
              >
                {isUpdating ? 'Updating...' : `Update ${selectedPosts.length} Posts`}
              </button>
            </div>
            <div className={styles.quickCategories}>
              <span>Quick select:</span>
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <button
                  key={category.id}
                  onClick={() => setNewCategory(category.name)}
                  className={styles.quickCategoryButton}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCategoryManager;