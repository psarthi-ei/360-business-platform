// Vercel Serverless Function for Social Media Meta Tag Prerendering
// This function detects social media crawlers and serves prerendered HTML with correct meta tags

// Simple crawler detection
function isCrawler(userAgent) {
  if (!userAgent) return false;
  
  const crawlerPatterns = [
    /facebookexternalhit/i,
    /facebot/i,
    /twitterbot/i,
    /whatsapp/i,
    /linkedinbot/i,
    /googlebot/i,
    /bingbot/i,
    /slackbot/i,
    /telegrambot/i,
    /skypeuripreview/i,
    /discordbot/i
  ];

  return crawlerPatterns.some(pattern => pattern.test(userAgent));
}

// Load blog metadata from static file
async function loadBlogMetadata() {
  try {
    const response = await fetch('https://elevateidea.com/content/blog-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load blog metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading blog metadata:', error);
    return [];
  }
}

// Load book metadata from static file  
async function loadBookMetadata() {
  try {
    const response = await fetch('https://elevateidea.com/content/book/book-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load book metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading book metadata:', error);
    return [];
  }
}

// Load turnaround stories metadata from static file
async function loadTurnaroundStoriesMetadata() {
  try {
    const response = await fetch('https://elevateidea.com/content/turnaround-stories-metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load turnaround stories metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading turnaround stories metadata:', error);
    return [];
  }
}

// Get blog post by slug
async function getBlogPost(slug) {
  const posts = await loadBlogMetadata();
  return posts.find(post => post.slug === slug) || null;
}

// Get book chapter by slug
async function getBookChapter(slug) {
  const bookData = await loadBookMetadata();
  const chapters = bookData.chapters || [];
  return chapters.find(chapter => chapter.slug === slug) || null;
}

// Get turnaround story by slug
async function getTurnaroundStory(slug) {
  const stories = await loadTurnaroundStoriesMetadata();
  return stories.find(story => story.slug === slug) || null;
}

// Generate meta tags based on content type
function generateMetaTags(type, data, slug) {
  const baseUrl = 'https://elevateidea.com';
  
  switch (type) {
    case 'blog':
      if (data) {
        return {
          title: `${data.title} - ElevateIdea`,
          description: `${data.excerpt || data.content?.substring(0, 160)}...`,
          image: data.imagePath ? `${baseUrl}${data.imagePath}` : `${baseUrl}/social-preview.jpg`,
          url: `${baseUrl}/blog/${data.slug}`,
          type: 'article',
          author: 'ElevateIdea Technologies',
          publishedTime: data.publishedDate,
          tags: data.hashtags || []
        };
      }
      return getDefaultBlogMeta();
      
    case 'book':
      if (data) {
        return {
          title: `${data.title} - ElevateIdea`,
          description: data.excerpt,
          image: `${baseUrl}/social-preview.jpg`,
          url: `${baseUrl}/book/${data.slug}`,
          type: 'article',
          author: 'Partha Sarthi',
          publishedTime: data.publishedDate,
          tags: ['Engineering', 'AI Era', 'Leadership']
        };
      }
      return getDefaultBookMeta();
      
    case 'services':
      return {
        title: 'Technology Direction for Startups - ElevateIdea',
        description: 'Many early-stage startups struggle with technology direction and engineering execution. Former Head of Technology at Aadhaar (UIDAI), previously at IBM and Thoughtworks, I help startups navigate these challenges using AI-accelerated development practices.',
        image: `${baseUrl}/social-preview.jpg`,
        url: `${baseUrl}/services`,
        type: 'website',
        author: 'Partha Sarthi'
      };
      
    case 'about':
      return {
        title: 'About Partha Sarthi - Fractional CTO - ElevateIdea',
        description: 'Fractional CTO for early-stage startups. 20+ years experience at Aadhaar, IBM, and Thoughtworks. I help startups make better technology decisions and move faster with AI-native engineering practices.',
        image: `${baseUrl}/social-preview.jpg`,
        url: `${baseUrl}/about`,
        type: 'website',
        author: 'Partha Sarthi'
      };
      
    case 'contact':
      return {
        title: 'Contact - ElevateIdea',
        description: 'Get in touch with Partha Sarthi for Fractional CTO services. Whether you\'re an early-stage startup needing technology leadership, MVP development, or AI-native engineering guidance - let\'s connect.',
        image: `${baseUrl}/social-preview.jpg`,
        url: `${baseUrl}/contact`,
        type: 'website',
        author: 'Partha Sarthi'
      };
      
    case 'turnaround':
      return {
        title: 'Case Studies - ElevateIdea',
        description: 'Real corporate turnaround experiences from ElevateIdea founder. 20+ years experience across banks, government projects, startups, retailers. 6 major turnarounds, $15M+ recovery value.',
        image: `${baseUrl}/social-preview.jpg`,
        url: `${baseUrl}/turnaround-stories`,
        type: 'website',
        author: 'Partha Sarthi'
      };
      
    case 'turnaround-story':
      if (data) {
        return {
          title: `${data.title} - ElevateIdea`,
          description: data.excerpt || 'Read this business transformation case study from ElevateIdea.',
          image: `${baseUrl}/social-preview.jpg`,
          url: `${baseUrl}/turnaround-stories/${data.slug}`,
          type: 'article',
          author: 'ElevateIdea Technologies',
          publishedTime: data.publishedDate,
          tags: ['Business Transformation', data.category, 'Technology Leadership']
        };
      }
      return {
        title: 'Business Transformation Case Study - ElevateIdea',
        description: 'Read this real business transformation case study from ElevateIdea Technologies.',
        image: `${baseUrl}/social-preview.jpg`,
        url: `${baseUrl}/turnaround-stories`,
        type: 'article',
        author: 'ElevateIdea Technologies'
      };
      
    case 'leadership':
      return {
        title: 'Leadership - ElevateIdea',
        description: 'Engineering transformation expert and industry thought leader. $15M+ recovery value across 6 major turnarounds. Pioneering AI-era engineering leadership and organizational transformation.',
        image: `${baseUrl}/social-preview.jpg`,
        url: `${baseUrl}/leadership`,
        type: 'website',
        author: 'Partha Sarthi'
      };
      
    default:
      return getDefaultHomeMeta();
  }
}

function getDefaultHomeMeta() {
  return {
    title: 'Technology Direction for Startups | Partha Sarthi - Former Head of Tech, Aadhaar',
    description: 'Many early-stage startups struggle with technology direction and engineering execution. Former Head of Technology at Aadhaar (UIDAI), previously at IBM and Thoughtworks, I help startups navigate these challenges using AI-accelerated development practices.',
    image: 'https://elevateidea.com/social-preview.jpg',
    url: 'https://elevateidea.com',
    type: 'website',
    author: 'Partha Sarthi'
  };
}

function getDefaultBlogMeta() {
  return {
    title: 'Stories - ElevateIdea',
    description: 'Discover AI-powered business insights, MSME growth strategies, and technology transformation tips from ElevateIdea. Expert perspectives on scaling textile manufacturing businesses.',
    image: 'https://elevateidea.com/social-preview.jpg',
    url: 'https://elevateidea.com/blog',
    type: 'website',
    author: 'ElevateIdea Technologies'
  };
}

function getDefaultBookMeta() {
  return {
    title: 'Book - ElevateIdea',
    description: 'When Code Is No Longer the Bottleneck - A book about building future-ready engineering organizations in the AI era. Written in public, chapter by chapter.',
    image: 'https://elevateidea.com/social-preview.jpg',
    url: 'https://elevateidea.com/book',
    type: 'website',
    author: 'Partha Sarthi'
  };
}

// Generate HTML with meta tags injected
function generatePrerenderedHTML(metaTags) {
  const { title, description, image, url, type, author, publishedTime, tags } = metaTags;
  
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#667eea" />
    
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="author" content="${author}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="ElevateIdea Technologies" />
    <meta property="og:locale" content="en_US" />
    ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
    ${author ? `<meta property="article:author" content="${author}" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:creator" content="@parthasarathi" />
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    ${tags && tags.length > 0 ? `<meta name="keywords" content="${tags.join(', ')}" />` : ''}
    
    <!-- Preload critical resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <noscript>You need to enable JavaScript to run this app.</noscript>
  </head>
  <body>
    <div id="root">
      <!-- Clean body for crawlers - only meta tags matter for social media sharing -->
      <noscript>
        <h1>${title}</h1>
        <p>${description}</p>
      </noscript>
    </div>
  </body>
</html>`;
}

// Main serverless function handler
module.exports = async function handler(req, res) {
  try {
    const userAgent = req.headers['user-agent'] || '';
    
    // Check if this is a crawler
    if (!isCrawler(userAgent)) {
      // For regular users, serve the React app's index.html
      try {
        const fs = require('fs');
        const path = require('path');
        const indexPath = path.join(process.cwd(), 'frontend/build/index.html');
        const indexHtml = fs.readFileSync(indexPath, 'utf-8');
        
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        return res.status(200).send(indexHtml);
      } catch (error) {
        console.error('Error serving React app:', error);
        // Fallback: redirect to home if file reading fails
        return res.redirect(302, 'https://elevateidea.com');
      }
    }

    // Extract parameters from URL
    let { type, slug, path } = req.query;
    
    // Parse path parameter for new routing format
    if (path && !type) {
      const pathParts = path.split('/').filter(Boolean);
      
      if (pathParts.length === 0) {
        // Root path - home page
        type = 'home';
      } else if (pathParts[0] === 'blog' && pathParts[1]) {
        type = 'blog';
        slug = pathParts[1];
      } else if (pathParts[0] === 'book' && pathParts[1]) {
        type = 'book';
        slug = pathParts[1];
      } else if (pathParts[0] === 'turnaround-stories' && pathParts[1]) {
        type = 'turnaround-story';
        slug = pathParts[1];
      } else {
        // Single path segments: leadership, services, about, contact, etc.
        type = pathParts[0];
      }
    }
    
    let metaTags = getDefaultHomeMeta();
    
    try {
      // Generate meta tags based on content type
      if (type === 'blog' && slug) {
        const post = await getBlogPost(slug);
        metaTags = generateMetaTags('blog', post, slug);
      } else if (type === 'book' && slug) {
        const chapter = await getBookChapter(slug);
        metaTags = generateMetaTags('book', chapter, slug);
      } else if (type === 'turnaround-story' && slug) {
        const story = await getTurnaroundStory(slug);
        metaTags = generateMetaTags('turnaround-story', story, slug);
      } else {
        metaTags = generateMetaTags(type);
      }
    } catch (error) {
      console.error('Error generating meta tags:', error);
      // Fallback to default meta tags
    }

    // Generate and return prerendered HTML
    const html = generatePrerenderedHTML(metaTags);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.setHeader('X-Prerendered', 'true');
    
    return res.status(200).send(html);
    
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // Return fallback HTML on error
    const fallbackMeta = getDefaultHomeMeta();
    const fallbackHTML = generatePrerenderedHTML(fallbackMeta);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=300');
    
    return res.status(200).send(fallbackHTML);
  }
};