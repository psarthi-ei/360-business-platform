// Category management API utilities

import { BlogPost, updatePostInCache, clearBlogMetadataCache } from './blogUtils';

export interface CategoryUpdateRequest {
  postIds: string[];
  newCategory: string;
}

export interface CategoryUpdateResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}

// Simulate API call for updating categories
// In a real implementation, this would call your backend API
export async function updatePostCategories(request: CategoryUpdateRequest): Promise<CategoryUpdateResponse> {
  try {
    // Load current metadata
    const response = await fetch('/content/blog-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load blog metadata');
    }
    
    const metadata: BlogPost[] = await response.json();
    
    // Update the posts
    let updatedCount = 0;
    metadata.forEach(post => {
      if (request.postIds.includes(post.id)) {
        // Update the post in cache with new category
        const currentCategories = [...post.categories];
        if (!currentCategories.includes(request.newCategory)) {
          currentCategories.push(request.newCategory);
          updatePostInCache(post.id, { 
            categories: currentCategories,
            primaryCategory: request.newCategory 
          });
        }
        updatedCount++;
      }
    });
    
    // In a real application, you would send this to your backend API
    // For now, we'll simulate the update and show what would be changed
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Clear cache so updated data will be fetched fresh
    clearBlogMetadataCache();
    
    // For demo purposes, we'll return success
    // In production, you'd actually save the metadata file via your backend
    return {
      success: true,
      message: `Successfully updated ${updatedCount} posts to "${request.newCategory}" category`,
      updatedCount
    };
    
  } catch (error) {
    // Error updating categories
    return {
      success: false,
      message: 'Failed to update categories. Please try again.',
      updatedCount: 0
    };
  }
}

// Get category statistics
export async function getCategoryStats() {
  try {
    const response = await fetch('/content/blog-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load blog metadata');
    }
    
    const metadata: BlogPost[] = await response.json();
    const categoryCount: Record<string, number> = {};
    
    metadata.forEach(post => {
      post.categories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });
    
    return {
      totalPosts: metadata.length,
      categories: Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    };
  } catch (error) {
    // Error loading category stats
    return {
      totalPosts: 0,
      categories: []
    };
  }
}

// Validate category name
export function validateCategoryName(categoryName: string): { valid: boolean; error?: string } {
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
}

// Mark post as featured with priority (1, 2, or 3)
export async function markPostAsFeatured(postId: string, priority: number = 1): Promise<CategoryUpdateResponse> {
  try {
    // Load current metadata
    const response = await fetch('/content/blog-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load blog metadata');
    }
    
    const metadata: BlogPost[] = await response.json();
    
    // Find the post and update its featured status
    let updatedCount = 0;
    metadata.forEach(post => {
      if (post.id === postId) {
        updatedCount++;
      }
    });
    
    // In a real application, you would send this to your backend API
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Update the cache to simulate the database change
    updatePostInCache(postId, { featured: true, featuredPriority: priority });
    
    // Clear cache to ensure fresh data is loaded
    clearBlogMetadataCache();
    
    return {
      success: true,
      message: `Successfully marked post as featured`,
      updatedCount
    };
    
  } catch (error) {
    // Error marking post as featured
    return {
      success: false,
      message: 'Failed to mark post as featured. Please try again.',
      updatedCount: 0
    };
  }
}

// Remove featured status from post
export async function unmarkFeaturedPost(postId: string): Promise<CategoryUpdateResponse> {
  try {
    // Load current metadata
    const response = await fetch('/content/blog-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load blog metadata');
    }
    
    const metadata: BlogPost[] = await response.json();
    
    // Find the post and remove its featured status
    let updatedCount = 0;
    metadata.forEach(post => {
      if (post.id === postId) {
        updatedCount++;
      }
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Update the cache to simulate the database change
    updatePostInCache(postId, { featured: false, featuredPriority: undefined });
    
    // Clear cache to ensure fresh data is loaded
    clearBlogMetadataCache();
    
    return {
      success: true,
      message: `Successfully removed featured status`,
      updatedCount
    };
    
  } catch (error) {
    // Error removing featured status
    return {
      success: false,
      message: 'Failed to remove featured status. Please try again.',
      updatedCount: 0
    };
  }
}