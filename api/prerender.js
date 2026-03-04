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
          title: `${data.title} | ElevateIdea`,
          description: data.excerpt || data.content?.substring(0, 160) || 'Read this business transformation story from ElevateIdea.',
          image: data.imagePath ? `${baseUrl}${data.imagePath}` : `${baseUrl}/images/blog-default-og.jpg`,
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
          title: `${data.title} | Engineering in the AI Era`,
          description: data.excerpt || 'Read this chapter from Engineering in the AI Era book.',
          image: `${baseUrl}/images/book-chapter-og.jpg`,
          url: `${baseUrl}/book/${data.slug}`,
          type: 'article',
          author: 'Partha Sarathi',
          publishedTime: data.publishedDate,
          tags: ['Engineering', 'AI Era', 'Leadership']
        };
      }
      return getDefaultBookMeta();
      
    case 'services':
      return {
        title: 'Strategic Technology Partnership for Early-Stage Startups | ElevateIdea',
        description: 'AI-era strategic technology partnership for early-stage startups. 30-day MVP development, project acceleration, and scalability solutions with 20+ years experience.',
        image: `${baseUrl}/images/services-og.jpg`,
        url: `${baseUrl}/services`,
        type: 'website',
        author: 'ElevateIdea Technologies'
      };
      
    case 'about':
      return {
        title: 'About ElevateIdea - Technology Leadership & Business Transformation',
        description: '20+ years of technology leadership experience helping businesses transform. Learn about our journey and expertise in AI-era development.',
        image: `${baseUrl}/images/about-og.jpg`,
        url: `${baseUrl}/about`,
        type: 'website',
        author: 'ElevateIdea Technologies'
      };
      
    case 'contact':
      return {
        title: 'Contact ElevateIdea - Start Your Business Transformation',
        description: 'Ready to accelerate your startup with AI-powered development? Contact ElevateIdea for strategic technology partnership and 30-day MVP delivery.',
        image: `${baseUrl}/images/contact-og.jpg`,
        url: `${baseUrl}/contact`,
        type: 'website',
        author: 'ElevateIdea Technologies'
      };
      
    case 'turnaround':
      return {
        title: 'Turnaround Stories - Real Business Transformation Cases | ElevateIdea',
        description: 'Read real stories of business transformation and technology turnarounds. Learn from successful projects across banking, retail, and government sectors.',
        image: `${baseUrl}/images/turnaround-stories-og.jpg`,
        url: `${baseUrl}/turnaround-stories`,
        type: 'website',
        author: 'ElevateIdea Technologies'
      };
      
    case 'turnaround-story':
      if (data) {
        return {
          title: `${data.title} | ElevateIdea`,
          description: data.excerpt || 'Read this business transformation case study from ElevateIdea.',
          image: `${baseUrl}/images/turnaround-case-og.jpg`,
          url: `${baseUrl}/turnaround-stories/${data.slug}`,
          type: 'article',
          author: 'ElevateIdea Technologies',
          publishedTime: data.publishedDate,
          tags: ['Business Transformation', data.category, 'Technology Leadership']
        };
      }
      return {
        title: 'Business Transformation Case Study | ElevateIdea',
        description: 'Read this real business transformation case study from ElevateIdea Technologies.',
        image: `${baseUrl}/images/turnaround-case-og.jpg`,
        url: `${baseUrl}/turnaround-stories`,
        type: 'article',
        author: 'ElevateIdea Technologies'
      };
      
    case 'leadership':
      return {
        title: 'Technology Leadership & Executive Profile | ElevateIdea',
        description: 'Learn about ElevateIdea\'s technology leadership experience. 20+ years in enterprise software, AI transformation, and business scaling.',
        image: `${baseUrl}/images/leadership-og.jpg`,
        url: `${baseUrl}/leadership`,
        type: 'website',
        author: 'ElevateIdea Technologies'
      };
      
    default:
      return getDefaultHomeMeta();
  }
}

function getDefaultHomeMeta() {
  return {
    title: 'ElevateIdea - Complete Business Platform for Textile Manufacturers',
    description: 'ElevateIdea empowers textile manufacturers with 360° business platform. Voice-first, multilingual solutions for Indian MSMEs. 20+ years engineering expertise.',
    image: 'https://elevateidea.com/images/elevateidea-og.jpg',
    url: 'https://elevateidea.com',
    type: 'website',
    author: 'ElevateIdea Technologies'
  };
}

function getDefaultBlogMeta() {
  return {
    title: 'Business Transformation Stories | ElevateIdea Blog',
    description: 'Read the latest business insights and transformation strategies from ElevateIdea. Real-world examples of MSME growth and technology adoption.',
    image: 'https://elevateidea.com/images/blog-home-og.jpg',
    url: 'https://elevateidea.com/blog',
    type: 'website',
    author: 'ElevateIdea Technologies'
  };
}

function getDefaultBookMeta() {
  return {
    title: 'Engineering in the AI Era | ElevateIdea Book',
    description: 'A comprehensive guide to software engineering in the AI era. Learn how AI transforms development practices, team structures, and technical leadership.',
    image: 'https://elevateidea.com/images/book-home-og.jpg',
    url: 'https://elevateidea.com/book',
    type: 'website',
    author: 'Partha Sarathi'
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
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="ElevateIdea Technologies" />
    <meta property="og:locale" content="en_US" />
    ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
    ${author ? `<meta property="article:author" content="${author}" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:creator" content="@parthasarathi" />
    
    <!-- WhatsApp / Additional Social -->
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:secure_url" content="${image}" />
    
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
      <div style="padding: 40px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h1>${title}</h1>
        <p>${description}</p>
        <p>Loading full experience...</p>
        <script>
          // Redirect to app after a brief moment for crawlers to read meta tags
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        </script>
      </div>
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
      // For regular users, redirect to the React app
      return res.redirect(302, '/');
    }

    // Extract parameters from URL
    const { type, slug } = req.query;
    
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