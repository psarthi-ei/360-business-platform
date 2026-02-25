import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  author?: string;
  structuredData?: object;
}

function SEO({ 
  title, 
  description, 
  keywords,
  canonical,
  type = 'website',
  image,
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt,
  author = 'ElevateIdea Technologies',
  structuredData
}: SEOProps) {
  const siteUrl = 'https://elevateidea.com';
  const fullTitle = title.includes('ElevateIdea') ? title : `${title} | ElevateIdea Technologies`;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : undefined;
  const defaultImageAlt = imageAlt || `${title} - ElevateIdea Technologies`;

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
      {fullImage && (
        <>
          <meta property="og:image" content={fullImage} />
          <meta property="og:image:width" content={imageWidth.toString()} />
          <meta property="og:image:height" content={imageHeight.toString()} />
          <meta property="og:image:alt" content={defaultImageAlt} />
        </>
      )}
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="ElevateIdea Technologies" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={fullImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {fullImage && (
        <>
          <meta name="twitter:image" content={fullImage} />
          <meta name="twitter:image:alt" content={defaultImageAlt} />
        </>
      )}

      {/* WhatsApp and Additional Social Media Optimizations */}
      {fullImage && (
        <>
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:secure_url" content={fullImage} />
        </>
      )}
      <meta property="og:locale" content="en_US" />

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

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;