// Blog utilities for loading and managing blog posts

export interface BlogPost {
  id: string;
  day: number;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  categories: string[];
  primaryCategory: string;
  hashtags: string[];
  hasImage: boolean;
  imagePath: string | null;
  readTime: string;
  slug: string;
  featured?: boolean;
  featuredPriority?: number; // 1, 2, or 3 for primary, secondary, tertiary featured posts
}

export interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

// Cache for blog metadata
let blogMetadataCache: BlogPost[] | null = null;

// Clear cache function for when data is updated
export function clearBlogMetadataCache(): void {
  blogMetadataCache = null;
}

// Update a post in the cache (for simulating API updates)
export function updatePostInCache(postId: string, updates: Partial<BlogPost>): void {
  if (blogMetadataCache) {
    blogMetadataCache = blogMetadataCache.map(post => {
      if (post.id === postId) {
        return { ...post, ...updates };
      }
      
      // If we're setting a featured priority, clear that same priority from other posts
      if (updates.featuredPriority !== undefined) {
        if (post.featuredPriority === updates.featuredPriority) {
          return { ...post, featured: false, featuredPriority: undefined };
        }
      }
      
      // Legacy: if setting featured=true without priority, clear featured from all other posts
      if (updates.featured === true && updates.featuredPriority === undefined) {
        return { ...post, featured: false, featuredPriority: undefined };
      }
      
      return post;
    });
  }
}

// Load blog metadata from the generated JSON file
export async function loadBlogMetadata(): Promise<BlogPost[]> {
  if (blogMetadataCache) {
    return blogMetadataCache;
  }

  try {
    const response = await fetch('/content/blog-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load blog metadata');
    }
    
    const metadata: BlogPost[] = await response.json();
    blogMetadataCache = metadata;
    return metadata;
  } catch (error) {
    console.error('Error loading blog metadata:', error);
    return [];
  }
}

// Get all blog posts sorted by date (newest first)
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const metadata = await loadBlogMetadata();
  return metadata.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  
  if (category === 'all') {
    return allPosts;
  }
  
  return allPosts.filter(post => 
    post.primaryCategory === category || post.categories.includes(category)
  );
}

// Get available categories with post counts
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const allPosts = await getAllBlogPosts();
  
  const categoryMap = new Map<string, number>();
  
  // Count posts in each category
  allPosts.forEach(post => {
    post.categories.forEach(category => {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
  });
  
  const categories: BlogCategory[] = [
    { id: 'all', name: 'All Stories', count: allPosts.length }
  ];
  
  // Add individual categories
  categoryMap.forEach((count, category) => {
    categories.push({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      count: count
    });
  });
  
  return categories;
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  return allPosts.find(post => post.slug === slug) || null;
}

// Search blog posts by title, content, or hashtags
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  console.log('searchBlogPosts called with query:', query);
  const allPosts = await getAllBlogPosts();
  console.log('Total posts available for search:', allPosts.length);
  const searchTerm = query.toLowerCase();
  
  const results = allPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  
  console.log('Search filtering completed. Results:', results.length);
  return results;
}

// Get featured posts (up to 3, prioritized by featuredPriority)
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const allPosts = await getBlogPostsByDayNumber();
  
  // Get posts with featuredPriority set, sorted by priority
  const prioritizedFeatured = allPosts
    .filter(post => post.featured === true && post.featuredPriority)
    .sort((a, b) => (a.featuredPriority || 0) - (b.featuredPriority || 0));
  
  // Get posts marked as featured without priority
  const generalFeatured = allPosts
    .filter(post => post.featured === true && !post.featuredPriority);
  
  // Combine prioritized and general featured posts
  const featuredPosts = [...prioritizedFeatured, ...generalFeatured];
  
  // If we have featured posts, return up to 3
  if (featuredPosts.length > 0) {
    return featuredPosts.slice(0, 3);
  }
  
  // If no featured posts, return the 3 latest posts
  return allPosts.slice(0, 3);
}

// Get featured post (backward compatibility - returns primary featured post)
export async function getFeaturedPost(): Promise<BlogPost | null> {
  const featuredPosts = await getFeaturedPosts();
  return featuredPosts.length > 0 ? featuredPosts[0] : null;
}

// Utility to format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Utility to get category icon
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Entrepreneurship': '🚀',
    'Tech Leadership': '⚙️',
    'Corporate Experience': '🏢',
    'Personal Growth': '📚'
  };
  
  return icons[category] || '💭';
}

// Get next blog post by day number (not by date)
export async function getNextBlogPost(currentDay: number): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  
  // Sort by day number to ensure proper sequence
  const sortedPosts = allPosts.sort((a, b) => a.day - b.day);
  
  // Find next day
  const nextPost = sortedPosts.find(post => post.day === currentDay + 1);
  return nextPost || null;
}

// Get previous blog post by day number (not by date)
export async function getPreviousBlogPost(currentDay: number): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  
  // Sort by day number to ensure proper sequence
  const sortedPosts = allPosts.sort((a, b) => a.day - b.day);
  
  // Find previous day
  const prevPost = sortedPosts.find(post => post.day === currentDay - 1);
  return prevPost || null;
}

// Get blog posts sorted by day number for proper navigation (latest day first)
export async function getBlogPostsByDayNumber(): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.sort((a, b) => b.day - a.day); // Reverse order: Day 56 → Day 1
}

// Get blog posts by category but sorted by day number
export async function getBlogPostsByCategoryDayOrder(category: string): Promise<BlogPost[]> {
  const allPosts = await getBlogPostsByDayNumber(); // This gives us day-sorted posts
  
  console.log('Filtering posts for category:', category);
  console.log('Sample post categories:', allPosts.length > 0 ? allPosts[0].categories : 'no posts');
  console.log('Sample post primaryCategory:', allPosts.length > 0 ? allPosts[0].primaryCategory : 'no posts');
  
  if (category === 'all') {
    return allPosts;
  }
  
  // Convert category ID back to original category name for comparison
  const categoryName = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  console.log('Converted category name:', categoryName);
  
  const filtered = allPosts.filter(post => 
    post.primaryCategory === categoryName || post.categories.includes(categoryName)
  );
  
  console.log('Filtered posts count:', filtered.length);
  return filtered;
}