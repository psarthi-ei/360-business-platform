const fs = require('fs');
const path = require('path');

// Category mapping based on hashtags
const categoryMapping = {
  'Entrepreneurship': [
    'Entrepreneurship', 'StartupJourney', 'FounderInsights', 'StartupLessons', 
    'FounderJourney', 'Startups', 'BuildingInPublic'
  ],
  'Tech Leadership': [
    'TechLeadership', 'EngineeringLeadership', 'ProjectManagement', 'TechChallenges',
    'TechConsulting', 'Leadership'
  ],
  'Corporate Experience': [
    'TurnaroundStories', 'BusinessTransformation', 'CrisisManagement', 
    'ProjectTurnaround', 'HighPressure', 'GlobalExpansion', 'EnterpriseSolutions'
  ],
  'Personal Growth': [
    'PersonalBrand', 'CareerGrowth', 'GrowthMindset', 'SelfAwareness',
    'JobChange', 'JobSearch'
  ]
};

// Helper function to extract hashtags from markdown content
function extractHashtagsFromMarkdown(content) {
  // Look for hashtags in the last few lines of the content
  const lines = content.split('\n');
  const lastFewLines = lines.slice(-5).join('\n'); // Check last 5 lines
  
  // Two regex patterns to catch different hashtag formats
  const hashtagRegex1 = /#([A-Za-z0-9_]+)/g;
  const hashtagRegex2 = /hashtag#([A-Za-z0-9_]+)/g;
  
  const hashtags = [];
  let match;
  
  // Extract regular hashtags (#hashtag)
  while ((match = hashtagRegex1.exec(lastFewLines)) !== null) {
    hashtags.push(match[1]);
  }
  
  // Extract hashtag# format (hashtag#hashtag)
  while ((match = hashtagRegex2.exec(lastFewLines)) !== null) {
    hashtags.push(match[1]);
  }
  
  // Remove duplicates
  return [...new Set(hashtags)];
}

// Helper function to categorize based on hashtags
function categorizePost(hashtags) {
  const categories = [];
  
  for (const [category, categoryHashtags] of Object.entries(categoryMapping)) {
    const hasMatch = hashtags.some(hashtag => 
      categoryHashtags.some(catHashtag => 
        hashtag.toLowerCase().includes(catHashtag.toLowerCase())
      )
    );
    
    if (hasMatch) {
      categories.push(category);
    }
  }
  
  // Default to Personal Growth if no category found
  if (categories.length === 0) {
    categories.push('Personal Growth');
  }
  
  return categories;
}

// Helper function to parse CSV and extract blog dates
function parseBlogCSV() {
  try {
    const csvPath = path.join(__dirname, '../../public/content/blog/blog_table_api_2024-09-20-2025-09-20.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const lines = csvContent.split('\n');
    const blogDates = {};
    
    // Skip header row (line 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handling quotes)
      const columns = line.split('","').map(col => col.replace(/^"|"$/g, ''));
      
      if (columns.length >= 3) {
        const title = columns[1]; // Post title
        const publishDate = columns[2]; // Publish date
        
        // Extract day number from title
        const dayMatch = title.match(/Day (\d+)/);
        if (dayMatch) {
          const dayNumber = parseInt(dayMatch[1]);
          
          // Convert date format from DD/MM/YYYY to YYYY-MM-DD
          const dateParts = publishDate.split('/');
          if (dateParts.length === 3) {
            const day = dateParts[0].padStart(2, '0');
            const month = dateParts[1].padStart(2, '0');
            const year = dateParts[2];
            const formattedDate = `${year}-${month}-${day}`;
            
            blogDates[dayNumber] = formattedDate;
          }
        }
      }
    }
    
    // Parsed CSV dates successfully
    return blogDates;
  } catch (error) {
    // Debug statement removed
    return {};
  }
}

// Helper function to get date for specific day from CSV data
function getDateFromCSV(dayNumber, csvDates) {
  return csvDates[dayNumber] || null;
}

// Main function to generate blog metadata
function generateBlogMetadata() {
  const blogDir = path.join(__dirname, '../../public/content/blog');
  const metadata = [];
  
  // Parse CSV file first to get dates
  const csvDates = parseBlogCSV();
  
  // Process each day (1-56)
  for (let day = 1; day <= 56; day++) {
    const markdownFile = `day${day}.md`;
    const markdownPath = path.join(blogDir, markdownFile);
    
    if (!fs.existsSync(markdownPath)) {
      // Debug statement removed
      continue;
    }
    
    try {
      // Read markdown content
      const content = fs.readFileSync(markdownPath, 'utf-8');
      
      // Extract title (first line)
      const lines = content.split('\n');
      const title = lines[0].replace(/^#+\s*/, '').trim();
      
      // Extract hashtags
      const hashtags = extractHashtagsFromMarkdown(content);
      
      // Categorize post
      const categories = categorizePost(hashtags);
      const primaryCategory = categories[0];
      
      // Extract date from CSV file
      const publishedDate = getDateFromCSV(day, csvDates);
      
      // Create excerpt (first paragraph after title)
      const contentWithoutTitle = lines.slice(1).join('\n').trim();
      const paragraphs = contentWithoutTitle.split('\n\n');
      const excerpt = paragraphs.find(p => p.trim().length > 0)?.trim().substring(0, 200) + '...';
      
      // Check for associated image
      const assetsDir = path.join(blogDir, 'assets');
      const imageFiles = fs.readdirSync(assetsDir).filter(file => 
        file.startsWith(`day${day}.`) || file.startsWith(`day${day}a.`)
      );
      const hasImage = imageFiles.length > 0;
      const imagePath = hasImage ? `/content/blog/assets/${imageFiles[0]}` : null;
      
      // Create metadata object
      // Create a better fallback date - use a reasonable date progression
      let fallbackDate;
      if (publishedDate) {
        fallbackDate = publishedDate;
      } else {
        // Create progressive dates starting from Feb 15, 2025
        const startDate = new Date('2025-02-15');
        startDate.setDate(startDate.getDate() + (day - 1));
        fallbackDate = startDate.toISOString().split('T')[0];
      }

      const postMetadata = {
        id: `day${day}`,
        day: day,
        title: title,
        excerpt: excerpt || 'Professional story and business insights.',
        content: content,
        publishedDate: fallbackDate,
        categories: categories,
        primaryCategory: primaryCategory,
        hashtags: hashtags,
        hasImage: hasImage,
        imagePath: imagePath,
        readTime: `${Math.ceil(content.length / 200)} min read`,
        slug: `day${day}`
      };
      
      metadata.push(postMetadata);
      // Post metadata processed successfully
      
    } catch (error) {
      // Debug statement removed
    }
  }
  
  // Sort by date (newest first)
  metadata.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  
  // Write metadata to JSON file
  const outputPath = path.join(__dirname, '../../public/content/blog-metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  
  // Log category distribution
  const categoryStats = {};
  metadata.forEach(post => {
    const category = post.primaryCategory;
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });
  
  // Category statistics processed
  
  return metadata;
}

// Export for use in other files
module.exports = {
  generateBlogMetadata,
  extractHashtagsFromMarkdown,
  categorizePost
};

// Run if called directly
if (require.main === module) {
  generateBlogMetadata();
}