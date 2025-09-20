import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  author?: string;
}

function SEO({ 
  title, 
  description, 
  keywords,
  canonical,
  type = 'website',
  image = '/logo192.png',
  author = 'ElevateIdea Technologies'
}: SEOProps) {
  const siteUrl = 'https://elevateidea.com';
  const fullTitle = title.includes('ElevateIdea') ? title : `${title} | ElevateIdea Technologies`;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="ElevateIdea Technologies" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Brand-specific Meta Tags */}
      <meta name="application-name" content="ElevateIdea Technologies" />
      <meta name="msapplication-TileColor" content="#667eea" />
      <meta name="theme-color" content="#667eea" />
    </Helmet>
  );
}

export default SEO;