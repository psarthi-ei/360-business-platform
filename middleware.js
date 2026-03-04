import { NextResponse } from 'next/server';

// Crawler detection function (same as in prerender.js)
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

// Route pattern matching
function getRouteInfo(pathname) {
  // Blog posts: /blog/slug
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return { type: 'blog', slug: blogMatch[1] };
  }
  
  // Book chapters: /book/slug  
  const bookChapterMatch = pathname.match(/^\/book\/([^/]+)$/);
  if (bookChapterMatch) {
    return { type: 'book', slug: bookChapterMatch[1] };
  }
  
  // Turnaround stories: /turnaround-stories/slug
  const turnaroundMatch = pathname.match(/^\/turnaround-stories\/([^/]+)$/);
  if (turnaroundMatch) {
    return { type: 'turnaround-story', slug: turnaroundMatch[1] };
  }
  
  // Static pages
  switch (pathname) {
    case '/':
      return { type: 'home' };
    case '/book':
      return { type: 'book' };
    case '/services':
      return { type: 'services' };
    case '/about':
      return { type: 'about' };
    case '/contact':
      return { type: 'contact' };
    case '/leadership':
      return { type: 'leadership' };
    case '/turnaround-stories':
      return { type: 'turnaround' };
    default:
      return null;
  }
}

export function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const pathname = request.nextUrl.pathname;
  
  // Only intercept crawler requests
  if (isCrawler(userAgent)) {
    const routeInfo = getRouteInfo(pathname);
    
    if (routeInfo) {
      // Build prerender URL
      const prerenderUrl = new URL('/api/prerender', request.url);
      prerenderUrl.searchParams.set('type', routeInfo.type);
      
      if (routeInfo.slug) {
        prerenderUrl.searchParams.set('slug', routeInfo.slug);
      }
      
      // Rewrite to prerender function for crawlers only
      return NextResponse.rewrite(prerenderUrl);
    }
  }
  
  // Let all regular browser requests pass through to React app
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/book/:path*',
    '/blog/:path*', 
    '/turnaround-stories/:path*',
    '/services',
    '/about',
    '/contact',
    '/leadership'
  ]
};