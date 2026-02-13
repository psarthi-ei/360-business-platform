// Book utilities for loading and managing book chapters

export interface BookChapter {
  id: string;
  number: number | null;
  title: string;
  subtitle?: string;
  excerpt: string;
  filename: string;
  publishedDate: string;
  readTime: string;
  section: string;
  order: number;
  isPublished: boolean;
  slug: string;
}

export interface BookSection {
  id: string;
  name: string;
  count: number;
}

// Cache for book metadata
let bookMetadataCache: BookChapter[] | null = null;

// Clear cache function for when data is updated
export function clearBookMetadataCache(): void {
  bookMetadataCache = null;
}

// Load book metadata from the generated JSON file
export async function loadBookMetadata(): Promise<BookChapter[]> {
  if (bookMetadataCache) {
    return bookMetadataCache;
  }

  try {
    const response = await fetch('/content/book/book-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load book metadata');
    }
    
    const data = await response.json();
    const chapters: BookChapter[] = data.chapters || [];
    bookMetadataCache = chapters;
    return chapters;
  } catch (error) {
    // Error loading book metadata
    return [];
  }
}

// Get all published chapters sorted by order
export async function getAllChapters(): Promise<BookChapter[]> {
  const metadata = await loadBookMetadata();
  return metadata
    .filter(chapter => chapter.isPublished)
    .sort((a, b) => a.order - b.order);
}

// Get chapters by section
export async function getChaptersBySection(section: string): Promise<BookChapter[]> {
  const allChapters = await getAllChapters();
  
  if (section === 'all') {
    return allChapters;
  }
  
  // Find the section name that matches the section ID
  // First get all sections to find the mapping
  const sections = await getBookSections();
  const sectionData = sections.find(s => s.id === section);
  
  if (!sectionData) {
    return [];
  }
  
  // Filter chapters by the actual section name
  return allChapters.filter(chapter => 
    chapter.section === sectionData.name
  );
}

// Get available sections with chapter counts
export async function getBookSections(): Promise<BookSection[]> {
  const allChapters = await getAllChapters();
  
  const sectionMap = new Map<string, number>();
  
  // Count chapters in each section
  allChapters.forEach(chapter => {
    sectionMap.set(chapter.section, (sectionMap.get(chapter.section) || 0) + 1);
  });
  
  const sections: BookSection[] = [
    { id: 'all', name: 'All Chapters', count: allChapters.length }
  ];
  
  // Add individual sections
  sectionMap.forEach((count, section) => {
    sections.push({
      id: section.toLowerCase().replace(/\s+/g, '-'),
      name: section,
      count: count
    });
  });
  
  return sections;
}

// Get a single chapter by slug
export async function getChapter(slug: string): Promise<BookChapter | null> {
  const allChapters = await getAllChapters();
  return allChapters.find(chapter => chapter.slug === slug) || null;
}

// Get chapter by chapter number
export async function getChapterByNumber(number: number): Promise<BookChapter | null> {
  const allChapters = await getAllChapters();
  return allChapters.find(chapter => chapter.number === number) || null;
}

// Search chapters by title, content, or excerpt
export async function searchChapters(query: string): Promise<BookChapter[]> {
  const allChapters = await getAllChapters();
  
  const searchTerm = query.toLowerCase();
  
  const results = allChapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchTerm) ||
    chapter.subtitle?.toLowerCase().includes(searchTerm) ||
    chapter.excerpt.toLowerCase().includes(searchTerm)
  );
  
  return results;
}

// Get next chapter by order
export async function getNextChapter(currentOrder: number): Promise<BookChapter | null> {
  const allChapters = await getAllChapters();
  
  // Find next chapter
  const nextChapter = allChapters.find(chapter => chapter.order === currentOrder + 1);
  return nextChapter || null;
}

// Get previous chapter by order
export async function getPreviousChapter(currentOrder: number): Promise<BookChapter | null> {
  const allChapters = await getAllChapters();
  
  // Find previous chapter
  const prevChapter = allChapters.find(chapter => chapter.order === currentOrder - 1);
  return prevChapter || null;
}

// Load chapter content from HTML/markdown file
export async function loadChapterContent(filename: string): Promise<string> {
  try {
    // Add cache busting parameter to ensure fresh content
    const cacheBuster = Date.now();
    const response = await fetch(`/content/book/${filename}?v=${cacheBuster}`);
    if (!response.ok) {
      throw new Error('Failed to load chapter content');
    }
    
    const content = await response.text();
    
    // If it's an HTML file, extract only the content between <body> tags
    if (filename.endsWith('.html')) {
      const bodyStart = content.indexOf('<body>');
      const bodyEnd = content.lastIndexOf('</body>');
      
      if (bodyStart !== -1 && bodyEnd !== -1) {
        // Extract content between <body> and </body>, excluding the tags themselves
        const bodyContent = content.substring(bodyStart + 6, bodyEnd).trim();
        return bodyContent;
      }
    }
    
    return content;
  } catch (error) {
    return '# Chapter not found\n\nThis chapter content is not available yet.';
  }
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

// Utility to get section icon
export function getSectionIcon(section: string): string {
  const icons: Record<string, string> = {
    'Foundation': '🏗️',
    'AI Era Engineering': '🤖',
    'Team Dynamics': '👥',
    'Leadership': '🎯',
    'Implementation': '⚙️',
    'Future': '🚀'
  };
  
  return icons[section] || '📖';
}

// Get appropriate hashtags for a chapter
export function getChapterHashtags(chapterSlug: string): string {
  const hashtagMap: Record<string, string> = {
    'introduction': '#BookLaunch #EngineeringFuture',
    'chapter1-two-engineering-organizations': '#EngineeringOrganizations #TechLeadership',
    'chapter2-why-models-worked': '#EngineeringHistory #AgileEvolution',
    'chapter3-invisible-cost': '#EngineeringCosts #SystemicIssues',
    'chapter4-code-gravity': '#AITransformation #CodingBottleneck',
    'chapter5-broken-assumptions': '#BrokenAssumptions #EngineeringShift',
    'chapter6-sdlc-lying': '#SDLCEvolution #ProcessLimitations'
  };
  
  return hashtagMap[chapterSlug] || '#Engineering #Leadership';
}

// Get total reading progress (for future use)
export function calculateReadingProgress(completedChapters: number, totalChapters: number): number {
  if (totalChapters === 0) return 0;
  return Math.round((completedChapters / totalChapters) * 100);
}